const express = require("express");
const router = express.Router();
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
} = require("../controllers/wishlistController");
const { protect } = require("../middlewares/authMiddleware");

// All routes are protected
router.use(protect);

router.get("/", getWishlist);
router.post("/:productId", addToWishlist);
router.delete("/:productId", removeFromWishlist);

module.exports = router;
