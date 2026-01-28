"use client";
import { FiUsers, FiLayers, FiEdit2, FiTrash2, FiMapPin, FiInfo } from "react-icons/fi";
import { motion } from "framer-motion";

export default function RoomCard({ room, onEdit, onDelete, onView }) {
  // Status wise color logic
  const statusStyles = {
    available: "bg-emerald-50 text-emerald-600 border-emerald-100",
    occupied: "bg-amber-50 text-amber-600 border-amber-100",
    maintenance: "bg-rose-50 text-rose-600 border-rose-100",
    inactive: "bg-slate-100 text-slate-400 border-slate-200",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 relative overflow-hidden"
    >
      {/* Top Section: Status & Type */}
      <div className="flex justify-between items-start mb-6">
        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusStyles[room.status] || statusStyles.available}`}>
          {room.status}
        </span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={() => onEdit(room)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
            <FiEdit2 size={16} />
          </button>
          <button onClick={() => onDelete(room._id)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      {/* Room Identity */}
      <div className="mb-8">
        <h3 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
          {room.name}
        </h3>
        <div className="flex items-center gap-2 text-slate-400">
          <FiMapPin size={14} />
          <span className="text-xs font-bold uppercase tracking-tight">
            {room.floor ? `${room.floor} Floor` : "Ground Floor"}
          </span>
        </div>
      </div>

      {/* Room Features (Backend capacity & type) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
          <div className="text-indigo-600 bg-white p-2 rounded-lg shadow-sm">
            <FiUsers size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase leading-none">Capacity</span>
            <span className="text-sm font-black text-slate-700">{room.capacity} Pax</span>
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
          <div className="text-violet-600 bg-white p-2 rounded-lg shadow-sm">
            <FiLayers size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase leading-none">Type</span>
            <span className="text-sm font-black text-slate-700 capitalize">{room.type}</span>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <button
        onClick={() => onView(room._id)}
        className="w-full py-4 bg-slate-50 group-hover:bg-indigo-600 text-slate-500 group-hover:text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2"
      >
        <FiInfo size={14} strokeWidth={3} />
        View Details & Timeline
      </button>

      {/* Decorative Gradient Background (Hidden by default) */}
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
    </motion.div>
  );
}