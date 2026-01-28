"use client";
import { FiPlus, FiBriefcase } from "react-icons/fi";

export default function ProjectHeader({ onAddClick, totalProjects = 0 }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
      {/* Left Side: Title & Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 p-2 rounded-xl">
            <FiBriefcase className="text-white" size={24} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">
            Project Nexus
          </h1>
        </div>
        <p className="text-slate-500 font-medium ml-12">
          Currently overseeing <span className="text-indigo-600 font-black">{totalProjects}</span> active development sprints
        </p>
      </div>

      {/* Right Side: Action Button */}
      <button
        onClick={onAddClick}
        className="group relative flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black tracking-widest hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-300 overflow-hidden"
      >
        {/* Hover Effect Layer */}
        <div className="absolute inset-0 w-0 bg-white/10 transition-all duration-300 group-hover:w-full" />

        <FiPlus strokeWidth={3} className="relative z-10 transition-transform group-hover:rotate-90" />
        <span className="relative z-10">NEW PROJECT</span>
      </button>
    </div>
  );
}