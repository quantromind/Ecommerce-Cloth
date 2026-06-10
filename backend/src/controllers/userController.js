/**
 * WHY: Frontend refresh ke baad bhi token se user data reload kar sake.
 * Route: GET /api/users/me (protected)
 */
const User = require("../models/User");

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * ADMIN: Get all users (filter by role optional)
 * GET /api/users
 */
const getAllUsers = async (req, res) => {
    try {
        const role = req.query.role;
        const filter = role ? { role } : {};
        // Return everything except password
        const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * ADMIN: Update user credentials
 * PUT /api/users/:id
 */
const updateUserByAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update fields if provided
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        if (req.body.password) {
            user.password = req.body.password; // Pre-save hook will hash it
        }

        // Optional: Update verification status
        if (typeof req.body.isVerified !== 'undefined') {
            user.isVerified = req.body.isVerified;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            isVerified: updatedUser.isVerified
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMe, getAllUsers, updateUserByAdmin };
