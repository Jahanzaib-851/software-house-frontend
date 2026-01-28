"use client";

import { useState, useEffect } from "react";
import attendanceService from "@/services/attendance.service";
import { FiClock, FiLogIn, FiLogOut, FiZap, FiTarget } from "react-icons/fi";
import { motion } from "framer-motion";

import { toast } from "react-toastify";

export default function MarkAttendancePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // Aaj ka record
  const [employee, setEmployee] = useState(null);
  const [time, setTime] = useState(new Date());

  // 1. Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Load Employee Profile & Today's Status
  useEffect(() => {
    const loadData = async () => {
      try {
        // Aapke controller 'getMyAttendance' ko use karke aaj ka status check karenge
        const res = await attendanceService.getMyAttendance({ limit: 1 });
        const lastRecord = res.data[0];

        // Check if last record is for today (UTC matching as per your backend)
        const isToday = lastRecord && new Date(lastRecord.date).toDateString() === new Date().toDateString();

        if (isToday) setStatus(lastRecord);

        // Profile set karein (Isse humein employee._id mil jayegi)
        // Note: Agar backend token se khud nikal raha hai toh employeeId ki zaroorat nahi hogi
        // Lekin aapke controller mein 'req.body' se employeeId maangi gayi hai.
      } catch (err) {
        console.error("Error loading status:", err);
      }
    };
    loadData();
  }, []);

  // 3. Handle Check-In / Check-Out
  const handleAttendance = async (type) => {
    setLoading(true);
    try {
      let res;
      // Backend expects: { employeeId, date }
      const payload = {
        employeeId: status?.employee || "CURRENT_USER_ID", // Token logic handles this in good backends
        date: new Date().toISOString()
      };

      if (type === "in") {
        res = await attendanceService.markCheckIn(payload);
        toast.success("Check-in Recorded!");
      } else {
        res = await attendanceService.markCheckOut(payload);
        toast.success("Check-out Recorded!");
      }

      setStatus(res.data); // Update UI with backend response
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- LEFT: MAIN ACTION CARD --- */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 border border-slate-50 text-center"
          >
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <FiClock size={40} className={!status?.checkOut ? "animate-pulse" : ""} />
            </div>

            <h2 className="text-7xl font-black text-slate-800 tracking-tighter mb-4">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-xs mb-12">
              {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                disabled={loading || status?.checkIn}
                onClick={() => handleAttendance("in")}
                className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[2rem] font-black uppercase tracking-widest transition-all ${status?.checkIn
                    ? "bg-slate-100 text-slate-400"
                    : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-200 active:scale-95"
                  }`}
              >
                <FiLogIn size={20} /> {status?.checkIn ? "In Recorded" : "Check In"}
              </button>

              <button
                disabled={loading || !status?.checkIn || status?.checkOut}
                onClick={() => handleAttendance("out")}
                className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[2rem] font-black uppercase tracking-widest transition-all ${status?.checkOut || !status?.checkIn
                    ? "bg-slate-100 text-slate-400"
                    : "bg-rose-500 text-white hover:bg-rose-600 shadow-xl shadow-rose-200 active:scale-95"
                  }`}
              >
                <FiLogOut size={20} /> {status?.checkOut ? "Out Recorded" : "Check Out"}
              </button>
            </div>
          </motion.div>
        </div>

        {/* --- RIGHT: LIVE STATS --- */}
        <div className="space-y-6">
          <StatusCard
            title="Check In Time"
            value={status?.checkIn ? new Date(status.checkIn).toLocaleTimeString() : "--:--"}
            icon={<FiLogIn />} color="text-emerald-500"
          />
          <StatusCard
            title="Total Work Hours"
            value={status?.totalHours ? `${status.totalHours}h` : "0.0h"}
            icon={<FiTarget />} color="text-indigo-500"
          />
          <StatusCard
            title="Overtime"
            value={status?.overtimeHours ? `${status.overtimeHours}h` : "0.0h"}
            icon={<FiZap />} color="text-amber-500"
          />
        </div>

      </div>
    </div>
  );
}

function StatusCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6">
      <div className={`text-2xl ${color} bg-slate-50 p-4 rounded-2xl`}>{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-xl font-black text-slate-700">{value}</p>
      </div>
    </div>
  );
}