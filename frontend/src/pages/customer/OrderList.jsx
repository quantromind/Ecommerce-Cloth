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

    if (loading) return <div className="text-text-main">Loading orders...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-text-main">My Orders</h1>
                <button onClick={fetchOrders} className="text-text-muted hover:text-text-main transition p-2 bg-black/5 rounded-lg border border-border-light hover:border-border-light">
                    Refresh Status
                </button>
            </div>

            {orders.length === 0 ? (
                <div className="text-text-muted">No orders found. Go buy something!</div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-secondary border border-border-light rounded-2xl p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-sm text-text-muted">Order ID: {order._id}</div>
                                    <div className="text-text-main font-bold mt-1">₹{order.totalPrice}</div>
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
                                    <div key={idx} className="flex gap-4 items-center bg-black/5 p-3 rounded-xl">
                                        <div className="w-16 h-16 bg-primary rounded-lg overflow-hidden">
                                            {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <div className="text-text-main font-medium">{item.name}</div>
                                            <div className="text-xs text-text-muted">Qty: {item.qty}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tracking Timeline */}
                            <div className="mt-6 border-t border-border-light pt-6">
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
