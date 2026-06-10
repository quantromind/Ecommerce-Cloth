const express = require("express");
const { protect, authorize, requireVerifiedForBusinessRoles } = require("../middlewares/authMiddleware");
const {
    getProducts,
    getProductById,
    createProduct,
    getMyProducts,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const router = express.Router();

router.route("/")
    .get(getProducts)
    .post(protect, authorize("admin", "owner"), createProduct);



router.get("/my", protect, authorize("admin", "owner"), getMyProducts);

router.route("/:id")
    .get(getProductById)
    .put(protect, authorize("admin", "owner"), updateProduct)
    .delete(protect, authorize("admin", "owner"), deleteProduct);

module.exports = router;
