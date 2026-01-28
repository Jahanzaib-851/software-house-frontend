import fetcher from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";

/**
 * User API Service
 * Token auto‑attached via fetcher interceptor
 */

// Create user (admin)
const createUser = async (data) => {
  const res = await fetcher.post(API_ENDPOINTS.USERS, data);
  return res.data;
};

// Get logged‑in user profile
const getMyProfile = async () => {
  const res = await fetcher.get(`${API_ENDPOINTS.USERS}/me`);
  return res.data;
};

// Update logged‑in user profile
const updateMyProfile = async (data) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.USERS}/me`, data);
  return res.data;
};

// Upload avatar
const updateMyAvatar = async (formData) => {
  const res = await fetcher.patch(
    `${API_ENDPOINTS.USERS}/me/avatar`,
    formData,
    {
      headers: { "Content‑Type": "multipart/form‑data" },
    }
  );
  return res.data;
};

// Upload cover image
const updateMyCoverImage = async (formData) => {
  const res = await fetcher.patch(
    `${API_ENDPOINTS.USERS}/me/cover`,
    formData,
    {
      headers: { "Content‑Type": "multipart/form‑data" },
    }
  );
  return res.data;
};

// Admin: get all users
const getUsers = async (params = {}) => {
  const res = await fetcher.get(API_ENDPOINTS.USERS, { params });
  return res.data;
};

// Admin: get user by ID
const getUserById = async (id) => {
  const res = await fetcher.get(`${API_ENDPOINTS.USERS}/${id}`);
  return res.data;
};

// Admin: update user by ID
const updateUserByAdmin = async (id, data) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.USERS}/${id}`, data);
  return res.data;
};

// Admin: delete user
const deleteUser = async (id) => {
  const res = await fetcher.delete(`${API_ENDPOINTS.USERS}/${id}`);
  return res.data;
};

export default {
  createUser,
  getMyProfile,
  updateMyProfile,
  updateMyAvatar,
  updateMyCoverImage,
  getUsers,
  getUserById,
  updateUserByAdmin,
  deleteUser,
};
