"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiUserCheck,
  FiDollarSign,
  FiBriefcase,
  FiBox,
  FiActivity,
  FiShield,
  FiNavigation,
  FiTrendingUp,
} from "react-icons/fi";
import {
  AreaChart, Area, Tooltip, ResponsiveContainer
} from 'recharts';

import { toast } from "react-toastify";
import userService from "@/services/user.service";
import employeeService from "@/services/employee.service";
import payrollService from "@/services/payroll.service";
import activityService from "@/services/activity.service";
import assetService from "@/services/asset.service";
import notificationService from "@/services/notification.service";
import useAuth from "@/hooks/useAuth";

// 🔥 LOGIC 1: Safe Count for Users & Staff
const safeCount = (res) => {
  if (res == null) return "—";
  if (typeof res === "number") return res;
  if (Array.isArray(res)) return res.length;
  if (res.total != null) return res.total;
  if (res.count != null) return res.count;
  if (Array.isArray(res.data)) return res.data.length;
  return "—";
};

// Dummy Graph Data
const graphData = [
  { name: 'Mon', val: 400 }, { name: 'Tue', val: 700 }, { name: 'Wed', val: 500 },
  { name: 'Thu', val: 900 }, { name: 'Fri', val: 600 }, { name: 'Sat', val: 800 },
];

export default function DashboardPage() {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickMsg, setQuickMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [totalUsers, setTotalUsers] = useState("—");
  const [totalEmployees, setTotalEmployees] = useState("—");
  const [monthlyPayroll, setMonthlyPayroll] = useState("—");
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentAssets, setRecentAssets] = useState([]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [uRes, eRes, pRes, aRes, asRes] = await Promise.all([
        userService.getUsers?.(),
        employeeService.getEmployees?.(),
        payrollService.getPayrollList?.({ limit: 5 }),
        activityService.getMyActivities?.({ limit: 6 }),
        assetService.getAssets?.({ limit: 5 }),
      ]);

      // ✅ LOGIC 2: User & Staff Counts
      setTotalUsers(safeCount(uRes));
      setTotalEmployees(safeCount(eRes));

      // ✅ LOGIC 3: LATEST PAYROLL LOGIC (From your provided file)
      const payData = pRes?.data?.data || pRes?.data || pRes;
      if (payData?.stats) {
        setMonthlyPayroll(`$${(payData.stats.totalNet || 0).toLocaleString()}`);
      } else if (Array.isArray(payData)) {
        const sum = payData.reduce((s, p) => s + (p?.amount || 0), 0);
        setMonthlyPayroll(sum ? `$${sum.toLocaleString()}` : safeCount(pRes));
      } else if (payData?.totalAmount) {
        setMonthlyPayroll(`$${Number(payData.totalAmount).toLocaleString()}`);
      } else {
        setMonthlyPayroll(safeCount(pRes));
      }

      setRecentActivities(Array.isArray(aRes) ? aRes.slice(0, 5) : aRes?.data?.slice?.(0, 5) || []);
      setRecentAssets(Array.isArray(asRes) ? asRes.slice(0, 5) : asRes?.data?.slice?.(0, 5) || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const handleQuickDispatch = async () => {
    if (!quickMsg.trim()) return toast.error("Please type a message!");
    setIsSending(true);
    const toastId = toast.loading("Transmitting...");
    try {
      const payload = {
        message: quickMsg,
        recipients: [{ id: "6961f8793dfd32f5d57a9f13", model: "User" }],
        notificationType: "system",
        channels: ["in-app"]
      };
      await notificationService.createNotification(payload);
      toast.update(toastId, { render: "Dispatch Successful!", type: "success", isLoading: false, autoClose: 3000 });
      setQuickMsg("");
      loadDashboard();
    } catch (err) {
      toast.update(toastId, { render: "Failed to dispatch", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 sm:p-10 bg-[#fbfcfd] min-h-screen font-sans">

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-[900] text-slate-900 tracking-tight">Analytics_Hub</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              System Status: Active / {currentUser?.role || "Admin"}
            </p>
          </div>
        </div>
        <button onClick={loadDashboard} disabled={loading} className="px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all font-black text-[10px] uppercase tracking-widest text-slate-600 active:scale-95">
          {loading ? "Syncing..." : "Refresh Data"}
        </button>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-bold text-xs uppercase italic">{error}</div>}

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Users", val: totalUsers, icon: FiUsers, col: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Staff Count", val: totalEmployees, icon: FiUserCheck, col: "text-blue-600", bg: "bg-blue-50" },
          { label: "Gross Payroll", val: monthlyPayroll, icon: FiDollarSign, col: "text-violet-600", bg: "bg-violet-50" },
        ].map((stat, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className={`p-5 rounded-3xl ${stat.bg} ${stat.col}`}><stat.icon size={28} /></div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{loading ? "..." : stat.val}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- GRAPH SECTION --- */}
        <div className="lg:col-span-2 bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2 text-lg">
              <FiTrendingUp className="text-indigo-600" /> Performance_Flow
            </h3>
            <div className="flex gap-2">
              <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-3 py-1 rounded-lg uppercase">Live Feed</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: '900', fontSize: '12px', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- QUICK DISPATCH --- */}
        <div className="bg-slate-900 rounded-[3rem] p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-indigo-400 font-black italic uppercase tracking-tighter flex items-center gap-2 mb-6 text-xl">
              <FiNavigation /> Send_Signal
            </h3>
            <textarea
              value={quickMsg}
              onChange={(e) => setQuickMsg(e.target.value)}
              placeholder="Type system broadcast..."
              className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all min-h-[180px] placeholder:text-slate-600"
            />
          </div>
          <button
            onClick={handleQuickDispatch}
            disabled={isSending}
            className="w-full py-5 bg-white text-slate-900 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all active:scale-95 mt-6 relative z-10 shadow-xl disabled:opacity-50"
          >
            {isSending ? "Transmitting..." : "Transmit Now"}
          </button>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/20 blur-[80px] rounded-full" />
        </div>

        {/* --- RECENT ACTIVITY --- */}
        <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm lg:col-span-1">
          <h3 className="font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-2">
            <FiActivity className="text-indigo-600" /> Recent_Events
          </h3>
          <div className="space-y-4">
            {recentActivities.map((a, i) => (
              <div key={i} className="flex gap-4 p-4 hover:bg-slate-50 rounded-[2rem] transition-all group">
                <div className="w-1.5 h-10 bg-indigo-100 group-hover:bg-indigo-600 rounded-full transition-all" />
                <div>
                  <p className="text-[11px] font-black text-slate-800 uppercase leading-tight">{a.title || a.action || "System Log"}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">
                    {a.createdAt ? new Date(a.createdAt).toLocaleTimeString() : "Just Now"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- ASSET SNAPSHOT --- */}
        <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm lg:col-span-2">
          <h3 className="font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center gap-2 text-lg">
            <FiBox className="text-blue-600" /> Inventory_Snapshot
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentAssets.map((asset, i) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-[2rem] bg-[#f8fafc] border border-slate-50 hover:border-blue-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm text-blue-600"><FiBox size={18} /></div>
                  <span className="font-black text-slate-700 text-[11px] uppercase tracking-tight">{asset?.name || "Equipment"}</span>
                </div>
                <span className="text-[9px] font-black text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
                  ID: {asset?.assetTag || "N/A"}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}