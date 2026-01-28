import fetcher from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";

/**
 * Attendance API Service
 * Sequence: Fixed routes handled first for safety
 */

// 1. Get logged‑in user's attendance (Top par rakh diya)
const getMyAttendance = async () => {
  const res = await fetcher.get(`${API_ENDPOINTS.ATTENDANCE}/me`);
  return res.data;
};

// 2. Mark check‑in
const markCheckIn = async (data) => {
  const res = await fetcher.post(`${API_ENDPOINTS.ATTENDANCE}/check-in`, data);
  return res.data;
};

// 3. Mark check‑out
const markCheckOut = async (data) => {
  const res = await fetcher.post(`${API_ENDPOINTS.ATTENDANCE}/check-out`, data);
  return res.data;
};

// 4. Admin: Get attendance list
const getAttendanceList = async (params = {}) => {
  const res = await fetcher.get(API_ENDPOINTS.ATTENDANCE, { params });
  return res.data;
};

// 5. Admin: Update attendance
const updateAttendance = async (id, data) => {
  if (!id) throw new Error("Attendance ID is required");

  // ID ko string aur trim karna zaroori hai temp-IDs ke liye
  const cleanId = String(id).trim();
  const res = await fetcher.patch(`${API_ENDPOINTS.ATTENDANCE}/${cleanId}`, data);
  return res.data;
};

// 6. Admin: Delete attendance
const deleteAttendance = async (id) => {
  if (!id) throw new Error("ID is required for deletion");
  const cleanId = String(id).trim();
  const res = await fetcher.delete(`${API_ENDPOINTS.ATTENDANCE}/${cleanId}`);
  return res.data;
};

export default {
  getMyAttendance,
  markCheckIn,
  markCheckOut,
  getAttendanceList,
  updateAttendance,
  deleteAttendance,
};