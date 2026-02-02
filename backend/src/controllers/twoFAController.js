const Admin = require("../models/adminModels");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const { generateToken } = require("../utils/jwt");

// ENABLE 2FA → generate QR
const enable2FA = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    const user = await Admin.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // 🔥 DO NOT regenerate secret if already exists
    if (user.twoFASecret) {
      const otpauthUrl = speakeasy.otpauthURL({
        secret: user.twoFASecret,
        label: `TechRabbitAdmin (${user.email})`,
        encoding: "base32",
      });

      const qrCode = await QRCode.toDataURL(otpauthUrl);

      return res.json({
        message: "Scan QR code",
        qrCode,
      });
    }

    // ✅ Generate ONLY once
    const secret = speakeasy.generateSecret({
      name: `TechRabbitAdmin (${user.email})`,
    });

    user.twoFASecret = secret.base32;
    user.twoFAEnabled = false;
    await user.save();

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      message: "Scan QR code",
      qrCode,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// VERIFY TOTP → activate 2FA
const verify2FA = async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({
        message: "User ID and token required",
      });
    }

    const user = await Admin.findById(userId);
    if (!user || !user.twoFASecret) {
      return res.status(400).json({
        message: "2FA not initialized",
      });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: "base32",
      token: token.toString(), // 🔥 IMPORTANT
      window: 1,
    });

    if (!verified) {
      return res.status(401).json({
        message: "Invalid authentication code",
      });
    }

    user.twoFAEnabled = true;
    await user.save();

    // 🔑 JWT AFTER VERIFY
    const userToken = generateToken({
      id: user._id,
      role: "admin",
    });

    res.status(200).json({
      message: "2FA enabled successfully",
      token: userToken,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  enable2FA,
  verify2FA,
};
