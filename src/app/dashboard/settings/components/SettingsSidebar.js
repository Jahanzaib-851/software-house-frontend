"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiSettings,
  FiShield,
  FiMail,
  FiActivity,
  FiChevronRight
} from "react-icons/fi";

const NAV_ITEMS = [
  {
    label: "General",
    desc: "Branding & Identity",
    path: "/dashboard/settings/general",
    icon: <FiSettings />,
    color: "group-hover:text-blue-500",
  },
  {
    label: "Security",
    desc: "Auth & Protocols",
    path: "/dashboard/settings/security",
    icon: <FiShield />,
    color: "group-hover:text-emerald-500",
  },
  {
    label: "Communication",
    desc: "SMTP & Alerts",
    path: "/dashboard/settings/communication",
    icon: <FiMail />,
    color: "group-hover:text-purple-500",
  },
];

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 p-2">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.path;

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`
              group relative flex items-center justify-between p-4 rounded-[2rem] 
              transition-all duration-500 ease-out overflow-hidden
              ${isActive
                ? "bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-2"
                : "hover:bg-slate-50 text-slate-500 hover:translate-x-1"
              }
            `}
          >
            {/* Active Glow Effect */}
            {isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent opacity-50" />
            )}

            <div className="flex items-center gap-4 relative z-10">
              {/* Icon Container */}
              <div className={`
                w-10 h-10 rounded-2xl flex items-center justify-center text-xl
                transition-all duration-500
                ${isActive
                  ? "bg-white/10 text-white rotate-[360deg]"
                  : `bg-white border border-slate-100 shadow-sm ${item.color}`
                }
              `}>
                {item.icon}
              </div>

              {/* Text Area */}
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1
                  ${isActive ? "text-indigo-400" : "text-slate-400"}
                `}>
                  {item.label}
                </p>
                <p className={`text-[9px] font-bold italic transition-all duration-500
                  ${isActive ? "text-slate-300" : "text-slate-300 group-hover:text-slate-500"}
                `}>
                  {item.desc}
                </p>
              </div>
            </div>

            {/* Fancy Arrow Indicator */}
            <div className={`
              transition-all duration-500 transform
              ${isActive ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}
            `}>
              <FiChevronRight className={isActive ? "text-indigo-400" : "text-slate-300"} />
            </div>

            {/* Modern Bottom Border Trace */}
            {isActive && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
            )}
          </Link>
        );
      })}

      {/* --- SYSTEM AUDIT LINK (Bottom Spacer) --- */}
      <div className="mt-10 pt-6 border-t border-slate-100/50">
        <Link
          href="/dashboard/activities"
          className="flex items-center gap-3 px-6 py-4 text-slate-400 hover:text-slate-900 transition-colors group"
        >
          <FiActivity className="group-hover:rotate-180 transition-transform duration-700" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">System Logs</span>
        </Link>
      </div>
    </nav>
  );
}