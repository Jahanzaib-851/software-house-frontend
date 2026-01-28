"use client";
import React from "react";
import { FiAlertTriangle, FiInfo, FiSettings, FiUserPlus, FiCheckCircle } from "react-icons/fi";

const NotificationIcon = ({ type, size = "md" }) => {
  const sizes = { sm: "w-8 h-8 text-[16px]", md: "w-10 h-10 text-[20px]", lg: "w-14 h-14 text-[28px]" };

  const configs = {
    alert: { icon: <FiAlertTriangle />, bg: "bg-rose-50", text: "text-rose-500", border: "border-rose-100", glow: "shadow-[0_0_15px_rgba(244,63,94,0.3)]", animate: "animate-pulse" },
    info: { icon: <FiInfo />, bg: "bg-sky-50", text: "text-sky-500", border: "border-sky-100", glow: "" },
    system: { icon: <FiSettings />, bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", glow: "" },
    user: { icon: <FiUserPlus />, bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100", glow: "" },
    success: { icon: <FiCheckCircle />, bg: "bg-emerald-50", text: "text-emerald-500", border: "border-emerald-100", glow: "" }
  };

  const config = configs[type] || configs.info;

  return (
    <div className="relative inline-flex items-center justify-center">
      {type === "alert" && <span className="absolute inset-0 rounded-2xl bg-rose-400 opacity-20 animate-ping" />}
      <div className={`${sizes[size]} ${config.bg} ${config.text} ${config.border} ${config.glow} flex items-center justify-center rounded-2xl border transition-all duration-300`}>
        <span className={config.animate || ""}>{config.icon}</span>
      </div>
    </div>
  );
};

export default NotificationIcon;
