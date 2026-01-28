"use client";
import { FiSearch, FiFilter } from "react-icons/fi";

export default function ClientFilters({ searchTerm, setSearchTerm, status, setStatus }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-xl">
        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search by name, email or company..."
          className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-white border-none outline-none ring-4 ring-slate-50 focus:ring-indigo-100 transition-all font-bold text-sm text-slate-600 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2 bg-white px-4 rounded-[1.5rem] shadow-sm">
        <FiFilter className="text-slate-400" />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-transparent py-4 text-xs font-black uppercase text-slate-500 outline-none"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
}