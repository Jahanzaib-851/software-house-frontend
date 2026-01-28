"use client";
import { FiSearch, FiFilter, FiGrid, FiList, FiCommand } from "react-icons/fi";

export default function UserFilters({ onSearch, onRoleChange, view, setView }) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-white/40 backdrop-blur-xl p-4 rounded-[2.5rem] border border-white/60 shadow-xl shadow-slate-200/50">

      {/* 🔍 Smart Search Bar */}
      <div className="relative flex-1 w-full group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
          <FiSearch size={20} />
        </div>
        <input
          type="text"
          placeholder="SEARCH BY IDENTITY (NAME OR EMAIL)..."
          className="w-full pl-14 pr-6 py-4 bg-white/80 rounded-3xl border-none outline-none ring-2 ring-transparent focus:ring-indigo-500/20 text-xs font-black tracking-widest text-slate-900 placeholder:text-slate-400 transition-all shadow-inner"
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
          <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400">
            <FiCommand /> K
          </span>
        </div>
      </div>

      {/* 🛡️ Role Selection Dropdown */}
      <div className="relative w-full md:w-48">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500">
          <FiFilter size={16} />
        </div>
        <select
          className="w-full pl-11 pr-6 py-4 bg-white/80 rounded-3xl border-none outline-none appearance-none text-[10px] font-black uppercase tracking-widest text-slate-700 cursor-pointer hover:bg-white transition-all shadow-inner"
          onChange={(e) => onRoleChange(e.target.value)}
        >
          <option value="">ALL CLASSIFICATIONS</option>
          <option value="admin">ADMIN_ROOT</option>
          <option value="manager">MANAGER_OPS</option>
          <option value="user">USER_STANDARD</option>
        </select>
      </div>

      {/* 🖼️ View Switcher (Table vs Grid) */}
      <div className="flex bg-slate-100 p-1.5 rounded-[1.8rem] shadow-inner">
        <button
          onClick={() => setView('table')}
          className={`p-3 rounded-2xl flex items-center gap-2 transition-all ${view === 'table' ? 'bg-white text-indigo-600 shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <FiList size={18} />
          <span className="text-[10px] font-black uppercase tracking-tighter">List</span>
        </button>
        <button
          onClick={() => setView('grid')}
          className={`p-3 rounded-2xl flex items-center gap-2 transition-all ${view === 'grid' ? 'bg-white text-indigo-600 shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <FiGrid size={18} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Grid</span>
        </button>
      </div>
    </div>
  );
}