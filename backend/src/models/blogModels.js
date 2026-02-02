const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
    },

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogTag",
      },
    ],

    // ✅ Blog Image (Thumbnail / Cover)
    blogImage: {
      type: String,
      default: "",
    },

    blogImagePublicId: {
      type: String,
      default: "",
    },

    blogImageAlt: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },

    // ✅ SEO Settings
    metaTitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: 150,
    },

    metaDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["PUBLISHED", "DRAFT"],
      default: "DRAFT",
    },

    author: {
      type: String,
      default: "Admin",
    },

    views: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
