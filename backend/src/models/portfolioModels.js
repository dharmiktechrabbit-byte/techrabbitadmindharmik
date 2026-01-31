const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PortfolioCategory",
      required: true,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    // ✅ store uploaded file path/url
    projectLogo: {
      type: String,
      default: "",
    },

    projectImage: {
      type: String,
      default: "",
    },

    // ✅ status: Draft / Published
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "DRAFT",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
