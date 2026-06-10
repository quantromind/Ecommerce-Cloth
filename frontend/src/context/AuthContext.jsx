import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "watchstore_auth";

const safeParse = (v) => {
    try { return JSON.parse(v); } catch { return null; }
};

export const AuthProvider = ({ children }) => {
    const stored = safeParse(localStorage.getItem(STORAGE_KEY));
    const [token, setToken] = useState(stored?.token || null);
    const [user, setUser] = useState(stored?.user || null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isAuthenticated = !!token;

    const persist = (t, u) => {
        setToken(t);
        setUser(u);
        if (!t) localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: t, user: u }));
    };

    const logout = () => {
        persist(null, null);
        window.location.href = "/";
    };

    const login = async ({ email, password }) => {
        setError(null);
        try {
            const { data } = await api.post("/api/users/login", { email, password });
            persist(data.token, data);
            return { ok: true, data };
        } catch (err) {
            const msg = err?.response?.data?.message || "Login failed";
            setError(msg);
            return { ok: false, code: err?.response?.data?.code, message: msg };
        }
    };

    const register = async ({ name, email, password }) => {
        setError(null);
        try {
            const { data } = await api.post("/api/users/register", { name, email, password });
            persist(data.token, data);
            return { ok: true };
        } catch (err) {
            const msg = err?.response?.data?.message || "Registration failed";
            setError(msg);
            return { ok: false, message: msg };
        }
    };

    const googleLogin = async (credential) => {
        setError(null);
        try {
            const { data } = await api.post("/api/users/google", { credential });
            persist(data.token, data);
            return { ok: true };
        } catch (err) {
            const msg = err?.response?.data?.message || "Google login failed";
            setError(msg);
            return { ok: false, code: err?.response?.data?.code, message: msg };
        }
    };

    // refresh: optional later (/me)
    useEffect(() => {
        setLoading(false);
    }, []);

    const value = useMemo(
        () => ({ user, token, loading, error, isAuthenticated, login, register, googleLogin, logout }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user, token, loading, error, isAuthenticated]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
