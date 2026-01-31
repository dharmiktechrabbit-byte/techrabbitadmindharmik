const cloudinary = require("../config/cloudinary");

const uploadResumeToCloudinary = (fileBuffer, folderName = "techrabbit/resumes") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folderName,
          resource_type: "raw", // ✅ important for pdf/doc/docx
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(fileBuffer);
  });
};

module.exports = { uploadResumeToCloudinary };
