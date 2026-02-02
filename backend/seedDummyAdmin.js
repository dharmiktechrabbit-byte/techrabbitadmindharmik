const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./src/models/adminModels");

dotenv.config();

const seedDummyAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "admin@gmail.com";
    const password = "123456";

    // Delete existing admin with this email if any
    await Admin.deleteMany({ email });

    const admin = new Admin({
      name: "Dummy Admin",
      email,
      password, // Will be hashed automatically by the pre-save hook in adminModels.js
    });

    await admin.save();
    console.log(`✅ Dummy Admin created successfully!`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password} (Hashed in DB)`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding dummy admin:", error);
    process.exit(1);
  }
};

seedDummyAdmin();
