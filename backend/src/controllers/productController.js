const Product = require("../models/Product");




// Helper to format product for public display
const formatProduct = (product) => {
    const p = product.toObject ? product.toObject() : product;

    // 1. Mask Serial Number
    if (p.trust?.serialNumber) {
        const len = p.trust.serialNumber.length;
        p.trust.serialNumber = len > 4
            ? "*".repeat(len - 4) + p.trust.serialNumber.slice(-4)
            : "****";
    }

    // 2. Calculate Pricing & Offers
    let finalPrice = p.price;
    let discountLabel = null;

    if (p.offer?.enabled) {
        const now = new Date();
        const start = p.offer.startDate ? new Date(p.offer.startDate) : null;
        const end = p.offer.endDate ? new Date(p.offer.endDate) : null;

        let isActive = true;
        // if (start && now < start) isActive = false; // Modified to show offers immediately
        if (end && now > end) isActive = false;

        if (isActive) {
            if (p.offer.type === "PERCENT") {
                const discountAmount = (p.price * p.offer.value) / 100;
                finalPrice = p.price - discountAmount;
                discountLabel = `${p.offer.value}% OFF`;
            } else if (p.offer.type === "FLAT") {
                finalPrice = p.price - p.offer.value;
                discountLabel = `₹${p.offer.value} OFF`;
            }
        }
    }

    // Ensure no negative price
    if (finalPrice < 0) finalPrice = 0;

    p.pricing = {
        mrp: p.price,
        sellingPrice: p.price, // Base price before offer
        finalPrice: finalPrice,
        discountLabel: discountLabel,
        isOnOffer: p.price !== finalPrice
    };

    return p;
};

// @desc    Get all products (Public - with search/filter)
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: "i",
                },
            }
            : {};

        const products = await Product.find({ ...keyword }).sort({ createdAt: -1 });
        const formattedProducts = products.map(formatProduct);
        res.json(formattedProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("creatorId", "name email");
        if (product) {
            res.json(formatProduct(product));
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product (Brand/Dealer only)
// @route   POST /api/products
// @desc    Create a product (Brand/Dealer only)
// @route   POST /api/products
const createProduct = async (req, res) => {
    try {
        const { name, price, description, images, video, brandName, category, stock,
            offer, warranty, trust, policy, engagement, // New fields
            collectionName, dialColor, dialSize, dialShape, caseMaterial, strapMaterial, movementType // Filter fields
        } = req.body;

        // Basic Validation
        if (offer?.enabled && offer?.endDate && offer?.startDate) {
            if (new Date(offer.endDate) <= new Date(offer.startDate)) {
                return res.status(400).json({ message: "Offer End Date must be after Start Date" });
            }
        }

        const product = new Product({
            name,
            price,
            description,
            images: images || [],
            video: video || "",
            brandName: brandName || req.user.name,
            category,
            stock,
            offer,
            warranty,
            trust,
            policy,
            engagement,
            collectionName, dialColor, dialSize, dialShape, caseMaterial, strapMaterial, movementType,
            creatorId: req.user._id,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my products (Brand/Dealer dashboard)
// @route   GET /api/products/my
const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ creatorId: req.user._id }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Update a product
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
    try {
        const { name, price, description, images, video, category, stock,
            offer, warranty, trust, policy, engagement,
            collectionName, dialColor, dialSize, dialShape, caseMaterial, strapMaterial, movementType
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            // Check ownership
            if (product.creatorId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Not authorized to update this product" });
            }

            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.category = category || product.category;
            product.stock = stock || product.stock;
            if (images) product.images = images;
            if (video !== undefined) product.video = video;

            // Update nested fields if provided
            if (offer) product.offer = offer;
            if (warranty) product.warranty = warranty;
            if (trust) product.trust = trust;
            if (policy) product.policy = policy;
            if (engagement) product.engagement = engagement;

            // Filter fields
            if (collectionName !== undefined) product.collectionName = collectionName;
            if (dialColor !== undefined) product.dialColor = dialColor;
            if (dialSize !== undefined) product.dialSize = dialSize;
            if (dialShape !== undefined) product.dialShape = dialShape;
            if (caseMaterial !== undefined) product.caseMaterial = caseMaterial;
            if (strapMaterial !== undefined) product.strapMaterial = strapMaterial;
            if (movementType !== undefined) product.movementType = movementType;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Delete a product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            if (product.creatorId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: "Not authorized to delete this product" });
            }
            await product.deleteOne();
            res.json({ message: "Product removed" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// @desc    Preview VTO processing (for Admin UI)


module.exports = {
    getProducts,
    getProductById,
    createProduct,
    getMyProducts,
    updateProduct,
    deleteProduct
};
