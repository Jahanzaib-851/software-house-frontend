"use client";

import { useEffect, useState, useCallback } from "react";
import payrollService from "@/services/payroll.service";
import PayrollTable from "./components/PayrollTable";
import PayrollStats from "./components/PayrollStats";
import GeneratePayrollModal from "./components/GeneratePayrollModal";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";

export default function PayrollPage() {
  const [loading, setLoading] = useState(true);
  const [payrolls, setPayrolls] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [stats, setStats] = useState({
    totalNet: 0,
    pendingCount: 0,
    paidCount: 0
  });

  // ✅ Simple Fetch: Sub data ek saath load hoga
  const fetchPayrolls = useCallback(async () => {
    setLoading(true);
    try {
      // Limit: 200 taake saare employees ka data mil jaye
      const response = await payrollService.getPayrollList({ limit: 200 });
      const result = response?.data?.data || response?.data || {};

      setPayrolls(Array.isArray(result.items) ? result.items : []);
      setStats(result.stats || { totalNet: 0, pendingCount: 0, paidCount: 0 });
    } catch (err) {
      console.error("Fetch Error:", err);
      setPayrolls([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayrolls();
  }, [fetchPayrolls]);

  return (
    <div className="p-6 lg:p-10 bg-[#f4f7fe] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Payroll System</h1>
          <p className="text-slate-500 text-sm font-medium">Full Salary Records</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchPayrolls}
            className="bg-white p-3 rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            <FiRefreshCw className={loading ? "animate-spin text-indigo-600" : "text-slate-600"} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg"
          >
            <FiPlus /> Generate Payroll
          </button>
        </div>
      </div>

      <PayrollStats stats={stats} />

      {/* ✅ Filters Remove kar diye hain, Table direct stats ke baad aayegi */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mt-8">
        <PayrollTable data={payrolls} loading={loading} onRefresh={fetchPayrolls} />
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <GeneratePayrollModal
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false);
              fetchPayrolls();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}