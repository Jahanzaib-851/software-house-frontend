"use client";

import React from "react";
import SettingsSidebar from "./components/SettingsSidebar";

export default function SettingsLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] selection:bg-indigo-100">
      {/* Background Decorative Elements - Fancy Touch */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-slate-200 rounded-full blur-[100px] opacity-40" />
      </div>

      <div className="max-w-[1600px] mx-auto p-4 md:p-10">
        {/* --- HEADER WITH FLOATING EFFECT --- */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="group">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-[2px] bg-indigo-600 group-hover:w-16 transition-all duration-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">
                Protocol v2.0
              </span>
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
              System <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">Architecture</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md p-2 rounded-2xl border border-white shadow-sm">
            <div className="px-4 py-2 text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Environment</p>
              <p className="text-xs font-bold text-slate-900">Production Node</p>
            </div>
            <div className="h-10 w-[1px] bg-slate-200" />
            <div className="px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-slate-900 uppercase">Live</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* --- SIDEBAR WITH HOVER EFFECTS --- */}
          <aside className="lg:col-span-3 sticky top-10 z-20">
            <div className="relative group">
              {/* Decorative Glow behind sidebar */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-slate-400 rounded-[2.6rem] blur opacity-5 group-hover:opacity-15 transition duration-1000 group-hover:duration-200" />

              <div className="relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/50 p-3 shadow-xl shadow-slate-200/50">
                <SettingsSidebar />
              </div>
            </div>

            {/* Fancy System Status Card */}
            <div className="mt-8 p-8 bg-slate-900 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-slate-900/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Core Security</p>
                <p className="text-slate-300 text-xs font-medium leading-relaxed italic">
                  "All configurations are encrypted and logged in the system audit trail."
                </p>
              </div>
            </div>
          </aside>

          {/* --- MAIN CONTENT WITH GLASS CARD --- */}
          <main className="lg:col-span-9 relative">
            <div className="relative bg-white/70 backdrop-blur-md rounded-[3.5rem] border border-white shadow-2xl shadow-slate-200/60 min-h-[700px] overflow-hidden">
              {/* Internal subtle glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

              <div className="p-8 md:p-14">
                {children}
              </div>
            </div>

            {/* Footer Tag */}
            <div className="mt-8 flex justify-center">
              <div className="px-6 py-2 bg-slate-100 rounded-full">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em]">
                  Terminal Console System Registry
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}