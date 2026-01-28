import { Suspense } from "react";

import ActivitiesContainer from "./components/ActivitiesContainer";
import { FiActivity, FiShield, FiCpu } from "react-icons/fi";

// Metadata for SEO & System Security Headers
export const metadata = {
  title: "Audit Ledger | Enterprise Security",
  description: "Real-time monitoring of system-wide activities and administrative logs.",
};

/**
 * ActivitiesPage - Advanced Server Entry
 * Logic: Suspense use kiya gaya hai taake Container ka data fetch 
 * hote waqt loading.jsx fallback automatically trigger ho jaye.
 */
export default async function ActivitiesPage() {

  return (
    <main className="relative p-4 md:p-10 max-w-[1600px] mx-auto min-h-screen space-y-10">

      {/* --- ADVANCED PAGE HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-2 border-slate-50 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900 text-white rounded-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <FiShield size={24} />
            </div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              Audit Ledger
            </h1>
          </div>
          <p className="text-slate-500 font-medium max-w-xl text-sm md:text-base leading-relaxed">
            System-level event tracking enabled. Monitoring <span className="text-black font-bold uppercase tracking-tighter italic px-2 bg-slate-100 rounded">Live Traffic</span> and administrative overrides.
          </p>
        </div>

        {/* Real-time Status Indicator */}
        <div className="hidden lg:flex items-center gap-4 bg-white border-2 border-slate-100 px-6 py-4 rounded-[2rem] shadow-sm">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-500 animate-pulse" />
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
              <FiCpu size={12} className="text-slate-400" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Status</p>
            <p className="text-xs font-bold text-slate-900">ACTIVE MONITORING</p>
          </div>
        </div>
      </header>

      {/* --- CORE LOGIC WITH SUSPENSE --- */}
      {/* Suspense ensures that the skeleton (loading.jsx) 
        is shown perfectly while the client-side hook fetches data 
      */}
      <Suspense fallback={<p className="text-center p-20 font-black italic animate-pulse">BOOTING MODULE...</p>}>
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <ActivitiesContainer isAdmin={true} />
        </div>
      </Suspense>

      {/* --- BACKGROUND DECOR (Enterprise Feel) --- */}
      <div className="fixed top-0 right-0 -z-10 opacity-[0.03] pointer-events-none">
        <FiActivity size={600} className="rotate-12 translate-x-32 -translate-y-20 text-slate-900" />
      </div>

    </main>
  );
}