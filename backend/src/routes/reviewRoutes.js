const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
    getProductReviews,
    createOrUpdateReview,
    canUserReview,
} = require("../controllers/reviewController");

const router = express.Router();

// Public: Get reviews for a product
router.get("/:id/reviews", getProductReviews);

// Protected: Check if user can review (purchased product)
router.get("/:id/reviews/can-review", protect, canUserReview);

// Protected: Create/Update review (customer only, verified purchase required)
router.post("/:id/reviews", protect, authorize("customer"), createOrUpdateReview);

module.exports = router;
