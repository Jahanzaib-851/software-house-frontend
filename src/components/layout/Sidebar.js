"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import useNotificationStore from "@/store/useNotificationStore";
import useBrandingStore from "@/store/useBrandingStore";
// Import icons (ensure lucide-react is installed)
import {
  LayoutDashboard, Users, UserCog, Clock, DollarSign, Briefcase,
  FolderKanban, Bell, Activity, FileText, Settings, Home,
  Package, Building2, Loader2, ChevronRight
} from "lucide-react";

const menu = [
  {
    section: "Main",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Landing Page", href: "/", icon: Home },
    ],
  },
  {
    section: "People",
    items: [
      { name: "Users", href: "/dashboard/users", icon: Users },
      { name: "Employees", href: "/dashboard/employees", icon: UserCog },
      { name: "Attendance", href: "/dashboard/attendance", icon: Clock },
      { name: "Payroll", href: "/dashboard/payroll", icon: DollarSign },
    ],
  },
  {
    section: "Business",
    items: [
      { name: "Clients", href: "/dashboard/clients", icon: Building2 },
      { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
      { name: "Rooms", href: "/dashboard/rooms", icon: Briefcase },
      { name: "Assets", href: "/dashboard/assets", icon: Package },
      { name: "Finance", href: "/dashboard/finance", icon: DollarSign },
    ],
  },
  {
    section: "System",
    items: [
      { name: "Notifications", href: "/dashboard/notifications", icon: Bell, isNotification: true },
      { name: "Activities", href: "/dashboard/activities", icon: Activity },
      { name: "Reports", href: "/dashboard/reports", icon: FileText },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const { branding, loading, fetchBranding } = useBrandingStore();

  useEffect(() => {
    if (fetchBranding) fetchBranding();
  }, [fetchBranding]);

  const renderBrandName = () => {
    // Safety check for branding name
    if (!branding?.name) return <span>TERMINAL</span>;
    const parts = branding.name.split(" ");
    return parts.length === 1 ? <span>{parts[0]}</span> : (
      <>{parts[0]} <span className="text-indigo-500">{parts.slice(1).join(" ")}</span></>
    );
  };

  return (
    <aside className="w-80 min-h-screen bg-slate-950 text-slate-200 px-6 py-8 overflow-y-auto border-r border-white/5 relative">
      <div className="absolute top-0 left-0 w-full h-64 bg-indigo-600/5 blur-[100px] pointer-events-none" />

      {/* 🚀 Branding Section */}
      <div className="mb-10 relative">
        {loading ? (
          <div className="flex h-16 items-center justify-center bg-white/5 rounded-2xl border border-white/5">
            <Loader2 className="animate-spin text-indigo-500" size={24} />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 shadow-2xl text-center group"
          >
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic leading-tight group-hover:scale-105 transition-transform duration-500">
              {renderBrandName()}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="h-[1px] w-4 bg-indigo-500/50" />
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">
                {branding?.version || "OS V2026"}
              </p>
              <span className="h-[1px] w-4 bg-indigo-500/50" />
            </div>
          </motion.div>
        )}
      </div>

      {/* 🧭 Menu */}
      <nav className="space-y-8 relative z-10">
        {menu.map((group) => (
          <div key={group.section}>
            <div className="flex items-center gap-3 mb-4 px-2">
              <span className="h-[1px] w-4 bg-slate-800" />
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                {group.section}
              </p>
            </div>

            <ul className="space-y-1.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                const IconComponent = item.icon;

                return (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-500 group relative
                          ${active
                            ? "bg-indigo-600 shadow-[0_10px_30px_rgba(79,70,229,0.3)] text-white"
                            : "hover:bg-white/5 text-slate-400 hover:text-white border border-transparent hover:border-white/5"
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg transition-colors ${active ? "bg-white/20" : "bg-slate-900 group-hover:bg-indigo-500/10 group-hover:text-indigo-400"}`}>
                            {/* Safety check: Only render if icon exists */}
                            {IconComponent ? <IconComponent size={18} strokeWidth={2.5} /> : <div className="w-[18px]" />}
                          </div>
                          <span className="text-[13px] font-bold tracking-wide">{item.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.isNotification && unreadCount > 0 && (
                            <span className="h-5 min-w-[20px] flex items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-lg shadow-rose-500/40">
                              {unreadCount}
                            </span>
                          )}
                          {active && (
                            <ChevronRight size={14} className="opacity-50" />
                          )}
                        </div>
                      </motion.div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-10 p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20">
        <p className="text-[9px] font-bold text-indigo-400 uppercase text-center tracking-widest leading-relaxed">
          Enterprise Grade <br /> Protocol Active
        </p>
      </div>
    </aside>
  );
}