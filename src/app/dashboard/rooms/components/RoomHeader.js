"use client";
import { FiPlus, FiBox, FiSearch, FiFilter } from "react-icons/fi";
import { motion } from "framer-motion";

export default function RoomHeader({ onAddClick, totalRooms = 0 }) {
  return (
    <div className="relative mb-12">
      {/* Background Decorative Element */}
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left Side: Title & Count */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-start gap-5"
        >
          <div className="relative">
            <div className="p-4 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[1.5rem] text-white shadow-xl shadow-indigo-200">
              <FiBox size={32} strokeWidth={1.5} />
            </div>
            {/* Pulsing Badge */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>

          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-1">
              ROOM <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">HUB</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                {totalRooms} Spaces Live in System
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Action Buttons */}
        <motion.div
          initial={{ opacity: 0, s: 0.9 }}
          animate={{ opacity: 1, s: 1 }}
          className="flex items-center gap-3"
        >
          {/* Quick Stats Mini-pill */}
          <div className="hidden sm:flex items-center gap-4 bg-white border border-slate-100 px-5 py-3 rounded-2xl mr-2 shadow-sm">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase">System Status</span>
              <span className="text-xs font-bold text-emerald-500">All Optimized</span>
            </div>
            <div className="h-8 w-[1px] bg-slate-100" />
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <button
            onClick={onAddClick}
            className="group flex items-center gap-3 bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4.5 rounded-[1.5rem] font-black text-sm transition-all duration-300 shadow-2xl shadow-slate-200 hover:shadow-indigo-200 active:scale-95"
          >
            <div className="bg-white/10 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-300">
              <FiPlus size={18} strokeWidth={3} />
            </div>
            <span className="tracking-wide">LAUNCH NEW ROOM</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}