import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { toast } from "react-hot-toast";
import { FaBoxOpen, FaClipboardList, FaCheckCircle, FaTruck, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const MySales = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const { data } = await api.get("/api/orders/brand-sales");
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch sales", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });
            toast.success(`Order status updated to ${newStatus}`);
            fetchSales(); // Refresh
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Processing": return "text-amber-600 bg-amber-50 border-amber-200";
            case "Shipped": return "text-blue-600 bg-blue-50 border-blue-200";
            case "Delivered": return "text-emerald-600 bg-emerald-50 border-emerald-200";
            case "Cancelled": return "text-rose-600 bg-rose-50 border-rose-200";
            default: return "text-slate-500 bg-slate-50 border-slate-200";
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-500">Loading sales data...</div>;

    return (
        <div className="space-y-8 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">My Sales & Orders</h1>
                    <p className="text-slate-500 mt-1">Track and manage customer orders for your products.</p>
                </div>
                <div className="bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 text-sm text-slate-600">
                    <FaClipboardList className="text-teal-600" />
                    <span className="font-bold text-slate-800">{orders.length}</span> Total Orders
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center">
                    <FaBoxOpen className="text-4xl mb-4 opacity-50" />
                    <p>No orders received yet.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                            {/* Header */}
                            <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Order ID</div>
                                        <div className="font-mono text-slate-700 text-sm font-semibold">#{order._id.slice(-8).toUpperCase()}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Date</div>
                                        <div className="text-slate-700 text-sm font-semibold">{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Customer</div>
                                        <div className="text-slate-700 text-sm font-semibold">{order.shippingAddress.name}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Status</div>
                                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-12 gap-6">
                                {/* Items - Takes 7 Cols */}
                                <div className="md:col-span-7 space-y-3">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ordered Items</h4>
                                    <div className="space-y-3">
                                        {order.orderItems.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 overflow-hidden flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-slate-800 font-bold text-sm truncate">{item.name}</div>
                                                    <div className="text-xs text-slate-500 mt-0.5">Qty: {item.qty}</div>
                                                </div>
                                                <div className="text-slate-800 font-bold text-sm">₹{(item.price * item.qty).toLocaleString()}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end pt-3 border-t border-slate-100 mt-2">
                                        <div className="text-sm font-bold text-slate-800">Total: <span className="text-teal-600 text-base">₹{order.totalPrice.toLocaleString()}</span></div>
                                    </div>
                                </div>

                                {/* Shipping & Actions - Takes 5 Cols */}
                                <div className="md:col-span-5 flex flex-col gap-4">
                                    {/* Detailed Address */}
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1.5"><FaMapMarkerAlt /> Shipping Address</h4>
                                        <div className="text-sm text-slate-600 space-y-1 leading-snug">
                                            <p className="font-bold text-slate-800">{order.shippingAddress.name}</p>
                                            <p>{order.shippingAddress.address}</p>
                                            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                            <p>{order.shippingAddress.country}</p>
                                            <p className="flex items-center gap-1.5 mt-2 text-teal-600 font-medium bg-white px-2 py-1 rounded border border-slate-200 inline-block text-xs"><FaPhone size={10} /> {order.shippingAddress.phone}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div>
                                        {order.status === "Processing" && (
                                            <button onClick={() => handleStatusUpdate(order._id, "Shipped")} className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2">
                                                <FaTruck /> Mark as Shipped
                                            </button>
                                        )}
                                        {order.status === "Shipped" && (
                                            <button onClick={() => handleStatusUpdate(order._id, "Delivered")} className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 py-2 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2">
                                                <FaCheckCircle /> Mark as Delivered
                                            </button>
                                        )}
                                        {order.status === "Delivered" && (
                                            <div className="w-full text-center text-emerald-600 text-sm font-bold py-2 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-center gap-2">
                                                <FaCheckCircle /> Order Completed
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MySales;
