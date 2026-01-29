"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/auth.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LockClosedIcon,
  ShieldCheckIcon,
  KeyIcon,
  EnvelopeIcon,
  ChevronLeftIcon
} from "@heroicons/react/24/outline";

function ResetPasswordForm() {
  const router = useRouter();

  // States for all required backend fields
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    // 1. Basic Validation
    if (!email) return toast.error("Email is required");
    if (!otp) return toast.error("OTP is required");
    if (!password) return toast.error("New password is required");

    setLoading(true);
    const toastId = toast.loading("Verifying & Updating password...");

    try {
      // 2. Sending data with correct keys to match Backend
      await authService.resetPassword({
        email: email,
        otp: otp,
        newPassword: password
      });

      toast.update(toastId, {
        render: "✅ Password reset successful! Redirecting...",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });

      // Redirect to login after success
      setTimeout(() => router.push("/auth/login"), 2500);
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Reset failed. Check your OTP.";
      toast.update(toastId, {
        render: msg,
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <ToastContainer position="top-right" theme="colored" />

      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-100 w-full max-w-[440px] border border-gray-50 relative overflow-hidden">
        {/* Decorative Element */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>

        <div className="relative">
          {/* Back Button */}
          <button
            onClick={() => router.push("/auth/login")}
            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-sm font-bold mb-8 group"
          >
            <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>

          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
              <KeyIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Set New Password</h2>
            <p className="text-slate-500 mt-2 font-medium leading-relaxed">
              Enter your details and the OTP sent to your email.
            </p>
          </div>

          <div className="space-y-5">
            {/* Email Field */}
            <div className="group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-indigo-600 transition-colors">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                />
              </div>
            </div>

            {/* OTP Field */}
            <div className="group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-indigo-600 transition-colors">
                Verification OTP
              </label>
              <div className="relative">
                <ShieldCheckIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-indigo-600 transition-colors">
                New Secure Password
              </label>
              <div className="relative">
                <LockClosedIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                />
              </div>
            </div>

            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-indigo-600 active:scale-[0.97] transition-all shadow-xl shadow-slate-200 disabled:bg-slate-300 uppercase tracking-widest text-xs h-[60px] flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Updating...
                </div>
              ) : "Reset Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center font-bold text-slate-400">Loading reset form...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}