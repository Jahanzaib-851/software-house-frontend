"use client";
import { useState, useEffect } from "react";
// ✅ Fixed Imports (FiSettings added)
import { FiX, FiBarChart2, FiCheckCircle, FiSettings } from "react-icons/fi";
import Select from "react-select";
import projectService from "@/services/project.service";
import clientService from "@/services/client.service";

export default function ReportModal({ isOpen, onClose, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  const [formData, setFormData] = useState({
    reportType: "project",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    project: "",
    client: "",
    remarks: ""
  });

  // 1. Hydration Fix
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. Fetch Dynamic Options
  useEffect(() => {
    if (!isOpen || !isMounted) return;

    const loadData = async () => {
      setListLoading(true);
      try {
        let res;
        if (formData.reportType === "project") {
          res = await projectService.getProjects();
          const items = res.data?.items || res.data || [];
          setOptions(items.map(p => ({ value: p._id, label: p.name })));
        }
        else if (formData.reportType === "client") {
          res = await clientService.getClients();
          const items = res.data?.items || res.data || [];
          setOptions(items.map(c => ({ value: c._id, label: c.name || c.companyName })));
        }
        else {
          setOptions([]);
        }
      } catch (err) {
        console.error("API Error:", err);
        setOptions([]);
      } finally {
        setListLoading(false);
      }
    };

    loadData();
  }, [isOpen, formData.reportType, isMounted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await onSubmit(formData);
    setLoading(false);
    if (success) onClose();
  };

  if (!isOpen || !isMounted) return null;

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      padding: "10px",
      borderRadius: "1.5rem",
      border: state.isFocused ? "2px solid #0F172A" : "2px solid #F1F5F9",
      backgroundColor: "#F8FAFC",
      boxShadow: "none",
      "&:hover": { border: "2px solid #0F172A" }
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "1.5rem",
      overflow: "hidden",
      padding: "10px",
      zIndex: 1000,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: "0.8rem",
      backgroundColor: state.isSelected ? "#0F172A" : state.isFocused ? "#F1F5F9" : "white",
      color: state.isSelected ? "white" : "#475569",
      fontWeight: "bold",
      cursor: "pointer"
    })
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl">
      <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">

        {/* Header */}
        <div className="p-10 pb-6 flex justify-between items-center border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
              <FiBarChart2 size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Generate Report</h2>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">System Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-100 rounded-full transition-all">
            <FiX size={24} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 pt-8 space-y-8">

          {/* Category Pills */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Report Category</label>
            <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-50 rounded-[2rem]">
              {['finance', 'project', 'client'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, reportType: type, project: "", client: "" })}
                  className={`py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all ${formData.reportType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Link Field */}
          {(formData.reportType === 'project' || formData.reportType === 'client') && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">
                Link to {formData.reportType === 'project' ? 'Project' : 'Client Profile'}
              </label>
              <Select
                instanceId={`select-${formData.reportType}`} // Hydration fix
                isLoading={listLoading}
                options={options}
                styles={selectStyles}
                placeholder={`Search ${formData.reportType}...`}
                onChange={(opt) => setFormData({ ...formData, [formData.reportType]: opt?.value || "" })}
              />
            </div>
          )}

          {/* Date Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Period (Month)</label>
              <select
                className="w-full p-5 bg-slate-50 rounded-[1.5rem] font-bold border-2 border-slate-50 outline-none focus:bg-white focus:border-slate-900 transition-all appearance-none"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('en', { month: 'long' })}</option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Period (Year)</label>
              <input
                type="number"
                className="w-full p-5 bg-slate-50 rounded-[1.5rem] font-bold border-2 border-slate-50 outline-none focus:bg-white focus:border-slate-900 transition-all"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>
          </div>

          {/* Final Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-20 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-4"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <FiSettings className="animate-spin text-xl" /> Processing Data...
              </span>
            ) : (
              <>
                <FiCheckCircle size={24} />
                Finalize & Generate
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}