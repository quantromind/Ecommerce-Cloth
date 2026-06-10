const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const User = require('./src/models/User');
require('dotenv').config();

const seedProducts = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas!');

        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            // Fallback: create Admin if missing
            const email = process.env.ADMIN_EMAIL || "admin@Paytan.com";
            const password = process.env.ADMIN_PASSWORD || "admin123";
            // Check if this email exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                admin = existingUser;
                admin.role = 'admin';
                await admin.save();
                console.log('✅ Updated existing user to Admin');
            } else {
                admin = await User.create({
                    name: "Paytan Owner",
                    email,
                    password,
                    role: "admin",
                    isVerified: true
                });
                console.log('✅ Created Admin user for seeding');
            }
        }

        const creatorId = admin._id;

        // Clean existing products
        console.log('Clearing existing products...');
        await Product.deleteMany({});
        console.log('✅ Cleared old products');

        // Product list to seed
        const demoProducts = [
            {
                creatorId,
                brandName: "Paytan Men's",
                name: "Premium Kolhapuri Chappal",
                category: "Chappals",
                price: 1500,
                images: ["/images/kolhapuri_chappal_1781072032688.png"],
                description: "Handcrafted traditional Kolhapuri Chappal made with genuine premium leather. Perfect for ethnic wear and daily use.",
                size: "8",
                color: "Brown",
                material: "Leather",
                stock: 25,
                offer: {
                    enabled: true,
                    type: "PERCENT",
                    value: 10
                },
                trust: {
                    authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" },
                    condition: { type: "NEW" },
                    box: true,
                    papers: true
                },
                isFeatured: true
            },
            {
                creatorId,
                brandName: "Paytan Men's",
                name: "Classic Formal Loafers",
                category: "Formal",
                price: 2200,
                images: ["/images/formal_loafers_1781072056333.png"],
                description: "Elegant dark brown formal leather loafers, designed for ultimate comfort and professional styling.",
                size: "9",
                color: "Dark Brown",
                material: "Leather",
                stock: 15,
                offer: {
                    enabled: false
                },
                trust: {
                    authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" },
                    condition: { type: "NEW" },
                    box: true,
                    papers: true
                },
                isFeatured: true
            },
            {
                creatorId,
                brandName: "Paytan Men's",
                name: "Executive Black Oxfords",
                category: "Formal",
                price: 2500,
                images: ["/images/oxford_shoes_1781072071635.png"],
                description: "Sleek and sophisticated black oxford shoes with a polished finish. A must-have for your formal wardrobe.",
                size: "10",
                color: "Black",
                material: "Leather",
                stock: 20,
                offer: {
                    enabled: true,
                    type: "FLAT",
                    value: 200
                },
                trust: {
                    authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" },
                    condition: { type: "NEW" },
                    box: true,
                    papers: true
                },
                isFeatured: true
            },
            {
                creatorId,
                brandName: "Paytan Men's",
                name: "Casual White Sneakers",
                category: "Sneakers",
                price: 1800,
                images: ["/images/casual_sneakers_1781072086142.png"],
                description: "Comfortable and stylish casual white sneakers. Perfect for everyday wear, featuring premium synthetic material.",
                size: "8",
                color: "White",
                material: "Synthetic",
                stock: 30,
                offer: {
                    enabled: false
                },
                trust: {
                    authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" },
                    condition: { type: "NEW" },
                    box: true,
                    papers: true
                },
                isFeatured: true
            }
        ];

        console.log('Inserting seed products...');
        const inserted = await Product.insertMany(demoProducts);
        console.log(`✅ Successfully seeded ${inserted.length} products!`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
