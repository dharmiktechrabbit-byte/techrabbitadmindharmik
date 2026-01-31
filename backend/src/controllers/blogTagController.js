const BlogTag = require("../models/blogTagModels");
const Blog = require("../models/blogModels");

// Create Tag
const createTag = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Tag name is required" });
    }

    // ✅ normalize
    name = String(name).trim();

    // ✅ max length 20
    if (name.length > 20) {
      return res.status(400).json({
        message: "Tag name must be maximum 20 characters",
      });
    }

    // ✅ alphabets only (with spaces)
    const alphaRegex = /^[A-Za-z\s]+$/;
    if (!alphaRegex.test(name)) {
      return res.status(400).json({
        message: "Tag name must contain only alphabetic characters",
      });
    }

    // ✅ normalize multiple spaces
    name = name.replace(/\s+/g, " ").trim();

    // ✅ normalized key (no case + no spaces)
    const normalizedName = name.toLowerCase().replace(/\s+/g, "");

    // ✅ check duplicate tag (case + space ignore)
    const tagExists = await BlogTag.findOne({ normalizedName });
    if (tagExists) {
      return res.status(409).json({
        message: "Tag already exists (case/space duplicates not allowed)",
      });
    }

    const tag = await BlogTag.create({
      name,
      normalizedName,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Tag created ✅",
      tag,
    });
  } catch (error) {
    console.error("Create Tag Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get All Tags (+usage count + search)
const getAllTags = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const tags = await BlogTag.find({
      name: { $regex: search, $options: "i" },
    }).sort({ createdAt: -1 });

    const tagsWithCount = await Promise.all(
      tags.map(async (tag) => {
        const usageCount = await Blog.countDocuments({ tags: tag._id });

        return {
          _id: tag._id,
          name: tag.name,
          status: tag.status,
          usageCount,
          createdAt: tag.createdAt,
        };
      }),
    );

    return res.status(200).json({
      message: "Tags fetched ✅",
      total: tagsWithCount.length,
      tags: tagsWithCount,
    });
  } catch (error) {
    console.error("Get Tags Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Tag
const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const updated = await BlogTag.findByIdAndUpdate(
      id,
      { name, status },
      { new: true, runValidators: true },
    );

    if (!updated) return res.status(404).json({ message: "Tag not found" });

    return res.status(200).json({
      message: "Tag updated ✅",
      tag: updated,
    });
  } catch (error) {
    console.error("Update Tag Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Tag (prevent if used in blogs)
const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const usageCount = await Blog.countDocuments({ tags: id });
    if (usageCount > 0) {
      return res.status(400).json({
        message: `Cannot delete tag. Used in ${usageCount} blog posts.`,
      });
    }

    const deleted = await BlogTag.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Tag not found" });

    return res.status(200).json({
      message: "Tag deleted ✅",
    });
  } catch (error) {
    console.error("Delete Tag Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createTag,
  getAllTags,
  updateTag,
  deleteTag,
};
