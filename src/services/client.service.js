import fetcher from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";

/**
 * Client API Service
 */

const createClient = async (data) => {
  // ZARURI: Agar data FormData hai toh headers set karne parenge
  const config = data instanceof FormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};

  const res = await fetcher.post(API_ENDPOINTS.CLIENTS, data, config);
  return res.data;
};

// Get logged-in client profile
const getMyProfile = async () => {
  const res = await fetcher.get(`${API_ENDPOINTS.CLIENTS}/me`);
  return res.data;
};

const updateMyProfile = async (data) => {
  const config = data instanceof FormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};

  const res = await fetcher.patch(`${API_ENDPOINTS.CLIENTS}/me`, data, config);
  return res.data;
};

// Upload avatar
const updateAvatar = async (formData) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.CLIENTS}/me/avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Upload cover image
const updateCoverImage = async (formData) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.CLIENTS}/me/cover`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ADMIN APIs
const getClients = async (params = {}) => {
  const res = await fetcher.get(API_ENDPOINTS.CLIENTS, { params });
  return res.data;
};

const getClientById = async (id) => {
  const res = await fetcher.get(`${API_ENDPOINTS.CLIENTS}/${id}`);
  return res.data;
};

const updateClientByAdmin = async (id, data) => {
  const config = data instanceof FormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};

  const res = await fetcher.patch(`${API_ENDPOINTS.CLIENTS}/${id}`, data, config);
  return res.data;
};

const deleteClient = async (id) => {
  const res = await fetcher.delete(`${API_ENDPOINTS.CLIENTS}/${id}`);
  return res.data;
};

export default {
  createClient,
  getMyProfile,
  updateMyProfile,
  updateAvatar,
  updateCoverImage,
  getClients,
  getClientById,
  updateClientByAdmin,
  deleteClient,
};