"use client";
import { FiCheckCircle, FiActivity, FiAlertCircle, FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";

export default function RoomStats({ rooms = [] }) {
  // Logic to calculate stats
  const total = rooms.length;
  const available = rooms.filter(r => r.status === 'available').length;
  const occupied = rooms.filter(r => r.status === 'occupied').length;

  const statCards = [
    {
      label: "Inventory Size",
      value: total,
      desc: "Total spaces managed",
      icon: FiActivity,
      color: "from-blue-600 to-indigo-600",
      shadow: "shadow-blue-100",
    },
    {
      label: "Live & Available",
      value: available,
      desc: "Ready for assignment",
      icon: FiCheckCircle,
      color: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-100",
    },
    {
      label: "Currently Active",
      value: occupied,
      desc: "Rooms under usage",
      icon: FiAlertCircle,
      color: "from-orange-500 to-rose-500",
      shadow: "shadow-orange-100",
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {statCards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -5 }}
          className={`relative group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm ${card.shadow} transition-all duration-300`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                {card.label}
              </p>
              <h3 className="text-4xl font-black text-slate-900 mb-1">
                {card.value < 10 && card.value > 0 ? `0${card.value}` : card.value}
              </h3>
              <p className="text-xs font-bold text-slate-400 italic">
                {card.desc}
              </p>
            </div>

            <div className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg`}>
              <card.icon size={24} strokeWidth={2.5} />
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="absolute bottom-6 left-8 right-8 h-[2px] bg-slate-50 overflow-hidden rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-full bg-gradient-to-r ${card.color}`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}