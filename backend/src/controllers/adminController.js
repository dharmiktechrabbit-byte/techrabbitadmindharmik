const Admin = require("../models/adminModels");

const { generateToken } = require("../utils/jwt");

// ✅ Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Compare hashed password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }


    const token = generateToken({
      id: admin._id,
      role: "admin",
    });

    return res.status(200).json({
      message: "Admin login success ✅",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        twoFAEnabled: admin.twoFAEnabled,
      },
    });

  } catch (error) {
    console.error("Admin Login Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Admin Reset Password (Authenticated)
const resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const adminId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new passwords are required" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Verify old password
    const isMatch = await admin.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    // Update to new password
    admin.password = newPassword;
    await admin.save();

    return res.status(200).json({
      message: "Password reset successfully ✅",
    });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { adminLogin, resetPassword };


