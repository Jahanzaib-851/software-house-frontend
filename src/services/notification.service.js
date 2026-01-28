import fetcher from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";

const createNotification = async (data) => {
  const res = await fetcher.post(API_ENDPOINTS.NOTIFICATIONS, data);
  return res.data;
};

const getMyNotifications = async (params = {}) => {
  const res = await fetcher.get(`${API_ENDPOINTS.NOTIFICATIONS}/me`, { params });
  return res.data;
};

// ⚡ FIXED: URL matches backend route
const markAsRead = async (id, ids = []) => {
  // Agar ID hai toh: /api/notifications/ID/read
  // Agar Bulk (Bell icon zero) hai toh: /api/notifications/read
  const url = id
    ? `${API_ENDPOINTS.NOTIFICATIONS}/${id}/read`
    : `${API_ENDPOINTS.NOTIFICATIONS}/read`; // 👈 Changed from 'mark-all-read' to 'read'

  const res = await fetcher.patch(url, {
    ids: id ? [id] : ids
  });
  return res.data;
};

// 🗑️ DELETE FIX
const deleteNotification = async (id, ids = []) => {
  const url = id ? `${API_ENDPOINTS.NOTIFICATIONS}/${id}` : API_ENDPOINTS.NOTIFICATIONS;
  const targetIds = id ? [id] : ids;

  const res = await fetcher.request({
    url: url,
    method: 'DELETE',
    data: { ids: targetIds }
  });

  return res.data;
};

const notificationService = {
  createNotification,
  getMyNotifications,
  getMyNotes: getMyNotifications,
  markAsRead,
  markRead: markAsRead,
  deleteNotification,
  delete: deleteNotification,
};

export default notificationService;