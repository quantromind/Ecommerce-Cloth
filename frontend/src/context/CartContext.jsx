import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Get the correct storage key based on user
    const getCartKey = () => user ? `watchstore_cart_${user._id}` : "watchstore_cart_guest";

    // Load Cart when User Changes
    useEffect(() => {
        const key = getCartKey();
        const storedCart = localStorage.getItem(key);
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        } else {
            setCartItems([]); // Reset if no cart exists for this user
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]); // Re-run when user logs in/out

    // Save Cart when Items Change (strip large images to avoid quota exceeded)
    useEffect(() => {
        const key = getCartKey();
        try {
            // Store only essential data - strip large base64 images
            const cartToStore = cartItems.map(item => ({
                _id: item._id,
                name: item.name,
                price: item.price,
                qty: item.qty,
                brandName: item.brandName,
                brandId: item.creatorId || item.brandId,
                // Keep only first image, and only if it's not too large (< 50KB)
                image: item.images?.[0]?.length < 50000 ? item.images[0] : (item.image || ""),
            }));
            localStorage.setItem(key, JSON.stringify(cartToStore));
        } catch (error) {
            // If still fails, clear cart from storage to prevent broken state
            console.warn("Cart storage failed, clearing:", error);
            localStorage.removeItem(key);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartItems, user]);

    const addToCart = (product) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item._id === product._id);
            if (existing) {
                // Increment qty
                return prev.map((item) =>
                    item._id === product._id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
        setIsCartOpen(true); // Auto open cart on add
    };

    const removeFromCart = (id) => {
        setCartItems((prev) => prev.filter((item) => item._id !== id));
    };

    const updateQty = (id, newQty) => {
        if (newQty < 1) return;
        setCartItems((prev) =>
            prev.map((item) => (item._id === id ? { ...item, qty: newQty } : item))
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQty,
                clearCart,
                isCartOpen,
                setIsCartOpen,
                total
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
