import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { FaStar, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-hot-toast';

const SuggestedProducts = ({ currentProductId, category, brand, limit = 4, title = "You May Also Like" }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchSuggested = async () => {
            try {
                // Fetch all products (in a real app, use a specific filter endpoint)
                const { data } = await api.get('/api/products');

                if (data) {
                    // Filter logic: Same Category OR Same Brand, excluding current
                    const related = data.filter(p =>
                        p._id !== currentProductId &&
                        (p.category === category || p.brandName === brand || p.brand === brand)
                    );

                    // Shuffle and slice
                    const shuffled = related.sort(() => 0.5 - Math.random());
                    setProducts(shuffled.slice(0, limit));
                }
            } catch (error) {
                console.warn("Failed to fetch suggested products", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentProductId) {
            fetchSuggested();
        }
    }, [currentProductId, category, brand, limit]);

    if (loading || products.length === 0) return null;

    return (
        <div className="mt-12 border-t border-white/5 pt-8">
            <h3 className="text-xl font-bold mb-6 text-white">{title}</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map(product => (
                    <div key={product._id} className="group bg-[#1a1a1a] rounded-xl border border-white/5 overflow-hidden hover:border-[#D4AF37]/30 transition-all">
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#111]">
                            <img
                                src={product.images?.[0] || product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-transparent w-full flex flex-col gap-2">
                                <Link
                                    to={`/product/${product._id}`}
                                    className="w-full bg-white text-black font-bold py-2 rounded-lg hover:bg-gray-200 transition text-center text-sm shadow-lg"
                                >
                                    View Details
                                </Link>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        addToCart(product);
                                        toast.success("Added to Cart");
                                    }}
                                    className="w-full bg-[#D4AF37] text-black font-bold py-2 rounded-lg hover:bg-[#b5952f] transition text-center text-sm shadow-lg flex items-center justify-center gap-2"
                                >
                                    <FaShoppingCart size={14} /> Add to Cart
                                </button>
                            </div>
                        </div>
                        <div className="p-3">
                            <div className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider mb-1">
                                {product.brandName || product.brand}
                            </div>
                            <Link to={`/product/${product._id}`} className="block">
                                <h4 className="text-sm font-medium text-white truncate group-hover:text-[#D4AF37] transition-colors">
                                    {product.name}
                                </h4>
                            </Link>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-white font-bold">₹{product.price.toLocaleString()}</span>
                                <div className="flex items-center text-[10px] text-gray-500 gap-1">
                                    <FaStar className="text-yellow-500" /> 4.5
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedProducts;
