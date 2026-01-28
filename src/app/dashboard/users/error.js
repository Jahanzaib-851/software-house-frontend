"use client";
import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";
import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-rose-500 blur-3xl opacity-20 animate-pulse" />
          <div className="relative bg-rose-50 p-8 rounded-[2.5rem] border-2 border-rose-100">
            <FiAlertTriangle size={60} className="text-rose-500 mx-auto" />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">
            Protocol Breach
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-4 leading-relaxed">
            {error.message || "An unexpected error occurred during data synchronization with the core server."}
          </p>
          <code className="block mt-4 p-3 bg-slate-100 rounded-xl text-[10px] font-mono text-slate-400">
            ERROR_CODE: {error.digest || "FETCH_FAILED_500"}
          </code>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
          >
            <FiRefreshCw /> Re-initialize System
          </button>

          <Link
            href="/dashboard"
            className="w-full py-4 bg-white text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs border border-slate-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
          >
            <FiHome /> Back to Terminal
          </Link>
        </div>
      </div>
    </div>
  );
}