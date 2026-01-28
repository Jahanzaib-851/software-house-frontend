"use client";

import { useState, useEffect, Suspense } from "react"; // Suspense add kiya
import { useRouter, useSearchParams } from "next/navigation";
import authService from "@/services/auth.service";
import userService from "@/services/user.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- 1. Alag Component banaya taake useSearchParams build error na de ---
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sessionStatus = searchParams.get("session");
    if (sessionStatus === "expired") {
      toast.error("🔒 Session Expired! Please login again.", {
        toastId: "session-expired-unique",
      });
    }
  }, [searchParams]);

  const showMessage = (msg, type = "info") => {
    if (type === "success") toast.success(msg);
    else if (type === "error") toast.error(msg);
    else toast.info(msg);
  };

  const handleLogin = async () => {
    if (!email || !password) return showMessage("Please enter email and password", "error");
    setLoading(true);
    const toastId = toast.loading("Logging in...");
    try {
      const data = await authService.login({ email, password });
      if (data.accessToken) localStorage.setItem("softwarehouse_token", data.accessToken);
      if (data.refreshToken) localStorage.setItem("softwarehouse_refresh", data.refreshToken);
      toast.update(toastId, { render: "✅ Login successful!", type: "success", isLoading: false, autoClose: 3000 });
      router.push("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Login failed! Please check credentials.";
      toast.update(toastId, { render: msg, type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("softwarehouse_token");
    localStorage.removeItem("softwarehouse_refresh");
    showMessage("✅ Logged out successfully", "success");
    router.push("/auth/login");
  };

  const handleRefreshToken = async () => {
    setLoading(true);
    const toastId = toast.loading("Refreshing token...");
    try {
      const data = await authService.refreshToken();
      if (data.accessToken) localStorage.setItem("softwarehouse_token", data.accessToken);
      if (data.refreshToken) localStorage.setItem("softwarehouse_refresh", data.refreshToken);
      toast.update(toastId, { render: "✅ Token refreshed successfully", type: "success", isLoading: false, autoClose: 3000 });
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Token refresh failed! Please login again.";
      toast.update(toastId, { render: msg, type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestUser = async () => {
    if (!email) return showMessage("Enter email of test user to delete", "error");
    setLoading(true);
    const toastId = toast.loading(`Deleting test user: ${email}...`);
    try {
      await userService.deleteUser(email);
      toast.update(toastId, { render: `✅ Test user ${email} deleted`, type: "success", isLoading: false, autoClose: 3000 });
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Delete failed!";
      toast.update(toastId, { render: msg, type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <ToastContainer position="top-right" theme="colored" />
      <div className="bg-white p-10 rounded-2xl shadow-xl shadow-indigo-100 w-full max-w-[420px] border border-gray-100">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Enter your credentials to access your account</p>
        </div>
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all duration-200"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all duration-200"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 disabled:bg-indigo-300 flex justify-center items-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : "Login"}
          </button>
        </div>
        <hr className="my-8 border-gray-100" />
        <div className="grid grid-cols-2 gap-4 text-xs font-medium">
          <button onClick={() => router.push("/auth/forgot-password")} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">Forgot Password</button>
          <button onClick={() => router.push("/auth/reset-password")} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-right">Reset Password</button>
          <button onClick={handleRefreshToken} disabled={loading} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors text-left">Refresh Token</button>
          <button onClick={handleLogout} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-right">Logout</button>
          <button onClick={() => router.push("/auth/register")} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-left">Register</button>
          <button onClick={handleDeleteTestUser} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-right underline decoration-dotted">Delete Test User</button>
        </div>
      </div>
    </div>
  );
}

// --- 2. Main Page Export with Suspense ---
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}