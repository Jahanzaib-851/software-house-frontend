import fetcher from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";

/**
 * Settings API Service
 * Token auto‑attached via fetcher interceptor
 */

// Get general settings
const getSettings = async () => {
  const res = await fetcher.get(API_ENDPOINTS.SETTINGS);
  return res.data;
};

// Update general settings
const updateSettings = async (data) => {
  const res = await fetcher.patch(API_ENDPOINTS.SETTINGS, data);
  return res.data;
};

// Update email settings
const updateEmailSettings = async (data) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.SETTINGS}/email`, data);
  return res.data;
};

// Update security settings
const updateSecuritySettings = async (data) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.SETTINGS}/security`, data);
  return res.data;
};

export default {
  getSettings,
  updateSettings,
  updateEmailSettings,
  updateSecuritySettings,
};
