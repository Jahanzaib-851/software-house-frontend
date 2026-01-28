"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiBell, FiCheckCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import useNotificationStore from "@/store/useNotificationStore";
import notificationService from "@/services/notification.service";
import NotificationCard from "./NotificationCard";
import Link from "next/link";

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const notifications = useNotificationStore(state => state.notifications) || [];
  const unreadCount = useNotificationStore(state => state.unreadCount) || 0;
  const loading = useNotificationStore(state => state.loading);
  const markAllRead = useNotificationStore(state => state.markAllRead);

  const handleMarkAllRead = async () => {
    try {
      markAllRead();
      if (notificationService?.markAllAsRead) await notificationService.markAllAsRead();
    } catch (err) {
      console.error("Counter Reset Error:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-white group">
        <FiBell size={22} className="group-hover:scale-110 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-black text-indigo-900 border-2 border-slate-900 animate-bounce">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute right-0 mt-4 w-96 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden z-[100]"
          >
            <div className="p-6 bg-slate-50 border-b flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase italic">Command Inbox</h3>
              <button onClick={handleMarkAllRead} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all">
                <FiCheckCircle size={20} />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto bg-white">
              {loading ? (
                <div className="p-10 text-center text-slate-400 text-[10px] font-black uppercase animate-pulse">Scanning...</div>
              ) : notifications.length > 0 ? (
                notifications.map(note => <NotificationCard key={note._id} note={note} />)
              ) : (
                <div className="p-12 text-center text-slate-400 uppercase text-[10px] font-black">Frequency Clear</div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t">
              <Link href="/dashboard/notifications" onClick={() => setIsOpen(false)} className="block w-full py-4 text-center bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-indigo-700 shadow-lg transition-all">
                Access Main Feed
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
