const Portfolio = require("../models/portfolioModels");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");

const createPortfolio = async (req, res) => {
  try {
    const { projectName, category, shortDescription, status } = req.body;

    if (!projectName || !category || !shortDescription) {
      return res.status(400).json({
        message: "projectName, category, shortDescription are required",
      });
    }

    // ✅ validate length
    if (projectName.trim().length > 50) {
      return res.status(400).json({
        message: "Project Name must be maximum 50 characters",
      });
    }

    if (shortDescription.trim().length > 500) {
      return res.status(400).json({
        message: "Project Description must be maximum 500 characters",
      });
    }

    // ✅ validate required files
    if (!req.files?.projectLogo?.[0]) {
      return res.status(400).json({ message: "Project logo is required" });
    }

    if (!req.files?.projectImage?.[0]) {
      return res.status(400).json({ message: "Project image is required" });
    }

    const logoFile = req.files.projectLogo[0];
    const imageFile = req.files.projectImage[0];

    // ✅ validate image mimetype
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

    if (!allowedTypes.includes(logoFile.mimetype)) {
      return res.status(400).json({
        message: "Invalid projectLogo file type. Only JPG, PNG, WEBP allowed",
      });
    }

    if (!allowedTypes.includes(imageFile.mimetype)) {
      return res.status(400).json({
        message: "Invalid projectImage file type. Only JPG, PNG, WEBP allowed",
      });
    }

    // ✅ validate image size (5MB)
    const maxSize = 5 * 1024 * 1024;

    if (logoFile.size > maxSize) {
      return res.status(400).json({
        message: "Project logo size must be less than 5MB",
      });
    }

    if (imageFile.size > maxSize) {
      return res.status(400).json({
        message: "Project image size must be less than 5MB",
      });
    }

    // ✅ upload to cloudinary
    const logoUpload = await uploadToCloudinary(
      logoFile.buffer,
      "techrabbit/portfolios/logo",
    );

    const imageUpload = await uploadToCloudinary(
      imageFile.buffer,
      "techrabbit/portfolios/image",
    );

    const portfolio = await Portfolio.create({
      projectName: projectName.trim(),
      category,
      shortDescription: shortDescription.trim(),
      status: status || "DRAFT",
      projectLogo: logoUpload.secure_url,
      projectImage: imageUpload.secure_url,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Portfolio created ✅",
      portfolio,
    });
  } catch (error) {
    console.error("Create Portfolio Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get All Portfolios (with search)
const getAllPortfolios = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const query = {
      projectName: { $regex: search, $options: "i" },
    };

    const portfolios = await Portfolio.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Portfolios fetched ✅",
      total: portfolios.length,
      portfolios,
    });
  } catch (error) {
    console.error("Get Portfolios Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get Single Portfolio
const getPortfolioById = async (req, res) => {
  try {
    const { id } = req.params;

    const portfolio = await Portfolio.findById(id);
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    return res.status(200).json({
      message: "Portfolio fetched ✅",
      portfolio,
    });
  } catch (error) {
    console.error("Get Portfolio Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update Portfolio
const updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectName, shortDescription } = req.body;

    // ✅ validate length if present
    if (projectName && typeof projectName === 'string' && projectName.trim().length > 50) {
      return res.status(400).json({
        message: "Project Name must be maximum 50 characters",
      });
    }

    if (shortDescription && typeof shortDescription === 'string' && shortDescription.trim().length > 500) {
      return res.status(400).json({
        message: "Project Description must be maximum 500 characters",
      });
    }

    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true },
    );

    if (!updatedPortfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    return res.status(200).json({
      message: "Portfolio updated ✅",
      portfolio: updatedPortfolio,
    });
  } catch (error) {
    console.error("Update Portfolio Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Delete Portfolio
const deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPortfolio = await Portfolio.findByIdAndDelete(id);
    if (!deletedPortfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    return res.status(200).json({
      message: "Portfolio deleted ✅",
      portfolio: deletedPortfolio,
    });
  } catch (error) {
    console.error("Delete Portfolio Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

const updatePortfolioStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["PUBLISHED", "DRAFT"];

    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Allowed: PUBLISHED, DRAFT",
      });
    }

    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!updatedPortfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    return res.status(200).json({
      message: "Portfolio status updated ✅",
      portfolio: updatedPortfolio,
    });
  } catch (error) {
    console.error("Update Portfolio Status Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createPortfolio,
  getAllPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  updatePortfolioStatus,
};
