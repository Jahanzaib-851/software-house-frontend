"use client";

import { FiTrash2, FiCheck, FiClock } from "react-icons/fi";
import { format } from "date-fns";
import NotificationIcon from "../shared/NotificationIcon";
import useNotificationActions from "@/hooks/useNotificationActions";
import useNotificationStore from "@/store/useNotificationStore";

/**
 * 🔔 Notification List Component
 * Handle single notification actions and display
 */
export default function NotificationList({
  notifications,
  loading,
  setData,
  selectedIds,
  onSelect
}) {
  const { markAsRead, archiveNotification } = useNotificationActions();
  const fetchInitial = useNotificationStore((state) => state.fetchInitial);

  // 🗑️ Handle Single Delete (Archive)
  const handleSingleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation(); // Taake checkbox trigger na ho

    try {
      if (typeof archiveNotification === "function") {
        // ⚡ FIX: Sirf 2 arguments bhejein (id, setData)
        // Hook khud isay array mein convert kar ke backend ko bhej dega
        await archiveNotification(id, setData);
      }
    } catch (error) {
      console.error("Delete UI Error:", error);
    }
  };

  // ✅ Handle Mark as Read
  const handleMarkAsRead = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await markAsRead(id, setData);
      // Zustand store update karne ke liye (top bar count)
      if (fetchInitial) fetchInitial();
    } catch (error) {
      console.error("Read Action Error:", error);
    }
  };

  // Loading State
  if (loading && (!notifications || notifications.length === 0)) {
    return (
      <div className="p-20 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
        <p className="font-bold text-slate-400 animate-pulse">SYNCHRONIZING INBOX...</p>
      </div>
    );
  }

  // Empty State
  if (!notifications || notifications.length === 0) {
    return (
      <div className="p-20 text-center text-slate-400 font-medium">
        No notifications found in your inbox.
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {notifications.map((note) => (
        <div
          key={note._id}
          className={`group flex items-center gap-4 p-5 hover:bg-slate-50 transition-all cursor-default ${note.status === 'unread' ? 'bg-white' : 'bg-slate-50/30'
            }`}
        >
          {/* Checkbox for Bulk Selection */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedIds.includes(note._id)}
              onChange={() => {
                if (selectedIds.includes(note._id)) {
                  onSelect(selectedIds.filter(i => i !== note._id));
                } else {
                  onSelect([...selectedIds, note._id]);
                }
              }}
              className="w-5 h-5 rounded border-slate-300 text-indigo-600 cursor-pointer focus:ring-indigo-500"
            />
          </div>

          {/* Icon based on Type */}
          <div className="shrink-0">
            <NotificationIcon type={note.notificationType} />
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm truncate mb-0.5 ${note.status === 'unread' ? 'font-bold text-black' : 'font-medium text-slate-400'
              }`}>
              {note.message}
            </h4>

            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black uppercase text-indigo-500 italic tracking-wider">
                {note.notificationType}
              </span>
              <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1">
                <FiClock size={10} className="mb-0.5" />
                {note.createdAt ? format(new Date(note.createdAt), 'hh:mm a • MMM dd') : 'Just now'}
              </span>
            </div>
          </div>

          {/* Action Buttons (Hover visible) */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {note.status === 'unread' && (
              <button
                title="Mark as Read"
                onClick={(e) => handleMarkAsRead(e, note._id)}
                className="p-2 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
              >
                <FiCheck size={18} />
              </button>
            )}

            <button
              title="Archive Notification"
              onClick={(e) => handleSingleDelete(e, note._id)}
              className="p-2 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}