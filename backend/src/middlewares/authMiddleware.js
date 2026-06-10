const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * WHY: Central auth gate for protected routes.
 * - Extracts Bearer token from Authorization header
 * - Verifies token signature + expiry
 * - Loads user from DB (source of truth)
 * - Attaches user to req.user so next controllers can trust it
 */
const protect = async (req, res, next) => {
    try {
        // WHY: If JWT secret not configured, auth can't work safely.
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: "Server misconfigured: JWT secret missing" });
        }

        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

        if (!token) {
            return res.status(401).json({ message: "Not authorized: token missing" });
        }

        let decoded;
        try {
            // WHY: jwt.verify checks token validity + expiry
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            // WHY: Separate expiry error for better UX
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Not authorized: token expired" });
            }
            return res.status(401).json({ message: "Not authorized: token invalid" });
        }

        // WHY: Always re-fetch user from DB (token might be valid but user deleted/disabled)
        const user = await User.findById(decoded.id).select("_id name email role isVerified createdAt");

        if (!user) {
            return res.status(401).json({ message: "Not authorized: user not found" });
        }

        // WHY: Controllers can now rely on req.user safely.
        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ message: "Auth middleware error", error: err.message });
    }
};

/**
 * WHY: Role-based authorization middleware
 * Example: authorize("admin") allows only admin.
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // WHY: authorize must always be used after protect.
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized: login required" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden: insufficient role",
                required: allowedRoles,
                current: req.user.role,
            });
        }

        next();
    };
};

/**
 * WHY: Brand/Dealer must be verified by Admin to use protected business features.
 * Use this after protect (and optionally after authorize).
 */
const requireVerifiedForBusinessRoles = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized: login required" });
    }

    const businessRoles = ["brand", "dealer"];
    const isBusinessUser = businessRoles.includes(req.user.role);

    if (isBusinessUser && !req.user.isVerified) {
        return res.status(403).json({
            message: "Account pending verification by Super Admin",
            code: "PENDING_VERIFICATION",
        });
    }

    next();
};

module.exports = { protect, authorize, requireVerifiedForBusinessRoles };
