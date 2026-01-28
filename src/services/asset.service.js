import fetcher from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";

/**
 * Asset API Service
 * Token automatically attached via fetcher interceptor
 */

// Create a new asset (admin only)
const createAsset = async (data) => {
  const res = await fetcher.post(API_ENDPOINTS.ASSETS, data);
  return res.data;
};

// Get all assets (list & filters)
const getAssets = async (params = {}) => {
  const res = await fetcher.get(API_ENDPOINTS.ASSETS, { params });
  return res.data;
};

// Get single asset by ID
const getAssetById = async (id) => {
  const res = await fetcher.get(`${API_ENDPOINTS.ASSETS}/${id}`);
  return res.data;
};

// Update asset (admin/manager)
const updateAsset = async (id, data) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.ASSETS}/${id}`, data);
  return res.data;
};

// Assign an asset (admin/manager)
const assignAsset = async (id, data) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.ASSETS}/${id}/assign`, data);
  return res.data;
};

// Unassign an asset (admin/manager)
const unassignAsset = async (id, data) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.ASSETS}/${id}/unassign`, data);
  return res.data;
};

// Send asset to maintenance (admin/manager)
const sendToMaintenance = async (id, data) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.ASSETS}/${id}/maintenance`, data);
  return res.data;
};

// Retire asset (admin only)
const retireAsset = async (id) => {
  const res = await fetcher.delete(`${API_ENDPOINTS.ASSETS}/${id}`);
  return res.data;
};

export default {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  assignAsset,
  unassignAsset,
  sendToMaintenance,
  retireAsset,
};
