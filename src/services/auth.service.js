import fetcher from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";

const authService = {
  me: async () => {
    try {
      const res = await fetcher.get(API_ENDPOINTS.AUTH_ME || "/auth/me");
      return res.data?.data || res.data;
    } catch (error) { throw error; }
  },

  register: async (userData) => {
    const res = await fetcher.post(API_ENDPOINTS.AUTH_REGISTER, userData);
    return res.data;
  },

  login: async (credentials) => {
    const res = await fetcher.post(API_ENDPOINTS.AUTH_LOGIN, credentials);
    const tokenData = res.data?.data || res.data;

    // Yahan ensure karein ke aap wahi keys use kar rahe hain jo LoginPage mein hain
    if (tokenData.accessToken) {
      localStorage.setItem("accessToken", tokenData.accessToken);
      localStorage.setItem("refreshToken", tokenData.refreshToken);
    }
    return tokenData;
  },

  logout: async () => {
    try {
      await fetcher.post(API_ENDPOINTS.AUTH_LOGOUT).catch(() => null);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    return { success: true };
  },

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

  forgotPassword: async (email) => {
    const res = await fetcher.post(API_ENDPOINTS.AUTH_FORGOT_PASSWORD, { email });
    return res.data;
  },

  resetPassword: async (data) => {
    const res = await fetcher.post(API_ENDPOINTS.AUTH_RESET_PASSWORD, data);
    return res.data;
  },

  deleteTestUser: async (email) => {
    const res = await fetcher.delete(API_ENDPOINTS.AUTH_DELETE_TEST_USER, {
      data: { email }
    });
    return res.data;
  },
};

export default authService;