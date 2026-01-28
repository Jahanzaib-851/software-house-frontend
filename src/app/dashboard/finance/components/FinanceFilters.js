"use client";
import { FiSearch, FiCalendar, FiFilter } from "react-icons/fi";

export default function FinanceFilters({ onFilterChange }) {
  return (
    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
      {/* 1. Transaction Type Filter */}
      <div className="relative min-w-[160px]">
        <select
          onChange={(e) => onFilterChange("type", e.target.value)}
          className="w-full pl-4 pr-10 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer shadow-sm text-xs"
        >
          <option value="">All Transactions</option>
          <option value="income">Income Only</option>
          <option value="expense">Expenses Only</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <FiFilter size={14} />
        </div>
      </div>

      {/* 2. Date Range Filters */}
      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border-none shadow-sm">
        <FiCalendar className="text-slate-400" size={14} />
        <input
          type="date"
          onChange={(e) => onFilterChange("from", e.target.value)}
          className="bg-transparent border-none text-[11px] font-bold text-slate-700 focus:ring-0 p-0 cursor-pointer"
        />
        <span className="text-slate-300 font-black text-[10px]">TO</span>
        <input
          type="date"
          onChange={(e) => onFilterChange("to", e.target.value)}
          className="bg-transparent border-none text-[11px] font-bold text-slate-700 focus:ring-0 p-0 cursor-pointer"
        />
      </div>
    </div>
  );
}