const express = require("express");
const {
  applyJob,
  getAllApplications,
  getApplicationsSummary,
  updateApplicationStatus,
  downloadResume,
} = require("../controllers/jobApplicationController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

const uploadResume = require("../middlewares/resumeMulter");

const router = express.Router();

// ✅ PUBLIC: candidate apply job
router.post("/apply/:jobId", uploadResume.single("resume"), applyJob);

// ✅ ADMIN: list
router.get("/", authMiddleware, requireRole("admin"), getAllApplications);

// ✅ ADMIN: summary
router.get("/summary", authMiddleware, requireRole("admin"), getApplicationsSummary);

// ✅ ADMIN: update status
router.put("/:id/status", authMiddleware, requireRole("admin"), updateApplicationStatus);

// ✅ ADMIN: Download resume
router.get("/:id/resume", downloadResume);


module.exports = router;
