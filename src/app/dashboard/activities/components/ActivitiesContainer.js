"use client";

import { useState, useMemo } from "react";

import { useActivities } from "@/hooks/useActivities";
import { ActivityTable } from "./ActivityTable";
import { ActivityFilters } from "./ActivityFilters";
import { ActivityStats } from "./ActivityStats";
import { FiRefreshCcw, FiDownload, FiInfo, FiSearch } from "react-icons/fi";

export default function ActivitiesContainer({ isAdmin = false }) {
  const { data, meta, loading, filters, setFilters, refresh } = useActivities(isAdmin);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Export Logic (Professional feature for Audit Logs)
  const handleExport = () => {
    if (data.length === 0) return;
    const headers = ["ID", "Module", "Action", "Performed By", "IP Address", "Date"];
    const csvContent = data.map(log => [
      log._id, log.module, log.action, log.performedBy, log.ipAddress, log.createdAt
    ].join(",")).join("\n");

    const blob = new Blob([[headers.join(","), csvContent].join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* --- TOP SECTION: Title & Actions --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900">
              Audit Logs
            </h1>
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter">
              v2.0
            </span>
          </div>
          <p className="text-slate-500 font-medium flex items-center gap-2">
            <FiInfo className="text-indigo-500" />
            {isAdmin ? "Full system transparency enabled" : "Viewing your account's security history"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="group flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-bold uppercase text-xs tracking-widest hover:bg-slate-50 transition-all"
          >
            <FiDownload className="group-hover:translate-y-0.5 transition-transform" /> Export CSV
          </button>

          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <FiRefreshCcw className={loading ? "animate-spin" : ""} />
            {loading ? "Syncing..." : "Sync Logs"}
          </button>
        </div>
      </div>

      {/* --- STATS SECTION --- */}
      <ActivityStats data={data} loading={loading} />

      {/* --- CONTROL BAR: Search & Filters --- */}
      <div className="bg-white p-4 rounded-[2.5rem] border-2 border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-1/3">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search descriptions..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-slate-900 transition-all font-medium"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-2/3">
          <ActivityFilters
            filters={filters}
            onFilterChange={setFilters}
            isLoading={loading}
          />
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="relative rounded-[3.5rem] bg-white border-2 border-slate-100 overflow-hidden min-h-[550px] shadow-2xl shadow-slate-200/50">
        {loading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-20 flex items-center justify-center">
            <div className="loader-ring"></div>
          </div>
        )}

        {data.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-[500px] text-center p-10">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <FiInfo size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 italic uppercase">No Activities Found</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">Try adjusting your filters or date range to find what you're looking for.</p>
          </div>
        ) : (
          <ActivityTable
            items={data}
            meta={meta}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        )}
      </div>

      <style jsx>{`
        .loader-ring {
          width: 48px;
          height: 48px;
          border: 5px solid #f1f5f9;
          border-bottom-color: #0f172a;
          border-radius: 50%;
          display: inline-block;
          animation: rotation 1s linear infinite;
        }
        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}