const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const helmet = require("helmet");
const { notFound, errorHandler } = require("./src/middlewares/errorMiddleware");

const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");

dotenv.config();

const app = express();

// WHY: JSON limit prevents payload abuse attacks
app.use(express.json({ limit: "50mb" })); // Increased for image uploads
// WHY: basic security headers
app.use(helmet());

// Logs only in dev
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// ROUTES
app.use("/api/users", authRoutes); // /login
app.use("/api/users", userRoutes); // /me
app.use("/api/products", productRoutes);
app.use("/api/products", reviewRoutes); // /api/products/:id/reviews
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes); // /stats
app.use("/api/wishlist", require("./src/routes/wishlistRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;

