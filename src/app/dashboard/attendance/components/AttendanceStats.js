"use client";

import { motion } from "framer-motion";
import { FiUsers, FiUserCheck, FiUserX, FiZap } from "react-icons/fi";

const AttendanceStats = ({ stats }) => {
  // Stats values ko ensure karne ke liye default values
  const total = stats?.total || 0;
  const present = stats?.present || 0;
  const absent = stats?.absent || 0;
  const avgHours = stats?.avgHours || 0;

  const cards = [
    {
      label: "Total Logs",
      value: total,
      icon: <FiUsers size={24} />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
    },
    {
      label: "Present Records",
      value: present,
      icon: <FiUserCheck size={24} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      label: "Absent/Leaves",
      value: absent,
      icon: <FiUserX size={24} />,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-100",
    },
    {
      label: "Avg. Daily Hours",
      value: `${avgHours}h`,
      icon: <FiZap size={24} />,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className={`bg-white p-6 rounded-[2rem] border ${card.border} shadow-sm shadow-slate-200/40 flex items-center gap-5`}
        >
          <div className={`p-4 ${card.bg} ${card.color} rounded-2xl shadow-sm flex items-center justify-center`}>
            {card.icon}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-0.5">
              {card.label}
            </p>
            <p className="text-2xl font-black text-slate-800 tracking-tight">
              {card.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AttendanceStats;