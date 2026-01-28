"use client";

import { FiSearch, FiFilter, FiCalendar, FiRefreshCw, FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";

const AttendanceFilters = ({ filters, setFilters }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      status: "",
      q: "",
      from: "",
      to: ""
    });
  };

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col xl:flex-row gap-4 mb-8 items-end xl:items-center"
    >
      {/* 1. Search Box */}
      <div className="relative flex-1 w-full group">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300" size={18} />
        <input
          type="text"
          name="q"
          // FIX: Added || "" to prevent uncontrolled error
          value={filters.q || ""}
          placeholder="Quick search by name or employee ID..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200/60 rounded-[1.25rem] shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-sm text-slate-600 placeholder:text-slate-400 placeholder:font-medium"
          onChange={handleChange}
        />
      </div>

      {/* 2. Status Dropdown */}
      <div className="relative w-full xl:w-56 group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none">
          <FiFilter size={16} />
        </div>
        <select
          name="status"
          // FIX: Added || ""
          value={filters.status || ""}
          className="w-full pl-11 pr-10 py-4 bg-white border border-slate-200/60 rounded-[1.25rem] shadow-sm appearance-none outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-black text-[11px] uppercase tracking-widest text-slate-600 cursor-pointer transition-all"
          onChange={handleChange}
        >
          <option value="">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="half-day">Half Day</option>
          <option value="leave">On Leave</option>
        </select>
        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-indigo-500 transition-colors" />
      </div>

      {/* 3. Date Range (From - To) */}
      <div className="flex w-full xl:w-auto gap-2 items-center bg-white p-2 rounded-[1.25rem] border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-2 px-2">
          <FiCalendar className="text-indigo-500" size={16} />
          <input
            type="date"
            name="from"
            // FIX: Added || ""
            value={filters.from || ""}
            className="bg-transparent border-none outline-none text-xs font-bold text-slate-600 cursor-pointer"
            onChange={handleChange}
          />
        </div >
        <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>
        <div className="flex items-center gap-2 px-2">
          <input
            type="date"
            name="to"
            // FIX: Added || ""
            value={filters.to || ""}
            className="bg-transparent border-none outline-none text-xs font-bold text-slate-600 cursor-pointer"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 4. Reset Button */}
      <motion.button
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.5 }}
        onClick={resetFilters}
        className="p-4 bg-white text-slate-400 hover:text-indigo-600 border border-slate-200/60 rounded-[1.25rem] shadow-sm hover:shadow-md transition-all"
        title="Reset Filters"
      >
        <FiRefreshCw size={20} />
      </motion.button>
    </motion.div>
  );
};

export default AttendanceFilters;