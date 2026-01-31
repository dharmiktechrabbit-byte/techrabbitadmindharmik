const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    experience: {
      type: String,
      required: true,
      trim: true,
      // you can make enum based on your dropdown
      // enum: ["0-1 years", "1-2 years", "2-4 years", "3-5 years", "5+ years"],
    },

    message: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    resumeUrl: {
      type: String,
      required: true,
    },

    resumePublicId: {
      type: String,
      default: "",
    },

    resumeName: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "NEW",
        "UNDER_REVIEW",
        "SHORTLISTED",
        "INTERVIEW_SCHEDULED",
        "REJECTED",
      ],
      default: "NEW",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
