import React from "react";
import { FaTrash, FaArrowRight, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PublicNavbar from "../components/public/PublicNavbar";

const Cart = () => {
    const { cartItems, removeFromCart, total, updateQty } = useCart();
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleCheckout = () => {
        if (!user) {
            navigate("/login", { state: { from: "/checkout" } });
        } else {
            navigate("/checkout");
        }
    };

    return (
        <div className="min-h-screen bg-secondary text-text-main font-sans selection:bg-accent selection:text-black">
            <PublicNavbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <FaShoppingBag className="text-accent" /> Your Shopping Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-primary rounded-2xl border border-border-light">
                        <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mb-6">
                            <FaShoppingBag className="text-4xl text-text-muted" />
                        </div>
                        <h2 className="text-xl font-bold text-text-main mb-2">Your cart is empty</h2>
                        <p className="text-text-muted mb-8">Looks like you haven't added any timepieces yet.</p>
                        <button
                            onClick={() => navigate("/products")}
                            className="bg-accent hover:bg-[#b5952f] text-black font-bold py-3 px-8 rounded-full transition-all"
                        >
                            Explore Collection
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex gap-4 sm:gap-6 bg-primary p-4 sm:p-6 rounded-xl border border-border-light hover:border-border-light transition-colors">
                                    {/* Image */}
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-primary rounded-lg overflow-hidden flex-shrink-0 border border-border-light">
                                        <img
                                            src={item.images?.[0] || item.image}
                                            alt={item.name}
                                            className="w-full h-full object-contain p-2"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <div className="text-accent text-xs font-bold tracking-widest uppercase mb-1">{item.brandName}</div>
                                                    <h3 className="text-lg font-bold text-text-main leading-tight">{item.name}</h3>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="text-text-muted hover:text-red-500 p-2 transition-colors"
                                                    title="Remove Item"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                            <p className="text-sm text-text-muted">Model: {item.modelNumber || "N/A"}</p>
                                        </div>

                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex items-center gap-3 bg-primary rounded-lg p-1 border border-border-light">
                                                <button
                                                    onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
                                                    className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-main transition"
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQty(item._id, item.qty + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-main transition"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <div className="text-xl font-bold text-text-main">
                                                ₹{(item.price * item.qty).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-primary p-6 rounded-xl border border-border-light sticky top-24">
                                <h3 className="text-lg font-bold text-text-main mb-6 pb-4 border-b border-border-light">Order Summary</h3>

                                <div className="space-y-3 text-sm text-text-muted mb-6">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="text-text-main">₹{total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-green-400">Free</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax (Included)</span>
                                        <span className="text-text-main">₹0</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-xl font-bold text-text-main mb-8 pt-4 border-t border-border-light">
                                    <span>Total</span>
                                    <span className="text-accent">₹{total.toLocaleString()}</span>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-accent hover:bg-[#b5952f] text-black font-bold py-4 rounded-xl shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                                >
                                    Proceed to Checkout <FaArrowRight />
                                </button>

                                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    Secure Checkout
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
