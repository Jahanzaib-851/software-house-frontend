"use client";
import { useState, useEffect } from "react";
import { FiX, FiDollarSign, FiFileText, FiCalendar, FiUser, FiBriefcase } from "react-icons/fi";
import Select from "react-select";

// Services
import projectService from "@/services/project.service";
import clientService from "@/services/client.service";
import employeeService from "@/services/employee.service";

export default function TransactionModal({ isOpen, onClose, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({ projects: [], clients: [], employees: [] });

  const [formData, setFormData] = useState({
    transactionType: "expense",
    amount: "",
    description: "",
    project: "",
    client: "",
    employee: "",
    transactionDate: new Date().toISOString().split("T")[0],
    remarks: ""
  });

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [pRes, cRes, eRes] = await Promise.allSettled([
            projectService.getProjects({ limit: 100 }),
            clientService.getClients({ limit: 100 }),
            employeeService.getEmployees({ limit: 100 })
          ]);

          // 🔥 FIXED MAPPING logic to find the name deep inside the object
          const mapper = (res) => {
            const data = res.status === 'fulfilled' ? (res.value.data?.items || res.value.data || []) : [];
            return data.map(item => ({
              value: item._id,
              // Check priority: item.name -> item.fullName -> item.user.name -> item.employeeId
              label: item.name || item.fullName || item.user?.name || item.user?.fullName || `Staff (${item.employeeId || 'ID Missing'})`
            }));
          };

          setOptions({
            projects: mapper(pRes),
            clients: mapper(cRes),
            employees: mapper(eRes)
          });
        } catch (err) {
          console.error("Dropdown loading failed:", err);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || formData.amount <= 0) return alert("Please enter a valid amount");

    setLoading(true);
    const payload = { ...formData, amount: Number(formData.amount) };

    // Cleanup empty strings for Mongoose ObjectId fields
    if (!payload.project) delete payload.project;
    if (!payload.client) delete payload.client;
    if (!payload.employee) delete payload.employee;

    const success = await onSubmit(payload);
    setLoading(false);

    if (success !== false) {
      setFormData({
        transactionType: "expense",
        amount: "",
        description: "",
        project: "",
        client: "",
        employee: "",
        transactionDate: new Date().toISOString().split("T")[0],
        remarks: ""
      });
      onClose();
    }
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      padding: "6px",
      borderRadius: "1.2rem",
      border: "2px solid #F1F5F9",
      backgroundColor: "#F8FAFC",
      fontWeight: "600",
      boxShadow: "none",
      "&:hover": { border: "2px solid #CBD5E1" }
    }),
    placeholder: (base) => ({ ...base, color: "#94A3B8", fontSize: "13px" }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#0F172A" : state.isFocused ? "#F1F5F9" : "white",
      color: state.isSelected ? "white" : "#475569",
      fontWeight: "600",
      fontSize: "13px",
      cursor: "pointer"
    })
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">New Transaction</h2>
            <div className="flex bg-white p-1.5 mt-4 rounded-2xl shadow-sm border border-slate-100 w-fit">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, transactionType: "expense" })}
                className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.transactionType === 'expense' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'text-slate-400 hover:text-slate-600'}`}
              > Expense </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, transactionType: "income" })}
                className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.transactionType === 'income' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-400 hover:text-slate-600'}`}
              > Income </button>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white text-slate-400 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all border border-slate-100 shadow-sm">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Amount</label>
              <div className="relative">
                <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  required type="number"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold focus:ring-2 focus:ring-slate-900 border-none"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Date</label>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold focus:ring-2 focus:ring-slate-900 border-none"
                  value={formData.transactionDate}
                  onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Searchable Selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-1">
                <FiBriefcase size={10} /> Project (Search)
              </label>
              <Select
                options={options.projects}
                styles={selectStyles}
                isSearchable={true}
                isClearable={true}
                placeholder="Type to search project..."
                onChange={(opt) => setFormData({ ...formData, project: opt ? opt.value : "" })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-1">
                <FiUser size={10} /> Employee Name (Search)
              </label>
              <Select
                options={options.employees}
                styles={selectStyles}
                isSearchable={true}
                isClearable={true}
                placeholder="Type to search employee..."
                onChange={(opt) => setFormData({ ...formData, employee: opt ? opt.value : "" })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Description</label>
            <div className="relative">
              <FiFileText className="absolute left-4 top-4 text-slate-400" />
              <textarea
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl font-bold focus:ring-2 focus:ring-slate-900 border-none min-h-[100px]"
                placeholder="What is this for?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-white transition-all shadow-xl ${formData.transactionType === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-slate-800'
              }`}
          >
            {loading ? "Processing..." : "Finalize Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
}