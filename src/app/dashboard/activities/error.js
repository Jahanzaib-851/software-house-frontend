"use client";

import { useEffect } from "react";
import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Backend log error monitor karne ke liye
    console.error("Activity Module Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center text-5xl mb-6 animate-bounce">
        <FiAlertTriangle />
      </div>

      <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 mb-2">
        System Malfunction
      </h2>
      <p className="text-slate-500 font-medium max-w-md mb-8 italic">
        The audit logs could not be retrieved. This could be due to a connection timeout or a database sync error.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all"
        >
          <FiRefreshCw /> Attempt Recovery
        </button>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:border-slate-900 hover:text-black transition-all"
        >
          <FiHome /> Back to Terminal
        </Link>
      </div>

      <div className="mt-12 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
          Technical Trace: {error.message || "Unknown Runtime Error"}
        </p>
      </div>
    </div>
  );
}