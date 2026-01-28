"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers, FiUserCheck, FiDollarSign, FiBriefcase,
  FiBox, FiActivity, FiShield, FiNavigation, FiTrendingUp, FiLogOut, FiCpu, FiArrowRight
} from "react-icons/fi";
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis } from 'recharts';

import { toast } from "react-toastify";
import userService from "@/services/user.service";
import employeeService from "@/services/employee.service";
import payrollService from "@/services/payroll.service";
import activityService from "@/services/activity.service";
import assetService from "@/services/asset.service";
import notificationService from "@/services/notification.service";
import useAuth from "@/hooks/useAuth";

// --- CORE LOGIC (Preserved) ---
const safeCount = (res) => {
  if (!res) return "0";
  const d = res?.data?.data || res?.data || res;
  if (typeof d === "number") return d;
  if (Array.isArray(d)) return d.length;
  if (d.total != null) return d.total;
  return d.count || "0";
};

// Dummy Trends Data
const graphData = [
  { name: '1', val: 400 }, { name: '2', val: 700 }, { name: '3', val: 500 },
  { name: '4', val: 900 }, { name: '5', val: 600 }, { name: '6', val: 800 },
];

export default function DashboardPage() {
  const { user: currentUser, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({ users: "—", staff: "—", payroll: "—" });
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentAssets, setRecentAssets] = useState([]);

  // 🔥 POWERFUL SYNC & AUTH GUARD
  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        userService.getUsers(),
        employeeService.getEmployees(),
        payrollService.getPayrollList({ limit: 5 }),
        activityService.getMyActivities({ limit: 8 }),
        assetService.getAssets({ limit: 6 })
      ]);

      // 🛡️ TOKEN EXPIRY REDIRECT LOGIC
      const isUnauthorized = results.some(r => r.status === 'rejected' && r.reason?.response?.status === 401);
      if (isUnauthorized) {
        toast.warning("Session Expired. Securely redirecting...");
        logout?.();
        router.push("/login");
        return;
      }

      // Extract Data from Fulfilled Promises
      const [uRes, eRes, pRes, aRes, asRes] = results.map(r => r.status === 'fulfilled' ? r.value : null);

      // ✅ PAYROLL LOGIC (Latest Working Version)
      let payrollVal = "0";
      const payData = pRes?.data?.data || pRes?.data || pRes;
      if (payData?.stats) payrollVal = `$${(payData.stats.totalNet || 0).toLocaleString()}`;
      else if (payData?.totalAmount) payrollVal = `$${Number(payData.totalAmount).toLocaleString()}`;
      else payrollVal = safeCount(pRes);

      setStats({
        users: safeCount(uRes),
        staff: safeCount(eRes),
        payroll: payrollVal
      });

      // ✅ ACTIVITY & ASSETS UPDATE LOGIC
      setRecentActivities(Array.isArray(aRes?.data?.items) ? aRes.data.items : (Array.isArray(aRes?.data) ? aRes.data : []));
      setRecentAssets(Array.isArray(asRes?.data?.items) ? asRes.data.items : (Array.isArray(asRes?.data) ? asRes.data : []));

    } catch (err) {
      console.error("Sync Error");
    } finally {
      setLoading(false);
    }
  }, [router, logout]);

  useEffect(() => {
    loadDashboard();
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadDashboard, 300000);
    return () => clearInterval(interval);
  }, [loadDashboard]);

  return (
    <div className="p-4 sm:p-8 bg-[#FDFDFD] min-h-screen text-slate-900 overflow-x-hidden">

      {/* 🚀 PREMIUM HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">CORE_OVERVIEW</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
              System Live: {currentUser?.role || "Operator"}
            </span>
          </div>
        </motion.div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={loadDashboard} className="flex-1 md:flex-none px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl active:scale-95">
            {loading ? "Syncing Nodes..." : "Forced Refresh"}
          </button>
          <button onClick={() => logout?.()} className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-colors">
            <FiLogOut size={20} />
          </button>
        </div>
      </div>

      {/* 📊 DYNAMIC METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: "User Database", val: stats.users, icon: FiUsers, color: "bg-indigo-600 shadow-indigo-200" },
          { label: "Active Staff", val: stats.staff, icon: FiUserCheck, color: "bg-emerald-600 shadow-emerald-200" },
          { label: "Gross Payroll", val: stats.payroll, icon: FiDollarSign, color: "bg-slate-900 shadow-slate-200" },
        ].map((item, i) => (
          <motion.div key={i} whileHover={{ y: -8 }} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden group">
            <div className={`p-4 rounded-2xl ${item.color} text-white w-fit mb-6 shadow-2xl`}>
              <item.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mt-1">{loading ? "..." : item.val}</h2>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* 📈 PERFORMANCE STREAM */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-10 relative z-10">
            <h3 className="font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
              <FiTrendingUp className="text-indigo-600" /> Data_Stream_Flow
            </h3>
          </div>
          <div className="h-[300px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData}>
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="val" stroke="#4f46e5" strokeWidth={5} fill="url(#grad)" />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ⚡ ACTIVITY FEED */}
        <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <h3 className="font-black italic uppercase tracking-widest flex items-center gap-2 mb-8 text-indigo-400">
            <FiActivity /> Live_Packets
          </h3>
          <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {recentActivities.length > 0 ? recentActivities.map((log, i) => (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={i} className="flex gap-4 group">
                <div className="w-1 h-8 bg-indigo-500 rounded-full group-hover:h-10 transition-all" />
                <div>
                  <p className="text-[11px] font-black uppercase tracking-tight text-indigo-100">{log.action || log.message}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">
                    {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : "Syncing"}
                  </p>
                </div>
              </motion.div>
            )) : <p className="text-[10px] font-bold text-slate-600 uppercase italic">Awaiting data...</p>}
          </div>
        </div>

        {/* 📦 INVENTORY SNAPSHOT (Updated) */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="font-black text-slate-900 uppercase tracking-tighter text-2xl">Global_Assets</h3>
            <div className="h-px flex-1 bg-slate-100" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {recentAssets.map((asset, i) => (
                <motion.div
                  key={asset._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                      <FiCpu size={24} />
                    </div>
                    <span className="text-[9px] font-black px-3 py-1 bg-slate-100 rounded-full uppercase text-slate-500 italic">
                      {asset.category || "Hardware"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase tracking-tight truncate">{asset.name || "System Unit"}</h4>
                    <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-tighter">SN: {asset.serialNumber || "SEC-00"}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${asset.status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-[9px] font-black uppercase text-slate-400">{asset.status || "Deployed"}</span>
                    </div>
                    <button className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all">
                      <FiArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}