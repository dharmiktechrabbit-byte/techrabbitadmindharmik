const Job = require("../models/jobModels");

// ✅ Create Job
const createJob = async (req, res) => {
  try {
    const { title, description, experience, type, location, status } = req.body;

    if (!title || !description || !experience || !type || !location) {
      return res.status(400).json({
        message: "title, description, experience, type, location are required",
      });
    }

    const job = await Job.create({
      title: title.trim(),
      description: description.trim(),
      experience,
      type,
      location,
      status: status || "Active",
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Job created ✅",
      job,
    });
  } catch (error) {
    console.error("Create Job Error:", error.message);
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
