const express = require("express");
const {
  createTag,
  getAllTags,
  updateTag,
  deleteTag,
} = require("../controllers/blogTagController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", authMiddleware, requireRole("admin"), createTag);
router.get("/", authMiddleware, requireRole("admin"), getAllTags);
router.put("/:id", authMiddleware, requireRole("admin"), updateTag);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteTag);

module.exports = router;
