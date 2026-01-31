const express = require("express");
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/portfolioCategoryController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, requireRole("admin"), createCategory);
router.get("/", authMiddleware, requireRole("admin"), getAllCategories);
router.put("/:id", authMiddleware, requireRole("admin"), updateCategory);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteCategory);

module.exports = router;
