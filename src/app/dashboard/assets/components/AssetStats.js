"use client";
import { FiBox, FiUserCheck, FiTool, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AssetStats({ assets = [] }) {
  // Safe filtering logic: handle case-sensitivity and undefined data
  const getCount = (statusName) => {
    return assets.filter(a => a.status?.toLowerCase() === statusName.toLowerCase()).length;
  };

  const stats = [
    {
      label: "Total Inventory",
      value: assets.length,
      icon: FiBox,
      color: "from-slate-800 to-slate-900",
      shadow: "shadow-slate-200",
      textColor: "text-white"
    },
    {
      label: "Deployed Assets",
      value: getCount('assigned'),
      icon: FiUserCheck,
      color: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-100",
      textColor: "text-white"
    },
    {
      label: "Ready to Deploy",
      value: getCount('available'),
      icon: FiCheckCircle,
      color: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/20",
      textColor: "text-white"
    },
    {
      label: "In Maintenance",
      value: getCount('maintenance'),
      icon: FiTool,
      color: "from-amber-400 to-orange-500",
      shadow: "shadow-amber-100",
      textColor: "text-white"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative group overflow-hidden bg-gradient-to-br ${stat.color} p-8 rounded-[2.5rem] ${stat.shadow} shadow-2xl transition-all hover:-translate-y-2`}
        >
          {/* Decorative Glass Circle */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

          <div className="relative z-10 flex flex-col gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/30 shadow-inner">
              <stat.icon size={24} strokeWidth={2} />
            </div>

            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] opacity-80 ${stat.textColor}`}>
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className={`text-4xl font-black ${stat.textColor}`}>
                  {stat.value.toString().padStart(2, '0')}
                </h3>
                <span className={`text-[10px] font-bold ${stat.textColor} opacity-60 uppercase tracking-widest`}>Units</span>
              </div>
            </div>
          </div>

          {/* Bottom Decoration Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-white/20"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}