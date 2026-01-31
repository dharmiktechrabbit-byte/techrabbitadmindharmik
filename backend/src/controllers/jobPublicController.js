const mongoose = require("mongoose");
const Job = require("../models/jobModels");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ✅ Get all jobs for user side (only Active)
const getJobsPublic = async (req, res) => {
  try {
    const {
      search = "",
      location = "all",
      type = "all",
      experience = "all",
    } = req.query;

    const query = {
      status: "Active",
      title: { $regex: search, $options: "i" },
    };

    if (location !== "all") query.location = location;
    if (type !== "all") query.type = type;
    if (experience !== "all") query.experience = experience;

    const jobs = await Job.find(query)
      .select("_id title description experience type location status createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Jobs fetched ✅",
      total: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Public Jobs Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get single job details (user side)
const getJobPublicById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const job = await Job.findOne({ _id: id, status: "Active" })
      .select("_id title description experience type location status createdAt")
      .lean();

    if (!job) return res.status(404).json({ message: "Job not found" });

    return res.status(200).json({
      message: "Job fetched ✅",
      job,
    });
  } catch (error) {
    console.error("Public Job Details Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getJobsPublic,
  getJobPublicById,
};
