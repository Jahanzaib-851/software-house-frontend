"use client";
import { create } from "zustand";
import notificationService from "@/services/notification.service";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  isSynced: false,

  fetchInitial: async (force = false) => {
    if (get().isSynced && !force) return;
    set({ loading: true });
    try {
      const res = await notificationService.getMyNotifications();
      const rawItems = res?.data?.items || res?.data || [];
      const notifications = Array.isArray(rawItems) ? rawItems : [];
      const totalCount = res?.meta?.total ?? notifications.filter(n => n.status === 'unread').length ?? 0;

      set({
        notifications: notifications.slice(0, 10),
        unreadCount: totalCount,
        loading: false,
        isSynced: true
      });
    } catch (err) {
      set({ loading: false, unreadCount: 0, isSynced: true });
    }
  },

  markAllRead: () => {
    const { notifications } = get();
    set({
      notifications: notifications.map(n => ({ ...n, status: 'read' })),
      unreadCount: 0,
      isSynced: true
    });
  },

  markLocalAsRead: (id) => {
    const { notifications, unreadCount } = get();
    set({
      notifications: notifications.map(n => n._id === id ? { ...n, status: 'read' } : n),
      unreadCount: Math.max(0, unreadCount - 1)
    });
  }
}));

export default useNotificationStore;
