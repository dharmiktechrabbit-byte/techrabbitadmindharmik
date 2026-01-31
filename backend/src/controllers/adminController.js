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

    // ✅ plain password check (because you removed bcrypt)
    if (password !== admin.password) {
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
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { adminLogin };
