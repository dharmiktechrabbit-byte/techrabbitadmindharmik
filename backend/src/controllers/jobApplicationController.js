const mongoose = require("mongoose");
const Job = require("../models/jobModels");
const JobApplication = require("../models/jobApplicationModels");
const { uploadResumeToCloudinary } = require("../utils/cloudinaryResumeUpload");
const axios = require("axios");

const applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    let { fullName, email, phone, experience, message } = req.body;

    // ✅ required
    if (!fullName || !email || !phone || !experience) {
      return res.status(400).json({
        message: "fullName, email, phone, experience are required",
      });
    }

    // ✅ normalize (IMPORTANT for form-data)
    fullName = String(fullName || "").trim();
    email = String(email || "")
      .trim()
      .toLowerCase();
    phone = String(phone || "").trim();
    experience = String(experience || "").trim();

    phone = phone.replace(/[\s-]/g, ""); // remove spaces and -

    // ✅ fullName validation
    if (fullName.length < 3) {
      return res
        .status(400)
        .json({ message: "Full name must be at least 3 characters" });
    }

    // ✅ email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // ✅ phone validation
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: "Invalid phone number. Use 10 digit mobile number",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    console.log("file:", {
      originalname: req.file?.originalname,
      size: req.file?.size,
      mimetype: req.file?.mimetype,
      bufferLength: req.file?.buffer?.length,
    });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.status === "Closed") {
      return res.status(400).json({ message: "This job is closed" });
    }

    // ✅ prevent duplicate apply
    // ✅ prevent duplicate apply
    const alreadyApplied = await JobApplication.findOne({
      jobId: new mongoose.Types.ObjectId(jobId),
      email: email.toLowerCase(),
    });

    if (alreadyApplied) {
      return res.status(409).json({
        message: "You already applied for this job",
      });
    }

    const uploadResult = await uploadResumeToCloudinary(
      req.file.buffer,
      "techrabbit/job-resumes",
    );

    const application = await JobApplication.create({
      jobId,
      fullName,
      email,
      phone,
      experience,
      message: message || "",
      resumeUrl: uploadResult.secure_url,
      resumePublicId: uploadResult.public_id,
      resumeName: req.file.originalname,
      status: "NEW",
    });

    await Job.findByIdAndUpdate(jobId, { $inc: { applicantsCount: 1 } });

    return res.status(201).json({
      message: "Applied successfully ✅",
      application,
    });
  } catch (error) {
    console.error("Apply Job Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get All Applications (search)
const getAllApplications = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const applications = await JobApplication.find({
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    })
      .populate("jobId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Applications fetched ✅",
      total: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get Applications Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Admin: Dashboard summary counts
const getApplicationsSummary = async (req, res) => {
  try {
    const total = await JobApplication.countDocuments();

    const underReview = await JobApplication.countDocuments({
      status: "UNDER_REVIEW",
    });
    const shortlisted = await JobApplication.countDocuments({
      status: "SHORTLISTED",
    });

    // new today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const newToday = await JobApplication.countDocuments({
      createdAt: { $gte: todayStart },
    });

    res.status(200).json({
      message: "Summary fetched ✅",
      total,
      underReview,
      shortlisted,
      newToday,
    });
  } catch (error) {
    console.error("Summary Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Admin: Update Application Status
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const flow = [
      "NEW",
      "UNDER_REVIEW",
      "SHORTLISTED",
      "INTERVIEW_SCHEDULED",
      "REJECTED",
    ];

    if (!flow.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await JobApplication.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const currentIndex = flow.indexOf(application.status);
    const newIndex = flow.indexOf(status);

    // ✅ if already rejected, no update allowed
    if (application.status === "REJECTED") {
      return res.status(400).json({
        message: "Rejected application cannot be updated",
      });
    }

    // ✅ Prevent backward
    if (newIndex < currentIndex) {
      return res.status(400).json({
        message: `Backward status change not allowed (Current: ${application.status})`,
      });
    }

    // ✅ prevent same status update
    if (newIndex === currentIndex) {
      return res.status(400).json({
        message: `Application is already in ${application.status} status`,
      });
    }

    application.status = status;
    await application.save();

    const updated = await JobApplication.findById(id).populate(
      "jobId",
      "title",
    );

    return res.status(200).json({
      message: "Status updated ✅",
      application: updated,
    });
  } catch (error) {
    console.error("Update Status Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Admin: Download resume (proxy)

const downloadResume = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await JobApplication.findById(id);
    if (!application)
      return res.status(404).json({ message: "Application not found" });

    const url = application.resumeUrl;
    if (!url) return res.status(404).json({ message: "Resume not found" });

    // ✅ download file as binary
    const fileRes = await axios.get(url, { responseType: "arraybuffer" });

    // ✅ use resumeName (original file name)
    let filename = application.resumeName || "resume.pdf";

    // fallback if resumeName not stored
    if (!filename.includes(".")) {
      filename = filename + ".pdf";
    }

    // ✅ proper headers
    res.setHeader(
      "Content-Type",
      fileRes.headers["content-type"] || "application/octet-stream",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    return res.status(200).send(fileRes.data);
  } catch (error) {
    console.error("Download Resume Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  applyJob,
  getAllApplications,
  getApplicationsSummary,
  updateApplicationStatus,
  downloadResume,
};
