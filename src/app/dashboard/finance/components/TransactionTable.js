"use client";
import { FiArrowUpRight, FiArrowDownRight, FiCalendar, FiUser, FiBriefcase, FiPrinter } from "react-icons/fi";
import { format } from "date-fns";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency"; // Utility import karein

export default function TransactionTable({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="p-6 bg-slate-50 rounded-full mb-4">
          <FiBriefcase size={40} className="text-slate-300" />
        </div>
        <p className="font-bold uppercase tracking-widest text-[11px]">No transactions recorded yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-6">
            <th className="pb-4 pl-8">Transaction Details</th>
            <th className="pb-4">Category / Link</th>
            <th className="pb-4">Date</th>
            <th className="pb-4 text-right pr-8">Amount & Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((item) => (
            <tr key={item._id} className="group transition-all">
              {/* Transaction Main Info */}
              <td className="bg-white border-y border-l border-slate-100 rounded-l-[2rem] py-5 pl-8 group-hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${item.transactionType === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                    {item.transactionType === 'income' ? <FiArrowUpRight size={20} /> : <FiArrowDownRight size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 leading-tight">{item.description}</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">
                      REF: {item._id.slice(-8)}
                    </p>
                  </div>
                </div>
              </td>

              {/* Linked Entity */}
              <td className="bg-white border-y border-slate-100 py-5 group-hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col gap-1">
                  {item.project && (
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 w-fit px-3 py-1 rounded-full">
                      <FiBriefcase size={12} /> {item.project.name}
                    </span>
                  )}
                  {item.client && (
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 w-fit px-3 py-1 rounded-full">
                      <FiUser size={12} /> {item.client.name}
                    </span>
                  )}
                  {item.employee && (
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-slate-50 w-fit px-3 py-1 rounded-full">
                      {item.employee.name || 'Staff'}
                    </span>
                  )}
                </div>
              </td>

              {/* Date */}
              <td className="bg-white border-y border-slate-100 py-5 group-hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
                  <FiCalendar size={14} className="text-slate-300" />
                  {format(new Date(item.transactionDate), "MMM dd, yyyy")}
                </div>
              </td>

              {/* Amount & Print Button */}
              <td className="bg-white border-y border-r border-slate-100 rounded-r-[2rem] py-5 pr-8 text-right group-hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-end gap-4">
                  <div>
                    <p className={`text-lg font-black ${item.transactionType === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                      {item.transactionType === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PKR</p>
                  </div>

                  {/* 🚀 Slip Link Button */}
                  <Link
                    href={`/dashboard/finance/${item._id}`}
                    className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                    title="View & Print Slip"
                  >
                    <FiPrinter size={18} />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}