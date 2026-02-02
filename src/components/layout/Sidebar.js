"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, UserCog, Clock, DollarSign, Briefcase,
  FolderKanban, Bell, Activity, FileText, Settings, Home,
  Package, Building2, Loader2, ChevronRight, Menu, X
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
      { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { name: "Activities", href: "/dashboard/activities", icon: Activity },
      { name: "Reports", href: "/dashboard/reports", icon: FileText },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Jab link pe click ho toh menu band ho jaye
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* 📱 Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[1000] p-3 bg-indigo-600 text-white rounded-xl md:hidden shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 🌫️ Dark Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[900] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🚀 Main Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-[950] w-72 bg-slate-950 border-r border-white/10
        flex flex-col transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:z-auto h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>

        {/* Branding Section - Forced White Text */}
        <div className="p-8 border-b border-white/5">
          <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">
            TERMINAL <span className="text-indigo-500 font-normal">OS</span>
          </h1>
        </div>

        {/* 🧭 Menu Navigation - overflow-y-auto is MUST */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
          {menu.map((group) => (
            <div key={group.section} className="opacity-100 visible">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 px-2">
                {group.section}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link key={item.href} href={item.href}>
                      <div className={`
                        flex items-center justify-between px-4 py-3 rounded-xl transition-all
                        ${active
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }
                      `}>
                        <div className="flex items-center gap-4">
                          <Icon size={18} className={active ? "text-white" : "text-slate-500"} />
                          <span className="text-[14px] font-bold block">{item.name}</span>
                        </div>
                        {active && <ChevronRight size={14} />}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Badge */}
        <div className="p-6 border-t border-white/5 bg-slate-950">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              SYSTEM ACTIVE
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}