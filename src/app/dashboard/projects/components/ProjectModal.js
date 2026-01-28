"use client";
import { useState, useEffect } from "react";
import { FiX, FiCheck, FiUsers, FiBriefcase, FiCalendar } from "react-icons/fi";
import clientService from "@/services/client.service";
// Note: Maan letay hain aapke paas employeeService tayyar hai
// import employeeService from "@/services/employee.service"; 

export default function ProjectModal({ isOpen, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    client: "",
    team: [],
    priority: "medium",
    timeline: { startDate: "", endDate: "" }
  });

  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Clients fetch karein dropdown ke liye
      clientService.getClients().then(res => setClients(res.data || []));
      // Employees fetch karein (Agar aapka service tayyar hai)
      // employeeService.getEmployees().then(res => setEmployees(res.data || []));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">Initiate Sprint</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Setup new project parameters</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-colors">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Project Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Project Identity</label>
            <input
              required
              type="text"
              placeholder="e.g. E-commerce Mobile App"
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 ring-indigo-500/10 font-bold text-slate-700 outline-none"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 text-flex items-center gap-2">
                <FiBriefcase /> Client Association
              </label>
              <select
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 ring-indigo-500/10 font-bold text-slate-700 outline-none appearance-none"
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              >
                <option value="">Select Client</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.companyName || c.name}</option>)}
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Priority Level</label>
              <select
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 ring-indigo-500/10 font-bold text-slate-700 outline-none appearance-none"
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Scope of Work</label>
            <textarea
              rows="3"
              placeholder="Briefly describe the project goals..."
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 ring-indigo-500/10 font-bold text-slate-700 outline-none resize-none"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 flex items-center gap-2">
                <FiCalendar /> Start Date
              </label>
              <input
                type="date"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 outline-none"
                onChange={(e) => setFormData({ ...formData, timeline: { ...formData.timeline, startDate: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 flex items-center gap-2">
                <FiCalendar /> Deadline
              </label>
              <input
                type="date"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold text-slate-700 outline-none"
                onChange={(e) => setFormData({ ...formData, timeline: { ...formData.timeline, endDate: e.target.value } })}
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? "PROCESING..." : <><FiCheck strokeWidth={4} /> LAUNCH PROJECT</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}