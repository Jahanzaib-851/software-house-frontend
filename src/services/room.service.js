import fetcher from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";

/**
 * Room API Service
 * Token automatically attached via fetcher interceptor
 */

// Create a new room
const createRoom = async (data) => {
  const res = await fetcher.post(API_ENDPOINTS.ROOMS, data);
  return res.data;
};

// Get all rooms (any authorized user)
const getRooms = async (params = {}) => {
  const res = await fetcher.get(API_ENDPOINTS.ROOMS, { params });
  return res.data;
};

// Get a single room by ID
const getRoomById = async (id) => {
  const res = await fetcher.get(`${API_ENDPOINTS.ROOMS}/${id}`);
  return res.data;
};

// Update room (admin/manager)
const updateRoom = async (id, data) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.ROOMS}/${id}`, data);
  return res.data;
};

// Assign a room (admin/manager)
const assignRoom = async (id, data) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.ROOMS}/${id}/assign`, data);
  return res.data;
};

// Release a room (admin/manager)
const releaseRoom = async (id, data) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.ROOMS}/${id}/release`, data);
  return res.data;
};

// Delete room (admin)
const deleteRoom = async (id) => {
  const res = await fetcher.delete(`${API_ENDPOINTS.ROOMS}/${id}`);
  return res.data;
};

export default {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  assignRoom,
  releaseRoom,
  deleteRoom,
};
