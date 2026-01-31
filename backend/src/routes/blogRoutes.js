const express = require("express");
const {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  updateBlogStatus,
} = require("../controllers/blogController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/multer");

const router = express.Router();

// ✅ Admin CRUD
router.post(
  "/",
  authMiddleware,
  requireRole("admin"),
  upload.single("blogImage"),
  createBlog,
);
router.get("/", authMiddleware, requireRole("admin"), getBlogs);
router.get("/:id", authMiddleware, requireRole("admin"), getBlogById);
router.put("/:id", authMiddleware, requireRole("admin"), updateBlog);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteBlog);
router.patch("/:id/status", authMiddleware, requireRole("admin"), updateBlogStatus);

module.exports = router;
