"use client";
import { FiEdit2, FiTrash2, FiEye, FiUsers, FiBox } from "react-icons/fi";
import { motion } from "framer-motion";

export default function RoomTable({ rooms = [], onEdit, onDelete, onView }) {

  // Status mapping for fancy badges
  const getStatusStyle = (status) => {
    const styles = {
      available: "bg-emerald-50 text-emerald-600 border-emerald-100",
      occupied: "bg-amber-50 text-amber-600 border-amber-100",
      maintenance: "bg-rose-50 text-rose-600 border-rose-100",
      inactive: "bg-slate-100 text-slate-400 border-slate-200",
    };
    return styles[status] || styles.available;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity & Floor</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Specifications</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Current Status</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Utilization</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rooms.map((room) => (
              <tr key={room._id} className="hover:bg-slate-50/50 transition-colors group">
                {/* Room Name & Floor */}
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs shadow-sm">
                      {room.name?.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                        {room.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        {room.floor || "Level 0"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Type & Capacity */}
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-slate-600">
                      <FiBox size={12} className="text-indigo-400" />
                      <span className="text-xs font-bold capitalize">{room.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <FiUsers size={12} />
                      <span className="text-[10px] font-bold">{room.capacity} Person Max</span>
                    </div>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(room.status)}`}>
                    {room.status}
                  </span>
                </td>

                {/* Utilization Placeholder (Can be linked to assignments) */}
                <td className="p-6">
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${room.status === 'occupied' ? 'w-full bg-amber-400' : 'w-0 bg-emerald-400'}`}
                    />
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 block uppercase">
                    {room.status === 'occupied' ? 'Full Load' : 'Empty'}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onView(room._id)}
                      className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-xl shadow-sm transition-all"
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(room)}
                      className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-amber-600 hover:border-amber-100 rounded-xl shadow-sm transition-all"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(room._id)}
                      className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 hover:border-rose-100 rounded-xl shadow-sm transition-all"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}