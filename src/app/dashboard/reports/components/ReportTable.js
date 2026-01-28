"use client";
import { FiEye, FiTrash2, FiFileText, FiCalendar, FiUser } from "react-icons/fi";

// 🎯 FIXED: onView prop yahan receive karna zaroori hai
export default function ReportTable({ data, loading, onDelete, onView }) {
  if (loading) {
    return <div className="p-20 text-center font-bold text-slate-400 animate-pulse">Loading Reports...</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-20 text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiFileText size={40} className="text-slate-200" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Reports Found</h3>
        <p className="text-slate-500 text-sm">Generate your first report to see it here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Report Info</th>
            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Linked To</th>
            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Period</th>
            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((report) => (
            <tr key={report._id} className="hover:bg-slate-50/30 transition-all group">
              {/* 1. Report Type & Creator */}
              <td className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200 uppercase font-black text-xs">
                    {report.reportType?.substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 capitalize">{report.reportType} Report</p>
                    <p className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                      <FiUser size={12} /> By {report.generatedBy?.name || "System"}
                    </p>
                  </div>
                </div>
              </td>

              {/* 2. Project/Client/Employee */}
              <td className="p-6">
                <div className="space-y-1">
                  {report.project && (
                    <p className="text-sm font-bold text-slate-700 leading-none">
                      Project: <span className="text-slate-500 font-medium">{report.project.name}</span>
                    </p>
                  )}
                  {report.client && (
                    <p className="text-[11px] font-bold text-slate-400">
                      Client: {report.client.name || report.client.companyName}
                    </p>
                  )}
                  {!report.project && !report.client && (
                    <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-400 font-black">GENERAL</span>
                  )}
                </div>
              </td>

              {/* 3. Period */}
              <td className="p-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <FiCalendar className="text-slate-300" />
                  <span className="text-sm font-black italic">
                    {report.month ? `${report.month}/` : ""}{report.year || "All Time"}
                  </span>
                </div>
              </td>

              {/* 4. Actions */}
              <td className="p-6 text-right">
                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* 🎯 FIXED: onClick event added here */}
                  <button
                    onClick={() => onView(report)}
                    className="p-3 hover:bg-slate-900 hover:text-white rounded-xl text-slate-400 transition-all shadow-sm bg-white border border-slate-100"
                  >
                    <FiEye size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(report._id)}
                    className="p-3 hover:bg-rose-600 hover:text-white rounded-xl text-slate-400 transition-all shadow-sm bg-white border border-slate-100"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}