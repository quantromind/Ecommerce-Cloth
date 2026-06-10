import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaBell, FaSearch, FaShoppingCart, FaShoppingBag, FaChartPie, FaBox } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { api } from "../../services/api";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { setIsCartOpen, cartItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    // Notification state for admin
    const [notifications, setNotifications] = useState([]);
    const [notifCount, setNotifCount] = useState(0);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [loadingNotifs, setLoadingNotifs] = useState(false);
    const dropdownRef = useRef(null);

    const isAdmin = user?.role === "admin";

    // Fetch pending inquiries for admin
    useEffect(() => {
        if (isAdmin) {
            fetchNotifications();
        }
    }, [isAdmin]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowNotifDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        setLoadingNotifs(true);
        try {
            const { data } = await api.get("/api/orders");
            // Show latest 5 orders
            setNotifications(data.slice(0, 5));
            setNotifCount(data.filter(o => o.orderStatus === "processing").length);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoadingNotifs(false);
        }
    };

    const handleBellClick = () => {
        setShowNotifDropdown(!showNotifDropdown);
        if (!showNotifDropdown) {
            if (isAdmin) fetchNotifications();
            else fetchNewProducts(); // Customer
        }
    };

    const fetchNewProducts = async () => {
        setLoadingNotifs(true);
        try {
            // Fetch latest 5 products (mocking 'new arrivals' logic by sorting desc)
            const { data } = await api.get("/api/products?sort=newest&limit=5");
            setNotifications(data.products || []);
            setNotifCount(data.products?.length || 0);
        } catch (error) {
            console.error("Failed to fetch new products", error);
        } finally {
            setLoadingNotifs(false);
        }
    };

    const goToOrders = () => {
        setShowNotifDropdown(false);
        navigate("/admin/sales");
    };

    const navLinks = [
        { to: "/admin", label: "Dashboard", icon: <FaChartPie /> },
        { to: "/admin/inventory", label: "Inventory", icon: <FaBox /> },
        { to: "/admin/sales", label: "Sales Orders", icon: <FaShoppingBag /> },
    ];

    return (
        <div className="h-16 bg-white flex items-center justify-between px-6 z-30 sticky top-0 border-b border-gray-200 shadow-sm transition-all">

            {/* Left: Logo & Navigation */}
            <div className="flex items-center gap-8 flex-1">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <img src="/logo.jpg" alt="Paytan Men's Logo" className="h-10 w-auto object-contain rounded-lg" />
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.to;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200 py-2 ${
                                    isActive 
                                        ? "text-blue-600 border-b-2 border-blue-600" 
                                        : "text-gray-600 hover:text-blue-600 border-b-2 border-transparent"
                                }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">

                {/* Cart - Hide for admin */}
                {!isAdmin && (
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-600 hover:text-gray-900 group"
                    >
                        <FaShoppingCart className="text-lg group-hover:scale-110 transition-transform" />
                        {cartItems.length > 0 && (
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
                        )}
                    </button>
                )}

                {/* Notification Bell */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={handleBellClick}
                        className="relative w-10 h-10 flex items-center justify-center rounded-full transition group hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    >
                        <FaBell className="text-lg group-hover:rotate-12 transition-transform" />
                        {notifCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full ring-2 ring-white bg-red-500 text-white">
                                {notifCount > 9 ? "9+" : notifCount}
                            </span>
                        )}
                    </button>

                    {showNotifDropdown && (
                        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Header */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                <h3 className="font-bold text-gray-800 text-sm">{isAdmin ? "Recent Orders" : "New Arrivals"}</h3>
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{notifCount} new</span>
                            </div>

                            <div className="max-h-72 overflow-y-auto custom-scrollbar">
                                {loadingNotifs ? (
                                    <div className="p-6 text-center text-gray-500 text-sm">Loading...</div>
                                ) : notifications.length === 0 ? (
                                    <div className="p-6 text-center text-gray-500 text-sm">
                                        <FaBell className="text-2xl mx-auto mb-2 opacity-30" />
                                        No new notifications
                                    </div>
                                ) : (
                                    notifications.map((n) => (
                                        isAdmin ? (
                                            // Admin Notification Item (Order)
                                            <div key={n._id} className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition" onClick={goToOrders}>
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs bg-blue-100 text-blue-600">
                                                        <FaShoppingBag />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium text-gray-900 truncate">Order {n._id.slice(-6).toUpperCase()}</div>
                                                        <div className="text-xs text-gray-500 truncate">₹{n.totalPrice.toLocaleString()} • {n.orderStatus}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // Customer Notification Item (Product)
                                            <div key={n._id} className="p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition flex gap-3" onClick={() => { setShowNotifDropdown(false); navigate(`/product/${n._id}`); }}>
                                                <img src={n.images?.[0] || n.image} alt="product" className="w-10 h-10 object-cover rounded" />
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900 line-clamp-1">{n.name}</div>
                                                    <div className="text-xs text-blue-600">Just Arrived</div>
                                                </div>
                                            </div>
                                        )
                                    ))
                                )}
                            </div>

                            {isAdmin && notifications.length > 0 && (
                                <button onClick={goToOrders} className="w-full p-3 text-center text-sm font-medium text-blue-600 hover:bg-gray-50 border-t border-gray-100 transition">
                                    View All Orders →
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="h-8 w-[1px] hidden md:block mx-2 bg-gray-200" />

                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block leading-tight">
                        <div className="text-sm font-bold text-gray-900 tracking-tight">{isAdmin ? "Paytan" : (user?.name || "User")}</div>
                        <div className="text-[10px] items-center uppercase font-bold tracking-wider flex justify-end gap-1 text-gray-500">
                            {user?.role}
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 border border-gray-200">
                            <FaUserCircle className="text-2xl" />
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="text-gray-500 hover:text-red-500 transition ml-1 p-2 hover:bg-red-50 rounded-lg"
                        title="Logout"
                    >
                        <FaSignOutAlt className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
