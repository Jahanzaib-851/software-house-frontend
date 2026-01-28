"use client";

import React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiInfo
} from "react-icons/fi";
import activityService from "@/services/activity.service";
import { ActivityRow } from "./ActivityRow";

export const ActivityTable = ({ items = [], meta, onPageChange, refresh }) => {

  // Activity archive (delete) function
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to archive this log?")) {
      try {
        await activityService.delete(id);
        alert("Activity archived successfully");
        if (refresh) refresh();
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  // Agar backend se data empty array aaye toh ye show hoga
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
        <FiInfo size={48} className="text-slate-200 mb-4" />
        <h3 className="text-lg font-black text-slate-400 uppercase italic tracking-widest">
          No Activities Found
        </h3>
        <p className="text-slate-300 text-xs mt-2 uppercase font-bold tracking-tighter">
          Perform some actions to generate system logs
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/50 border-b-2 border-slate-100">
              <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action Type</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description & Device</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Module</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Time</th>
              <th className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {/* Safe Mapping: Check if items exists before mapping */}
            {items && items.map((item) => (
              <ActivityRow
                key={item._id}
                item={item}
                onDelete={() => handleDelete(item._id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION SECTION --- */}
      <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Current Page: {meta?.page || 1}
          </p>
          <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">
            Total Entries: {meta?.total || 0}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            disabled={meta?.page <= 1}
            onClick={() => onPageChange(meta.page - 1)}
            className="p-2.5 rounded-xl bg-white border-2 border-slate-200 text-slate-600 disabled:opacity-20 hover:border-slate-900 hover:text-white transition-all shadow-sm"
          >
            <FiChevronLeft size={20} />
          </button>

          <button
            disabled={meta?.page >= Math.ceil((meta?.total || 0) / (meta?.limit || 15))}
            onClick={() => onPageChange(meta.page + 1)}
            className="p-2.5 rounded-xl bg-white border-2 border-slate-200 text-slate-600 disabled:opacity-20 hover:border-slate-900 hover:text-white transition-all shadow-sm"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};