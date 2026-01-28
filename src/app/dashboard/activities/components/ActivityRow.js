"use client";

import React, { useState } from "react";
import { getActivityConfig } from "@/utils/activity.helpers";
import { formatDistanceToNow } from "date-fns";
import {
  FiMonitor,
  FiMapPin,
  FiClock,
  FiChevronRight,
  FiTrash2,
  FiUser,
  FiActivity
} from "react-icons/fi";
import { useRouter } from "next/navigation";

export const ActivityRow = ({ item, onDelete }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Backend Action se Config lena (Icon, Color, Label)
  const config = getActivityConfig(item.action);
  const { icon, color, label } = config || {
    icon: <FiActivity />,
    color: "bg-slate-50 border-slate-200 text-slate-400",
    label: item.action
  };

  // 2. Row par click karne se Detail Page par bhejna
  const handleRowClick = () => {
    router.push(`/dashboard/activities/${item._id}`);
  };

  // 3. Delete button handle karna
  const internalDelete = async (e) => {
    e.stopPropagation(); // Row click trigger na ho
    setIsDeleting(true);
    try {
      await onDelete(); // Table se aaya hua function
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr
      onClick={handleRowClick}
      className={`
        group border-b border-slate-50 hover:bg-slate-50/80 transition-all duration-300 cursor-pointer
        ${isDeleting ? "opacity-50 pointer-events-none bg-rose-50/20" : ""}
      `}
    >
      {/* --- COLUMN 1: ACTION TYPE --- */}
      <td className="p-5">
        <div className="flex items-center gap-4">
          <div className={`
            w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm border-2 
            transition-transform group-hover:scale-110 duration-500
            ${color}
          `}>
            {icon}
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
              Action Type
            </p>
            <h4 className="text-sm font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              {label}
            </h4>
          </div>
        </div>
      </td>

      {/* --- COLUMN 2: INTEL (Description & Device) --- */}
      <td className="p-5">
        <div className="max-w-xs">
          <p className="text-sm font-bold text-slate-700 leading-tight mb-2 line-clamp-1 group-hover:line-clamp-none transition-all">
            {item.description}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-md shadow-sm">
              <FiMonitor size={10} />
              {item.userAgent?.includes("Windows") ? "Windows PC" : "System Agent"}
            </span>
            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-indigo-400 bg-indigo-50/50 border border-indigo-100 px-2 py-0.5 rounded-md shadow-sm">
              <FiMapPin size={10} /> {item.ipAddress || "Internal"}
            </span>
          </div>
        </div>
      </td>

      {/* --- COLUMN 3: TARGET/MODULE --- */}
      <td className="p-5">
        <div className="flex flex-col gap-1">
          <div className="bg-slate-900 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] w-fit italic shadow-md">
            {item.module}
          </div>
          <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 px-1">
            <FiUser size={10} /> {item.performedBy?.slice(-6) || "SYS"}
          </span>
        </div>
      </td>

      {/* --- COLUMN 4: TIMESTAMP --- */}
      <td className="p-5">
        <div className="flex items-center gap-2 text-slate-400">
          <FiClock size={14} className="group-hover:text-indigo-500 transition-colors" />
          <span className="text-xs font-bold tracking-tighter uppercase whitespace-nowrap">
            {item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }) : "Recent"}
          </span>
        </div>
      </td>

      {/* --- COLUMN 5: CONTROL BUTTONS --- */}
      <td className="p-5 text-right">
        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

          {/* ARCHIVE/DELETE BUTTON */}
          <button
            onClick={internalDelete}
            disabled={isDeleting}
            className="
              w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 
              hover:bg-rose-500 hover:text-white hover:border-rose-500 
              hover:rotate-12 active:scale-90 transition-all duration-300 shadow-sm
              flex items-center justify-center
            "
            title="Archive this log"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiTrash2 size={18} />
            )}
          </button>

          {/* VIEW DETAIL BUTTON */}
          <div className="
            w-10 h-10 rounded-xl bg-slate-900 text-white border border-slate-900
            hover:bg-white hover:text-slate-900 transition-all duration-300 
            shadow-lg flex items-center justify-center
          ">
            <FiChevronRight size={22} />
          </div>
        </div>
      </td>
    </tr>
  );
};