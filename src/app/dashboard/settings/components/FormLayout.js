"use client";

import React from "react";

export default function FormLayout({ title, description, children, icon }) {
  return (
    <div className="group relative mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* --- SECTION DIVIDER & DECORATION --- */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center justify-center w-12 h-12 rounded-[1.2rem] bg-slate-900 text-white shadow-2xl shadow-slate-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          {icon}
        </div>
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 leading-none">
            {title}
          </h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {description}
          </p>
        </div>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-slate-100 via-slate-50 to-transparent ml-4" />
      </div>

      {/* --- GRID CONTAINER --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 relative">
        {/* Subtle Vertical Grid Lines (Desktop Only) */}
        <div className="hidden lg:block absolute left-1/3 top-0 w-[1px] h-full bg-slate-50/50" />
        <div className="hidden lg:block absolute left-2/3 top-0 w-[1px] h-full bg-slate-50/50" />

        {children}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: ADVANCED INPUT FIELD ---
export const SettingField = ({ label, icon, children, helperText }) => (
  <div className="space-y-3 group/field">
    <div className="flex items-center gap-2 ml-1">
      <span className="text-slate-400 group-hover/field:text-indigo-500 transition-colors duration-300">
        {icon}
      </span>
      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover/field:text-slate-900 transition-colors duration-300">
        {label}
      </label>
    </div>

    <div className="relative">
      {children}

      {/* Hover Underline Glow */}
      <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-indigo-500/30 group-hover/field:w-full transition-all duration-500 rounded-full" />
    </div>

    {helperText && (
      <p className="text-[8px] font-bold italic text-slate-300 ml-1">
        * {helperText}
      </p>
    )}
  </div>
);