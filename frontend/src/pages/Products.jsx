import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { api } from "../services/api";
import PublicNavbar from "../components/public/PublicNavbar";
import { FaHeart, FaShoppingCart, FaFilter } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import FilterSidebar from "../components/public/FilterSidebar";

// import { DUMMY_PRODUCTS as ALL_DUMMY } from "../data/dummyData";

const Products = () => {
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const categoryFilter = queryParams.get("category");
    const searchQuery = queryParams.get("search");

    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    // -- Filter State --
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 1000000]); // Large default range
    const [activeFilters, setActiveFilters] = useState({
        brands: [],
        categories: [],
        colors: [],
        sizes: [],
        materials: [],
        availability: []
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch all products from API
                const { data } = await api.get("/api/products");
                if (data && data.length > 0) {
                    setAllProducts(data);

                    // Set initial max price dynamically
                    const maxPrice = Math.max(...data.map(p => p.price));
                    setPriceRange([0, maxPrice]);
                } else {
                    setAllProducts([]);
                }
                setLoading(false);
            } catch (error) {
                console.warn("Failed to fetch products:", error);
                setAllProducts([]);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle filter updates
    const handleFilterChange = (category, values) => {
        setActiveFilters(prev => ({
            ...prev,
            [category]: values
        }));
    };

    useEffect(() => {
        let result = allProducts;

        // 1. URL Query Params (Search / Category Link)
        if (categoryFilter) {
            if (categoryFilter === "Luxury") {
                result = result.filter(p => p.category === "Luxury" || p.category === "Premium");
            } else {
                result = result.filter(p => p.category?.toLowerCase() === categoryFilter.toLowerCase());
            }
        }

        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(lowerQ) ||
                p.brandName?.toLowerCase().includes(lowerQ) ||
                p.brand?.toLowerCase().includes(lowerQ)
            );
        }

        // 2. Sidebar Filters
        // Price
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Brand
        if (activeFilters.brands.length > 0) {
            result = result.filter(p => activeFilters.brands.includes(p.brandName || p.brand));
        }

        // Categories (Manual Checkbox)
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
    }, [categoryFilter, searchQuery, allProducts, activeFilters, priceRange]);

    return (
        <div className="bg-secondary min-h-screen text-text-main font-sans">
            <PublicNavbar />

            <div className="max-w-[1600px] mx-auto flex">

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

                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-24 w-full">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-border-light pb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-text-main to-gray-500 bg-clip-text text-transparent">
                                {categoryFilter ? `${categoryFilter} Collection` : searchQuery ? `Results for "${searchQuery}"` : "All Clothing"}
                            </h1>
                            <p className="text-text-muted mt-2 text-sm tracking-wide">
                                Showing {filteredProducts.length} curated items
                            </p>
                        </div>

                        <div className="flex items-center gap-4 mt-6 md:mt-0">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="flex lg:hidden items-center gap-2 px-4 py-2 border border-border-light rounded-full text-sm hover:bg-black/5 transition"
                            >
                                <FaFilter className="text-accent" /> Filter
                            </button>

                            <select className="bg-transparent border border-border-light rounded-full px-4 py-2 text-sm outline-none cursor-pointer hover:bg-black/5">
                                <option className="bg-primary">Sort by: Recommended</option>
                                <option className="bg-primary">Price: High to Low</option>
                                <option className="bg-primary">Price: Low to High</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters Display (Chips) */}
                    {(activeFilters.brands.length > 0 || activeFilters.colors.length > 0 || activeFilters.sizes.length > 0 || activeFilters.materials.length > 0) && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {[...activeFilters.brands, ...activeFilters.colors, ...activeFilters.sizes, ...activeFilters.materials].map(filter => (
                                <span key={filter} className="text-xs bg-black/5 px-3 py-1 rounded-full flex items-center gap-2">
                                    {filter}
                                    {/* Simplified remove for demo - ideally calling specific remove handler */}
                                </span>
                            ))}
                            <button
                                onClick={() => setActiveFilters({ brands: [], categories: [], colors: [], sizes: [], materials: [], availability: [] })}
                                className="text-xs text-accent hover:underline ml-2"
                            >
                                Clear All
                            </button>
                        </div>
                    )}

                    {/* Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                            {filteredProducts.map((product) => (
                                <div key={product._id} className="group relative bg-secondary rounded-xl overflow-hidden shadow-lg border border-border-light hover:border-accent/50 transition-all duration-300 flex flex-col">

                                    {/* Badge */}
                                    {product.isNew && (
                                        <span className="absolute top-3 left-3 bg-accent text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider z-10">
                                            New Arrival
                                        </span>
                                    )}

                                    {/* Image Area */}
                                    <Link to={`/product/${product._id}`} className="block relative aspect-[4/5] overflow-hidden">
                                        <img
                                            src={product.images?.[0] || product.image || "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800"}
                                            alt={product.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                            <button
                                                onClick={(e) => { e.preventDefault(); addToCart(product); }}
                                                className="w-full bg-accent hover:bg-[#b5952f] text-black font-bold py-3 rounded shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                <FaShoppingCart /> Add to Cart
                                            </button>
                                        </div>
                                    </Link>

                                    <div className="p-3 md:p-5 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-1 md:mb-2">
                                            <div className="text-[10px] md:text-xs text-accent tracking-widest uppercase font-bold truncate">{product.brandName || product.brand || "Brand"}</div>
                                            <button className="text-text-muted hover:text-red-500 transition"><FaHeart className="w-3 md:w-4" /></button>
                                        </div>
                                        <Link to={`/product/${product._id}`} className="block mb-1 md:mb-2">
                                            <h3 className="text-sm md:text-lg font-bold text-text-main leading-tight group-hover:text-accent transition-colors line-clamp-2">{product.name}</h3>
                                        </Link>

                                        {/* Specs (New) */}
                                        <div className="flex gap-2 text-[10px] text-text-muted mb-3 uppercase tracking-wide">
                                            {product.size && <span>Size {product.size}</span>}
                                            {product.size && product.material && <span>•</span>}
                                            {product.material && <span>{product.material}</span>}
                                        </div>

                                        <div className="mt-auto text-text-muted font-medium">
                                            ₹{product.price.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-text-muted">
                            <p className="text-xl">No clothing matches your criteria.</p>
                            <button
                                onClick={() => {
                                    setActiveFilters({ brands: [], categories: [], colors: [], sizes: [], materials: [] });
                                    setPriceRange([0, 1000000]); // Reset to max
                                }}
                                className="inline-block mt-4 text-accent hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default Products;
