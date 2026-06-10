const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "DUMMY"); // later env

const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "Email and Password are required" });

        // --- SUPER ADMIN LOGIN MOVED TO DB LOOKUP ---
        // We now rely on Seed/Reset DB to create this user in the database.


        // --- NORMAL LOGIN (Database) ---
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        // Brand/Dealer Approval Check
        if ((user.role === "brand" || user.role === "dealer") && !user.isVerified) {
            return res.status(403).json({
                message: "Account pending approval. Please wait for Super Admin verification.",
                code: "PENDING_APPROVAL",
            });
        }

        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: error.message });
    }
};

/**
 * CUSTOMER REGISTER
 * POST /api/users/register
 */
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) return res.status(400).json({ message: "name, email, password required" });

        const exists = await User.findOne({ email: email.toLowerCase().trim() });
        if (exists) return res.status(409).json({ message: "Email already registered" });

        const user = await User.create({
            name,
            email: email.toLowerCase().trim(),
            password,
            role: "customer",
            isVerified: true, // customers can use immediately
        });

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            token: generateToken(user._id),
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// ... (keep googleLogin as is if not touching it, but I need to be careful with replace tool range)
// Actually I should just replace the function name and export.

/**
 * GOOGLE LOGIN (Customer)
// ...
 */
const googleLogin = async (req, res) => {
    // ...
    // content of googleLogin
    try {
        const { credential } = req.body;
        if (!credential) return res.status(400).json({ message: "Google credential required" });

        // Verify token with Google
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload?.email?.toLowerCase();
        const name = payload?.name || "Google User";

        if (!email) return res.status(400).json({ message: "Google token invalid" });

        let user = await User.findOne({ email });

        // If user doesn't exist, create as customer
        if (!user) {
            user = await User.create({
                name,
                email,
                password: "GoogleLogin@" + Date.now(), // will be hashed, user won't use it
                role: "customer",
                isVerified: true,
            });
        }

        // If someone tries google login for brand/dealer (blocked unless verified)
        if ((user.role === "brand" || user.role === "dealer") && !user.isVerified) {
            return res.status(403).json({ message: "Account pending approval", code: "PENDING_APPROVAL" });
        }

        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            token: generateToken(user._id),
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { authUser, registerUser, googleLogin };
