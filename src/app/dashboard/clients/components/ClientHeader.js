"use client";
import { FiPlus, FiUsers, FiUserCheck, FiUserPlus } from "react-icons/fi";

export default function ClientHeader({ onAddClick, stats }) {
  // Default values agar stats na milein
  const {
    total = 0,
    active = 0,
    newThisMonth = 0
  } = stats || {};

  return (
    <div className="mb-10 space-y-8">
      {/* Top Row: Title and Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">
            Client Directory
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage and monitor your business relationships</p>
        </div>

        <button
          onClick={onAddClick}
          className="flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
        >
          <FiPlus strokeWidth={3} />
          <span>REGISTER CLIENT</span>
        </button>
      </div>

      {/* Stats Row: The Cards you wanted */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={<FiUsers size={20} />}
          label="Total Clients"
          value={total}
          color="bg-indigo-500"
        />
        <StatCard
          icon={<FiUserCheck size={20} />}
          label="Active Today"
          value={active}
          color="bg-emerald-500"
        />
        <StatCard
          icon={<FiUserPlus size={20} />}
          label="New This Month"
          value={newThisMonth}
          color="bg-amber-500"
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
      <div className={`${color} text-white p-4 rounded-2xl shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}