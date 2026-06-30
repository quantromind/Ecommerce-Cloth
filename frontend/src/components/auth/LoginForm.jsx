import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import PublicNavbar from "../public/PublicNavbar";
import Footer from "../public/Footer";

const LoginForm = ({ role, title, showRegisterLink = false }) => {
    const { login, error } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Form state
    const [form, setForm] = useState({ email: "", password: "" });
    const [submitting, setSubmitting] = useState(false);
    const [localError, setLocalError] = useState(null);

    const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);

        if (!form.email || !form.password) {
            setLocalError("Please enter email and password.");
            return;
        }

        setSubmitting(true);

        // Pass the fixed role to login logic
        const loginData = { ...form, role: role };
        const res = await login(loginData);
        setSubmitting(false);

        if (!res.ok) {
            if (res.code === "PENDING_APPROVAL") navigate("/pending-approval", { replace: true });
            return;
        }

        // Verify the backend returned the role we expected (or authorized)
        const userRole = res.data?.role;

        // Redirect Logic
        if (location.state?.from) {
            // If redirecting to checkout, ensure user is customer
            if (location.state.from === "/checkout" && userRole !== "customer") {
                toast.error("Only customers can checkout. You logged in as " + userRole);
            } else {
                navigate(location.state.from, { state: location.state, replace: true });
                return;
            }
        }

        // Dashboard Redirects
        if (userRole === "admin") navigate("/admin", { replace: true });
        else navigate("/customer/orders", { replace: true });
    };

    return (
        <div className="min-h-screen flex flex-col bg-secondary relative overflow-x-hidden">
            <PublicNavbar />
            
            <div className="flex-1 flex items-center justify-center p-4 relative w-full">
                {/* Background Blobs */}
                <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-highlight/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="w-full max-w-md bg-black/5 backdrop-blur-xl border border-border-light rounded-3xl p-8 shadow-2xl relative z-10 my-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-text-main tracking-tight">
                        {role === "customer" ? "Welcome Back" : title}
                    </h1>
                    {role !== "customer" && (
                        <p className="text-text-muted mt-2 text-xs uppercase tracking-widest opacity-70">
                            Restricted Access Portal
                        </p>
                    )}
                    {role === "customer" && (
                        <p className="text-text-muted mt-2 text-sm">
                            Sign in to access your wishlist, orders, and more.
                        </p>
                    )}
                </div>

                {(localError || error) && (
                    <div className="mb-6 text-sm bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg text-center animate-pulse">
                        {localError || error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Email Address</label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={onChange}
                            type="email"
                            className="w-full bg-primary/40 border border-border-light rounded-xl px-4 py-3.5 outline-none focus:border-accent focus:ring-1 focus:ring-[#D4AF37] transition-all text-text-main placeholder-gray-600 focus:bg-primary/60"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Password</label>
                        <input
                            name="password"
                            value={form.password}
                            onChange={onChange}
                            type="password"
                            className="w-full bg-primary/40 border border-border-light rounded-xl px-4 py-3.5 outline-none focus:border-accent focus:ring-1 focus:ring-[#D4AF37] transition-all text-text-main placeholder-gray-600 focus:bg-primary/60"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        disabled={submitting}
                        className="w-full bg-accent hover:bg-[#b5952f] text-black font-bold py-4 rounded-xl shadow-lg shadow-accent/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm mt-4"
                    >
                        {submitting ? "Authenticating..." : role === "customer" ? "Sign In" : "Access Dashboard"}
                    </button>
                </form>

                {showRegisterLink && (
                    <div className="mt-8 text-center text-sm text-text-muted">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-accent font-bold hover:underline ml-1">
                            Join Now
                        </Link>
                    </div>
                )}
            </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default LoginForm;
