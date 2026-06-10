import axios from "axios";

/**
 * WHY: One axios instance = consistent baseURL + headers + error handling.
 */
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically from localStorage
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("watchstore_auth");
    const parsed = raw ? JSON.parse(raw) : null;
    const token = parsed?.token;

    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // ignore
  }
  return config;
});
