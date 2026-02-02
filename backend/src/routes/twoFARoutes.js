const express = require("express");
const { enable2FA, verify2FA } = require("../controllers/twoFAController");

const router = express.Router();

router.post("/enable", enable2FA);
router.post("/verify", verify2FA);

module.exports = router;
