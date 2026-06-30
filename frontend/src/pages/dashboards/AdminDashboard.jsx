import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaEnvelope, FaBox, FaShoppingBag, FaChartLine, FaCog, FaArrowRight, FaCheckCircle, FaClock } from "react-icons/fa";
import { api } from "../../services/api";

const SuperAdminDashboard = () => {
    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalProducts: 0,
        totalOrders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch counts from various endpoints
            const [usersRes, productsRes, ordersRes] = await Promise.all([
                api.get("/api/users?role=customer").catch(() => ({ data: [] })),
                api.get("/api/products").catch(() => ({ data: { products: [] } })),
                api.get("/api/orders").catch(() => ({ data: [] }))
            ]);

            setStats({
                totalCustomers: usersRes.data?.length || 0,
                totalProducts: productsRes.data?.products?.length || productsRes.data?.length || 0,
                totalOrders: ordersRes.data?.length || 0
            });
        } catch (err) {
            console.error("Failed to fetch stats", err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: "Total Revenue", value: "₹" + (stats.totalOrders * 1250).toLocaleString(), icon: <FaChartLine />, color: "from-blue-500 to-indigo-600", link: null },
        { label: "Total Customers", value: stats.totalCustomers, icon: <FaUsers />, color: "from-purple-500 to-pink-600", link: null },
        { label: "Total Products", value: stats.totalProducts, icon: <FaBox />, color: "from-cyan-500 to-blue-600", link: "/admin/inventory" },
        { label: "Total Orders", value: stats.totalOrders, icon: <FaShoppingBag />, color: "from-emerald-500 to-teal-600", link: "/admin/sales" },
    ];

    const featureCards = [
        {
            to: "/admin/inventory",
            icon: <FaBox />,
            title: "My Inventory",
            desc: "Manage your clothing catalog",
            color: "blue"
        },
        {
            to: "/admin/sales",
            icon: <FaShoppingBag />,
            title: "Sales Orders",
            desc: "Review and manage customer orders",
            color: "indigo"
        },
        {
            to: "#",
            icon: <FaChartLine />,
            title: "Analytics",
            desc: "View platform insights & reports",
            color: "purple",
            soon: true
        },
        {
            to: "#",
            icon: <FaCog />,
            title: "Settings",
            desc: "System configuration & preferences",
            color: "slate",
            soon: true
        },
    ];

    const getColorClasses = (color) => {
        const colors = {
            purple: "bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-100",
            indigo: "bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-100",
            blue: "bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-100",
            slate: "bg-slate-50 text-slate-600 border-slate-100 group-hover:bg-slate-100",
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="space-y-8 w-full">
            {/* Welcome Header */}
            <div className="relative overflow-hidden bg-white shadow-sm rounded-3xl p-8 border border-gray-100">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold mb-2">
                        <FaCheckCircle /> System Administrator
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                        Welcome to Command Center
                    </h1>
                    <p className="text-gray-500 max-w-xl">
                        Manage your store inventory, review customer orders, and monitor your business performance from one central dashboard.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div
                        key={i}
                        className={`relative overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl p-6 ${stat.link ? 'cursor-pointer hover:border-blue-200 transition' : ''}`}
                        onClick={() => stat.link && (window.location.href = stat.link)}
                    >
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                                <p className="text-3xl font-extrabold text-gray-900">
                                    {loading ? "..." : stat.value}
                                </p>
                            </div>
                            <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-xl shadow-md`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Feature Cards */}
            <div>
                <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featureCards.map((card, i) => (
                        <Link
                            key={i}
                            to={card.to}
                            className={`relative bg-white border border-gray-100 shadow-sm p-6 rounded-2xl hover:shadow-md hover:border-blue-200 transition-all group ${card.soon ? 'opacity-60 pointer-events-none' : ''}`}
                        >
                            {card.soon && (
                                <span className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                    Soon
                                </span>
                            )}
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 transition-all border ${getColorClasses(card.color)} group-hover:scale-110`}>
                                {card.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                                {card.title}
                                <FaArrowRight className="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-500" />
                            </h3>
                            <p className="text-sm text-gray-500">{card.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-3">Getting Started</h3>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                        <p className="text-gray-600">Head over to <span className="font-semibold text-gray-900">My Inventory</span> to start adding your premium clothing collection.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                        <p className="text-gray-600">Monitor <span className="font-semibold text-gray-900">Sales Orders</span> to track customer purchases and fulfillments.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                        <p className="text-gray-600">Use the <span className="font-semibold text-gray-900">Analytics</span> tab to view overall revenue and insights.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
