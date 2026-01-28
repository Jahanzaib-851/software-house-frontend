"use client";
import { motion } from "framer-motion";
import { FiClock, FiTrash2, FiEdit3, FiUser } from "react-icons/fi";

export default function AttendanceTable({ data, loading, onDelete, onEdit }) {
  // 1. Loading State
  if (loading) {
    return (
      <div className="p-10 text-center animate-pulse text-slate-400 font-bold">
        Loading Logs...
      </div>
    );
  }

  // 2. Data Extraction
  const items = Array.isArray(data) ? data : (data?.data || []);

  // Status Color Helper
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'present': return 'bg-emerald-100 text-emerald-600';
      case 'absent': return 'bg-rose-100 text-rose-600';
      case 'leave': return 'bg-amber-100 text-amber-600';
      case 'half-day': return 'bg-indigo-100 text-indigo-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Employee</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Date / Time</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Work Hours</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
            <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.length > 0 ? (
            items.map((item) => (
              <motion.tr
                key={item._id}
                whileHover={{ backgroundColor: "#fcfcfd" }}
                className="group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <FiUser size={16} />
                    </div>
                    <div>
                      {/* 🔥 FIXED: Ab yahan Name nazar aayega */}
                      <div className="font-black text-slate-800 text-sm leading-tight">
                        {item.employee?.fullName || item.employee?.name || 'Unknown Employee'}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {item.employee?.employeeId || 'ID-N/A'} • {item.employee?.designation || 'Staff'}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-600">
                    {item.date ? new Date(item.date).toDateString() : 'N/A'}
                  </div>
                  <div className="text-[10px] font-bold text-indigo-500 uppercase">
                    {item.checkIn ? 'IN: ' + new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'NOT CHECKED IN'}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-slate-700">
                      {item.totalHours || 0}h
                    </span>
                    {item.overtimeHours > 0 && (
                      <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-bold">
                        +{item.overtimeHours} OT
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusStyle(item.attendanceStatus)}`}>
                    {item.attendanceStatus || 'absent'}
                  </span>
                </td>

                <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                    title="Edit Record"
                  >
                    <FiEdit3 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Delete Record"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-medium italic">
                No attendance records found for this period.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}