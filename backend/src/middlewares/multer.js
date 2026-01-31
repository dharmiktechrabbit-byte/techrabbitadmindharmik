const multer = require("multer");

// store file in memory (buffer), not in local uploads folder
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // allow only image
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

module.exports = upload;
