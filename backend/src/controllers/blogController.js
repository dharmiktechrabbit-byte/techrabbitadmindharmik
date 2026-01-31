const mongoose = require("mongoose");
const Blog = require("../models/blogModels");
const cloudinary = require("../config/cloudinary"); // ✅ your cloudinary config
const { uploadToCloudinary } = require("../utils/cloudinaryUpload"); // ✅ image upload util

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ✅ Create Blog (with image optional)
const createBlog = async (req, res) => {
  try {
    let {
      title,
      description,
      category,
      tags = [],
      metaTitle = "",
      metaDescription = "",
      slug,
      status = "DRAFT",
      blogImageAlt = "",
    } = req.body;

    if (!title || !description || !category || !slug) {
      return res.status(400).json({
        message: "title, description, category, slug are required",
      });
    }

    title = title.trim();
    slug = slug.trim().toLowerCase();
    metaTitle = metaTitle.trim();
    metaDescription = metaDescription.trim();
    blogImageAlt = blogImageAlt ? blogImageAlt.trim() : "";

    if (title.length < 3) {
      return res.status(400).json({ message: "Title must be at least 3 characters" });
    }

    if (title.length > 150) {
      return res.status(400).json({ message: "Title must be max 150 characters" });
    }

    if (metaTitle && metaTitle.length > 150) {
      return res.status(400).json({ message: "Meta title must be max 150 characters" });
    }

    if (metaDescription && metaDescription.length > 300) {
      return res
        .status(400)
        .json({ message: "Meta description must be max 300 characters" });
    }

    if (!isValidObjectId(category)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const allowedStatus = ["PUBLISHED", "DRAFT"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return res.status(400).json({
        message: "Slug is invalid. Use lowercase letters, numbers, and hyphen only.",
      });
    }

    // ✅ tags validation
    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: "tags must be an array" });
    }

    tags = [...new Set(tags)].filter(Boolean);

    for (let tagId of tags) {
      if (!isValidObjectId(tagId)) {
        return res.status(400).json({ message: `Invalid tag id: ${tagId}` });
      }
    }

    // ✅ slug duplicate check
    const exists = await Blog.findOne({ slug });
    if (exists) {
      return res.status(409).json({ message: "Slug already exists" });
    }

    // ✅ upload blog image (optional)
    let blogImage = "";
    let blogImagePublicId = "";

    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "techrabbit/blogs"
      );

      blogImage = uploadResult.secure_url;
      blogImagePublicId = uploadResult.public_id;
    }

    const blog = await Blog.create({
      title,
      description,
      category,
      tags,
      metaTitle,
      metaDescription,
      slug,
      status,
      blogImage,
      blogImagePublicId,
      blogImageAlt,
      author: "Admin",
      createdBy: req.user.id,
    });

    return res.status(201).json({ message: "Blog created ✅", blog });
  } catch (error) {
    console.error("Create Blog Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get All Blogs
const getBlogs = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const filter = {
      title: { $regex: search, $options: "i" },
    };

    const blogs = await Blog.find(filter)
      .populate("category", "name")
      .populate("tags", "name")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Blogs fetched ✅",
      total: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error("Get Blogs Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get Single Blog
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid blog id" });
    }

    const blog = await Blog.findById(id)
      .populate("category", "name")
      .populate("tags", "name");

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    return res.status(200).json({ message: "Blog fetched ✅", blog });
  } catch (error) {
    console.error("Get Blog Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update Blog (with optional image replace)
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid blog id" });
    }

    // ✅ validate tags if present
    if (req.body.tags) {
      if (!Array.isArray(req.body.tags)) {
        return res.status(400).json({ message: "tags must be an array" });
      }

      req.body.tags = [...new Set(req.body.tags)].filter(Boolean);

      for (let tagId of req.body.tags) {
        if (!isValidObjectId(tagId)) {
          return res.status(400).json({ message: `Invalid tag id: ${tagId}` });
        }
      }
    }

    if (req.body.category && !isValidObjectId(req.body.category)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    if (req.body.status) {
      const allowedStatus = ["PUBLISHED", "DRAFT"];
      if (!allowedStatus.includes(req.body.status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
    }

    // ✅ validate slug if present
    if (req.body.slug) {
      req.body.slug = req.body.slug.trim().toLowerCase();
      const slugRegex = /^[a-z0-9-]+$/;

      if (!slugRegex.test(req.body.slug)) {
        return res.status(400).json({
          message: "Slug is invalid. Use lowercase letters, numbers, and hyphen only.",
        });
      }

      const existSlug = await Blog.findOne({
        slug: req.body.slug,
        _id: { $ne: id },
      });

      if (existSlug) {
        return res.status(409).json({ message: "Slug already exists" });
      }
    }

    if (req.body.title) req.body.title = req.body.title.trim();
    if (req.body.metaTitle) req.body.metaTitle = req.body.metaTitle.trim();
    if (req.body.metaDescription) req.body.metaDescription = req.body.metaDescription.trim();
    if (req.body.blogImageAlt) req.body.blogImageAlt = req.body.blogImageAlt.trim();

    // ✅ if new image uploaded -> replace old
    if (req.file) {
      const oldBlog = await Blog.findById(id);

      // delete old image from cloudinary (if exists)
      if (oldBlog?.blogImagePublicId) {
        await cloudinary.uploader.destroy(oldBlog.blogImagePublicId);
      }

      // upload new image
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "techrabbit/blogs"
      );

      req.body.blogImage = uploadResult.secure_url;
      req.body.blogImagePublicId = uploadResult.public_id;
    }

    const updated = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("category", "name")
      .populate("tags", "name");

    if (!updated) return res.status(404).json({ message: "Blog not found" });

    return res.status(200).json({ message: "Blog updated ✅", blog: updated });
  } catch (error) {
    console.error("Update Blog Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Delete Blog (also delete cloudinary image)
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid blog id" });
    }

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    if (blog.blogImagePublicId) {
      await cloudinary.uploader.destroy(blog.blogImagePublicId);
    }

    await Blog.findByIdAndDelete(id);

    return res.status(200).json({ message: "Blog deleted ✅" });
  } catch (error) {
    console.error("Delete Blog Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update Blog Status (PUBLISHED / DRAFT)
const updateBlogStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid blog id" });
    }

    const allowedStatus = ["PUBLISHED", "DRAFT"];
    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Allowed: PUBLISHED, DRAFT",
      });
    }

    const updated = await Blog.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("category", "name")
      .populate("tags", "name");

    if (!updated) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({
      message: "Blog status updated ✅",
      blog: updated,
    });
  } catch (error) {
    console.error("Update Blog Status Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};


module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  updateBlogStatus
};
