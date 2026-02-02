"use client";
import { useEffect, Component, useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import useNotificationStore from "@/store/useNotificationStore";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

/**
 * --- GLOBAL ERROR BOUNDARY ---
 */
class GlobalErrorCatch extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorLog: "" };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorLog: error.toString() };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6 font-mono text-center">
          <div className="max-w-2xl w-full border-2 border-dashed border-red-500/40 p-10 rounded-[3rem] bg-red-500/5 backdrop-blur-xl">
            <h1 className="text-2xl font-black text-red-500 mb-4 uppercase">System_Failure</h1>
            <p className="text-xs text-red-400 mb-6">{this.state.errorLog}</p>
            <button onClick={() => window.location.reload()} className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Re-Initialize</button>
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle

  useEffect(() => {
    if (fetchInitial) fetchInitial();
  }, [fetchInitial]);

  return (
    <GlobalErrorCatch>
      <div className="flex min-h-screen bg-gray-100 overflow-hidden relative">

        {/* --- MOBILE SIDEBAR OVERLAY --- */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* --- SIDEBAR CONTAINER --- */}
        <aside className={`
          fixed inset-y-0 left-0 z-[70] w-64 bg-white shadow-2xl transition-transform duration-300 ease-in-out transform
          md:relative md:translate-x-0 md:shadow-none md:z-auto
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <Sidebar />

          {/* Mobile Close Button inside Sidebar */}
          <button
            className="absolute top-4 right-4 p-2 md:hidden text-slate-500"
            onClick={() => setIsSidebarOpen(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="flex flex-col flex-1 w-full min-w-0">

          {/* TOP HEADER WITH HAMBURGER */}
          <header className="flex items-center bg-white border-b border-gray-100 sticky top-0 z-50">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-4 md:hidden text-slate-600 hover:bg-slate-50"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <div className="flex-1">
              <Header />
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>

          {/* FOOTER */}
          <Footer />
        </div>
      </div>
    </GlobalErrorCatch>
  );
}