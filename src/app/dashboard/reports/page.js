"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiTrendingUp, FiLayers, FiUsers, FiPlus, FiActivity, FiX, FiInfo, FiCalendar, FiBriefcase } from "react-icons/fi";
import reportService from "@/services/report.service";
import ReportTable from "./components/ReportTable";
import ReportModal from "./components/ReportModal";
import ReportFilters from "./components/ReportFilters";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filters, setFilters] = useState({ page: 1, limit: 10, type: "", search: "" });
  const [meta, setMeta] = useState({ total: 0 });

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const res = await reportService.getReports(filters);
      // 🛡️ Data Safety: Fallback to empty array/object
      const items = res?.items || res?.data?.items || [];
      const metadata = res?.meta || res?.data?.meta || { total: 0 };
      setReports(items);
      setMeta(metadata);
    } catch (error) {
      // 🛡️ Safe Toast: No complex objects
      toast.error("Cloud sync failed", { icon: false });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleViewDetails = (report) => {
    setSelectedReport(report);
  };

  const handleGenerateReport = async (formData) => {
    try {
      const payload = {
        reportType: String(formData?.reportType || "").toLowerCase(),
        month: Number(formData?.month),
        year: Number(formData?.year),
        remarks: String(formData?.remarks || "").trim()
      };

      if (formData?.project && formData?.project?.length === 24) payload.project = formData.project;
      if (formData?.client && formData?.client?.length === 24) payload.client = formData.client;

      const reportPromise = reportService.generateReport(payload);

      // 🔥 TOAST FIX: Removed emojis and added global icon:false protection 
      // taake production build mein undefined icons ka error na aye.
      await toast.promise(
        reportPromise,
        {
          pending: "Generating Report...",
          success: "Report Saved Successfully!",
          error: "Failed to generate report."
        },
        { icon: false }
      );

      await reportPromise;
      fetchReports();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Report Generation Error:", err);
      // Catch-all safety toast
      toast.error("An unexpected error occurred", { icon: false });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Zaroori: Delete this record?")) return;
    try {
      await reportService.deleteReport(id);
      toast.success("Record Deleted", { icon: false });
      fetchReports();
    } catch (e) {
      toast.error("Delete operation failed", { icon: false });
    }
  };

  const stats = [
    { label: "Total Analysis", value: meta?.total || 0, icon: <FiActivity />, color: "bg-indigo-500" },
    { label: "Active Projects", value: "12", icon: <FiLayers />, color: "bg-emerald-500" },
    { label: "Linked Clients", value: "08", icon: <FiUsers />, color: "bg-orange-500" },
    { label: "Growth Rate", value: "+14%", icon: <FiTrendingUp />, color: "bg-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">
            Reports<span className="text-indigo-600">.</span>
          </h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-16 px-10 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          <FiPlus /> New Generation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center mb-6`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="sticky top-4 z-40">
        <ReportFilters
          activeType={filters.type}
          onTypeChange={(type) => setFilters({ ...filters, type, page: 1 })}
          onSearch={(val) => setFilters({ ...filters, search: val, page: 1 })}
        />
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-[3.5rem] border border-white shadow-xl overflow-hidden ring-1 ring-slate-100">
        <ReportTable
          data={reports || []}
          loading={loading}
          onDelete={handleDelete}
          onView={handleViewDetails}
        />

        <div className="p-8 border-t border-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">
            Page {filters.page} of {Math.ceil((meta?.total || 0) / filters.limit) || 1}
          </span>
          <div className="flex gap-3">
            <button
              disabled={filters.page === 1}
              onClick={() => setFilters(p => ({ ...p, page: p.page - 1 }))}
              className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center disabled:opacity-20 hover:bg-black hover:text-white transition-all"
            >
              ←
            </button>
            <button
              disabled={filters.page >= Math.ceil((meta?.total || 0) / filters.limit)}
              onClick={() => setFilters(p => ({ ...p, page: p.page + 1 }))}
              className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center disabled:opacity-20 hover:bg-black hover:text-white transition-all"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <ReportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleGenerateReport} />

      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
            >
              <FiX size={20} />
            </button>

            <div className="p-12 space-y-8">
              <div className="space-y-2">
                <span className="px-4 py-1 bg-indigo-100 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Report Intelligence</span>
                <h2 className="text-4xl font-black text-slate-900 italic capitalize">
                  {selectedReport.reportType || "System"} Report
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-[2rem]">
                  <FiCalendar className="text-indigo-500 mb-2" />
                  <p className="text-[10px] font-black text-slate-400 uppercase">Period</p>
                  <p className="text-lg font-black">{selectedReport.month}/{selectedReport.year}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-[2rem]">
                  <FiBriefcase className="text-emerald-500 mb-2" />
                  <p className="text-[10px] font-black text-slate-400 uppercase">Project</p>
                  <p className="text-lg font-black truncate">{selectedReport.project?.name || "General"}</p>
                </div>
              </div>

              <div className="p-8 bg-slate-900 text-white rounded-[2.5rem]">
                <div className="flex items-center gap-2 mb-4">
                  <FiInfo className="text-indigo-400" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">System Remarks</p>
                </div>
                <p className="text-slate-300 italic">
                  "{selectedReport.remarks || "No specific remarks provided for this generation."}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-black text-xs">
                    {selectedReport.generatedBy?.name?.substring(0, 1) || "A"}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Generated By</p>
                    <p className="text-sm font-bold">{selectedReport.generatedBy?.name || "Authorized Admin"}</p>
                  </div>
                </div>
                <p className="text-[10px] font-mono text-slate-300 uppercase">REF: {selectedReport._id?.substring(0, 8)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}