const multer = require("multer");

const storage = multer.memoryStorage();

const allowedMimeTypes = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/rtf",
  "application/vnd.oasis.opendocument.text", // .odt
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only resume files are allowed (pdf, doc, docx, rtf, odt)"), false);
};

const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // ✅ 10MB
  },
});

module.exports = uploadResume;
