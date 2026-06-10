const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    getBrandSales,
    updateOrderStatus,
    deleteOrder
} = require("../controllers/orderController");

const router = express.Router();

router.route("/")
    .post(protect, addOrderItems)
    .get(protect, authorize("admin"), getOrders);

router.get("/my", protect, getMyOrders);
router.get("/brand-sales", protect, authorize("admin"), getBrandSales);

router.route("/:id")
    .get(protect, getOrderById)
    .delete(protect, authorize("admin"), deleteOrder);

router.patch("/:id/status", protect, authorize("admin"), updateOrderStatus);

module.exports = router;
