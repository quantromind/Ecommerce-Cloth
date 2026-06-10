import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { toast } from "react-hot-toast";

const ProductForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        brandName: "",
        category: "Men",
        price: "",
        stock: "",
        description: "",
        image: "" // Base64 string
    });

    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    // Simple file to Base64 (since we don't have separate upload server yet)
    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm({ ...form, image: reader.result }); // Base64 string
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/api/products", form);
            toast.success("Product created successfully");
            navigate(-1); // Go back
        } catch (error) {
            toast.error("Failed to create product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Add New Watch</h1>

            <form onSubmit={submit} className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 space-y-6">

                {/* Image Upload Preview */}
                <div className="flex justify-center mb-6">
                    <label className="cursor-pointer group relative w-40 h-40 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden border border-dashed border-white/20 hover:border-highlight transition">
                        {form.image ? (
                            <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center text-gray-500 text-xs">
                                <span className="block text-2xl mb-2">+</span>
                                Upload Image
                            </div>
                        )}
                        <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
                    </label>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs text-gray-500 uppercase">Model Name</label>
                        <input name="name" onChange={onChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 outline-none focus:border-highlight" placeholder="Rolex Submariner" required />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase">Brand Name (Display)</label>
                        <input name="brandName" onChange={onChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 outline-none focus:border-highlight" placeholder="Rolex" required />
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <label className="text-xs text-gray-500 uppercase">Category</label>
                        <select name="category" onChange={onChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 outline-none focus:border-highlight">
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Unisex">Unisex</option>
                            <option value="Luxury">Luxury</option>
                            <option value="Sport">Sport</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase">Price ($)</label>
                        <input name="price" type="number" onChange={onChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 outline-none focus:border-highlight" placeholder="12500" required />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase">Stock Qty</label>
                        <input name="stock" type="number" onChange={onChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 outline-none focus:border-highlight" placeholder="5" required />
                    </div>
                </div>

                <div>
                    <label className="text-xs text-gray-500 uppercase">Description</label>
                    <textarea name="description" onChange={onChange} rows="4" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 outline-none focus:border-highlight" placeholder="Detailed specs..." required />
                </div>

                <button disabled={loading} className="w-full bg-highlight hover:bg-highlight/90 text-white font-bold py-3 rounded-xl transition">
                    {loading ? "Saving..." : "Publish Product"}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;
