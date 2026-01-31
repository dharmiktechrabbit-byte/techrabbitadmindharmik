const express = require("express");
const {
  getPortfolioCategoriesPublic,
  getPortfoliosPublic,
} = require("../controllers/portfolioPublicController");

const router = express.Router();

// ✅ Categories for tabs
router.get("/portfolio-categories", getPortfolioCategoriesPublic);

// ✅ Portfolios list
router.get("/portfolios", getPortfoliosPublic);



module.exports = router;
