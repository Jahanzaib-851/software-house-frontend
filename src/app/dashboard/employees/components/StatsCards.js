"use client";

import React from 'react';
import {
  UserGroupIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function StatsCards({ meta, employees }) {

  // 1. Role Calculation (Checking both employee and nested user object)
  const adminCount = employees?.filter(e =>
    e.role === 'admin' || e.user?.role === 'admin'
  ).length || 0;

  const managerCount = employees?.filter(e =>
    e.role === 'manager' || e.user?.role === 'manager'
  ).length || 0;

  // 2. Active Ratio (Based on status field)
  const activeCount = employees?.filter(e =>
    e.status === 'active' || e.status === 'Active'
  ).length || 0;

  const totalOnPage = employees?.length || 0;
  const ratioValue = totalOnPage > 0
    ? Math.round((activeCount / totalOnPage) * 100)
    : 0;

  const stats = [
    {
      label: "Total Personnel",
      value: meta?.total || 0, // Poore database ka total
      icon: UserGroupIcon,
      color: "bg-indigo-600",
      lightColor: "bg-indigo-50",
      textColor: "text-indigo-600",
      desc: "Registered Staff"
    },
    {
      label: "System Admins",
      value: adminCount,
      icon: ShieldCheckIcon,
      color: "bg-purple-600",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
      desc: "Full Access Users"
    },
    {
      label: "Managers",
      value: managerCount,
      icon: UserPlusIcon,
      color: "bg-blue-600",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
      desc: "Dept Supervisors"
    },
    {
      label: "Active Ratio",
      value: `${ratioValue}%`,
      icon: ChartBarIcon,
      color: "bg-emerald-600",
      lightColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      desc: "Operational Rate"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all duration-500 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-4 rounded-2xl ${stat.lightColor} ${stat.textColor} group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon className="w-6 h-6 stroke-[2px]" />
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Live</span>
          </div>

          <h3 className="text-3xl font-black text-slate-900 mb-1">{stat.value}</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>

          <div className="flex items-center gap-2">
            <div className={`w-1 h-1 rounded-full ${stat.color}`}></div>
            <p className="text-[9px] font-bold text-slate-400 italic">{stat.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}