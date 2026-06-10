const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User", // Brand or Dealer who posted this
        },
        brandName: {
            type: String, // Denormalized for easier display
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        category: {
            type: String,
            required: true,
            enum: ["Casual", "Formal", "Sports", "Ethnic", "Sneakers", "Chappals"],
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        images: [
            {
                type: String, // URL or Base64
            },
        ],
        video: {
            type: String, // URL or Base64 (Optional)
            default: ""
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        // --- NEW FIELDS ---

        // A) Offers / Discount
        offer: {
            enabled: { type: Boolean, default: false },
            type: { type: String, enum: ["PERCENT", "FLAT"], default: "PERCENT" },
            value: { type: Number, default: 0 },
            couponCode: { type: String, uppercase: true, trim: true }, // Optional
            startDate: { type: Date },
            endDate: { type: Date },
        },

        // B) Warranty
        warranty: {
            enabled: { type: Boolean, default: false },
            planId: { type: String }, // link to template ID if used
            durationMonths: { type: Number, default: 0 },
            coverage: { type: String, enum: ["MOVEMENT_ONLY", "FULL", "CUSTOM"], default: "MOVEMENT_ONLY" },
            provider: { type: String, enum: ["DEALER", "MANUFACTURER"], default: "DEALER" },
            terms: { type: String }, // Rich text / Markdown
            highlights: [{ type: String }],
            exclusions: [{ type: String }],
        },

        // C) Trust & Authenticity
        trust: {
            authenticity: {
                guarantee: { type: Boolean, default: false },
                verifiedBy: { type: String, enum: ["IN_HOUSE", "THIRD_PARTY", "NOT_VERIFIED"], default: "NOT_VERIFIED" },
                certificateUrl: { type: String },
            },
            condition: {
                type: { type: String, enum: ["NEW", "PRE_OWNED"], default: "NEW" },
                grade: { type: String, enum: ["A", "B", "C"] }, // Only if PRE_OWNED
            },
            box: { type: Boolean, default: false },
            papers: { type: Boolean, default: false },
            serialNumber: { type: String }, // Will be masked in API
            productionYear: { type: String },
        },

        // D) Policies
        policy: {
            returnEnabled: { type: Boolean, default: false },
            returnDays: { type: Number, default: 0 },
            returnTerms: { type: String },
            codAvailable: { type: Boolean, default: false },
            freeShipping: { type: Boolean, default: false },
        },

        // E) Engagement
        engagement: {
            whatsappAvailable: { type: Boolean, default: false },
            videoCallAvailable: { type: Boolean, default: false },
        },

        // --- FILTER ATTRIBUTES ---
        size: { type: String }, // e.g. "7", "8", "9"
        color: { type: String }, // e.g. "Black", "Brown"
        material: { type: String }, // e.g. "Leather", "Synthetic"

    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);
