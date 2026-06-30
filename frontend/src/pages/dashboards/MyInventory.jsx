import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { toast } from "react-hot-toast";
import { showConfirmationToast } from "../../utils/toastConfirm";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaBoxOpen, FaImage, FaStar, FaTags, FaShieldAlt, FaHandshake, FaTruck, FaChevronDown, FaChevronUp } from "react-icons/fa";


const MyInventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Form State
    const [activeSection, setActiveSection] = useState(null); // Accordion state

    const [form, setForm] = useState({
        name: "",
        brandName: "",
        price: "",
        category: "Casual",
        description: "",
        stock: "",
        images: [],

        // Filter Fields
        collectionName: "",
        color: "",
        size: "",
        material: "",

        // Extended Fields
        offer: { enabled: false, type: "PERCENT", value: 0, couponCode: "", startDate: "", endDate: "" },
        policy: { returnEnabled: false, returnDays: 0, codAvailable: false, freeShipping: false }
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const { data } = await api.get("/api/products/my");
            setProducts(data);
        } catch (error) {
            console.error("Failed to fetch inventory", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brandName.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setForm({
                name: product.name,
                brandName: product.brandName,
                price: product.price,
                category: product.category,
                description: product.description,
                stock: product.stock,
                images: product.images || [],

                collectionName: product.collectionName || "",
                color: product.color || "",
                size: product.size || "",
                material: product.material || "",

                offer: product.offer || { enabled: false, type: "PERCENT", value: 0, couponCode: "", startDate: "", endDate: "" },
                policy: product.policy || { returnEnabled: false, returnDays: 0, codAvailable: false, freeShipping: false }
            });
        } else {
            setEditingProduct(null);
            setForm({
                name: "",
                brandName: "",
                price: "",
                category: "Casual",
                description: "",
                stock: "",
                images: [],

                collectionName: "",
                color: "",
                size: "",
                material: "",

                offer: { enabled: false, type: "PERCENT", value: 0, couponCode: "", startDate: "", endDate: "" },
                policy: { returnEnabled: false, returnDays: 0, codAvailable: false, freeShipping: false }
            });
        }
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // VALIDATION
        const validFiles = files.filter(file => {
            const isImage = file.type.startsWith('image/');
            const isSizeOk = file.size <= 5 * 1024 * 1024; // 5MB limit
            return isImage && isSizeOk;
        });

        if (files.length !== validFiles.length) {
            toast.error("Some files were rejected. Ensure images are under 5MB.");
        }

        if (validFiles.length > 0) {
            setIsUploading(true);
            Promise.all(validFiles.map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            })).then(results => {
                setForm(prev => ({ ...prev, images: [...prev.images, ...results] }));
                setIsUploading(false);
            }).catch(() => {
                setIsUploading(false);
                toast.error("Failed to read image files.");
            });
        }
    };

    const removeImage = (index) => {
        setForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleNestedChange = (section, field, value) => {
        setForm(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleDeepNestedChange = (section, subsection, field, value) => {
        setForm(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [subsection]: {
                    ...prev[section][subsection],
                    [field]: value
                }
            }
        }));
    };


    const setPrimaryImage = (index) => {
        if (index === 0) return;
        setForm(prev => {
            const newImages = [...prev.images];
            const [selected] = newImages.splice(index, 1);
            newImages.unshift(selected);
            return { ...prev, images: newImages };
        });
    };

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isUploading) {
            toast.error("Please wait for images to finish uploading.");
            return;
        }

        if (form.images.length === 0) {
            toast.error("Please upload at least one image.");
            return;
        }

        try {
            if (editingProduct) {
                await api.put(`/api/products/${editingProduct._id}`, form);
            } else {
                await api.post("/api/products", form);
            }
            setShowModal(false);
            fetchInventory();
            toast.success(editingProduct ? "Clothing updated successfully!" : "Clothing created successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = (id) => {
        showConfirmationToast("Remove this clothing item?", async () => {
            try {
                await api.delete(`/api/products/${id}`);
                fetchInventory();
                toast.success("Clothing removed successfully!");
            } catch (error) {
                toast.error("Failed to delete product");
            }
        });
    };

    return (
        <div className="space-y-8 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">My Collections</h1>
                    <p className="text-slate-500 mt-1">Manage your exclusive clothing and inventory.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-transform active:scale-95"
                >
                    <FaPlus /> Add New Clothing
                </button>
            </div>

            {/* Stats & Search */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-xl">
                        <FaBoxOpen />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-800">{products.length}</div>
                        <div className="text-sm text-slate-500">Total Products</div>
                    </div>
                </div>

                <div className="md:col-span-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaSearch className="text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, brand, or SKU..."
                        value={search}
                        onChange={handleSearch}
                        className="w-full h-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 text-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition shadow-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Item</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading inventory...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan="5" className="p-12 text-center text-slate-400">No items found. Start adding your collection.</td></tr>
                            ) : (
                                currentItems.map((product) => (
                                    <tr key={product._id} className="hover:bg-slate-50/50 transition group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 relative">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300"><FaImage /></div>
                                                    )}
                                                    {product.images?.length > 1 && (
                                                        <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1">+{product.images.length - 1}</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 group-hover:text-teal-600 transition">{product.name}</div>
                                                    <div className="text-xs text-slate-500">{product.brandName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono font-bold text-slate-700">₹{product.price.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-2 font-medium ${product.stock < 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                <span className={`w-2 h-2 rounded-full ${product.stock < 5 ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                                                {product.stock} Units
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openModal(product)} className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition"><FaEdit /></button>
                                                <button onClick={() => handleDelete(product._id)} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-2">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition font-medium text-sm shadow-sm"
                    >
                        Previous
                    </button>
                    <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => paginate(i + 1)}
                                className={`w-10 h-10 rounded-lg border flex items-center justify-center text-sm font-bold shadow-sm transition ${
                                    currentPage === i + 1 
                                        ? "bg-teal-600 text-white border-teal-600" 
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition font-medium text-sm shadow-sm"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-slate-800">
                                {editingProduct ? "Edit Clothing" : "Add New Clothing"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl transition">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs uppercase text-slate-500 font-bold">Model Name</label>
                                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none transition" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Submariner Date" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs uppercase text-slate-500 font-bold">Brand</label>
                                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none transition" value={form.brandName} onChange={e => setForm({ ...form, brandName: e.target.value })} placeholder="e.g. Rolex" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs uppercase text-slate-500 font-bold">Price (₹)</label>
                                    <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none transition" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs uppercase text-slate-500 font-bold">Stock Quantity</label>
                                    <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none transition" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs uppercase text-slate-500 font-bold">Category</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none transition" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                        <option value="T-Shirts">T-Shirts</option>
                                        <option value="Shirts">Shirts</option>
                                        <option value="Jeans">Jeans</option>
                                        <option value="Trousers">Trousers</option>
                                        <option value="Jackets">Jackets</option>
                                        <option value="Activewear">Activewear</option>
                                        <option value="Ethnic Wear">Ethnic Wear</option>
                                        <option value="Winter Wear">Winter Wear</option>
                                    </select>
                                </div>
                            </div>

                            {/* Images Section */}
                            <div className="space-y-3">
                                <label className="text-xs uppercase text-slate-500 font-bold">Images (Primary First)</label>
                            </div>

                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                {form.images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group shadow-sm">
                                        <img src={img} alt={`Upload ${idx}`} className={`w-full h-full object-cover ${idx === 0 ? 'border-2 border-teal-500' : ''}`} />
                                        {/* Primary Badge */}
                                        {idx === 0 && <span className="absolute top-1 left-1 bg-teal-500 text-white text-[8px] px-1.5 rounded uppercase font-bold shadow-sm">Main</span>}

                                        {/* Set Primary Button */}
                                        {idx !== 0 && (
                                            <button type="button" onClick={() => setPrimaryImage(idx)} className="absolute bottom-1 left-1 bg-black/50 hover:bg-teal-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow-sm" title="Set as Primary">
                                                <FaStar size={10} />
                                            </button>
                                        )}

                                        {/* Remove Button */}
                                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm border border-slate-100">
                                            &times;
                                        </button>
                                    </div>
                                ))}

                                <label className="cursor-pointer aspect-square bg-slate-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-teal-500 hover:bg-teal-50 transition group">
                                    <span className="text-2xl text-slate-400 group-hover:text-teal-500 mb-1 transition"><FaPlus /></span>
                                    <span className="text-[10px] text-slate-500 group-hover:text-teal-600 uppercase font-bold">Add</span>
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" multiple />
                                </label>
                            </div>
                            <p className="text-xs text-slate-400">
                                Max 5MB per image. The first image will be the primary display.
                            </p>

                            {/* Specifications & Filters */}
                            <div className="space-y-4 border-t border-slate-100 pt-4">
                                <label className="text-xs uppercase text-slate-500 font-bold">Specifications & Filter Attributes</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500">Collection</label>
                                        <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 text-sm" value={form.collectionName} onChange={e => setForm({ ...form, collectionName: e.target.value })} placeholder="e.g. Submariner" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500">Size</label>
                                        <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 text-sm" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} placeholder="e.g. 42" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500">Color</label>
                                        <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 text-sm" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} placeholder="e.g. Black" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-500">Material</label>
                                        <input className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 text-sm" value={form.material} onChange={e => setForm({ ...form, material: e.target.value })} placeholder="e.g. Leather" />
                                    </div>
                                </div>
                            </div>



                            <div className="space-y-4">
                                <label className="text-xs uppercase text-slate-500 font-bold">Additional Details & Trust</label>

                                {/* Offers Section */}
                                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <div className="bg-slate-50 p-4 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition" onClick={() => toggleSection('offer')}>
                                        <div className="flex items-center gap-2 font-bold text-slate-700"><FaTags className="text-teal-500" /> Offers & Discounts</div>
                                        <div className="flex items-center gap-3 text-slate-500">
                                            <div className="relative inline-block w-10 mr-2 align-middle select-none">
                                                <input type="checkbox" checked={form.offer.enabled} onClick={(e) => e.stopPropagation()} onChange={(e) => handleNestedChange('offer', 'enabled', e.target.checked)} className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:bg-teal-500 transition-all duration-300 left-0 shadow-sm border-slate-200" />
                                                <label className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer"></label>
                                            </div>
                                            {activeSection === 'offer' ? <FaChevronUp /> : <FaChevronDown />}
                                        </div>
                                    </div>
                                    {activeSection === 'offer' && form.offer.enabled && (
                                        <div className="p-4 bg-white space-y-4 border-t border-slate-100 animation-slide-down">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs text-slate-500 block mb-1">Discount Type</label>
                                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800" value={form.offer.type} onChange={e => handleNestedChange('offer', 'type', e.target.value)}>
                                                        <option value="PERCENT">Percentage (%)</option>
                                                        <option value="FLAT">Flat Amount (₹)</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 block mb-1">Value</label>
                                                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800" value={form.offer.value} onChange={e => handleNestedChange('offer', 'value', Number(e.target.value))} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 block mb-1">Coupon Code (Optional)</label>
                                                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 uppercase" value={form.offer.couponCode} onChange={e => handleNestedChange('offer', 'couponCode', e.target.value.toUpperCase())} placeholder="e.g. SUMMER2024" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs text-slate-500 block mb-1">Start Date</label>
                                                    <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800" value={form.offer.startDate?.split('T')[0]} onChange={e => handleNestedChange('offer', 'startDate', e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-500 block mb-1">End Date</label>
                                                    <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800" value={form.offer.endDate?.split('T')[0]} onChange={e => handleNestedChange('offer', 'endDate', e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="bg-teal-50 p-2 rounded text-xs text-teal-700 text-center border border-teal-100">
                                                Preview: Final Price ₹{form.price - (form.offer.type === "PERCENT" ? (form.price * form.offer.value / 100) : form.offer.value)}
                                            </div>
                                        </div>
                                    )}
                                </div>



                                {/* Policies & Engagement Section */}
                                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                    <div className="bg-slate-50 p-4 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition" onClick={() => toggleSection('policy')}>
                                        <div className="flex items-center gap-2 font-bold text-slate-700"><FaTruck className="text-violet-500" /> Policies & Engagement</div>
                                        <div className="flex items-center gap-3 text-slate-500">
                                            {activeSection === 'policy' ? <FaChevronUp /> : <FaChevronDown />}
                                        </div>
                                    </div>
                                    {activeSection === 'policy' && (
                                        <div className="p-4 bg-white space-y-4 border-t border-slate-100 animation-slide-down">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <h4 className="text-xs font-bold text-slate-500 uppercase">Return Policy</h4>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input type="checkbox" checked={form.policy.returnEnabled} onChange={e => handleNestedChange('policy', 'returnEnabled', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                                                        <span className="text-sm text-slate-600">Accept Returns</span>
                                                    </label>
                                                    {form.policy.returnEnabled && (
                                                        <div className="flex items-center gap-2">
                                                            <input type="number" className="w-20 bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 text-sm" value={form.policy.returnDays} onChange={e => handleNestedChange('policy', 'returnDays', Number(e.target.value))} />
                                                            <span className="text-sm text-slate-500">Days</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-3">
                                                    <h4 className="text-xs font-bold text-slate-500 uppercase">Shipping</h4>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input type="checkbox" checked={form.policy.codAvailable} onChange={e => handleNestedChange('policy', 'codAvailable', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                                                        <span className="text-sm text-slate-600">COD Available</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input type="checkbox" checked={form.policy.freeShipping} onChange={e => handleNestedChange('policy', 'freeShipping', e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                                                        <span className="text-sm text-slate-600">Free Shipping</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase text-slate-500 font-bold">Description</label>
                                <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500 outline-none h-32 transition" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Enter product description..."></textarea>
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-500 hover:text-slate-800 font-medium">Cancel</button>
                                <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all active:scale-95">
                                    {editingProduct ? "Save Changes" : "Publish Clothing"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            )}


        </div >
    );
};

export default MyInventory;
