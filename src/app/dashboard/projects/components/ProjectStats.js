"use client";
import { FiBox, FiActivity, FiCheckCircle, FiAlertCircle, FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ProjectStats({ stats }) {
  // Backend aggregation se jo data mil raha hai, usay yahan map kar rahe hain
  const cards = [
    {
      label: "All Projects",
      value: stats?.totalProjects || 0,
      icon: <FiBox />,
      color: "from-blue-600 to-indigo-700",
      shadow: "shadow-blue-200"
    },
    {
      label: "Ongoing Sprints",
      value: stats?.active || 0,
      icon: <FiActivity />,
      color: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-200"
    },
    {
      label: "Completed",
      value: stats?.completed || 0,
      icon: <FiCheckCircle />,
      color: "from-purple-500 to-pink-600",
      shadow: "shadow-purple-200"
    },
    {
      label: "Urgent/High",
      value: stats?.urgent || 0,
      icon: <FiAlertCircle />,
      color: "from-red-500 to-rose-600",
      shadow: "shadow-red-200"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {cards.map((card, i) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          key={i}
          className={`relative overflow-hidden bg-gradient-to-br ${card.color} p-7 rounded-[2.5rem] text-white shadow-2xl ${card.shadow} group hover:scale-[1.02] transition-all duration-300`}
        >
          {/* Abstract background shapes for premium look */}
          <div className="absolute -right-2 -top-2 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />

          {/* Large background icon */}
          <div className="absolute right-4 bottom-4 text-white/10 text-7xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
            {card.icon}
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                {card.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
                {card.label}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black tracking-tighter italic leading-none">
                {card.value}
              </h3>
              {card.value > 0 && (
                <div className="flex items-center text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                  <FiTrendingUp className="mr-1" size={10} /> LIVE
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}