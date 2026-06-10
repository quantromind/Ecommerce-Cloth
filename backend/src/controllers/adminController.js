const User = require("../models/User");
const Order = require("../models/Order");

/**
 * GET /api/admin/stats
 * Returns counts for dashboard
 */
const getDashboardStats = async (req, res) => {
    try {
        const totalCustomers = await User.countDocuments({ role: "customer" });

        // Calculate Total Revenue (Simple sum of all paid orders)
        // Note: In a real app, you might want to filter by status 'paid' if you had payment integration
        const orders = await Order.find();
        const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

        return res.json({
            customers: totalCustomers,
            revenue: totalRevenue
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
