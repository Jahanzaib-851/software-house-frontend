import { create } from "zustand";
import notificationService from "@/services/notification.service";

/**
 * 🚀 Modern Global Notification Store
 * Logic: Dashboard aur Sidebar ko sync rakhna aur crash se bachana
 */
const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  // 🔄 Initial Load (Safe Fetching Logic)
  fetchInitial: async () => {
    set({ loading: true, error: null });
    try {
      const res = await notificationService.getMyNotifications();

      // 🛡️ ERROR PREVENTION:
      // Optional Chaining (?.) ka istemal taake agar res ya data undefined ho toh crash na ho
      const rawItems = res?.data?.items || res?.data || [];
      const notifications = Array.isArray(rawItems) ? rawItems : [];

      // ✅ Fix: Nullish Coalescing (??) ka use
      // Agar res.meta.total nahi milta toh notifications ki length use karega, warna 0
      const totalCount = res?.meta?.total ?? notifications.length ?? 0;

      set({
        notifications: notifications.slice(0, 10), // Top 10 for dropdown/sidebar
        unreadCount: totalCount,
        loading: false
      });
    } catch (err) {
      console.error("Zustand Sync Error:", err);
      set({
        loading: false,
        notifications: [],
        unreadCount: 0,
        error: "Sync failed - Backend unreachable"
      });
    }
  },

  // ✅ Local UI Update (Instant Read effect)
  markLocalAsRead: (id) => {
    const { notifications, unreadCount } = get();
    const updated = notifications.map(n =>
      n._id === id ? { ...n, status: 'read' } : n
    );

    set({
      notifications: updated,
      unreadCount: Math.max(0, unreadCount - 1)
    });
  },

  // 🔔 Add One (For Real-time Socket updates)
  addOne: (newNote) => {
    set((state) => ({
      notifications: [newNote, ...state.notifications].slice(0, 10),
      unreadCount: state.unreadCount + 1
    }));
  }
}));

export default useNotificationStore;