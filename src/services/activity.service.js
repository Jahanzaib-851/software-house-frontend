import fetcher from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";

/**
 * Activity API Service
 * Token auto‑attached via fetcher interceptor
 */

// 1. Get logged‑in user's activities
const getMyActivities = async (params = {}) => {
  const res = await fetcher.get(`${API_ENDPOINTS.ACTIVITIES}/me`, { params });
  return res.data;
};

// 2. Admin: get all activities
const getAllActivities = async (params = {}) => {
  const res = await fetcher.get(API_ENDPOINTS.ACTIVITIES, { params });
  return res.data;
};

// 3. Delete an activity (soft delete)
const deleteActivity = async (id) => {
  const res = await fetcher.delete(`${API_ENDPOINTS.ACTIVITIES}/${id}`);
  return res.data;
};

// Default Export
export default {
  getMyActivities,
  getAllActivities,
  deleteActivity,
  // ✅ Yeh line aapka error fix karegi: 
  // Ab agar aap frontend par .delete(id) likhein ya .deleteActivity(id), dono chalenge.
  delete: deleteActivity,
};