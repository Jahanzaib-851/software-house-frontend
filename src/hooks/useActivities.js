"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import activityService from "@/services/activity.service";

export const useActivities = (isAdmin = false) => {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 15 });
  const [loading, setLoading] = useState(true);

  const abortControllerRef = useRef(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 15,
    module: "",
    action: "",
    from: "",
    to: ""
  });

  const loadLogs = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      console.log("🚀 [API Request]: Fetching activities with filters:", filters);

      const res = isAdmin
        ? await activityService.getAllActivities(filters)
        : await activityService.getMyActivities(filters);

      // --- DEBUGGING CONSOLE ---
      console.log("📥 [API Response Full]:", res);

      // Backend ApiResponse ke mutabiq data set karein
      // Agar backend 'res.data.activities' bhej raha hai toh usey adjust karein
      const fetchedData = res.data || [];
      const fetchedMeta = res.meta || { total: 0, page: 1 };

      console.log("📊 [Processed Data]:", fetchedData);
      console.log("🔢 [Processed Meta]:", fetchedMeta);

      setData(fetchedData);
      setMeta(fetchedMeta);

    } catch (err) {
      if (err.name !== 'CanceledError') {
        console.error("❌ [Activity Fetch Error]:", err.response?.data || err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, isAdmin]);

  useEffect(() => {
    loadLogs();
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [loadLogs]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1
    }));
  };

  return {
    data,
    meta,
    loading,
    filters,
    setFilters: updateFilters,
    refresh: loadLogs
  };
};