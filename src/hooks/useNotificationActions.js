"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import notificationService from "@/services/notification.service";
import useNotificationStore from "@/store/useNotificationStore";

export default function useNotificationActions() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { decrementCount, fetchInitial } = useNotificationStore();

  const markAsRead = async (id, setData) => {
    try {
      if (setData) {
        setData(prev => prev.map(n => n._id === id ? { ...n, status: 'read' } : n));
      }
      await notificationService.markRead(id);
      decrementCount();
    } catch (err) {
      toast.error("SYSTEM_FAILURE: Action could not be synced");
      fetchInitial();
    }
  };

  // 🗑️ FINAL FIX: Logic for single and bulk delete
  const archiveNotification = async (id, setData, ids = []) => {
    // ⚡ Target IDs hamesha array mein hone chahiye
    const targetIds = id ? [id] : ids;
    if (targetIds.length === 0) return;

    try {
      // 1. Optimistic Update: UI se foran remove karein
      if (setData) {
        setData(prev => prev.filter(n => !targetIds.includes(n._id)));
      }

      // 2. Backend call: targetIds pass karein
      await notificationService.deleteNotification(id, targetIds);
      toast.info("Notification removed successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("ARCHIVE_ERROR: Could not remove notification");
      fetchInitial(); // Rollback on error
    }
  };

  return { isProcessing, markAsRead, archiveNotification };
}