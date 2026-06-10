const express = require("express");
const { authUser, registerUser, googleLogin } = require("../controllers/authController");

const router = express.Router();

router.post("/login", authUser);
router.post("/register", registerUser);
router.post("/google", googleLogin);

module.exports = router;
