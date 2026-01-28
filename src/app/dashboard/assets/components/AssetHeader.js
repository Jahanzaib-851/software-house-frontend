"use client";
import { FiPlus, FiCpu, FiSearch, FiFilter, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AssetHeader({ onAddClick, totalAssets = 0, searchTerm, setSearchTerm, category, setCategory }) {

  // Backend ASSET_CATEGORY enum ke mutabiq categories
  const categories = ["hardware", "software", "furniture", "license"];

  return (
    <div className="flex flex-col gap-8 mb-12">
      {/* 1. Top Section: Branding & CTA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-amber-500 shadow-2xl shadow-slate-300 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-amber-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <FiCpu size={36} strokeWidth={1.5} className="relative z-10" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-500 rounded-tl-2xl flex items-center justify-center text-slate-900">
              <FiActivity size={14} strokeWidth={3} />
            </div>
          </motion.div>

          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Asset <span className="text-amber-500 italic">Vault</span>
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="h-[2px] w-8 bg-amber-500 rounded-full" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                System Inventory: {totalAssets} Resources
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onAddClick}
          className="relative group overflow-hidden bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.15em] transition-all hover:shadow-2xl hover:shadow-amber-200 active:scale-95"
        >
          <div className="absolute inset-0 bg-amber-500 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10 flex items-center gap-3 group-hover:text-slate-900 transition-colors">
            <FiPlus size={20} strokeWidth={3} /> Register New Asset
          </span>
        </button>
      </div>

      {/* 2. Bottom Section: Smart Search & Category Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors">
            <FiSearch size={20} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Serial Number, Name or Remarks..."
            className="w-full pl-16 pr-6 py-5 bg-white border-none rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] focus:ring-4 focus:ring-amber-500/10 outline-none font-bold text-slate-700 placeholder:text-slate-300 transition-all"
          />
        </div>

        {/* Category Pill Filters (Backend Sync) */}
        <div className="flex items-center gap-2 p-2 bg-slate-100/50 rounded-[2rem] overflow-x-auto no-scrollbar border border-slate-100">
          <button
            onClick={() => setCategory("")}
            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!category ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {cat}
            </button>
          ))}
          <div className="h-6 w-[1px] bg-slate-200 mx-2" />
          <div className="px-4 text-slate-300">
            <FiFilter size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}