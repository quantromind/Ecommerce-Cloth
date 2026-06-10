import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
    FaShoppingCart, FaCreditCard, FaChevronLeft, FaChevronRight,
    FaStar, FaCheckCircle, FaHeart, FaRegHeart, FaTags,
    FaShieldAlt, FaTruck, FaBox, FaMapMarkerAlt, FaShareAlt, FaUndo
} from "react-icons/fa";
import PublicNavbar from "../components/public/PublicNavbar";
import { toast } from "react-hot-toast";
import SuggestedProducts from "../components/product/SuggestedProducts";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();

    // Core Data State
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Reviews State
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [canReview, setCanReview] = useState(false);
    const [existingReview, setExistingReview] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState("");

    // Wishlist State
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    // UI/Gallery State
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);

    // Delivery Check State
    const [pincode, setPincode] = useState("");
    const [deliveryEstimate, setDeliveryEstimate] = useState(null);
    const [isCheckingPincode, setIsCheckingPincode] = useState(false);
    const [userLocationCity, setUserLocationCity] = useState("");

    // Swipe Refs
    const touchStart = useRef(0);
    const touchEnd = useRef(0);

    // Reset selection and scroll
    useEffect(() => {
        window.scrollTo(0, 0);
        setSelectedImageIndex(0);
        setDeliveryEstimate(null);
    }, [id]);

    // Initial Location Check (from LocalStorage or Default)
    useEffect(() => {
        const cached = localStorage.getItem("shoestore_user_location");
        if (cached) {
            const { city } = JSON.parse(cached);
            if (city) setUserLocationCity(city);
        }
    }, []);

    // Fetch Product Logic
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/api/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.warn("API Product not found");
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // Fetch Reviews & Wishlist
    useEffect(() => {
        if (!id) return;

        const fetchReviews = async () => {
            try {
                const { data } = await api.get(`/api/products/${id}/reviews`);
                setReviews(data.reviews || []);
                setAvgRating(data.avgRating || 0);
                setReviewCount(data.reviewCount || 0);
            } catch (error) { console.warn("Review fetch fail", error); }
        };

        const checkWishlist = async () => {
            if (!user) return;
            try {
                const { data } = await api.get("/api/wishlist");
                setIsWishlisted(data.some(item => item._id === id));
            } catch (error) { console.error("Wishlist check fail", error); }
        };

        const checkCanReview = async () => {
            if (!user || user.role !== "customer") {
                setCanReview(false);
                return;
            }
            try {
                const { data } = await api.get(`/api/products/${id}/reviews/can-review`);
                setCanReview(data.canReview);
                if (data.existingReview) {
                    setExistingReview(data.existingReview);
                    setReviewForm({ rating: data.existingReview.rating, comment: data.existingReview.comment });
                }
            } catch (error) { console.warn("Eligibility check fail", error); }
        };

        fetchReviews();
        if (user) {
            checkWishlist();
            checkCanReview();
        }
    }, [id, user]);

    // Recently Viewed Logic
    useEffect(() => {
        if (!product) return;
        try {
            const existing = localStorage.getItem("recently_viewed_shoes");
            let recent = existing ? JSON.parse(existing) : [];
            recent = recent.filter(p => p._id !== product._id);
            recent.unshift({
                _id: product._id,
                name: product.name,
                image: product.images?.[0] || product.image,
                price: product.pricing?.finalPrice || product.price,
                brandName: product.brandName
            });
            if (recent.length > 6) recent.pop();
            localStorage.setItem("recently_viewed_shoes", JSON.stringify(recent));
        } catch (err) { /* ignore */ }
    }, [product]);

    // Auto-Slider
    useEffect(() => {
        if (!product?.images?.length || product.images.length <= 1 || !autoPlay) return;
        const interval = setInterval(() => {
            setSelectedImageIndex(prev => (prev + 1) % product.images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [product, autoPlay]);

    // Handlers
    const handleAddToCart = () => {
        addToCart(product);
        toast.success("Added to Cart");
    };

    const handleBuyNow = () => {
        const directBuyState = {
            directBuyItem: product,
            quantity: 1,
            from: "/checkout"
        };

        // Strict check: User must be logged in AND have a valid role for checkout
        const validRoles = ["customer", "admin"];

        if (!user || !validRoles.includes(user.role)) {
            // Treat as guest or invalid session -> Send to Login
            toast("Please Login to Secure your Order", { icon: "🔒" });
            navigate("/login", { state: directBuyState });
        } else {
            navigate("/checkout", { state: directBuyState });
        }
    };

    const handleWishlistToggle = async () => {
        if (!user) return toast.error("Please login to use wishlist");
        setWishlistLoading(true);
        try {
            if (isWishlisted) {
                await api.delete(`/api/wishlist/${id}`);
                setIsWishlisted(false);
                toast.success("Removed from Wishlist");
            } else {
                await api.post(`/api/wishlist/${id}`);
                setIsWishlisted(true);
                toast.success("Added to Wishlist");
            }
        } catch (error) { toast.error("Wishlist action failed"); }
        finally { setWishlistLoading(false); }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    const handleCheckDelivery = () => {
        if (!pincode || pincode.length < 6) return toast.error("Enter valid 6-digit pincode");
        setIsCheckingPincode(true);
        // Simulate API call
        setTimeout(() => {
            const date = new Date();
            date.setDate(date.getDate() + (Math.random() > 0.5 ? 3 : 5));
            setDeliveryEstimate(`Get it by ${date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}`);
            setIsCheckingPincode(false);
            if (userLocationCity) toast.success(`Delivery available in ${userLocationCity}`);
        }, 800);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setReviewError("");
        setReviewLoading(true);
        try {
            await api.post(`/api/products/${id}/reviews`, reviewForm);
            const { data } = await api.get(`/api/products/${id}/reviews`);
            setReviews(data.reviews || []);
            setAvgRating(data.avgRating || 0);
            setReviewCount(data.reviewCount || 0);
            setExistingReview({ rating: reviewForm.rating, comment: reviewForm.comment });
            toast.success("Review submitted!");
        } catch (error) {
            setReviewError(error.response?.data?.message || "Failed to submit review");
        } finally { setReviewLoading(false); }
    };

    // Render Helpers
    const renderStars = (rating) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <FaStar key={star} className={`text-sm ${star <= rating ? "text-[#D4AF37]" : "text-gray-700"}`} />
            ))}
        </div>
    );

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-light tracking-widest uppercase">Loading Product...</div>;
    if (!product) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-light tracking-widest uppercase">Product Not Found</div>;

    const discountPercentage = product.pricing?.mrp ? Math.round(((product.pricing.mrp - product.pricing.finalPrice) / product.pricing.mrp) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#D4AF37] selection:text-black">
            <PublicNavbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

                {/* Main 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

                    {/* LEFT COLUMN: Gallery (Sticky) */}
                    <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-6">
                        {/* Main Image Stage */}
                        <div
                            className="aspect-[4/5] sm:aspect-square lg:aspect-[4/3] bg-[#111] rounded-sm overflow-hidden border border-white/5 relative group cursor-crosshair"
                            onMouseEnter={() => setAutoPlay(false)}
                            onMouseLeave={() => setAutoPlay(true)}
                            onTouchStart={e => { touchStart.current = e.targetTouches[0].clientX; setAutoPlay(false); }}
                            onTouchMove={e => touchEnd.current = e.targetTouches[0].clientX}
                            onTouchEnd={() => {
                                if (!touchStart.current || !touchEnd.current) return;
                                const distance = touchStart.current - touchEnd.current;
                                distance > 50 ? setSelectedImageIndex(prev => (prev + 1) % product.images.length) :
                                    distance < -50 && setSelectedImageIndex(prev => (prev - 1 + product.images.length) % product.images.length);
                                setAutoPlay(true);
                            }}
                        >
                            <img
                                src={product.images?.[selectedImageIndex] || product.image}
                                alt={product.name}
                                className="w-full h-full object-contain p-8 lg:p-12 transition-transform duration-500 hover:scale-110"
                            />

                            {/* Nav Arrows */}
                            {product.images?.length > 1 && (
                                <>
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1)); }}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 p-3 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                                        <FaChevronLeft />
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(prev => (prev + 1) % product.images.length); }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 p-3 rounded-full text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                                        <FaChevronRight />
                                    </button>
                                    <div className="absolute bottom-4 right-6 text-xs font-bold tracking-widest text-white/50 bg-black/40 px-3 py-1 rounded-full">
                                        {selectedImageIndex + 1} / {product.images.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images?.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar snap-x">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden border transition-all snap-start ${selectedImageIndex === idx ? 'border-[#D4AF37] opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
                                    >
                                        <img src={img} alt="thumb" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Product Info (Scrollable) */}
                    <div className="lg:col-span-5 flex flex-col space-y-8">

                        {/* Header Section */}
                        <div className="space-y-4 border-b border-white/10 pb-8">
                            <div className="flex justify-between items-start">
                                <h2 className="text-[#D4AF37] text-xs font-bold tracking-[0.25em] uppercase mb-2">{product.brandName}</h2>
                                <div className="flex gap-4">
                                    <button onClick={handleShare} className="text-gray-400 hover:text-white transition" title="Share"><FaShareAlt /></button>
                                    <button onClick={handleWishlistToggle} className={`transition text-lg ${isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}>
                                        {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                                    </button>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white leading-tight tracking-tight">{product.name}</h1>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-white/5 py-1 px-3 rounded-full">
                                    {renderStars(Math.round(avgRating))}
                                    <span className="text-xs text-gray-400 ml-1 font-medium">{avgRating} ({reviewCount} Reviews)</span>
                                </div>
                                <span className="text-xs text-green-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                    <FaCheckCircle className="text-[10px]" /> {product.stock > 0 ? "In Stock" : "Unavailable"}
                                </span>
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="space-y-3">
                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl font-light tracking-tight text-white">₹{product.pricing?.finalPrice?.toLocaleString() || product.price.toLocaleString()}</span>
                                {discountPercentage > 0 && (
                                    <>
                                        <span className="text-xl text-gray-500 line-through font-light">₹{product.pricing?.mrp?.toLocaleString()}</span>
                                        <span className="text-[#D4AF37] text-sm font-bold bg-[#D4AF37]/10 px-2 py-1 rounded">{discountPercentage}% OFF</span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">Inclusive of all taxes. Free shipping on all prepaid orders.</p>
                        </div>

                        {/* Actions & Delivery */}
                        <div className="space-y-6 bg-[#111] p-6 rounded-xl border border-white/5">
                            {/* Delivery Checker */}
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                    <FaMapMarkerAlt className="text-[#D4AF37]" /> Check Delivery
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                                        placeholder="Enter Pincode"
                                        className="bg-black border border-white/10 rounded-lg px-4 py-2 text-sm text-white w-full focus:border-[#D4AF37] outline-none"
                                    />
                                    <button
                                        onClick={handleCheckDelivery}
                                        disabled={isCheckingPincode}
                                        className="text-[#D4AF37] font-bold text-xs uppercase tracking-wider hover:text-white px-3 disabled:opacity-50"
                                    >
                                        {isCheckingPincode ? "Checking..." : "Check"}
                                    </button>
                                </div>
                                {deliveryEstimate && (
                                    <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                                        <FaTruck /> {deliveryEstimate}
                                    </p>
                                )}
                            </div>

                            {/* Coupon */}
                            {product.offer?.couponCode && (
                                <div className="flex items-center justify-between bg-[#1a1a1a] border border-dashed border-[#D4AF37]/40 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-sm text-white">
                                        <FaTags className="text-[#D4AF37]" />
                                        <span>Use Code: <span className="font-bold text-[#D4AF37]">{product.offer.couponCode}</span></span>
                                    </div>
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(product.offer.couponCode); toast.success("Copied!"); }}
                                        className="text-xs text-gray-400 hover:text-white underline decoration-dotted"
                                    >
                                        Copy
                                    </button>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2">
                                <button
                                    onClick={handleAddToCart}
                                    className="border border-white/20 hover:border-white hover:bg-white hover:text-black text-white py-3 sm:py-4 rounded-lg font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
                                >
                                    <FaShoppingCart /> Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="bg-[#D4AF37] hover:bg-[#c29f2d] text-black py-3 sm:py-4 rounded-lg font-bold uppercase tracking-widest text-xs transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2"
                                >
                                    <FaCreditCard /> Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Trust Strip */}
                        <div className="grid grid-cols-4 gap-2 py-6 border-y border-white/10">
                            {[
                                { icon: FaCheckCircle, text: "Authentic" },
                                { icon: FaShieldAlt, text: "Warranty" },
                                { icon: FaUndo, text: "7 Day Return" },
                                { icon: FaBox, text: "Secure Box" },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                                    <item.icon className="text-[#D4AF37] text-lg" />
                                    <span className="text-[10px] uppercase font-bold text-gray-500">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Specs & Description */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-white font-bold text-lg mb-2">Highlights</h3>
                                <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 marker:text-[#D4AF37]">
                                    <li>Premium {product.category} Collection</li>
                                    <li>Premium Comfort Sole</li>
                                    <li>High-Quality Leather Finish</li>
                                    <li>Durable & Breathable Design</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-white font-bold text-lg mb-2">Specifications</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                                    <div className="bg-[#111] p-3 rounded border border-white/5">
                                        <span className="block text-xs text-gray-500 uppercase">Brand</span>
                                        <span className="text-white font-medium">{product.brandName}</span>
                                    </div>
                                    <div className="bg-[#111] p-3 rounded border border-white/5">
                                        <span className="block text-xs text-gray-500 uppercase">Category</span>
                                        <span className="text-white font-medium">{product.category}</span>
                                    </div>
                                    <div className="bg-[#111] p-3 rounded border border-white/5">
                                        <span className="block text-xs text-gray-500 uppercase">Model</span>
                                        <span className="text-white font-medium">PM-{product._id.slice(-4).toUpperCase()}</span>
                                    </div>
                                    <div className="bg-[#111] p-3 rounded border border-white/5">
                                        <span className="block text-xs text-gray-500 uppercase">Warranty</span>
                                        <span className="text-white font-medium">6 Months Manufacturing</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-24 max-w-5xl">
                    <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-[#D4AF37] pl-4">Customer Reviews</h3>

                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Review Form */}
                        <div className="md:col-span-1">
                            {!user ? (
                                <div className="bg-[#111] p-6 rounded-xl border border-white/5 text-center">
                                    <p className="text-gray-400 text-sm mb-4">Please login to write a review.</p>
                                    <button onClick={() => navigate("/login")} className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest border border-[#D4AF37] px-6 py-2 rounded full hover:bg-[#D4AF37] hover:text-black transition">Login</button>
                                </div>
                            ) : canReview ? (
                                <form onSubmit={handleSubmitReview} className="bg-[#111] p-6 rounded-xl border border-white/5 space-y-4">
                                    <h4 className="font-bold text-white">Write a Review</h4>
                                    <div className="flex gap-1">{[1, 2, 3, 4, 5].map(s => (
                                        <button type="button" key={s} onClick={() => setReviewForm({ ...reviewForm, rating: s })}>
                                            <FaStar className={s <= reviewForm.rating ? "text-[#D4AF37]" : "text-gray-600"} />
                                        </button>
                                    ))}</div>
                                    <textarea
                                        value={reviewForm.comment}
                                        onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-[#D4AF37] outline-none"
                                        rows={4} placeholder="Your experience..."
                                    />
                                    <button type="submit" disabled={reviewLoading} className="w-full bg-white text-black font-bold py-2 rounded text-xs uppercase tracking-widest hover:bg-[#D4AF37] transition">
                                        {reviewLoading ? "Posting..." : "Submit"}
                                    </button>
                                    {reviewError && <p className="text-red-500 text-xs">{reviewError}</p>}
                                </form>
                            ) : (
                                <div className="bg-[#111] p-6 rounded-xl border border-white/5 text-gray-500 text-sm italic">
                                    Only verified customers can review this product.
                                </div>
                            )}
                        </div>

                        {/* Reviews List */}
                        <div className="md:col-span-2 space-y-4">
                            {reviews.length === 0 ? <p className="text-gray-500">No reviews yet.</p> : reviews.map(rev => (
                                <div key={rev._id} className="border-b border-white/5 pb-4 last:border-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h5 className="font-bold text-white text-sm">{rev.user?.name || "Anonymous"}</h5>
                                            <div className="flex text-xs text-[#D4AF37] mt-1">{renderStars(rev.rating)}</div>
                                        </div>
                                        <span className="text-xs text-gray-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed">{rev.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Suggested */}
                <div className="mt-24">
                    <SuggestedProducts currentProductId={product._id} category={product.category} brand={product.brandName} limit={4} />

                    {/* Recently Viewed (Manual Grid) */}
                    {localStorage.getItem("recently_viewed_shoes") && (
                        <div className="mt-16">
                            <h3 className="text-xl font-bold text-white mb-8">Recently Viewed</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {JSON.parse(localStorage.getItem("recently_viewed_shoes")).slice(0, 4).map(item => (
                                    <div key={item._id} onClick={() => navigate(`/product/${item._id}`)} className="group cursor-pointer">
                                        <div className="aspect-[4/5] bg-[#111] rounded-lg border border-white/5 overflow-hidden mb-3">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />
                                        </div>
                                        <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                                        <p className="text-xs text-gray-500 mt-1">₹{item.price.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ProductDetails;
