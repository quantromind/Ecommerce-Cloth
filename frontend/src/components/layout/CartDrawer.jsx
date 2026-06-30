import React from "react";
import { FaTimes, FaTrash, FaArrowRight } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CartDrawer = () => {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, total } = useCart();
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        setIsCartOpen(false);
        if (!user) {
            // Redirect to login with return path
            navigate("/login", { state: { from: "/checkout" } });
        } else {
            navigate("/checkout");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-primary border-l border-border-light h-[100dvh] flex flex-col shadow-2xl animate-slide-in-right">
                <div className="p-6 border-b border-border-light flex items-center justify-between">
                    <h2 className="text-xl font-bold text-text-main">Your Cart ({cartItems.length})</h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-black/5 rounded-full transition text-text-muted hover:text-text-main"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="text-center text-text-muted py-20 flex flex-col items-center">
                            <span className="text-4xl mb-4">🛒</span>
                            <p>Your cart is empty.</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="mt-4 text-highlight font-bold hover:underline"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item._id} className="flex gap-4 bg-black/5 p-4 rounded-xl border border-border-light">
                                <div className="w-20 h-20 bg-primary rounded-lg overflow-hidden flex-shrink-0">
                                    {item.images?.[0] ? (
                                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-800" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-text-main text-sm line-clamp-1">{item.name}</h3>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="text-text-muted hover:text-red-400 transition"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                    <div className="text-xs text-text-muted mt-1">{item.brandName}</div>
                                    <div className="flex justify-between items-end mt-2">
                                        <div className="text-highlight font-bold">₹{item.price.toLocaleString()}</div>
                                        <div className="text-xs text-text-muted">Qty: {item.qty}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-border-light bg-secondary">
                        <div className="flex justify-between items-center mb-4 text-lg font-bold text-text-main">
                            <span>Total</span>
                            <span>₹{total.toLocaleString()}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-highlight hover:bg-highlight/90 text-text-main font-bold py-4 rounded-xl shadow-lg shadow-highlight/20 transition flex items-center justify-center gap-2"
                        >
                            Proceed to Checkout <FaArrowRight />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
