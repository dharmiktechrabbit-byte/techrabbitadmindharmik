const Job = require("../models/jobModels");

// ✅ Create Job
// ✅ Create Job with proper validation
const createJob = async (req, res) => {
  try {
    const { title, description, experience, type, location, status } = req.body;

    const isValidString = (v) => typeof v === "string" && v.trim().length > 0;

    if (!isValidString(title))
      return res.status(400).json({ message: "title is required" });

    if (!isValidString(description))
      return res.status(400).json({ message: "description is required" });

    if (!isValidString(location))
      return res.status(400).json({ message: "location is required" });

    if (title.trim().length < 3 || title.trim().length > 80) {
      return res.status(400).json({
        message: "title must be between 3 and 80 characters",
      });
    }

    if (description.trim().length < 10 || description.trim().length > 5000) {
      return res.status(400).json({
        message: "description must be between 10 and 5000 characters",
      });
    }

    const exp = Number(experience);
    if (Number.isNaN(exp) || exp < 0 || exp > 50) {
      return res.status(400).json({
        message: "experience must be a valid number between 0 and 50",
      });
    }

    const allowedTypes = [
      "Full-time",
      "Part-time",
      "Internship",
      "Contract",
      "Freelance",
    ];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        message: `type must be one of: ${allowedTypes.join(", ")}`,
      });
    }

    // ✅ NEW location validation
    const allowedLocations = ["Remote", "Hybrid", "On-site"];
    if (!allowedLocations.includes(location)) {
      return res.status(400).json({
        message: `location must be one of: ${allowedLocations.join(", ")}`,
      });
    }

    const allowedStatus = ["Active", "Inactive", "Closed"];
    const finalStatus = status || "Active";

    if (!allowedStatus.includes(finalStatus)) {
      return res.status(400).json({
        message: `status must be one of: ${allowedStatus.join(", ")}`,
      });
    }

    if (!req.user?.id)
      return res.status(401).json({ message: "Unauthorized" });

    const job = await Job.create({
      title: title.trim(),
      description: description.trim(),
      experience: exp,
      type,
      location,
      status: finalStatus,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Job created ✅",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};


// ✅ Get All Jobs (Search)
const getAllJobs = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const query = {
      title: { $regex: search, $options: "i" },
    };

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Jobs fetched ✅",
      total: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get Jobs Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get Single Job
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({
      message: "Job fetched ✅",
      job,
    });
  } catch (error) {
    console.error("Get Job Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update Job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.title) req.body.title = req.body.title.trim();
    if (req.body.description) req.body.description = req.body.description.trim();

    const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({
      message: "Job updated ✅",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update Job Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Delete Job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedJob = await Job.findByIdAndDelete(id);
    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({
      message: "Job deleted ✅",
      job: deletedJob,
    });
  } catch (error) {
    console.error("Delete Job Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update Job Status (select Active / Closed)
const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["Active", "Closed"];
    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Allowed: Active, Closed",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({
      message: "Job status updated ✅",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update Job Status Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
};
