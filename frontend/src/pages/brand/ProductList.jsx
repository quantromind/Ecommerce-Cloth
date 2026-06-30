import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { showConfirmationToast } from "../../utils/toastConfirm";
import { api } from "../../services/api";
import { FaPlus, FaTrash } from "react-icons/fa";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get("/api/products/my");
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = (id) => {
        showConfirmationToast("Are you sure you want to delete this product?", async () => {
            try {
                await api.delete(`/api/products/${id}`);
                fetchProducts();
                toast.success("Product deleted successfully");
            } catch (error) {
                toast.error("Failed to delete");
            }
        });
    };

    if (loading) return <div className="text-text-main p-8">Loading inventory...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">My Inventory</h1>
                    <p className="text-text-muted text-sm mt-1">Manage your watch catalog.</p>
                </div>
                <Link
                    to="/brand/inventory/new"
                    className="flex items-center gap-2 bg-highlight hover:bg-highlight/90 text-text-main px-4 py-2 rounded-xl transition font-medium"
                >
                    <FaPlus /> Add Watch
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((p) => (
                    <div key={p._id} className="bg-secondary border border-border-light rounded-2xl overflow-hidden group hover:border-border-light transition-all">
                        <div className="aspect-square bg-black/5 relative">
                            {p.images?.[0] ? (
                                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-600 text-xs">No Image</div>
                            )}
                            <div className="absolute top-2 right-2 bg-primary/60 backdrop-blur px-2 py-1 rounded text-xs text-text-main">
                                Stock: {p.stock}
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="text-text-main font-semibold truncate">{p.name}</h3>
                            <div className="text-highlight font-bold mt-1">${p.price}</div>
                            <div className="text-xs text-text-muted mt-2 line-clamp-2">{p.description}</div>

                            <div className="mt-4 flex items-center gap-2 pt-4 border-t border-border-light">
                                <button className="flex-1 bg-black/5 hover:bg-black/5 text-text-main py-2 rounded-lg text-sm transition">
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(p._id)}
                                    className="px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded-lg transition"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {products.length === 0 && (
                    <div className="col-span-full py-12 text-center text-text-muted border border-dashed border-border-light rounded-2xl">
                        No products found. Start adding your collection!
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
