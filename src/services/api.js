import axios from "axios";

// 1. Base URL set karein (Backend ka address)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor (Har request se pehle Token check karega)
api.interceptors.request.use(
  (config) => {
    // LocalStorage se token nikalo (agar user logged in hai)
    // Note: Make sure aap login ke waqt token ko 'accessToken' naam se save kar rahe hain
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor (Agar Token expire ho jaye to kya kare)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized (Token Invalid/Expired)
      console.error("Session Expired. Please login again.");
      // Optional: Redirect to login or clear storage
      // if (typeof window !== "undefined") localStorage.clear();
    }
    return Promise.reject(error);
  }
);

export default api;