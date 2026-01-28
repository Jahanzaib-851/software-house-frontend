"use client";
import { FiBriefcase, FiMapPin, FiFileText, FiCalendar, FiShield } from "react-icons/fi";
import { formatDate } from "@/utils/helpers";

export default function ClientDetailCard({ client }) {
  return (
    <div className="space-y-6">
      {/* Main Info Card */}
      <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
          <FiBriefcase className="text-indigo-600" /> Business Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Company / Organization</label>
            <div className="p-4 rounded-2xl bg-slate-50 font-bold text-slate-700 border border-slate-100">
              {client.companyName || "Personal Account"}
            </div>
          </div>

          {/* Verification Status */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Verification Status</label>
            <div className={`p-4 rounded-2xl font-bold flex items-center justify-between border ${client.isVerified
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-amber-50 text-amber-700 border-amber-100"
              }`}>
              {client.isVerified ? "Official / Verified" : "Pending Verification"}
              <FiShield className={client.isVerified ? "text-emerald-500" : "text-amber-500"} />
            </div>
          </div>

          {/* Address */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1">
              <FiMapPin size={10} /> Physical Address
            </label>
            <div className="p-4 rounded-2xl bg-slate-50 font-bold text-slate-700 border border-slate-100 min-h-[60px]">
              {client.address || "No address provided."}
            </div>
          </div>

          {/* Notes */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 flex items-center gap-1">
              <FiFileText size={10} /> Internal Client Notes
            </label>
            <div className="p-6 rounded-[2rem] bg-indigo-50/30 border-2 border-dashed border-indigo-100 text-slate-600 font-medium italic">
              {client.notes ? `"${client.notes}"` : "No internal notes for this client yet."}
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-10 pt-8 border-t border-slate-50 flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
            <FiCalendar className="text-indigo-400" />
            Member Since: {formatDate(client.createdAt)}
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
            <FiShield className="text-indigo-400" />
            Role: {client.role}
          </div>
        </div>
      </div>
    </div>
  );
}