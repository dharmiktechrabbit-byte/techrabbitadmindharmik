const express = require("express");
const { adminLogin, resetPassword } = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Admin login
router.post("/login", adminLogin);

// Reset password (Authenticated)
router.put("/reset-password", authMiddleware, resetPassword);

module.exports = router;
