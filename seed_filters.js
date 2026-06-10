const mongoose = require('mongoose');
const Product = require('./backend/src/models/Product');
require('dotenv').config({ path: './backend/.env' });

const seedFilters = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const products = await Product.find({});
        console.log(`Found ${products.length} products`);

        const sizes = ["7", "8", "9", "10", "11"];
        const colors = ["Black", "Brown", "Dark Brown", "Tan", "White"];
        const materials = ["Leather", "Synthetic", "Canvas", "Suede"];

        for (let i = 0; i < products.length; i++) {
            const p = products[i];

            // Randomly assign attributes if missing
            if (!p.size) p.size = sizes[Math.floor(Math.random() * sizes.length)];
            if (!p.color) p.color = colors[Math.floor(Math.random() * colors.length)];
            if (!p.material) p.material = materials[Math.floor(Math.random() * materials.length)];

            await p.save();
            console.log(`Updated ${p.name}`);
        }

        console.log("Seeding complete");
        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

seedFilters();
