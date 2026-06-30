import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // Fixed Import
import { toast } from "react-hot-toast";
import { FaMapMarkedAlt, FaLock, FaShieldAlt, FaTruck, FaMedal } from "react-icons/fa";
import SuggestedProducts from "../components/product/SuggestedProducts";

const GOOGLE_MAPS_API_KEY = "AIzaSyBUfh9lqcFGgqNMC7FCyfvaEL8h9USr8vk";

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, clearCart, total } = useCart();
    const { user } = useAuth();

    // Derived State for Items
    const directItem = location.state?.directBuyItem;
    const checkoutItems = directItem ? [{
        ...directItem,
        qty: location.state?.quantity || 1,
        // Ensure image structure is consistent
        image: directItem.images?.[0] || directItem.image || ""
    }] : cartItems;

    const [loading, setLoading] = useState(false);
    const [geoLocation, setGeoLocation] = useState(null);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    // Inline Search State
    const searchInputRef = useRef(null);
    const [isMapsLoaded, setIsMapsLoaded] = useState(false);

    const [form, setForm] = useState({
        name: "", flatNo: "", landmark: "", address: "", city: "", postalCode: "", country: "India", phone: ""
    });
    const [termsAccepted, setTermsAccepted] = useState(false);

    // Calc Total
    const finalTotal = directItem
        ? (directItem.pricing?.finalPrice || directItem.price) * (location.state?.quantity || 1)
        : total;

    // Safety Check - Redirect if no items
    useEffect(() => {
        if (!directItem && cartItems.length === 0 && !isOrderPlaced) {
            // Only redirect if NOT just placed an order
            const timer = setTimeout(() => {
                navigate("/");
            }, 100);
            return () => clearTimeout(timer);
        }
        if (user?.name && !form.name && user.name !== "Super Admin") {
            setForm(prev => ({ ...prev, name: user.name }));
        }
    }, [cartItems, directItem, navigate, user, isOrderPlaced, form.name]);

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const placeOrder = async (e) => {
        e.preventDefault();

        if (!termsAccepted) {
            toast.error("Please agree to the Terms and Conditions to proceed.");
            return;
        }

        setLoading(true);
        try {
            const itemsToOrder = checkoutItems.map(item => ({
                name: item.name,
                qty: item.qty || 1,
                image: item.image || item.images?.[0] || "",
                price: item.pricing?.finalPrice || item.price,
                product: item._id,
                brandId: item.creatorId?._id || item.creatorId || item.brandId
            }));

            const orderData = {
                orderItems: itemsToOrder,
                shippingAddress: {
                    ...form,
                    lat: geoLocation?.lat,
                    lng: geoLocation?.lng,
                    address: `Flat/House No: ${form.flatNo}, Landmark: ${form.landmark}, ${form.address}`
                },
                totalPrice: finalTotal,
                paymentMethod: "COD"
            };

            await api.post("/api/orders", orderData);
            setIsOrderPlaced(true);

            // Only clear cart if it was a cart checkout
            if (!directItem) {
                clearCart();
            }

            toast.success("Order placed successfully!");
            navigate("/customer/orders");
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Order failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Google Maps Logic (Kept same but minimized for brevity in this view)
    useEffect(() => {
        const checkForMaps = () => {
            if (window.google && window.google.maps && window.google.maps.places) {
                setIsMapsLoaded(true);
                return true;
            }
            return false;
        };

        if (!checkForMaps()) {
            const existingScript = document.querySelector(`script[src*="maps.googleapis.com/maps/api/js"]`);
            if (existingScript) {
                existingScript.addEventListener('load', () => setIsMapsLoaded(true));
            } else {
                const script = document.createElement("script");
                script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
                script.async = true;
                script.defer = true;
                script.onload = () => setIsMapsLoaded(true);
                document.head.appendChild(script);
            }
        }
    }, []);

    useEffect(() => {
        if (isMapsLoaded && searchInputRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
                fields: ["geometry", "formatted_address", "name", "address_components"],
                componentRestrictions: { country: "in" } // Restrict to India for better results
            });

            autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                if (place.geometry && place.geometry.location) {
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();
                    setGeoLocation({ lat, lng });

                    const preciseAddress = place.name && place.formatted_address && !place.formatted_address.startsWith(place.name)
                        ? `${place.name}, ${place.formatted_address}`
                        : place.formatted_address;

                    let city = "";
                    let postalCode = "";
                    let state = "";

                    if (place.address_components) {
                        const getComp = (types) => place.address_components.find(c => types.some(t => c.types.includes(t)))?.long_name || "";
                        city = getComp(["locality", "administrative_area_level_2"]);
                        state = getComp(["administrative_area_level_1"]);
                        postalCode = getComp(["postal_code"]);
                    }

                    setForm(prev => ({
                        ...prev,
                        address: preciseAddress || prev.address,
                        city: city || state || prev.city,
                        postalCode: postalCode || prev.postalCode,
                    }));
                }
            });
        }
    }, [isMapsLoaded, searchInputRef]);

    if (!directItem && cartItems.length === 0 && !isOrderPlaced) {
        return <div className="min-h-screen bg-secondary flex items-center justify-center text-text-main">Loading Checkout...</div>;
    }

    return (
        <div className="min-h-screen bg-secondary text-text-main p-4 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <FaLock className="text-accent" /> Secure Checkout
                </h1>

                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* LEFT: Shipping Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Address Section */}
                        <div className="bg-secondary p-6 lg:p-8 rounded-3xl border border-border-light shadow-2xl">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="bg-accent text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                Shipping Address
                            </h2>

                            {/* Location Search */}
                            <div className="mb-6 relative z-10">
                                <label className="block text-xs font-bold text-text-muted uppercase mb-2">Auto-fill address</label>
                                <div className="relative">
                                    <FaMapMarkedAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Search your apartment, area, or landmark..."
                                        className="w-full bg-secondary border border-border-light rounded-xl pl-12 pr-4 py-3 text-text-main placeholder-gray-400 focus:border-accent outline-none shadow-inner"
                                    />
                                </div>
                            </div>

                            <form id="checkout-form" onSubmit={placeOrder} className="grid md:grid-cols-2 gap-4">
                                <input name="name" value={form.name} onChange={onChange} required placeholder="Full Name" className="w-full bg-black/5 border border-border-light rounded-xl px-4 py-3 focus:border-accent outline-none" />
                                <input name="phone" value={form.phone} onChange={onChange} required placeholder="Phone Number" className="w-full bg-black/5 border border-border-light rounded-xl px-4 py-3 focus:border-accent outline-none" />

                                <input name="flatNo" value={form.flatNo} onChange={onChange} required placeholder="Flat / House No" className="w-full bg-black/5 border border-border-light rounded-xl px-4 py-3 focus:border-accent outline-none" />
                                <input name="landmark" value={form.landmark} onChange={onChange} required placeholder="Landmark" className="w-full bg-black/5 border border-border-light rounded-xl px-4 py-3 focus:border-accent outline-none" />

                                <input name="address" value={form.address} onChange={onChange} required placeholder="Area / Street" className="col-span-2 w-full bg-black/5 border border-border-light rounded-xl px-4 py-3 focus:border-accent outline-none" />

                                <input name="city" value={form.city} onChange={onChange} required placeholder="City" className="w-full bg-black/5 border border-border-light rounded-xl px-4 py-3 focus:border-accent outline-none" />
                                <input name="postalCode" value={form.postalCode} onChange={onChange} required placeholder="Postal Code" className="w-full bg-black/5 border border-border-light rounded-xl px-4 py-3 focus:border-accent outline-none" />
                                <input name="country" value={form.country} onChange={onChange} required placeholder="Country" className="col-span-2 w-full bg-black/5 border border-border-light rounded-xl px-4 py-3 focus:border-accent outline-none" />
                            </form>
                        </div>
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-secondary p-6 rounded-3xl border border-border-light sticky top-24 shadow-2xl">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-6">
                                {checkoutItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-16 h-16 bg-black/5 rounded-lg overflow-hidden flex-shrink-0 border border-border-light">
                                            <img src={item.image || item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold truncate hover:text-accent transition">{item.name}</h4>
                                            <div className="text-xs text-text-muted mt-1">
                                                Qty: {item.qty} × ₹{(item.price).toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-text-main">
                                            ₹{(item.price * item.qty).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-border-light pt-4 space-y-2 text-sm text-text-muted">
                                <div className="flex justify-between"><span>Subtotal</span> <span>₹{finalTotal.toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>Shipping</span> <span className="text-green-400">Free</span></div>
                                <div className="flex justify-between"><span>Taxes</span> <span>Calculated at next step</span></div>
                            </div>

                            <div className="border-t border-border-light pt-4 mt-4">
                                <div className="flex justify-between text-xl font-bold text-text-main mb-1">
                                    <span>Total</span>
                                    <span className="text-accent">₹{finalTotal.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-text-muted text-right">Including all taxes</p>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-2 mt-6">
                                <div className="flex items-center gap-2 text-[10px] bg-black/5 p-2 rounded text-text-muted">
                                    <FaShieldAlt className="text-green-400" /> Secure Payment
                                </div>
                                <div className="flex items-center gap-2 text-[10px] bg-black/5 p-2 rounded text-text-muted">
                                    <FaTruck className="text-accent" /> Fast Delivery
                                </div>
                                <div className="flex items-center gap-2 text-[10px] bg-black/5 p-2 rounded text-text-muted">
                                    <FaLock className="text-blue-400" /> Data Encrypted
                                </div>
                                <div className="flex items-center gap-2 text-[10px] bg-black/5 p-2 rounded text-text-muted">
                                    <FaMedal className="text-yellow-400" /> Authenticity
                                </div>
                            </div>

                            {/* Terms & Action */}
                            <div className="mt-6">
                                <div className="flex items-start gap-3 mb-4 cursor-pointer" onClick={() => setTermsAccepted(!termsAccepted)}>
                                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition ${termsAccepted ? "bg-accent border-accent" : "border-gray-500 bg-transparent"}`}>
                                        {termsAccepted && <svg className="w-3 h-3 text-black font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                    </div>
                                    <p className="text-xs text-text-muted select-none">
                                        I agree to the <span className="text-text-main font-bold hover:underline">Terms & Conditions</span>.
                                    </p>
                                </div>

                                <button
                                    onClick={placeOrder}
                                    disabled={loading || !termsAccepted}
                                    className="w-full bg-accent hover:bg-[#b5952f] text-black font-bold py-4 rounded-xl shadow-lg shadow-accent/20 transition-all disabled:opacity-50 disabled:grayscale transform active:scale-95"
                                >
                                    {loading ? "Processing..." : "Place Order"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Suggested Products (Cross-Sell) */}
                <div className="mt-20">
                    <SuggestedProducts
                        currentProductId={checkoutItems[0]?._id}
                        brand={checkoutItems[0]?.brandName}
                        category={checkoutItems[0]?.category}
                        title="Complete Your Collection"
                    />
                </div>
            </div>
        </div>
    );
};

export default Checkout;
