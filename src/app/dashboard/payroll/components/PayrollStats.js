"use client";
import { FiDollarSign, FiClock, FiCheckCircle, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";

export default function PayrollStats({ stats }) {
  // ✅ Safety Check: Agar stats undefined ho toh default values use karein
  const totalNet = stats?.totalNet || 0;
  const paidCount = stats?.paidCount || 0;
  const pendingCount = stats?.pendingCount || 0;
  const totalEmployees = paidCount + pendingCount || 1;

  const cards = [
    {
      label: "Total Net Payroll",
      value: `Rs. ${totalNet.toLocaleString()}`,
      icon: <FiDollarSign />,
      color: "bg-indigo-600",
      light: "bg-indigo-50",
      textColor: "text-indigo-600"
    },
    {
      label: "Paid Salaries",
      value: paidCount,
      icon: <FiCheckCircle />,
      color: "bg-emerald-500",
      light: "bg-emerald-50",
      textColor: "text-emerald-600"
    },
    {
      label: "Pending Payments",
      value: pendingCount,
      icon: <FiClock />,
      color: "bg-amber-500",
      light: "bg-amber-50",
      textColor: "text-amber-600"
    },
    {
      label: "Avg. Per Head",
      // ✅ Division by zero se bachne ke liye safe calculation
      value: totalNet > 0 ? `Rs. ${(totalNet / totalEmployees).toFixed(0)}` : "0",
      icon: <FiActivity />,
      color: "bg-slate-800",
      light: "bg-slate-100",
      textColor: "text-slate-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow"
        >
          <div className={`${card.light} ${card.textColor} p-4 rounded-2xl text-2xl`}>
            {card.icon}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</p>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{card.value}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
}