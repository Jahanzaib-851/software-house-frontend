"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  FiUser, FiMail, FiLock, FiShield,
  FiUserPlus, FiLogIn, FiActivity
} from "react-icons/fi";
import authService from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    // 🛡️ Rule 1: Role check
    if (!form.role) {
      toast.dismiss(); // Purane toasts hatao
      toast.warning("Protocol Error: Please select a System Role!");
      return;
    }

    setLoading(true);
    toast.dismiss(); // Har click par purane toasts clear karein
    const toastId = toast.loading("Checking registry for conflicts...");

    try {
      await authService.register(form);

      toast.update(toastId, {
        render: "Account Created! Redirecting to Login...",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

      // Redirect logic
      setTimeout(() => router.push("/auth/login"), 2000);

    } catch (err) {
      // 🔥 Rule 2: Already registered ya koi aur backend error handle karein
      const errorMessage = err.response?.data?.message || "Registration Denied by System";

      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 4000 // Error ko parhne ke liye zyada time
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-slate-100 transition-all hover:border-blue-100">

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg mb-4">
            <FiUserPlus size={30} />
          </div>
          <h2 className="text-3xl font-[900] text-slate-900 tracking-tighter uppercase">Register_Node</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Create Operator Identity</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">

          {/* Full Name */}
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-700 transition-all shadow-inner"
            />
          </div>

          {/* Email Address */}
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              required
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-700 transition-all shadow-inner"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              required
              placeholder="Security Key"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-700 transition-all shadow-inner"
            />
          </div>

          {/* Role Selection */}
          <div className="relative">
            <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-black text-slate-600 appearance-none text-[10px] uppercase tracking-widest cursor-pointer"
            >
              <option value="">Select Protocol Role</option>
              <option value="admin">Administrator</option>
              <option value="manager">Manager</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <FiActivity size={14} />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-slate-900'} text-white font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-[11px] flex items-center justify-center gap-2`}
          >
            {loading ? "Authorizing..." : "Initialize Registration"}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors"
          >
            <FiLogIn /> Access Existing Account
          </Link>
        </div>

      </div>
    </div>
  );
}