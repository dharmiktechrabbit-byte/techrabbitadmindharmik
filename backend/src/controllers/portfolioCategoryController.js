const PortfolioCategory = require("../models/portfolioCategoryModels");
const Portfolio = require("../models/portfolioModels");

// ✅ Create Category
const createCategory = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // ✅ normalize name
    name = String(name).trim();

    // ✅ max length
    if (name.length > 50) {
      return res
        .status(400)
        .json({ message: "Category name must be maximum 50 characters" });
    }

    // ✅ allow only alphabets + spaces
    const alphaRegex = /^[A-Za-z\s]+$/;
    if (!alphaRegex.test(name)) {
      return res.status(400).json({
        message: "Category name must contain only alphabetic characters",
      });
    }

    // ✅ remove extra spaces (normalize)
    name = name.replace(/\s+/g, " ").trim();

    // ✅ create normalized key (case + spaces removed)
    const normalizedName = name.toLowerCase().replace(/\s+/g, "");

    // ✅ check duplicates ignoring case + spaces
    const exist = await PortfolioCategory.findOne({
      normalizedName,
    });

    if (exist) {
      return res.status(409).json({
        message:
          "Category already exists (case/space duplicates are not allowed)",
      });
    }

    const category = await PortfolioCategory.create({
      name,
      normalizedName, // ✅ store
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Category created ✅",
      category,
    });
  } catch (error) {
    console.error("Create Category Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get All Categories (with search + project count)
const getAllCategories = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const categories = await PortfolioCategory.find({
      name: { $regex: search, $options: "i" },
    }).sort({ createdAt: -1 });

    // add project count
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Portfolio.countDocuments({ category: cat._id });

        return {
          _id: cat._id,
          name: cat.name,
          status: cat.status,
          projectsCount: count,
          createdAt: cat.createdAt,
        };
      }),
    );

    res.status(200).json({
      message: "Categories fetched ✅",
      total: categoriesWithCount.length,
      categories: categoriesWithCount,
    });
  } catch (error) {
    console.error("Get Category Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update Category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const updated = await PortfolioCategory.findByIdAndUpdate(
      id,
      { name, status },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated ✅",
      category: updated,
    });
  } catch (error) {
    console.error("Update Category Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Delete Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ prevent delete if portfolios exist
    const count = await Portfolio.countDocuments({ category: id });

    if (count > 0) {
      return res.status(400).json({
        message: `Cannot delete category. ${count} projects exist in this category.`,
      });
    }

    const deleted = await PortfolioCategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted ✅" });
  } catch (error) {
    console.error("Delete Category Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
