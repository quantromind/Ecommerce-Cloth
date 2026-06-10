const Review = require("../models/Review");
const Order = require("../models/Order");
const mongoose = require("mongoose");

/**
 * @desc    Get all reviews for a product + avg rating + count
 * @route   GET /api/products/:id/reviews
 * @access  Public
 */
const getProductReviews = async (req, res) => {
    try {
        const productId = req.params.id;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        // Fetch reviews with user info
        const reviews = await Review.find({ productId })
            .populate("userId", "name")
            .sort({ createdAt: -1 });

        // Calculate stats
        const reviewCount = reviews.length;
        const avgRating = reviewCount > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
            : 0;

        res.json({
            reviews: reviews.map(r => ({
                _id: r._id,
                rating: r.rating,
                comment: r.comment,
                verifiedPurchase: r.verifiedPurchase,
                createdAt: r.createdAt,
                user: {
                    _id: r.userId._id,
                    name: r.userId.name,
                },
            })),
            avgRating: parseFloat(avgRating),
            reviewCount,
        });
    } catch (error) {
        console.error("getProductReviews Error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Create or update user's review (Verified Purchase required)
 * @route   POST /api/products/:id/reviews
 * @access  Protected (customer)
 */
const createOrUpdateReview = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user._id;
        const { rating, comment } = req.body;

        // Validation
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        if (!comment || comment.trim().length < 5) {
            return res.status(400).json({ message: "Comment must be at least 5 characters" });
        }

        // Check Verified Purchase: user must have ordered this product
        const hasPurchased = await Order.findOne({
            user: userId,
            "orderItems.product": productId,
        });

        if (!hasPurchased) {
            return res.status(403).json({
                message: "You must purchase this product before reviewing it",
                code: "PURCHASE_REQUIRED",
            });
        }

        // Upsert review (create or update)
        const review = await Review.findOneAndUpdate(
            { productId, userId },
            {
                productId,
                userId,
                rating: parseInt(rating),
                comment: comment.trim(),
                verifiedPurchase: true,
            },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(201).json({
            message: review.createdAt === review.updatedAt ? "Review submitted" : "Review updated",
            review: {
                _id: review._id,
                rating: review.rating,
                comment: review.comment,
                verifiedPurchase: review.verifiedPurchase,
                createdAt: review.createdAt,
            },
        });
    } catch (error) {
        // Handle duplicate key error (shouldn't happen with upsert, but safety)
        if (error.code === 11000) {
            return res.status(409).json({ message: "You already reviewed this product" });
        }
        console.error("createOrUpdateReview Error:", error);
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Check if current user can review a product (has purchased it)
 * @route   GET /api/products/:id/reviews/can-review
 * @access  Protected
 */
const canUserReview = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }

        // Check if user purchased this product
        const hasPurchased = await Order.findOne({
            user: userId,
            "orderItems.product": productId,
        });

        // Check if user already reviewed
        const existingReview = await Review.findOne({ productId, userId });

        res.json({
            canReview: !!hasPurchased,
            hasPurchased: !!hasPurchased,
            existingReview: existingReview ? {
                _id: existingReview._id,
                rating: existingReview.rating,
                comment: existingReview.comment,
            } : null,
        });
    } catch (error) {
        console.error("canUserReview Error:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProductReviews,
    createOrUpdateReview,
    canUserReview,
};
