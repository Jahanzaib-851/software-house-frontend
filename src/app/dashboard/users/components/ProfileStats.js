"use client";
import { FiUsers, FiShield, FiUserX, FiActivity, FiZap } from "react-icons/fi";

export default function ProfileStats({ stats }) {
  // Mapping with Backend Data
  const items = [
    {
      label: "TOTAL OPERATIVES",
      value: stats?.total || 0,
      icon: <FiUsers size={32} />,
      gradient: "from-indigo-600 via-indigo-700 to-slate-900",
      accent: "bg-indigo-400",
      description: "Total database entries",
    },
    {
      label: "ACTIVE NODES",
      value: stats?.active || 0,
      icon: <FiZap size={32} />,
      gradient: "from-emerald-500 via-teal-600 to-slate-900",
      accent: "bg-emerald-400",
      description: "Operatives with live access",
    },
    {
      label: "RESTRICTED",
      value: stats?.blocked || 0,
      icon: <FiUserX size={32} />,
      gradient: "from-rose-500 via-rose-700 to-slate-900",
      accent: "bg-rose-400",
      description: "Security restricted accounts",
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {items.map((item, index) => (
        <div
          key={index}
          className={`relative group overflow-hidden bg-gradient-to-br ${item.gradient} p-8 rounded-[3.5rem] text-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_30px_60px_rgba(0,0,0,0.2)]`}
        >
          {/* 🌑 Subtle Animated Mesh Background */}
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
            <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px] rotate-12" />
          </div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-12">
              <div className="p-4 bg-white/10 backdrop-blur-xl rounded-[1.8rem] border border-white/20 shadow-inner group-hover:rotate-6 transition-transform">
                {item.icon}
              </div>
              <div className="flex flex-col items-end">
                <div className={`px-3 py-1 rounded-full ${item.accent}/20 border border-${item.accent}/30 flex items-center gap-2`}>
                  <div className={`w-1.5 h-1.5 ${item.accent} rounded-full animate-pulse`} />
                  <span className="text-[9px] font-black tracking-widest uppercase">System_Live</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-7xl font-black italic tracking-tighter leading-none">
                  {item.value.toString().padStart(2, '0')}
                </h3>
                <span className="text-xl font-bold opacity-30 italic">/db</span>
              </div>
              <p className="text-sm font-black uppercase tracking-[0.25em] mt-4 text-white/90">
                {item.label}
              </p>
              <div className="h-1 w-12 bg-white/20 rounded-full mt-3 group-hover:w-full transition-all duration-700" />
              <p className="text-[10px] font-bold opacity-40 mt-3 tracking-wide">
                CMD: FETCH_DATA --SOURCE: {item.description.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}