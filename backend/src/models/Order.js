const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User", // Customer
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                image: { type: String, required: true },
                price: { type: Number, required: true },
                product: {
                    type: String, // Changed from ObjectId to String to support Dummy Data ("h1", etc)
                    required: true,
                },
                brandId: {
                    type: String, // Changed from ObjectId to String
                    required: true,
                }
            },
        ],
        shippingAddress: {
            name: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
            lat: { type: Number },
            lng: { type: Number },
            phone: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            required: true,
            default: "COD", // Cash on Delivery for now
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Processing"
        },
        deliveredAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);
