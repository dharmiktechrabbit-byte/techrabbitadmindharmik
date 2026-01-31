const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer, folderName = "techrabbit") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: folderName,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(fileBuffer);
  });
};

module.exports = { uploadToCloudinary };
