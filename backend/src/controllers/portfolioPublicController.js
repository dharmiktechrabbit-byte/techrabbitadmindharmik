const portfolioCategoryModels = require("../models/portfolioCategoryModels");
const PortfolioCategory = require("../models/portfolioCategoryModels");
const Portfolio = require("../models/portfolioModels");

// ✅ PUBLIC: Categories list (for tabs)
const getPortfolioCategoriesPublic = async (req, res) => {
  try {
    const categories = await PortfolioCategory.find({ status: "ACTIVE" })
      .sort({ createdAt: -1 })
      .select("_id name");

    return res.status(200).json({
      message: "Portfolio categories fetched ✅",
      categories,
    });
  } catch (error) {
    console.error("Public Categories Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getPortfoliosPublic = async (req, res) => {
  try {
    const { category = "all", search = "" } = req.query;

    const query = {
      status: "PUBLISHED",
      projectName: { $regex: search, $options: "i" },
    };

    // ✅ If category != all then filter
    if (category !== "all") {
      query.category = category; // categoryId
    }

    const portfolios = await Portfolio.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .select(
        "_id projectName shortDescription projectLogo projectImage category createdAt",
      );

    return res.status(200).json({
      message: "Portfolios fetched ✅",
      total: portfolios.length,
      portfolios,
    });
  } catch (error) {
    console.error("Public Portfolios Error:", error.message);
    return res.status(500).json({ message: "Server Error" });
  }
};



module.exports = {
  getPortfolioCategoriesPublic,
  getPortfoliosPublic,
};
