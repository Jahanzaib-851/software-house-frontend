"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/auth.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronLeftIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ----- Logic (Same as before, with Toastify) -----
  const handleSubmit = async () => {
    if (!email) return toast.error("Please enter your email address");

    setLoading(true);
    const toastId = toast.loading("Sending reset link...");

    try {
      await authService.forgotPassword(email);
      toast.update(toastId, {
        render: "Reset link sent! Check your email. ✅",
        type: "success",
        isLoading: false,
        autoClose: 4000
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error sending reset link.";
      toast.update(toastId, {
        render: errorMsg,
        type: "error",
        isLoading: false,
        autoClose: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <ToastContainer position="top-right" theme="colored" />

      <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-indigo-100 w-full max-w-[440px] border border-gray-50 relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>

        <div className="relative">
          <button
            onClick={() => router.push("/auth/login")}
            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors text-sm font-bold mb-8 group"
          >
            <ChevronLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>

          <div className="mb-8 text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Forgot Password
            </h2>
            <p className="text-slate-500 mt-3 font-medium leading-relaxed">
              Don't worry! Enter your email and we'll send you instructions to reset your password.
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <label className="text-xs font-black text-slate-400 uppercase tracking-[0.1em] block mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all duration-200 font-bold text-slate-700"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-100 disabled:bg-indigo-300 uppercase tracking-widest text-xs"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}