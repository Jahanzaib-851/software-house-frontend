"use client";

import axios from "axios";
import { toast } from "react-toastify";
import {
  getToken,
  removeTokens,
  setToken,
} from "./token";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const fetcher = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 30000, // 30 seconds
});

/* ================= REQUEST INTERCEPTOR ================= */
fetcher.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && !config.url.includes("/auth/refresh-token")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
fetcher.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🟢 HANDLING TIMEOUT
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      toast.error("🌐 Network is too slow. Please check your connection.");
      return Promise.reject(error);
    }

    // 🟢 AUTH REFRESH LOGIC (Token Expiry Handling)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        // Refresh token call
        const res = await axios.post(
          `${API_BASE}/auth/refresh-token`,
          {},
          { withCredentials: true, timeout: 20000 }
        );

        const accessToken = res.data?.data?.accessToken || res.data?.accessToken;

        if (!accessToken) throw new Error("No access token returned");

        setToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Re-try original request
        return fetcher(originalRequest);

      } catch (err) {
        console.error("🔴 Session expired or Refresh failed:", err);

        // Clear all session data
        removeTokens();

        if (typeof window !== "undefined") {
          // 🔥 Toast Alert before redirecting
          toast.error("🔒 Security Session Expired! Redirecting to Login...", {
            position: "top-center",
            autoClose: 2000,
            theme: "colored"
          });

          // 2 second delay taake user toast parh le
          setTimeout(() => {
            window.location.href = "/auth/login?session=expired";
          }, 2000);
        }
      }
    }

    // Server side validation errors ke liye toasts (optional)
    if (error.response?.status === 403) {
      toast.error("🚫 Access Denied: You don't have permission.");
    }

    return Promise.reject(error);
  }
);

export default fetcher;