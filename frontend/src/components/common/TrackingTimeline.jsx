import React from 'react';
import { FaBox, FaShippingFast, FaHome, FaClipboardCheck } from 'react-icons/fa';

const TrackingTimeline = ({ status }) => {
    // Expected statuses: "Pending", "Paid", "Processing", "Shipped", "Delivered"
    // We map them to steps.

    // Normalize status
    const currentStatus = status || "Pending";

    const steps = [
        { label: "Ordered", icon: FaClipboardCheck, match: ["Pending", "Paid", "Processing", "Shipped", "Delivered"] },
        { label: "Processing", icon: FaBox, match: ["Processing", "Shipped", "Delivered"] },
        { label: "Shipped", icon: FaShippingFast, match: ["Shipped", "Delivered"] },
        { label: "Delivered", icon: FaHome, match: ["Delivered"] },
    ];

    return (
        <div className="w-full mt-6 py-4">
            <div className="relative flex justify-between">
                {/* Connecting Line (Background) */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-black/5 -translate-y-1/2 rounded-full z-0"></div>

                {/* Connecting Line (Progress) - Simplified logic */}
                <div className={`absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full z-0 transition-all duration-1000 ease-out`}
                    style={{
                        width: currentStatus === "Delivered" ? "100%" :
                            currentStatus === "Shipped" ? "75%" :
                                currentStatus === "Processing" ? "50%" :
                                    "25%"
                    }}
                ></div>

                {steps.map((step, index) => {
                    const isCompleted = step.match.includes(currentStatus);
                    const isCurrent = (index === steps.length - 1 && isCompleted) ||
                        (isCompleted && !steps[index + 1].match.includes(currentStatus));

                    return (
                        <div key={index} className="relative z-10 flex flex-col items-center group">
                            <div className={`
                                w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500
                                ${isCompleted ? 'bg-green-500 border-black text-black scale-100' : 'bg-secondary border-border-light text-text-muted scale-90'}
                                ${isCurrent ? 'ring-4 ring-green-500/20' : ''}
                            `}>
                                <step.icon className="text-xs md:text-sm" />
                            </div>
                            <div className={`
                                mt-2 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors duration-300
                                ${isCompleted ? 'text-green-400' : 'text-gray-600'}
                            `}>
                                {step.label}
                            </div>
                        </div>
                    );
                })}
            </div>

            {currentStatus === "Pending" && (
                <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg text-xs text-yellow-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                    Your order is being verified. It will move to processing shortly.
                </div>
            )}
        </div>
    );
};

export default TrackingTimeline;
