"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import payrollService from "@/services/payroll.service";
import {
  FiPrinter, FiArrowLeft, FiCheckCircle, FiClock,
  FiUser, FiCalendar, FiBriefcase, FiDollarSign, FiFileText
} from "react-icons/fi";
import { motion } from "framer-motion";

import { toast } from "react-toastify";
export default function PayrollDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await payrollService.getPayrollById(id);
        console.log("Detail API Response:", res.data); // Console check karein

        // ✅ Data nikalne ki flexible logic
        const record = res.data?.data || res.data;

        if (record) {
          setData(record);
        } else {
          toast.error("Record format sahi nahi hai");
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Salary record nahi mil saka!");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-slate-500 animate-pulse">Loading Slip...</p>
      </div>
    );
  }

  // ✅ Agar loading khatam ho jaye aur phir bhi data na ho
  if (!data) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Record Not Found!</h2>
        <p className="text-slate-500 mb-6">Database se ye record nahi mil raha.</p>
        <button onClick={() => router.back()} className="text-indigo-600 font-bold underline">Wapis Jayein</button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-[#f8fafc] min-h-screen font-sans">
      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-600 font-bold hover:text-indigo-600">
          <FiArrowLeft /> Back
        </button>
        <button onClick={handlePrint} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2">
          <FiPrinter /> Print Slip
        </button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden print:shadow-none print:border-none">

        {/* Header */}
        <div className="bg-slate-900 p-8 text-white flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black italic">SALARY SLIP</h1>
            <p className="text-indigo-400 font-bold mt-2">
              {new Date(2025, (data.month || 1) - 1).toLocaleString('default', { month: 'long' })} {data.year}
            </p>
          </div>
          <div className="text-right">
            <p className="font-black text-xl">HR SOLUTIONS</p>
            <p className="text-xs text-slate-400">Slip ID: {id.slice(-6).toUpperCase()}</p>
          </div>
        </div>

        <div className="p-10">
          {/* Employee Info Section */}
          <div className="flex items-center gap-6 mb-12 border-b pb-10">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400">
              <FiUser size={40} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800">
                {/* ✅ Modal wala name ya populate wala name */}
                {data.employeeName || data.employee?.fullName || "Employee Name"}
              </h3>
              <p className="text-slate-500 font-bold flex items-center gap-2">
                <FiBriefcase /> {data.employee?.designation || "Staff Member"}
              </p>
            </div>
            <div className="ml-auto text-right">
              {data.paymentStatus === 'paid' ?
                <span className="text-emerald-500 font-black border border-emerald-500 px-4 py-1 rounded-full text-xs italic">PAID</span> :
                <span className="text-amber-500 font-black border border-amber-500 px-4 py-1 rounded-full text-xs italic">PENDING</span>
              }
            </div>
          </div>

          {/* Money Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h4 className="font-black border-b pb-2 uppercase text-xs tracking-widest">Earnings</h4>
              <div className="flex justify-between"><span>Basic Salary</span> <b>Rs. {data.salary?.basicSalary || 0}</b></div>
              <div className="flex justify-between"><span>Allowances</span> <b>Rs. {data.salary?.allowances || 0}</b></div>
              <div className="flex justify-between"><span>Bonuses</span> <b>Rs. {data.salary?.bonuses || 0}</b></div>
            </div>
            <div className="space-y-4">
              <h4 className="font-black border-b pb-2 uppercase text-xs tracking-widest text-red-500">Deductions</h4>
              <div className="flex justify-between text-red-500"><span>Tax/Deductions</span> <b>- Rs. {data.salary?.deductions || 0}</b></div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="mt-12 bg-indigo-600 p-8 rounded-[2rem] text-white flex justify-between items-center shadow-xl shadow-indigo-100">
            <div>
              <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Net Payable</p>
              <h2 className="text-5xl font-black">Rs. {data.calculations?.netSalary || data.netSalary || "0"}</h2>
            </div>
            <FiDollarSign size={50} className="opacity-20" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}