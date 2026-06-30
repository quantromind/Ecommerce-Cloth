import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import CartDrawer from "./components/layout/CartDrawer";

// Public Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/auth/Login";
import AdminLogin from "./pages/auth/AdminLogin";
import Register from "./pages/auth/Register";

import PendingApproval from "./pages/system/PendingApproval";

// Protected Pages
import Checkout from "./pages/Checkout";

// Admin Facets
import AdminDashboard from "./pages/dashboards/AdminDashboard";


// Other Facets
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import OrderList from "./pages/customer/OrderList";
import Wishlist from "./pages/customer/Wishlist";

import MyInventory from "./pages/dashboards/MyInventory";
import MySales from "./pages/dashboards/MySales";

const Unauthorized = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-secondary text-text-main flex items-center justify-center">
      <div className="bg-secondary border border-border-light p-6 rounded-2xl text-center">
        <h1 className="text-xl font-bold">Unauthorized</h1>
        <p className="text-sm opacity-80 mt-2">You do not have access to this page.</p>
        <div className="mt-6 flex justify-center gap-4">
          <button onClick={() => window.location.href = '/'} className="text-sm text-text-muted hover:text-text-main underline">Go Home</button>
          <button
            onClick={() => { logout(); window.location.href = '/login'; }}
            className="bg-highlight hover:bg-highlight/80 text-text-main px-4 py-2 rounded-lg text-sm font-bold transition"
          >
            Logout / Switch Account
          </button>
        </div>
      </div>
    </div>
  );
};



const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />

            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/admin-login" element={<AdminLogin />} />

            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Shared Routes (Checkout) */}
            <Route element={<ProtectedRoute allowedRoles={["customer", "admin"]} />}>
              <Route path="/checkout" element={<Checkout />} />
            </Route>

            {/* Dashboard Layout Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                  <Route path="admin">
                    <Route index element={<AdminDashboard />} />
                    <Route path="inventory" element={<MyInventory />} />
                    <Route path="sales" element={<MySales />} />
                  </Route>
                </Route>

                {/* Customer Dashboard */}
                <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
                  <Route path="/customer" element={<CustomerDashboard />} />
                  <Route path="/customer/orders" element={<OrderList />} />
                  <Route path="/customer/wishlist" element={<Wishlist />} />
                </Route>

              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <CartDrawer />
          <Toaster
            position="top-right"
            containerStyle={{
              top: 90,
            }}
            toastOptions={{
              duration: 1000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
