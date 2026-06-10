import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import TrackingTimeline from "../../components/common/TrackingTimeline";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/api/orders/my");
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <div className="text-white">Loading orders...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">My Orders</h1>
                <button onClick={fetchOrders} className="text-gray-400 hover:text-white transition p-2 bg-white/5 rounded-lg border border-white/10 hover:border-white/20">
                    Refresh Status
                </button>
            </div>

            {orders.length === 0 ? (
                <div className="text-gray-500">No orders found. Go buy something!</div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-sm text-gray-500">Order ID: {order._id}</div>
                                    <div className="text-white font-bold mt-1">₹{order.totalPrice}</div>
                                </div>
                                <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-500' :
                                    order.status === 'Cancelled' ? 'bg-red-500/20 text-red-500' :
                                        'bg-yellow-500/20 text-yellow-500'
                                    }`}>
                                    {order.status}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {order.orderItems.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center bg-white/5 p-3 rounded-xl">
                                        <div className="w-16 h-16 bg-black rounded-lg overflow-hidden">
                                            {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{item.name}</div>
                                            <div className="text-xs text-gray-400">Qty: {item.qty}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tracking Timeline */}
                            <div className="mt-6 border-t border-white/5 pt-6">
                                <TrackingTimeline status={order.status} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderList;
