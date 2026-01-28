"use client";
import { useState, useEffect } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";

import { toast } from "react-toastify";
import payrollService from "@/services/payroll.service";
import employeeService from "@/services/employee.service";

export default function GeneratePayrollModal({ onClose, onSuccess }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    employee: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    salary: { basicSalary: 0, allowances: 0, bonuses: 0, deductions: 0 },
    remarks: ""
  });

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const res = await employeeService.getEmployees({ limit: 500 });
        const fetchedData = res.data?.data?.items || res.data?.items || res.data?.data || res.data || [];

        const sortedData = Array.isArray(fetchedData) ? fetchedData.sort((a, b) => {
          const nameA = (a.fullName || a.name || a.user?.fullName || "").toLowerCase();
          const nameB = (b.fullName || b.name || b.user?.fullName || "").toLowerCase();
          return nameA.localeCompare(nameB);
        }) : [];

        setEmployees(sortedData);
      } catch (err) {
        toast.error("Employees load nahi ho sakay");
      }
    };
    loadEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee) return toast.error("Please select an employee");

    setLoading(true);

    try {
      // 1. ✅ Pehle selected employee ka object dhoondein taake uska name mil sakay
      const selectedEmployee = employees.find(emp => (emp._id || emp.id) === formData.employee);

      // 2. ✅ Employee ka saaf naam nikaalein
      const finalName = selectedEmployee?.fullName ||
        selectedEmployee?.name ||
        selectedEmployee?.user?.fullName ||
        "Unknown Employee";

      // 3. ✅ Payload mein name aur id dono bhejien
      const payload = {
        ...formData,
        employeeName: finalName, // Yeh field table mein show hogi
        month: Number(formData.month),
        year: Number(formData.year),
        salary: Object.fromEntries(Object.entries(formData.salary).map(([k, v]) => [k, Number(v)]))
      };

      await payrollService.generatePayroll(payload);
      toast.success("Generated!");
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative bg-white rounded-[2rem] w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-800">New Salary Slip</h2>
          <button onClick={onClose}><FiX className="text-xl" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">Employee Name</label>
            <select
              required
              className="w-full p-4 rounded-2xl bg-slate-50 font-bold border-none outline-none ring-slate-200 focus:ring-2"
              value={formData.employee}
              onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
            >
              <option value="">Choose Employee ({employees.length} found)</option>
              {employees.map((emp) => {
                const name = emp.fullName ||
                  emp.name ||
                  emp.user?.fullName ||
                  emp.user?.name ||
                  emp.personalInfo?.fullName ||
                  emp.basicInfo?.name ||
                  `ID: ${emp.employeeId || emp._id?.slice(-5)}`;

                return (
                  <option key={emp._id || emp.id} value={emp._id || emp.id}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Month</label>
              <input type="number" placeholder="Month" className="w-full p-4 rounded-2xl bg-slate-50 font-bold" value={formData.month} onChange={e => setFormData({ ...formData, month: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-400">Year</label>
              <input type="number" placeholder="Year" className="p-4 rounded-2xl bg-slate-50 font-bold" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-[2rem]">
            {Object.keys(formData.salary).map(key => (
              <div key={key}>
                <label className="text-[10px] font-bold uppercase text-slate-400">{key.replace(/([A-Z])/g, ' $1')}</label>
                <input type="number" className="w-full p-3 rounded-xl mt-1 font-bold" value={formData.salary[key]} onChange={e => setFormData({ ...formData, salary: { ...formData.salary, [key]: e.target.value } })} />
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-2">
            {loading ? "Processing..." : <><FiCheck /> Generate Salary Slip</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}