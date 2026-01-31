const express = require("express");
const {
  createBlogCategory,
  getBlogCategories,
  updateBlogCategory,
  deleteBlogCategory,
} = require("../controllers/blogCategoryController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, requireRole("admin"), createBlogCategory);
router.get("/", authMiddleware, requireRole("admin"), getBlogCategories);
router.put("/:id", authMiddleware, requireRole("admin"), updateBlogCategory);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteBlogCategory);

module.exports = router;
