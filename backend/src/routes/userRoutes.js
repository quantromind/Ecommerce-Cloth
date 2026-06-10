const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const { getMe, getAllUsers, updateUserByAdmin } = require("../controllers/userController");

const router = express.Router();

// GET /api/users/me
router.get("/me", protect, getMe);

// Admin User Management Routes
router.get("/", protect, authorize("admin"), getAllUsers);
router.put("/:id", protect, authorize("admin"), updateUserByAdmin);

module.exports = router;
