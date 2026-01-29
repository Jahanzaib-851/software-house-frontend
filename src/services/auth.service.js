import fetcher from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";

const authService = {
  // 1. Get Current User Profile
  me: async () => {
    try {
      const res = await fetcher.get(API_ENDPOINTS.AUTH_ME || "/auth/me");
      return res.data?.data || res.data;
    } catch (error) {
      throw error;
    }
  },

  // 2. Register New User
  register: async (userData) => {
    const res = await fetcher.post(API_ENDPOINTS.AUTH_REGISTER, userData);
    return res.data;
  },

  // 3. Login User
  login: async (credentials) => {
    const res = await fetcher.post(API_ENDPOINTS.AUTH_LOGIN, credentials);
    const tokenData = res.data?.data || res.data;

    // LocalStorage mein tokens save karna
    if (tokenData.accessToken) {
      localStorage.setItem("accessToken", tokenData.accessToken);
      localStorage.setItem("refreshToken", tokenData.refreshToken);
    }
    return tokenData;
  },

  // 4. Logout User
  logout: async () => {
    try {
      await fetcher.post(API_ENDPOINTS.AUTH_LOGOUT).catch(() => null);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    return { success: true };
  },

  // 5. Refresh Token Logic
  refreshToken: async () => {
    const token = localStorage.getItem("refreshToken");
    if (!token) throw new Error("No refresh token found");

    try {
      const res = await fetcher.post(API_ENDPOINTS.AUTH_REFRESH, { refreshToken: token });
      const newData = res.data?.data || res.data;

      localStorage.setItem("accessToken", newData.accessToken);
      localStorage.setItem("refreshToken", newData.refreshToken);
      return newData;
    } catch (error) {
      localStorage.clear();
      throw error;
    }
  },

  // 6. Forgot Password (Requesting OTP)
  forgotPassword: async (email) => {
    // Backend expects: { email: "..." }
    const res = await fetcher.post(API_ENDPOINTS.AUTH_FORGOT_PASSWORD, { email });
    return res.data;
  },

  // 7. Reset Password (Sending OTP & New Password) - FIXED
  resetPassword: async ({ email, otp, newPassword }) => {
    // Backend expects: { email, otp, newPassword }
    const res = await fetcher.post(API_ENDPOINTS.AUTH_RESET_PASSWORD, {
      email,
      otp,
      newPassword,
    });
    return res.data;
  },

  // 8. Delete Test User (Utility)
  deleteTestUser: async (email) => {
    const res = await fetcher.delete(API_ENDPOINTS.AUTH_DELETE_TEST_USER, {
      data: { email },
    });
    return res.data;
  },
};

export default authService;