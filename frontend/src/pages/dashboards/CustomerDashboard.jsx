import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingBag, FaHeart } from "react-icons/fa";

const CustomerDashboard = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text-main">Welcome Back</h1>
                <p className="text-text-muted mt-2">Manage your orders and saved items.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Orders Card */}
                <Link to="/customer/orders" className="bg-secondary border border-border-light p-6 rounded-2xl hover:bg-black/5 transition group">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                        <FaShoppingBag />
                    </div>
                    <h2 className="text-xl font-bold text-text-main mb-2">My Orders</h2>
                    <p className="text-sm text-text-muted">Track current orders and view past purchase history.</p>
                </Link>

                {/* Wishlist Card */}
                <Link to="/customer/wishlist" className="bg-secondary border border-border-light p-6 rounded-2xl hover:bg-black/5 transition group">
                    <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
                        <FaHeart />
                    </div>
                    <h2 className="text-xl font-bold text-text-main mb-2">My Wishlist</h2>
                    <p className="text-sm text-text-muted">View and manage products you have saved for later.</p>
                </Link>
            </div>
        </div>
    );
};

export default CustomerDashboard;
