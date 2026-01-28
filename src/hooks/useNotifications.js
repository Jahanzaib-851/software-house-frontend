"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import notificationService from "@/services/notification.service";
import { toast } from "react-toastify";

export default function useNotifications(initialParams = { page: 1, limit: 10 }) {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- Helper: Clean Params (Empty strings ko URL se hatata hai) ---
  const cleanParams = (params) => {
    return Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    );
  };

  // 1. Fetch Logic
  const fetchNotifications = useCallback(async (params = initialParams, isPoll = false) => {
    try {
      if (!isPoll) setLoading(true);

      const sanitizedParams = cleanParams(params);
      const response = await notificationService.getMyNotes(sanitizedParams);

      // Data structure check: agar response.data array nahi hai toh empty array set karein
      setData(response?.data || []);
      setMeta(response?.meta || { total: 0, page: 1, limit: 10 });
    } catch (err) {
      if (!isPoll) toast.error("PROTOCOL_ERROR: Sync failed");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // 2. Mark as Read (Counter hatane ke liye)
  const markAsRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setData(prev => prev.map(n => n._id === id ? { ...n, status: 'read' } : n));
    } catch (err) {
      toast.error("OVERRIDE_FAILED");
    }
  };

  // 3. Effect: Jab initialParams (filters) badlein, tab fetch ho
  useEffect(() => {
    fetchNotifications(initialParams);
  }, [initialParams.status, initialParams.notificationType, initialParams.page]);

  return {
    notifications: data,
    meta,
    loading,
    refreshing,
    setData, // Notification list update karne ke liye lazmi hai
    refresh: () => {
      setRefreshing(true);
      fetchNotifications(initialParams);
    },
    markAsRead,
    setPage: (newPage) => fetchNotifications({ ...initialParams, page: newPage })
  };
}