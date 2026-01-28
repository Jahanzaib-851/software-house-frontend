"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiShield, FiGlobe, FiInfo, FiUser } from "react-icons/fi";
import { format } from "date-fns";

// Agat aapke folders 'src' ke andar hain toh '@' use karna sabse best hai
import activityService from "@/services/activity.service";
import { getActivityConfig } from "@/utils/activity.helpers";

// AGAR '@' kaam nahi kar raha, toh relative path sahi karein (ek '..' mazeed peeche jayein):
// import activityService from "../../../../services/activity.service";

export default function ActivityDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDetail = async () => {
      try {
        // Backend filter logic using ID
        const res = await activityService.getAllActivities({ _id: id });
        setData(res.data[0]); // Backend returns array, so take first item
      } catch (err) {
        console.error("Detail Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    getDetail();
  }, [id]);

  if (loading) return <div className="p-20 text-center font-black italic animate-pulse text-slate-300">DECRYPTING LOG DATA...</div>;
  if (!data) return <div className="p-20 text-center font-bold text-rose-500 uppercase">Log Entry Not Found</div>;

  const { icon, color, label } = getActivityConfig(data.action);

  return (
    <div className="p-4 md:p-10 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header & Back Button */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-black transition-all">
          <FiArrowLeft size={18} /> Return to Ledger
        </button>
        <div className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] italic">
          Audit ID: {data._id}
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-[3rem] border-2 border-slate-100 p-10 shadow-sm relative overflow-hidden">
        <div className={`absolute right-0 top-0 w-40 h-40 translate-x-10 -translate-y-10 rounded-full opacity-5 bg-gradient-to-br ${color}`} />

        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
          <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-4xl shadow-xl border-2 ${color}`}>
            {icon}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-1 italic">{data.module} Module</p>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
              {label}
            </h1>
          </div>
        </div>
      </div>

      {/* Detailed Intel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Info */}
        <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 space-y-6">
          <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-500">
            <FiInfo /> Activity Context
          </h3>
          <div className="space-y-4">
            <InfoItem label="Description" value={data.description} />
            <InfoItem label="Performed By (UID)" value={data.performedBy} icon={<FiUser />} />
            <InfoItem label="Timestamp" value={format(new Date(data.createdAt), "PPPP p")} />
          </div>
        </div>

        {/* Technical Info */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl">
          <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
            <FiShield /> Security Metadata
          </h3>
          <div className="space-y-4">
            <InfoItem dark label="Origin IP" value={data.ipAddress || "0.0.0.0"} icon={<FiGlobe />} />
            <InfoItem dark label="Target Model" value={data.targetModel || "N/A"} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">User Agent String</p>
              <div className="bg-slate-800 p-4 rounded-2xl text-[10px] font-mono text-slate-400 break-all leading-relaxed border border-slate-700">
                {data.userAgent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for clean rendering
const InfoItem = ({ label, value, icon, dark }) => (
  <div>
    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
      {label}
    </p>
    <div className={`flex items-center gap-2 font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>
      {icon && <span className="opacity-50">{icon}</span>}
      <span className="text-sm tracking-tight">{value}</span>
    </div>
  </div>
);