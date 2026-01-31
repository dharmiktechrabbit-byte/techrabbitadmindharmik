const mongoose = require("mongoose");
const Blog = require("../models/blogModels");
const BlogCategory = require("../models/blogCategoryModels");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ✅ GET all blog categories (user-side dropdown)
const getBlogCategoriesPublic = async (req, res) => {
  try {
    const categories = await BlogCategory.find()
      .select("_id name")
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      message: "Blog categories fetched ✅",
      total: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Public Blog Categories Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getBlogsPublic = async (req, res) => {
  try {
    const { search = "", category = "all", categoryName = "" } = req.query;

    const query = {
      status: "PUBLISHED",
      title: { $regex: search, $options: "i" },
    };

    // ✅ 1) category filter by ObjectId
    if (category !== "all") {
      if (!isValidObjectId(category)) {
        return res.status(400).json({ message: "Invalid category id" });
      }
      query.category = category;
    }

    // ✅ 2) category filter by categoryName (case-insensitive)
    // categoryName should be ignored if category is already provided
    if (category === "all" && categoryName) {
      const normalized = String(categoryName).trim();

      const foundCategory = await BlogCategory.findOne({
        name: { $regex: `^${normalized}$`, $options: "i" }, // exact match ignore case
      }).select("_id");

      if (!foundCategory) {
        return res.status(200).json({
          message: "Blogs fetched ✅",
          total: 0,
          blogs: [],
        });
      }

      query.category = foundCategory._id;
    }

    const blogs = await Blog.find(query)
      .populate("category", "name")
      .populate("tags", "name")
      .select(
        "_id title slug blogImage blogImageAlt category metaDescription createdAt",
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Blogs fetched ✅",
      total: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error("Public Blogs Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ GET single published blog by slug (blog details page)
const getBlogPublicBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) return res.status(400).json({ message: "Slug is required" });

    const blog = await Blog.findOne({
      slug: slug.toLowerCase(),
      status: "PUBLISHED",
    })
      .populate("category", "name")
      .populate("tags", "name")
      .select(
        "_id title description slug blogImage blogImageAlt category tags metaTitle metaDescription author createdAt",
      );

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    return res.status(200).json({
      message: "Blog fetched ✅",
      blog,
    });
  } catch (error) {
    console.error("Public Blog Details Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getBlogCategoriesPublic,
  getBlogsPublic,
  getBlogPublicBySlug,
};
