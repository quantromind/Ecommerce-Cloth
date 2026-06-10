import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import PublicNavbar from "../components/public/PublicNavbar";
import FilterSidebar from "../components/public/FilterSidebar";
import { FaFilter } from "react-icons/fa";

const Home = () => {
    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    // -- Filter State --
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [activeFilters, setActiveFilters] = useState({
        brands: [],
        categories: [],
        colors: [],
        sizes: [],
        materials: [],
        availability: []
    });

    // Auto-scroll Slider
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % 6);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get("/api/products");
                if (data && data.length > 0) {
                    setAllProducts(data);
                    // Set initial max price dynamically
                    const prices = data.map(p => Number(p.price) || 0);
                    const maxPrice = Math.max(...prices, 100000); // Default to 1L if empty/zero
                    setPriceRange([0, maxPrice]);
                } else {
                    setAllProducts([]);
                }
            } catch (e) {
                console.warn("Failed to fetch products");
                setAllProducts([]);
            }
        };
        fetchProducts();
    }, []);

    // Filter Logic
    const handleFilterChange = (category, values) => {
        setActiveFilters(prev => ({
            ...prev,
            [category]: values
        }));
    };

    useEffect(() => {
        let result = allProducts;

        // Price
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Brand
        if (activeFilters.brands.length > 0) {
            result = result.filter(p => activeFilters.brands.includes(p.brandName || p.brand));
        }

        // Categories
        if (activeFilters.categories.length > 0) {
            result = result.filter(p => activeFilters.categories.includes(p.category));
        }

        // Colors
        if (activeFilters.colors.length > 0) {
            result = result.filter(p => activeFilters.colors.includes(p.color));
        }

        // Sizes
        if (activeFilters.sizes.length > 0) {
            result = result.filter(p => activeFilters.sizes.includes(p.size));
        }

        // Materials
        if (activeFilters.materials.length > 0) {
            result = result.filter(p => activeFilters.materials.includes(p.material));
        }

        // Availability
        if (activeFilters.availability.includes('Available Online')) {
            result = result.filter(p => p.stock > 0);
        }

        setFilteredProducts(result);
    }, [allProducts, activeFilters, priceRange]);


    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#D4AF37] selection:text-black">
            {/* Custom Public Header */}
            <PublicNavbar />

            {/* Hero Section - Premium Slider */}
            <section className="relative h-[600px] w-full overflow-hidden bg-black">
                {/* Slider Images */}
                {[
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1920&q=80",
                    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1920&q=80",
                    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1920&q=80",
                    "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1920&q=80",
                    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1920&q=80",
                    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1920&q=80"
                ].map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out`}
                        style={{
                            backgroundImage: `url(${img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: index === currentSlide ? 1 : 0
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent" />
                    </div>
                ))}

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10 px-6">
                    <div className="text-center max-w-4xl pt-20">
                        <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl tracking-tight leading-tight">
                            TIMELESS <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#febd69] to-[#f3a847]">ELEGANCE</span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 md:mb-10 font-light drop-shadow-md max-w-2xl mx-auto">
                            Discover the world's most exclusive collection of premium footwear.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <a href="#collection" className="bg-[#febd69] hover:bg-[#f3a847] text-black text-base md:text-lg px-8 py-3 md:px-10 md:py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-orange-500/20">
                                Shop Collection
                            </a>
                        </div>
                    </div>
                </div>

                {/* Slider Indicators */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`w-3 h-3 rounded-full transition-all ${i === currentSlide ? "bg-[#febd69] w-10" : "bg-white/50 hover:bg-white"}`}
                        />
                    ))}
                </div>
            </section>

            {/* Product Grid Section Container */}
            <div id="collection" className="max-w-[1600px] mx-auto flex pt-6 md:pt-10">

                {/* Sidebar Component */}
                <FilterSidebar
                    allProducts={allProducts}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                {/* Main Content */}
                <section className="flex-1 px-6 pb-20 w-full">
                    <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold">Latest Arrivals</h2>
                            <div className="text-gray-400 text-sm mt-1">Showing {filteredProducts.length} exclusive shoes</div>
                        </div>

                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="flex lg:hidden items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-sm hover:bg-white/5 transition"
                        >
                            <FaFilter className="text-[#D4AF37]" /> Filter
                        </button>
                    </div>


                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
                            {filteredProducts.map((p) => (
                                <div key={p._id} className="group relative bg-[#111] rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                                    <div className="aspect-[4/5] bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center p-4">
                                        {/* Discount Badge */}
                                        {p.pricing?.isOnOffer && (
                                            <div className="absolute top-3 left-3 bg-[#e11d48] text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-lg" style={{ fontFamily: 'monospace' }}>
                                                {p.pricing.discountLabel}
                                            </div>
                                        )}

                                        {/* Display Image if available (Base64 or URL) */}
                                        {p.images?.[0] ? (
                                            <img src={p.images[0]} alt={p.name} className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-700 flex-col gap-2">
                                                <span className="text-4xl">📷</span>
                                                <span>No Image</span>
                                            </div>
                                        )}

                                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent w-full">
                                            <button
                                                onClick={() => navigate(`/product/${p._id}`)}
                                                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition shadow-lg"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-3 md:p-5">
                                        <div className="text-xs md:text-sm text-gray-500 uppercase tracking-widest font-medium mb-1 truncate">{p.brandName}</div>
                                        <h3 className="text-sm md:text-lg font-bold text-white mb-2 truncate">{p.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                {p.pricing?.isOnOffer ? (
                                                    <div className="flex items-center gap-1 md:gap-2">
                                                        <span className="text-base md:text-xl text-highlight font-bold">₹{p.pricing.finalPrice.toLocaleString()}</span>
                                                        <span className="text-xs md:text-sm text-gray-500 line-through hidden sm:inline">₹{p.pricing.mrp.toLocaleString()}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-base md:text-xl text-highlight font-bold">₹{p.price.toLocaleString()}</span>
                                                )}
                                            </div>
                                            <span className="text-[10px] md:text-xs text-gray-500 border border-white/10 px-1 md:px-2 py-0.5 md:py-1 rounded hidden sm:inline">{p.category}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            <p className="text-xl">No shoes match your filters.</p>
                            <button
                                onClick={() => setActiveFilters({ brands: [], categories: [], colors: [], sizes: [], materials: [], availability: [] })}
                                className="inline-block mt-4 text-[#D4AF37] hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </section>
            </div>

        </div>
    );
};

export default Home;
