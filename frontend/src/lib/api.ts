import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("stayease-token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log(`[DEBUG] Request Interceptor: Attached token to ${config.url}`, token.substring(0, 10) + "...");
        } else {
            console.log(`[DEBUG] Request Interceptor: No token found for ${config.url}`);
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("stayease-token");
                localStorage.removeItem("stayease-user");
            }
        }
        return Promise.reject(error);
    }
);

export default api;
