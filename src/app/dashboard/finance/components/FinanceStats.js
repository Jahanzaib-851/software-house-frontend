"use client";
import { FiArrowUpRight, FiArrowDownRight, FiActivity, FiBriefcase, FiPieChart } from "react-icons/fi";

export default function FinanceStats({ summary }) {
  const stats = [
    {
      id: 1,
      name: "Net Portfolio",
      value: summary?.netBalance || 0,
      icon: FiActivity,
      gradient: "from-indigo-600 to-blue-500",
      shadow: "shadow-blue-200",
      percentage: "+12.5%", // Demo ke liye, aap calculate bhi kar sakte hain
    },
    {
      id: 2,
      name: "Total Revenue",
      value: summary?.totalIncome || 0,
      icon: FiArrowUpRight,
      gradient: "from-emerald-600 to-teal-500",
      shadow: "shadow-emerald-200",
      percentage: "+8.2%",
    },
    {
      id: 3,
      name: "Total Burn",
      value: summary?.totalExpense || 0,
      icon: FiArrowDownRight,
      gradient: "from-rose-600 to-orange-500",
      shadow: "shadow-rose-200",
      percentage: "-2.4%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {stats.map((item) => (
        <div
          key={item.id}
          className="group relative overflow-hidden bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500"
        >
          {/* Background Decorative Gradient Circle */}
          <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${item.gradient} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`} />

          <div className="relative flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg ${item.shadow}`}>
                <item.icon size={28} />
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${item.id === 3 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                  {item.percentage}
                </span>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                {item.name}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-slate-400">PKR</span>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                  {item.value.toLocaleString()}
                </h3>
              </div>
            </div>

            {/* Bottom Visual Bar */}
            <div className="mt-6 w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${item.gradient} transition-all duration-1000`}
                style={{ width: '70%' }} // Aap isay logic se change kar sakte hain
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}