const mongoose = require("mongoose");

const blogCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 20,
    },

    normalizedName: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("BlogCategory", blogCategorySchema);
