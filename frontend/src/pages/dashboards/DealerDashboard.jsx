import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaChartLine, FaShoppingBag, FaDollarSign, FaTags, FaArrowRight, FaStore, FaClock, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

const DealerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get("/api/products/my").catch(() => ({ data: [] })),
        api.get("/api/orders/my").catch(() => ({ data: [] }))
      ]);

      const products = productsRes.data || [];
      const orders = ordersRes.data || [];
      const revenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const pending = orders.filter(o => o.status === "pending" || o.status === "processing").length;

      // Calculate Low Stock (< 5 items)
      const lowStock = products.filter(p => (p.countInStock || 0) < 5).length;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: revenue,
        pendingOrders: pending
      });
      setRecentOrders(orders.slice(0, 5));
      setLowStockCount(lowStock);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, icon: <FaBoxOpen />, color: "bg-teal-500", lightColor: "bg-teal-50 text-teal-600" },
    { label: "Total Orders", value: stats.totalOrders, icon: <FaShoppingBag />, color: "bg-violet-500", lightColor: "bg-violet-50 text-violet-600" },
    { label: "Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <FaDollarSign />, color: "bg-amber-500", lightColor: "bg-amber-50 text-amber-600" },
    { label: "Pending", value: stats.pendingOrders, icon: <FaClock />, color: "bg-rose-500", lightColor: "bg-rose-50 text-rose-600" },
  ];

  const quickActions = [
    { to: "/dealer/inventory", icon: <FaBoxOpen />, title: "Manage Inventory", desc: "Update stock & add products", color: "teal" },
    { to: "/dealer/sales", icon: <FaChartLine />, title: "View Sales Report", desc: "Analyze performance details", color: "violet" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Hello, <span className="text-teal-600">{user?.name || "Partner"}</span> 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage your store performance efficiently.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm text-slate-600">
          <FaClock className="text-teal-500" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{loading ? "..." : stat.value}</h3>
              </div>
              <div className={`w-10 h-10 ${stat.lightColor} rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FaShoppingBag className="text-violet-500" /> Recent Orders
            </h3>
            <Link to="/dealer/sales" className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline">
              View All Orders
            </Link>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-slate-700">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="px-5 py-4 text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-700">₹{order.totalPrice?.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                            order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                          }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-5 py-8 text-center text-slate-400">
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Inventory Health & Actions */}
        <div className="space-y-6">
          {/* Inventory Health */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <FaExclamationTriangle className="text-amber-500" /> Inventory Health
            </h3>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-amber-800 font-semibold text-sm">Low Stock Items</span>
                <span className="bg-white text-amber-600 px-2 py-1 rounded-lg text-xs font-bold shadow-sm">Alert</span>
              </div>
              <p className="text-3xl font-bold text-amber-600">{lowStockCount}</p>
              <p className="text-xs text-amber-700/80 mt-1">Products with less than 5 units left.</p>

              {lowStockCount > 0 && (
                <Link to="/dealer/inventory" className="mt-4 block w-full py-2 bg-white text-amber-600 text-center rounded-lg text-sm font-bold shadow-sm hover:shadow hover:bg-amber-50 transition-all">
                  Restock Now
                </Link>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                to={action.to}
                className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4 hover:border-teal-400 hover:shadow-md transition-all group"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${action.color === 'teal' ? 'bg-teal-100 text-teal-600' : 'bg-violet-100 text-violet-600'
                  }`}>
                  {action.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm">{action.title}</h4>
                  <p className="text-xs text-slate-500">{action.desc}</p>
                </div>
                <FaArrowRight className="text-slate-300 group-hover:text-teal-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;


