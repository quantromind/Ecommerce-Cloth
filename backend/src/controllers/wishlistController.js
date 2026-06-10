const User = require("../models/User");
const Product = require("../models/Product");

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private (Customer)
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishlist");
        res.status(200).json(user.wishlist);
    } catch (error) {
        console.error("Get Wishlist Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private (Customer)
exports.addToWishlist = async (req, res) => {
    try {
        const productId = req.params.productId;
        const user = await User.findById(req.user._id);

        if (user.wishlist.includes(productId)) {
            return res.status(400).json({ message: "Product already in wishlist" });
        }

        user.wishlist.push(productId);
        await user.save();

        res.status(200).json({ message: "Added to wishlist" });
    } catch (error) {
        console.error("Add to Wishlist Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private (Customer)
exports.removeFromWishlist = async (req, res) => {
    try {
        const productId = req.params.productId;
        const user = await User.findById(req.user._id);

        user.wishlist = user.wishlist.filter(
            (id) => id.toString() !== productId.toString()
        );
        await user.save();

        res.status(200).json({ message: "Removed from wishlist" });
    } catch (error) {
        console.error("Remove from Wishlist Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
