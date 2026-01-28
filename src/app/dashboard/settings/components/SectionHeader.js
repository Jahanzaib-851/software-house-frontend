"use client";

import React from "react";
import { FiSave, FiRefreshCw, FiCheckCircle, FiInfo } from "react-icons/fi";

export default function SectionHeader({
  title,
  subtitle,
  onSave,
  isLoading,
  isSuccess
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">

      {/* --- LEFT: TITLE & META --- */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.4)]" />
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
            {title}
          </h2>
        </div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 ml-5">
          <FiInfo className="text-indigo-500" /> {subtitle}
        </p>
      </div>

      {/* --- RIGHT: SMART ACTIONS --- */}
      <div className="flex items-center gap-3">
        {/* Status Indicator */}
        {isSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl animate-bounce">
            <FiCheckCircle className="text-emerald-500" />
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
              Changes Synced
            </span>
          </div>
        )}

        {/* Fancy Save Button */}
        <button
          onClick={onSave}
          disabled={isLoading}
          className={`
            relative group overflow-hidden px-8 py-4 rounded-[1.5rem] 
            flex items-center gap-3 transition-all duration-500
            ${isLoading
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-[0_20px_40px_rgba(79,70,229,0.2)] active:scale-95"
            }
          `}
        >
          {/* Internal Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 flex items-center gap-3">
            {isLoading ? (
              <FiRefreshCw className="animate-spin text-indigo-500" />
            ) : (
              <FiSave className="group-hover:rotate-12 transition-transform" />
            )}

            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {isLoading ? "Synchronizing..." : "Update Protocol"}
            </span>
          </div>

          {/* Bottom Loading Bar (Progressive) */}
          {isLoading && (
            <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 animate-[loading_2s_ease-in-out_infinite]" />
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; left: 0%; }
          50% { width: 100%; left: 0%; }
          100% { width: 0%; left: 100%; }
        }
      `}</style>
    </div>
  );
}