const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

const {
  getDashboardSummary,
  getDashboardRecentActivities,
} = require("../controllers/dashboardController");

const router = express.Router();

// ✅ Admin Dashboard
router.get("/summary", authMiddleware, requireRole("admin"), getDashboardSummary);
router.get(
  "/recent-activities",
  authMiddleware,
  requireRole("admin"),
  getDashboardRecentActivities
);

module.exports = router;
