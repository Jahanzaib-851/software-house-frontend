"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { FiRefreshCw, FiTrash2 } from "react-icons/fi";
import useNotifications from "@/hooks/useNotifications";
import useNotificationActions from "@/hooks/useNotificationActions";
import NotificationList from "@/components/notifications/inbox/NotificationList";
import NotificationFilters from "@/components/notifications/inbox/NotificationFilters";
import useNotificationStore from "@/store/useNotificationStore";
import notificationService from "@/services/notification.service";

export default function NotificationsPage() {
  const [filters, setFilters] = useState({ status: "", notificationType: "" });
  const [selectedIds, setSelectedIds] = useState([]);
  const isInitialMount = useRef(true);

  // Zustand store se count reset karne ka function
  const fetchInitialStore = useNotificationStore((state) => state.fetchInitial);
  const { archiveNotification } = useNotificationActions();

  const { notifications, loading, refresh, setData } = useNotifications({
    page: 1, limit: 15, ...filters
  });

  const displayData = useMemo(() => {
    if (!notifications) return [];
    if (Array.isArray(notifications)) return notifications;
    return notifications.items || notifications.notifications || [];
  }, [notifications]);

  // 🔔 Logic: Page load hote hi unread ko read mark karna aur count zero karna
  useEffect(() => {
    const clearCount = async () => {
      const unreadIds = displayData
        .filter(n => n.status === 'unread')
        .map(n => n._id);

      if (unreadIds.length > 0) {
        try {
          // 1. Backend par sab read mark karein
          await notificationService.markRead(null, unreadIds);
          // 2. Local state update karein (taake bold se normal ho jayein)
          handleSetData(prev => prev.map(n => unreadIds.includes(n._id) ? { ...n, status: 'read' } : n));
          // 3. Zustand store refresh karein taake Bell icon 0 ho jaye
          if (fetchInitialStore) fetchInitialStore();
        } catch (err) {
          console.error("Auto-read failed", err);
        }
      } else if (isInitialMount.current) {
        // Agar koi unread nahi bhi hai tab bhi store sync karein
        fetchInitialStore();
      }
    };

    if (!loading && displayData.length > 0) {
      clearCount();
      if (isInitialMount.current) isInitialMount.current = false;
    }
  }, [displayData.length, loading]);

  // Filters change hone par refresh karein
  useEffect(() => {
    if (!isInitialMount.current) refresh();
  }, [filters.status, filters.notificationType]);

  const handleSetData = (updateFn) => {
    setData((prev) => {
      const currentList = Array.isArray(prev) ? prev : (prev?.items || []);
      const updatedList = typeof updateFn === "function" ? updateFn(currentList) : updateFn;
      if (prev && !Array.isArray(prev)) return { ...prev, items: updatedList };
      return updatedList;
    });
  };

  // 🗑️ Bulk Delete Fix: Arguments matched with Hook
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    if (confirm(`Delete ${selectedIds.length} notifications?`)) {
      // FIX: archiveNotification(id, setData, ids)
      // Bulk ke liye pehla argument null jayega
      await archiveNotification(null, handleSetData, selectedIds);
      setSelectedIds([]);
      // Store count sync karein delete ke baad
      fetchInitialStore();
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10 text-black font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border flex justify-between items-center">
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
            Notifications Inbox
          </h1>
          <button
            onClick={() => refresh()}
            className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors border"
          >
            <FiRefreshCw className={`${loading ? "animate-spin" : ""} text-indigo-600`} size={20} />
          </button>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="bg-indigo-600 p-4 rounded-2xl flex justify-between items-center text-white shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <span className="font-bold ml-4">{selectedIds.length} Items Selected</span>
            <button
              onClick={handleBulkDelete}
              className="bg-rose-500 hover:bg-rose-600 px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              <FiTrash2 /> Delete Selection
            </button>
          </div>
        )}

        {/* Filters */}
        <NotificationFilters
          activeFilter={filters}
          onFilterChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))}
        />

        {/* Main List Container */}
        <div className="bg-white rounded-[2rem] shadow-sm border overflow-hidden min-h-[400px]">
          <NotificationList
            notifications={displayData}
            loading={loading}
            selectedIds={selectedIds}
            onSelect={setSelectedIds}
            setData={handleSetData}
          />
        </div>
      </div>
    </div>
  );
}