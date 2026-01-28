"use client";
import { FiSearch, FiFilter, FiChevronDown } from "react-icons/fi";

export default function ReportFilters({ activeType, onTypeChange, onSearch }) {
  const types = [
    { id: "all", label: "All Reports" },
    { id: "finance", label: "Finance" },
    { id: "project", label: "Projects" },
    { id: "client", label: "Clients" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm">

      {/* 1. Fancy Tabs */}
      <div className="flex bg-slate-50 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => onTypeChange(type.id === "all" ? "" : type.id)}
            className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${(activeType === type.id || (activeType === "" && type.id === "all"))
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-600"
              }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* 2. Modern Search Bar */}
      <div className="relative w-full md:w-96">
        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search by report name or ID..."
          className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-slate-900 outline-none border-none transition-all placeholder:text-slate-300"
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-1.5 rounded-lg border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
          <FiFilter size={14} className="text-slate-400" />
        </div>
      </div>

    </div>
  );
}