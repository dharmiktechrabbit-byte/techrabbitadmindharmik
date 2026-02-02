const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const speakeasy = require('speakeasy');
const Admin = require('./src/models/adminModels');

dotenv.config();

const BASE_URL = 'http://localhost:5000/api/2fa/';
const userId = '69802bd8fa6808b353e2de38';

const verify2FAFlow = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for 2FA verification");

        // 1. Enable 2FA
        console.log("Enabling 2FA...");
        const enableRes = await axios.post(`${BASE_URL}enable`, { userId });
        console.log("✅ Success: Enable 2FA response received.");
        
        // 2. Get Secret from DB
        const admin = await Admin.findById(userId);
        const secret = admin.twoFASecret;
        console.log(`Retrieved secret from DB: ${secret}`);

        // 3. Generate TOTP
        const token = speakeasy.totp({
            secret: secret,
            encoding: 'base32'
        });
        console.log(`Generated TOTP: ${token}`);

        // 4. Verify 2FA
        console.log("Verifying 2FA...");
        const verifyRes = await axios.post(`${BASE_URL}verify`, { userId, token });
        
        if (verifyRes.status === 200) {
            console.log("✅ Success: 2FA verification worked.");
            console.log("Response:", JSON.stringify(verifyRes.data, null, 2));
        } else {
            console.error(`❌ Failure: 2FA verification failed with status ${verifyRes.status}`);
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error during 2FA verification:", error.response ? error.response.data : error.message);
        process.exit(1);
    }
};

verify2FAFlow();
