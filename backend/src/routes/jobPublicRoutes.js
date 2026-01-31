const express = require("express");
const {
  getJobsPublic,
  getJobPublicById,
} = require("../controllers/jobPublicController");

const router = express.Router();

// ✅ list jobs
router.get("/", getJobsPublic);

// ✅ job details
router.get("/:id", getJobPublicById);

module.exports = router;
