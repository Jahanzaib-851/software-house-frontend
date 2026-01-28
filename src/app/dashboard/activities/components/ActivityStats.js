"use client";

import { useMemo } from "react";
import { FiActivity, FiLayers, FiShield, FiTrendingUp } from "react-icons/fi";

export const ActivityStats = ({ data = [], loading }) => {

  // Backend se aane wale data ko client-side par analyze karte hain
  const stats = useMemo(() => {
    const total = data.length;
    const uniqueModules = new Set(data.map(item => item.module)).size;
    const criticalActions = data.filter(item => item.action === 'DELETE' || item.action === 'UPDATE').length;
    const recentSession = data.filter(item => item.action === 'LOGIN').length;

    return [
      {
        label: "Total Logs",
        value: total,
        icon: <FiActivity />,
        color: "from-blue-600 to-indigo-600 shadow-blue-200",
        desc: "Total operations tracked"
      },
      {
        label: "Modules Active",
        value: uniqueModules,
        icon: <FiLayers />,
        color: "from-emerald-500 to-teal-600 shadow-emerald-200",
        desc: "Modules reporting data"
      },
      {
        label: "System Alerts",
        value: criticalActions,
        icon: <FiShield />,
        color: "from-rose-500 to-orange-600 shadow-rose-200",
        desc: "Delete/Update actions"
      },
      {
        label: "Auth Traffic",
        value: recentSession,
        icon: <FiTrendingUp />,
        color: "from-amber-500 to-orange-500 shadow-amber-200",
        desc: "Login/Access events"
      }
    ];
  }, [data]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`relative group overflow-hidden bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${loading ? 'animate-pulse' : ''}`}
        >
          {/* Background Decorative Element */}
          <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-[0.03] group-hover:scale-150 transition-transform duration-700`} />

          <div className="relative z-10 space-y-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-2xl shadow-lg`}>
              {stat.icon}
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-4xl font-black italic tracking-tighter text-slate-900">
                  {loading ? "..." : stat.value}
                </h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Units</span>
              </div>
            </div>

            <p className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full w-fit uppercase tracking-widest border border-slate-100">
              {stat.desc}
            </p>
          </div>

          {/* Bottom Progress Bar Decor */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-50 overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${stat.color} w-1/3 group-hover:w-full transition-all duration-1000`} />
          </div>
        </div>
      ))}
    </div>
  );
};