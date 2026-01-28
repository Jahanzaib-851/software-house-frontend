"use client";
import { FiSearch, FiFilter, FiSliders } from "react-icons/fi";

export default function ProjectFilters({ searchTerm, setSearchTerm, status, setStatus }) {
  const tabs = [
    { id: "", label: "All Projects" },
    { id: "active", label: "Ongoing" },
    { id: "completed", label: "Completed" },
    { id: "on-hold", label: "On Hold" },
  ];

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by project name, client or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] bg-white border border-slate-100 outline-none focus:ring-4 ring-indigo-500/5 font-bold text-slate-600 transition-all shadow-sm group-hover:border-slate-200"
          />
        </div>

        {/* Priority Selector (Advanced Filter) */}
        <div className="relative min-w-[180px]">
          <FiSliders className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            className="w-full pl-12 pr-10 py-4 rounded-[1.5rem] bg-white border border-slate-100 outline-none focus:ring-4 ring-indigo-500/5 font-black text-[10px] uppercase tracking-widest text-slate-500 appearance-none shadow-sm cursor-pointer"
          >
            <option value="">Priority: All</option>
            <option value="urgent">Urgent Only</option>
            <option value="high">High Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">▼</div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatus(tab.id)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${status === tab.id
                ? "bg-white text-indigo-600 shadow-md transform scale-105"
                : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}