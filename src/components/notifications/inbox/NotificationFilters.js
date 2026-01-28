"use client";
import { FiFilter, FiAlertCircle, FiInfo, FiShield, FiInbox, FiCheckCircle } from "react-icons/fi";

export default function NotificationFilters({ activeFilter, onFilterChange }) {

  // Filters Config - Yahan 'all' ki ID ko empty string rakha hai taake saari notifications load hon
  const typeFilters = [
    { id: '', label: 'All Protocols', icon: <FiInbox /> },
    { id: 'alert', label: 'Alerts', icon: <FiAlertCircle />, color: 'text-rose-500' },
    { id: 'system', label: 'System', icon: <FiShield />, color: 'text-amber-500' },
    { id: 'info', label: 'Info', icon: <FiInfo />, color: 'text-indigo-500' },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/40 backdrop-blur-xl p-4 rounded-[2rem] border border-white shadow-xl">

      {/* 🚀 Protocol Type Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
        <div className="p-2 bg-slate-900 rounded-xl text-white mr-2 hidden md:block">
          <FiFilter size={14} />
        </div>

        {typeFilters.map((filter) => (
          <button
            key={filter.id}
            // 🎯 Change: 'type' ki jagah 'notificationType' use kiya hai jo aapke main page ki state hai
            onClick={() => onFilterChange('notificationType', filter.id)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap
              ${activeFilter.notificationType === filter.id
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 -translate-y-1'
                : 'bg-white/60 text-slate-500 hover:bg-white hover:text-indigo-600 border border-transparent hover:border-indigo-100'}
            `}
          >
            <span className={activeFilter.notificationType === filter.id ? 'text-white' : filter.color}>
              {filter.icon}
            </span>
            {filter.label}
          </button>
        ))}
      </div>

      {/* ⚡ Status Toggle Filters */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 md:border-l border-slate-200/50 pt-4 md:pt-0 md:pl-6">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden lg:block">Status:</span>

        <button
          onClick={() => onFilterChange('status', activeFilter.status === 'unread' ? '' : 'unread')}
          className={`
            flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2
            ${activeFilter.status === 'unread'
              ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-inner'
              : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}
          `}
        >
          <div className={`w-2 h-2 rounded-full ${activeFilter.status === 'unread' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
          {activeFilter.status === 'unread' ? 'Filter Active' : 'Show Unread'}
        </button>
      </div>
    </div>
  );
}