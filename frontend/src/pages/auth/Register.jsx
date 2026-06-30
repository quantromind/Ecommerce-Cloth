import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
    const { login } = useAuth(); // We'll just login the user after auto-reg response if possible, or force login
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            await api.post("/api/users/register", form);
            // After register, auto login
            await login({ email: form.email, password: form.password });
            navigate("/");
        } catch (err) {
            setError(err?.response?.data?.message || "Registration failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-secondary relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-highlight/20 rounded-full blur-[100px]" />

            <div className="w-full max-w-md bg-black/5 backdrop-blur-xl border border-border-light rounded-3xl p-8 shadow-2xl relative z-10">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-text-main to-text-muted bg-clip-text text-transparent">
                        Join StyleCloth
                    </h1>
                    <p className="text-text-muted mt-2">Create your customer account</p>
                </div>

                {error && (
                    <div className="mb-6 text-sm bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-text-muted uppercase tracking-wider ml-1">Full Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            className="w-full mt-1 bg-primary/20 border border-border-light rounded-xl px-4 py-3 outline-none focus:border-highlight text-text-main"
                            placeholder="Adil Khan"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-text-muted uppercase tracking-wider ml-1">Email Address</label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={onChange}
                            type="email"
                            className="w-full mt-1 bg-primary/20 border border-border-light rounded-xl px-4 py-3 outline-none focus:border-highlight text-text-main"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-text-muted uppercase tracking-wider ml-1">Password</label>
                        <input
                            name="password"
                            value={form.password}
                            onChange={onChange}
                            type="password"
                            className="w-full mt-1 bg-primary/20 border border-border-light rounded-xl px-4 py-3 outline-none focus:border-highlight text-text-main"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        disabled={submitting}
                        className="w-full bg-highlight hover:bg-highlight/90 text-text-main font-bold py-3.5 rounded-xl shadow-lg shadow-highlight/20 transition-all mt-2 disabled:opacity-50"
                    >
                        {submitting ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-text-muted">
                    Already have an account?{" "}
                    <Link to="/login" className="text-highlight hover:underline">
                        Login here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
