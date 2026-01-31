const BlogCategory = require("../models/blogCategoryModels");
const Blog = require("../models/blogModels");

// ✅ Create Blog Category
const createBlogCategory = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name required" });
    }

    // ✅ normalize
    name = String(name).trim();

    // ✅ max length 20
    if (name.length > 20) {
      return res.status(400).json({
        message: "Category name must be maximum 20 characters",
      });
    }

    // ✅ alphabets only (with spaces)
    const alphaRegex = /^[A-Za-z\s]+$/;
    if (!alphaRegex.test(name)) {
      return res.status(400).json({
        message: "Category name must contain only alphabetic characters",
      });
    }

    // ✅ normalize multiple spaces
    name = name.replace(/\s+/g, " ").trim();

    // ✅ remove case + spaces for duplicate checking
    const normalizedName = name.toLowerCase().replace(/\s+/g, "");

    // ✅ check duplicates: case/space ignored
    const exists = await BlogCategory.findOne({ normalizedName });
    if (exists) {
      return res.status(409).json({
        message: "Category already exists (case/space duplicates not allowed)",
      });
    }

    const category = await BlogCategory.create({
      name,
      normalizedName,
      createdBy: req.user.id,
    });

    return res
      .status(201)
      .json({ message: "Blog category created ✅", category });
  } catch (error) {
    console.error("Create Blog Category Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get All Categories
const getBlogCategories = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const categories = await BlogCategory.find({
      name: { $regex: search, $options: "i" },
    }).sort({ createdAt: -1 });

    // count blogs in category
    const result = await Promise.all(
      categories.map(async (cat) => {
        const count = await Blog.countDocuments({ category: cat._id });
        return {
          _id: cat._id,
          name: cat.name,
          status: cat.status,
          blogsCount: count,
          createdAt: cat.createdAt,
        };
      }),
    );

    res
      .status(200)
      .json({ message: "Categories fetched ✅", categories: result });
  } catch (error) {
    console.error("Get Blog Categories Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update Category
const updateBlogCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await BlogCategory.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category updated ✅", category: updated });
  } catch (error) {
    console.error("Update Blog Category Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Delete Category (prevent if blogs exist)
const deleteBlogCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const count = await Blog.countDocuments({ category: id });
    if (count > 0) {
      return res.status(400).json({
        message: `Cannot delete category. ${count} blogs exist.`,
      });
    }

    const deleted = await BlogCategory.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category deleted ✅" });
  } catch (error) {
    console.error("Delete Blog Category Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createBlogCategory,
  getBlogCategories,
  updateBlogCategory,
  deleteBlogCategory,
};
