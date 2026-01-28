"use client";
import { useEffect, Component } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import useNotificationStore from "@/store/useNotificationStore";

/**
 * --- GLOBAL ERROR BOUNDARY ---
 * Ye component poore dashboard ko crash hone se bachayega.
 * Agar koi icon undefined hoga, toh ye error screen dikha dega.
 */
class GlobalErrorCatch extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorLog: "" };
  }

  static getDerivedStateFromError(error) {
    // Agli render par error state update karein
    return { hasError: true, errorLog: error.toString() };
  }

  componentDidCatch(error, errorInfo) {
    // Aap console mein bhi error dekh sakte hain
    console.error("🚨 DASHBOARD_CRASH_REPORT:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 font-mono">
          <div className="max-w-2xl w-full border-2 border-dashed border-red-500/40 p-10 rounded-[3rem] bg-red-500/5 backdrop-blur-xl shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-ping" />
              <h1 className="text-2xl font-black uppercase tracking-tighter text-red-500">
                System_Component_Failure
              </h1>
            </div>

            <div className="bg-black/60 p-6 rounded-2xl border border-white/10 mb-8 overflow-auto max-h-64">
              <p className="text-xs text-red-400 font-bold leading-relaxed italic">
                {this.state.errorLog}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                DIAGNOSIS: Undefined Component detected. Check your "react-icons" imports or export statements.
              </p>

              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
              >
                Re-Initialize Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * --- MAIN DASHBOARD LAYOUT ---
 */
export default function DashboardLayout({ children }) {
  const fetchInitial = useNotificationStore((state) => state.fetchInitial);

  useEffect(() => {
    // Dashboard load hote hi notifications sync karein
    if (fetchInitial) {
      fetchInitial();
    }
  }, [fetchInitial]);

  return (
    <GlobalErrorCatch>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar Navigation */}
        <Sidebar />

        <div className="flex flex-col flex-1">
          {/* Top Header */}
          <Header />

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>

          {/* System Footer */}
          <Footer />
        </div>
      </div>
    </GlobalErrorCatch>
  );
}