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
            const email = process.env.ADMIN_EMAIL || "admin@stylecloth.com";
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
                    name: "StyleCloth Admin",
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

        // Product list to seed (Expanded Categories)
        const demoProducts = [
            // T-SHIRTS
            {
                creatorId, brandName: "StyleCloth Originals", name: "Premium Cotton White T-Shirt", category: "T-Shirts", price: 799,
                images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"],
                description: "Experience ultimate comfort with our premium 100% cotton t-shirt.", size: "M", color: "White", material: "Cotton", stock: 50,
                offer: { enabled: true, type: "PERCENT", value: 10 }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: true
            },
            {
                creatorId, brandName: "Urban Edge", name: "Graphic Print Black Tee", category: "T-Shirts", price: 999,
                images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop"],
                description: "Bold graphic tee for a standout streetwear look.", size: "L", color: "Black", material: "Cotton Blend", stock: 30,
                offer: { enabled: false }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: false
            },
            
            // JEANS
            {
                creatorId, brandName: "StyleCloth Originals", name: "Classic Blue Denim Jeans", category: "Jeans", price: 2499,
                images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop"],
                description: "Timeless straight-fit blue denim jeans.", size: "32", color: "Blue", material: "Denim", stock: 30,
                offer: { enabled: false }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: true }, isFeatured: true
            },
            {
                creatorId, brandName: "Urban Edge", name: "Distressed Black Skinny Jeans", category: "Jeans", price: 2799,
                images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop"],
                description: "Modern distressed denim for an edgy look.", size: "30", color: "Black", material: "Denim", stock: 20,
                offer: { enabled: true, type: "FLAT", value: 300 }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: false
            },

            // SHIRTS
            {
                creatorId, brandName: "StyleCloth Elite", name: "Formal White Shirt", category: "Shirts", price: 1599,
                images: ["https://images.unsplash.com/photo-1626497764746-6dc36546b388?q=80&w=800&auto=format&fit=crop"],
                description: "Sleek and sophisticated white formal shirt.", size: "L", color: "White", material: "Cotton Blend", stock: 40,
                offer: { enabled: true, type: "FLAT", value: 200 }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: true, papers: true }, isFeatured: true
            },
            {
                creatorId, brandName: "LuxeWear", name: "Casual Plaid Flannel Shirt", category: "Shirts", price: 1899,
                images: ["https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop"],
                description: "Comfortable and warm flannel shirt for everyday wear.", size: "XL", color: "Red/Black", material: "Flannel", stock: 25,
                offer: { enabled: false }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: true
            },

            // JACKETS
            {
                creatorId, brandName: "StyleCloth Winter", name: "Leather Biker Jacket", category: "Jackets", price: 4999,
                images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop"],
                description: "Stylish and edgy black leather jacket with asymmetrical zip closure.", size: "XL", color: "Black", material: "Leather", stock: 15,
                offer: { enabled: false }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: true, papers: true }, isFeatured: true
            },
            {
                creatorId, brandName: "Urban Edge", name: "Classic Denim Jacket", category: "Jackets", price: 3499,
                images: ["https://images.unsplash.com/photo-1495105787522-5334e3ffa0ea?q=80&w=800&auto=format&fit=crop"],
                description: "Versatile blue denim jacket. A wardrobe staple.", size: "M", color: "Blue", material: "Denim", stock: 22,
                offer: { enabled: true, type: "PERCENT", value: 15 }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: false
            },

            // TROUSERS
            {
                creatorId, brandName: "StyleCloth Elite", name: "Tailored Chino Pants", category: "Trousers", price: 2199,
                images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop"],
                description: "Smart and comfortable khaki chinos for office or casual outings.", size: "34", color: "Khaki", material: "Cotton Twill", stock: 35,
                offer: { enabled: false }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: true
            },

            // ACTIVEWEAR
            {
                creatorId, brandName: "FitCore", name: "Performance Running Shorts", category: "Activewear", price: 1299,
                images: ["https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800&auto=format&fit=crop"],
                description: "Lightweight and breathable shorts designed for high-intensity workouts.", size: "M", color: "Grey", material: "Polyester", stock: 45,
                offer: { enabled: true, type: "FLAT", value: 150 }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: false
            },
            {
                creatorId, brandName: "FitCore", name: "Moisture-Wicking Gym Tee", category: "Activewear", price: 1099,
                images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop"],
                description: "Stay cool and dry with our advanced moisture-wicking fabric technology.", size: "L", color: "Navy Blue", material: "Polyester Blend", stock: 50,
                offer: { enabled: false }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: true
            },

            // ETHNIC WEAR
            {
                creatorId, brandName: "Tradition Threads", name: "Embroidered Silk Kurta", category: "Ethnic Wear", price: 3999,
                images: ["https://images.unsplash.com/photo-1597983073493-88ec35a4afc0?q=80&w=800&auto=format&fit=crop"],
                description: "Elegant silk kurta with intricate embroidery for festive occasions.", size: "L", color: "Maroon", material: "Silk", stock: 12,
                offer: { enabled: true, type: "PERCENT", value: 20 }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: true, papers: true }, isFeatured: true
            },

            // WINTER WEAR
            {
                creatorId, brandName: "StyleCloth Winter", name: "Cozy Woolen Sweater", category: "Winter Wear", price: 2899,
                images: ["https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?q=80&w=800&auto=format&fit=crop"],
                description: "Keep warm and stylish with this chunky knit woolen sweater.", size: "M", color: "Beige", material: "Wool", stock: 25,
                offer: { enabled: false }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: true
            },
            {
                creatorId, brandName: "StyleCloth Winter", name: "Premium Trench Coat", category: "Winter Wear", price: 6599,
                images: ["https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=800&auto=format&fit=crop"],
                description: "A classic trench coat tailored for a sharp winter look.", size: "L", color: "Camel", material: "Wool Blend", stock: 10,
                offer: { enabled: true, type: "FLAT", value: 500 }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: true, papers: true }, isFeatured: true
            },
            
            // --- MORE ADDED ITEMS ---

            // MORE T-SHIRTS
            {
                creatorId, brandName: "Urban Edge", name: "Vintage Oversized Tee", category: "T-Shirts", price: 1199,
                images: ["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop"],
                description: "Trendy oversized fit with a vintage wash.", size: "XL", color: "Grey", material: "Cotton", stock: 60,
                offer: { enabled: true, type: "PERCENT", value: 15 }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: false
            },
            {
                creatorId, brandName: "StyleCloth Originals", name: "V-Neck Basic Tee", category: "T-Shirts", price: 699,
                images: ["https://images.unsplash.com/photo-1527719327859-c6ce80353573?q=80&w=800&auto=format&fit=crop"],
                description: "Essential V-neck t-shirt for daily layering.", size: "M", color: "Navy", material: "Cotton", stock: 100,
                offer: { enabled: false }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: false
            },

            // MORE SHIRTS
            {
                creatorId, brandName: "LuxeWear", name: "Linen Summer Shirt", category: "Shirts", price: 1799,
                images: ["https://images.unsplash.com/photo-1602810319428-019690571b5b?q=80&w=800&auto=format&fit=crop"],
                description: "Breathable linen shirt perfect for summer vacations.", size: "L", color: "Light Blue", material: "Linen", stock: 25,
                offer: { enabled: true, type: "FLAT", value: 300 }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: true
            },
            {
                creatorId, brandName: "StyleCloth Elite", name: "Striped Office Shirt", category: "Shirts", price: 1699,
                images: ["https://images.unsplash.com/photo-1598032895397-b9472444bf93?q=80&w=800&auto=format&fit=crop"],
                description: "Professional striped shirt with a crisp collar.", size: "M", color: "Blue/White", material: "Cotton Blend", stock: 45,
                offer: { enabled: false }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: true, papers: false }, isFeatured: false
            },

            // MORE JACKETS
            {
                creatorId, brandName: "Urban Edge", name: "Camouflage Bomber Jacket", category: "Jackets", price: 3299,
                images: ["https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=800&auto=format&fit=crop"],
                description: "Street-style bomber jacket with camo print.", size: "L", color: "Green Camo", material: "Polyester", stock: 20,
                offer: { enabled: true, type: "PERCENT", value: 10 }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: true
            },
            {
                creatorId, brandName: "StyleCloth Winter", name: "Puffer Winter Jacket", category: "Jackets", price: 4599,
                images: ["https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop"],
                description: "Ultra-warm puffer jacket for extreme cold.", size: "XL", color: "Yellow", material: "Nylon", stock: 15,
                offer: { enabled: true, type: "FLAT", value: 1000 }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: true
            },

            // MORE JEANS & TROUSERS
            {
                creatorId, brandName: "StyleCloth Originals", name: "Slim Fit Black Jeans", category: "Jeans", price: 2199,
                images: ["https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=800&auto=format&fit=crop"],
                description: "Versatile slim fit jeans in deep black.", size: "32", color: "Black", material: "Denim", stock: 40,
                offer: { enabled: false }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: false
            },
            {
                creatorId, brandName: "LuxeWear", name: "Formal Grey Trousers", category: "Trousers", price: 1999,
                images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop"],
                description: "Premium grey trousers for a sharp, formal look.", size: "34", color: "Grey", material: "Wool Blend", stock: 30,
                offer: { enabled: false }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: true, papers: false }, isFeatured: true
            },

            // ETHNIC & ACTIVEWEAR
            {
                creatorId, brandName: "Tradition Threads", name: "Designer Printed Kurta", category: "Ethnic Wear", price: 2499,
                images: ["https://images.unsplash.com/photo-1610427306202-b2f1559810f6?q=80&w=800&auto=format&fit=crop"],
                description: "Vibrant printed kurta for festive and casual traditional wear.", size: "M", color: "Mustard", material: "Cotton Silk", stock: 20,
                offer: { enabled: true, type: "PERCENT", value: 25 }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: false
            },
            {
                creatorId, brandName: "FitCore", name: "Compression Training Tights", category: "Activewear", price: 1499,
                images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop"],
                description: "High-performance compression tights for leg support.", size: "L", color: "Black", material: "Spandex", stock: 35,
                offer: { enabled: false }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: false
            },

            // --- EVEN MORE ITEMS ---
            
            {
                creatorId, brandName: "StyleCloth Originals", name: "Classic Polo T-Shirt", category: "T-Shirts", price: 899,
                images: ["https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=800&auto=format&fit=crop"],
                description: "Smart casual polo t-shirt with a comfortable fit.", size: "M", color: "Navy Blue", material: "Cotton Blend", stock: 80,
                offer: { enabled: true, type: "PERCENT", value: 10 }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: true
            },
            {
                creatorId, brandName: "Urban Edge", name: "Graphic Pullover Hoodie", category: "Winter Wear", price: 1999,
                images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop"],
                description: "Cozy fleece hoodie featuring a bold urban graphic print.", size: "L", color: "Grey", material: "Fleece", stock: 40,
                offer: { enabled: false }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: true
            },
            {
                creatorId, brandName: "StyleCloth Elite", name: "Tailored Navy Blazer", category: "Jackets", price: 5499,
                images: ["https://images.unsplash.com/photo-1594938291221-94f18cbb5660?q=80&w=800&auto=format&fit=crop"],
                description: "Premium tailored blazer for formal and semi-formal occasions.", size: "40", color: "Navy", material: "Wool Blend", stock: 15,
                offer: { enabled: true, type: "FLAT", value: 800 }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: true, papers: true }, isFeatured: true
            },
            {
                creatorId, brandName: "Urban Edge", name: "Lightweight Windbreaker", category: "Jackets", price: 2199,
                images: ["https://images.unsplash.com/photo-1545594861-3bef43679d62?q=80&w=800&auto=format&fit=crop"],
                description: "Water-resistant windbreaker perfect for unpredictable weather.", size: "M", color: "Red/Black", material: "Nylon", stock: 25,
                offer: { enabled: false }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: false
            },
            {
                creatorId, brandName: "FitCore", name: "Athletic Track Pants", category: "Activewear", price: 1399,
                images: ["https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop"],
                description: "Flexible track pants with zipper pockets for workouts and runs.", size: "L", color: "Black", material: "Polyester", stock: 50,
                offer: { enabled: true, type: "PERCENT", value: 20 }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: false
            },
            {
                creatorId, brandName: "StyleCloth Originals", name: "Utility Cargo Pants", category: "Trousers", price: 2399,
                images: ["https://images.unsplash.com/photo-1620616169527-7cd5048d88e0?q=80&w=800&auto=format&fit=crop"],
                description: "Durable cargo pants with multiple utility pockets.", size: "32", color: "Olive Green", material: "Cotton Twill", stock: 30,
                offer: { enabled: false }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: true
            },
            {
                creatorId, brandName: "Tradition Threads", name: "Embroidered Sherwani", category: "Ethnic Wear", price: 8999,
                images: ["https://images.unsplash.com/photo-1599596328399-556487e4129b?q=80&w=800&auto=format&fit=crop"],
                description: "Luxurious embroidered sherwani for weddings and grand festivities.", size: "XL", color: "Cream/Gold", material: "Silk Blend", stock: 5,
                offer: { enabled: true, type: "FLAT", value: 1500 }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: true, papers: true }, isFeatured: true
            },
            {
                creatorId, brandName: "LuxeWear", name: "Silk Blend Patterned Shirt", category: "Shirts", price: 2799,
                images: ["https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800&auto=format&fit=crop"],
                description: "Eye-catching patterned shirt made from a luxurious silk blend.", size: "M", color: "Multicolor", material: "Silk Blend", stock: 18,
                offer: { enabled: false }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: true
            },
            {
                creatorId, brandName: "Urban Edge", name: "Ripped Denim Shorts", category: "Jeans", price: 1299,
                images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop"],
                description: "Casual distressed denim shorts for a relaxed summer vibe.", size: "30", color: "Light Blue", material: "Denim", stock: 45,
                offer: { enabled: true, type: "PERCENT", value: 25 }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: false
            },
            {
                creatorId, brandName: "StyleCloth Winter", name: "Chunky Knit Cardigan", category: "Winter Wear", price: 3499,
                images: ["https://images.unsplash.com/photo-1434389678369-e840cb19b139?q=80&w=800&auto=format&fit=crop"],
                description: "Warm and stylish chunky knit cardigan, perfect for layering.", size: "L", color: "Burgundy", material: "Wool", stock: 20,
                offer: { enabled: false }, trust: { authenticity: { guarantee: true, verifiedBy: "IN_HOUSE" }, condition: { type: "NEW" }, box: false, papers: false }, isFeatured: true
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
