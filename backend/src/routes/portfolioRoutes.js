const express = require("express");
const {
  createPortfolio,
  getAllPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  updatePortfolioStatus,
} = require("../controllers/portfolioController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/multer");

const router = express.Router();

// ✅ Create Portfolio with Images
router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  upload.fields([
    { name: "projectLogo", maxCount: 1 },
    { name: "projectImage", maxCount: 1 },
  ]),
  createPortfolio
);

// ✅ Read
router.get("/", authMiddleware, requireRole("admin"), getAllPortfolios);
router.get("/:id", authMiddleware, requireRole("admin"), getPortfolioById);

// ✅ Update / Delete
router.put(
  "/:id",
  authMiddleware,
  requireRole("admin"),
  upload.fields([
    { name: "projectLogo", maxCount: 1 },
    { name: "projectImage", maxCount: 1 },
  ]),
  updatePortfolio
);
router.delete("/:id", authMiddleware, requireRole("admin"), deletePortfolio);

router.patch("/:id/status", authMiddleware, requireRole("admin"), updatePortfolioStatus);


module.exports = router;
