const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    description: {
      type: String,
      required: true, // ✅ important
      trim: true,
      maxlength: 500,
    },

    experience: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Freelance"],
      default: "Full-time",
    },

    location: {
      type: String,
      required: true,
      enum: ["Remote", "Hybrid", "On-site"],
      default: "Remote",
    },

    applicantsCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Active", "Closed"],
      default: "Active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Job", jobSchema);
