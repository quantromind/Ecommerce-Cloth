import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { toast } from "react-hot-toast";
import { FaTrash, FaShoppingCart, FaHeart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

const Wishlist = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    const fetchWishlist = async () => {
        try {
            const { data } = await api.get("/api/wishlist");
            setProducts(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const removeFromWishlist = async (id) => {
        try {
            await api.delete(`/api/wishlist/${id}`);
            setProducts((prev) => prev.filter((item) => item._id !== id));
            toast.success("Removed from wishlist");
        } catch (error) {
            toast.error("Failed to remove");
        }
    };

    const handleAddToCart = (product) => {
        addToCart(product);
        toast.success("Added to Cart");
    };

    if (loading) return <div className="text-white p-8">Loading Wishlist...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaHeart className="text-red-500" /> My Wishlist
            </h1>

            {products.length === 0 ? (
                <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-12 text-center text-gray-500">
                    <p className="text-lg">Your wishlist is empty.</p>
                    <Link to="/products" className="text-highlight hover:underline mt-2 inline-block">
                        Browse Collection
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/20 transition-all">
                            {/* Image */}
                            <Link to={`/product/${product._id}`} className="block aspect-square relative overflow-hidden">
                                {product.images?.[0] ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600">
                                        No Image
                                    </div>
                                )}
                            </Link>

                            {/* Details */}
                            <div className="p-4">
                                <Link to={`/product/${product._id}`} className="block">
                                    <h3 className="text-white font-semibold truncate hover:text-highlight transition">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 uppercase mt-1">{product.brandName}</p>
                                </Link>

                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-highlight font-bold">₹{product.price.toLocaleString()}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-sm transition flex items-center justify-center gap-2"
                                    >
                                        <FaShoppingCart size={14} /> Add
                                    </button>
                                    <button
                                        onClick={() => removeFromWishlist(product._id)}
                                        className="w-10 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition"
                                        title="Remove"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
