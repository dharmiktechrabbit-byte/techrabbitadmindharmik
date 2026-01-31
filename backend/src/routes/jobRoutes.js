const express = require("express");
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  updateJobStatus,
} = require("../controllers/jobController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

const router = express.Router();

// ✅ Create
router.post("/", authMiddleware, requireRole("admin"), createJob);

// ✅ Read
router.get("/", authMiddleware, requireRole("admin"), getAllJobs);
router.get("/:id", authMiddleware, requireRole("admin"), getJobById);

// ✅ Update
router.put("/:id", authMiddleware, requireRole("admin"), updateJob);

// ✅ Delete
router.delete("/:id", authMiddleware, requireRole("admin"), deleteJob);

router.patch("/:id/status", authMiddleware, requireRole("admin"), updateJobStatus);


module.exports = router;
