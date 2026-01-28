"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

// Feather icons - Stable and verified
import {
  FiLayout, FiActivity, FiLogOut, FiShield,
  FiUser, FiLoader, FiChevronDown
} from "react-icons/fi";

// Internal Components & Stores
import NotificationCenter from "../notifications/center/NotificationCenter";
import useNotificationStore from "@/store/useNotificationStore";
import useBrandingStore from "@/store/useBrandingStore";

const Header = () => {
  const pathname = usePathname();
  const fetchInitial = useNotificationStore((state) => state.fetchInitial);
  const { branding, loading, fetchBranding } = useBrandingStore();

  useEffect(() => {
    if (fetchInitial) fetchInitial();
    if (fetchBranding) fetchBranding();
  }, [fetchInitial, fetchBranding]);

  // Brand Name rendering logic
  const renderBrand = () => {
    if (!branding?.name) return <span>TERMINAL</span>;
    const parts = branding.name.split(" ");
    return parts.length === 1 ? (
      <span>{parts[0]}</span>
    ) : (
      <>
        {parts[0]} <span className="text-indigo-500">{parts.slice(1).join(" ")}</span>
      </>
    );
  };

  const navLinks = [
    { label: "Operations", href: "/dashboard", icon: <FiLayout size={16} /> },
    { label: "Broadcaster", href: "/dashboard/notifications/manage", icon: <FiActivity size={16} /> },
    { label: "Inbox", href: "/dashboard/notifications", icon: <FiShield size={16} /> },
  ];

  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-2xl border-b border-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.5)] sticky top-0 z-[100]">
      {/* Glow Effect Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      <div className="max-w-[1500px] mx-auto flex items-center justify-between h-24 px-8 md:px-12 relative">

        {/* 🏢 Left: Branding */}
        <div className="flex items-center gap-10">
          <Link href="/dashboard" className="flex items-center gap-4 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="relative p-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              <div className="bg-slate-950 rounded-xl p-1.5">
                <Image src="/images/logo.png" alt="Logo" width={45} height={45} priority className="drop-shadow-lg" />
              </div>
            </motion.div>

            <div className="flex flex-col">
              {loading ? (
                <div className="h-10 flex items-center"><FiLoader className="animate-spin text-indigo-500" size={20} /></div>
              ) : (
                <>
                  <motion.h1
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-white text-2xl font-black tracking-tighter uppercase italic leading-none group-hover:tracking-normal transition-all duration-300"
                  >
                    {renderBrand()}
                  </motion.h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="h-[2px] w-4 bg-indigo-500 rounded-full" />
                    <span className="text-[10px] text-slate-400 font-bold tracking-[0.4em] uppercase">
                      {branding?.version || "SYSTEM_INIT"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </Link>

          {/* 🧭 Nav */}
          <nav className="hidden xl:flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] p-1.5 rounded-2xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${isActive
                      ? "bg-indigo-600 text-white shadow-[0_10px_20px_rgba(79,70,229,0.3)]"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {link.icon} {link.label}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 🔔 Right Side */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-indigo-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-slate-900 border border-white/10 p-2.5 rounded-xl">
              {/* Added a safeguard check for NotificationCenter */}
              {NotificationCenter ? (
                <NotificationCenter />
              ) : (
                <div className="w-6 h-6 bg-slate-800 rounded animate-pulse" />
              )}
            </div>
          </div>

          <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent mx-2" />

          {/* User Section */}
          <div className="flex items-center gap-6">
            <Link href="/auth/login">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}
                className="hidden sm:flex items-center gap-2 px-6 py-3 bg-indigo-600/10 border border-indigo-500/50 text-indigo-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all duration-500"
              >
                <FiUser size={16} /> Login
              </motion.button>
            </Link>

            <div className="flex items-center gap-4 pl-4 border-l border-white/5 group cursor-pointer">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl border-2 border-indigo-500/30 p-1 group-hover:border-indigo-500 transition-colors duration-500 rotate-3 group-hover:rotate-0 overflow-hidden">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jahanzaib"
                    className="w-full h-full rounded-xl bg-slate-800 object-cover"
                    alt="User"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-slate-950 rounded-full shadow-lg" />
              </div>

              <div className="hidden lg:flex flex-col text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-white font-black uppercase tracking-tight">J. Hassan</span>
                  <FiChevronDown className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </div>
                <span className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest mt-0.5">System Admin</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.2, color: "#f43f5e" }}
                className="p-2 text-slate-600 transition-colors"
                onClick={() => console.log("Logout Clicked")}
              >
                <FiLogOut size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;