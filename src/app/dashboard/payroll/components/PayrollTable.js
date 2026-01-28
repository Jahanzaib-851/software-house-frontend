"use client";
import { FiEye, FiCheckCircle, FiClock } from "react-icons/fi";
import payrollService from "@/services/payroll.service";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function PayrollTable({ data, loading, onRefresh }) {
  const router = useRouter();

  const handlePay = async (id) => {
    if (!confirm("Confirm payment for this employee?")) return;
    try {
      await payrollService.markPaid(id);
      toast.success("Payment Marked as Paid!");
      onRefresh();
    } catch (err) {
      toast.error("Payment update failed");
    }
  };

  // ✅ Eye Button click par detail page par le jaye ga
  const handleView = (id) => {
    if (!id) return toast.error("ID nahi mili!");
    router.push(`/dashboard/payroll/${id}`);
  };

  if (loading) return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">Loading Records...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-400 tracking-widest">
          <tr>
            <th className="p-6">Employee</th>
            <th className="p-6">Period</th>
            <th className="p-6">Net Salary</th>
            <th className="p-6">Status</th>
            <th className="p-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item) => (
            <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="p-6">
                <div className="font-bold text-slate-800">
                  {/* ✅ Modal se save kiya hua name show hoga */}
                  {item.employeeName || item.employee?.fullName || "N/A"}
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">
                  {item.employee?.designation || "Staff"}
                </div>
              </td>
              <td className="p-6 font-bold text-slate-600">{item.month}/{item.year}</td>
              <td className="p-6 font-black text-slate-900">
                Rs. {(item.calculations?.netSalary || item.salary?.basicSalary || 0).toLocaleString()}
              </td>
              <td className="p-6">
                {item.paymentStatus === 'paid' ? (
                  <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-fit">
                    <FiCheckCircle /> Paid
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-fit">
                    <FiClock /> Pending
                  </span>
                )}
              </td>
              <td className="p-6 text-right space-x-2">
                {item.paymentStatus !== 'paid' && (
                  <button onClick={() => handlePay(item._id)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                    <FiCheckCircle size={18} />
                  </button>
                )}
                {/* ✅ Eye Button Fix */}
                <button
                  onClick={() => handleView(item._id)}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <FiEye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <div className="p-20 text-center text-slate-400 font-bold">No records found.</div>}
    </div>
  );
}