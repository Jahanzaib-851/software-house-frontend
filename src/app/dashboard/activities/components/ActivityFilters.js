"use client";

import { FiFilter, FiXCircle, FiCalendar, FiBox, FiZap } from "react-icons/fi";

export const ActivityFilters = ({ filters, onFilterChange, isLoading }) => {

  // Handlers for select/input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const handleReset = () => {
    onFilterChange({
      module: "",
      action: "",
      from: "",
      to: "",
      page: 1
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 w-full">
      {/* 1. Module Filter (Matches Backend Enum) */}
      <div className="flex-1 min-w-[150px] relative">
        <FiBox className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <select
          name="module"
          value={filters.module}
          onChange={handleChange}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white transition-all appearance-none font-bold uppercase text-[10px] tracking-widest text-slate-700"
        >
          <option value="">All Modules</option>
          <option value="auth">Auth</option>
          <option value="user">User</option>
          <option value="employee">Employee</option>
          <option value="project">Project</option>
          <option value="finance">Finance</option>
          <option value="attendance">Attendance</option>
        </select>
      </div>

      {/* 2. Action Filter (Matches Backend Enum) */}
      <div className="flex-1 min-w-[150px] relative">
        <FiZap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <select
          name="action"
          value={filters.action}
          onChange={handleChange}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white transition-all appearance-none font-bold uppercase text-[10px] tracking-widest text-slate-700"
        >
          <option value="">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="LOGIN">Login</option>
        </select>
      </div>

      {/* 3. Date Range (From) */}
      <div className="flex-1 min-w-[180px] relative">
        <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="date"
          name="from"
          value={filters.from}
          onChange={handleChange}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white transition-all font-bold text-[10px] text-slate-700"
        />
      </div>

      {/* 4. Date Range (To) */}
      <div className="flex-1 min-w-[180px] relative">
        <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="date"
          name="to"
          value={filters.to}
          onChange={handleChange}
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white transition-all font-bold text-[10px] text-slate-700"
        />
      </div>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        disabled={isLoading}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600 font-black uppercase text-[10px] tracking-[0.2em] transition-all"
      >
        <FiXCircle size={16} /> Reset
      </button>
    </div>
  );
};