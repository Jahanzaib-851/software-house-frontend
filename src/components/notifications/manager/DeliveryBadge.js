"use client";
import { FiMail, FiMessageSquare, FiGlobe, FiCheck, FiX, FiLoader } from "react-icons/fi";

export default function DeliveryBadge({ delivery }) {
  // 1. Channel ke mutabiq icon select karein
  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'email': return <FiMail size={12} />;
      case 'sms': return <FiMessageSquare size={12} />;
      case 'in-app': return <FiGlobe size={12} />;
      default: return null;
    }
  };

  // 2. Status ke mutabiq colors aur animations set karein
  const getStatusStyles = (status) => {
    switch (status) {
      case 'delivered':
        return "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
      case 'failed':
        return "bg-rose-50 text-rose-600 border-rose-100 shadow-[0_0_10px_rgba(244,63,94,0.1)]";
      case 'pending':
        return "bg-amber-50 text-amber-600 border-amber-100 animate-pulse";
      default:
        return "bg-slate-50 text-slate-400 border-slate-100";
    }
  };

  return (
    <div className="relative group inline-block">
      {/* 🚀 Main Badge */}
      <div className={`
        flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 transition-all duration-300
        hover:scale-105 hover:shadow-md cursor-help
        ${getStatusStyles(delivery.status)}
      `}>
        <span className="shrink-0">
          {getChannelIcon(delivery.channel)}
        </span>

        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-black uppercase tracking-tighter">
            {delivery.channel}
          </span>

          {/* Status Indicator Icon */}
          {delivery.status === 'delivered' && <FiCheck size={10} className="stroke-[4]" />}
          {delivery.status === 'failed' && <FiX size={10} className="stroke-[4]" />}
          {delivery.status === 'pending' && <FiLoader size={10} className="animate-spin" />}
        </div>
      </div>

      {/* 🛡️ Advanced Hover Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 z-50">
        <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-2xl border border-slate-700 text-[10px] space-y-1.5 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between border-b border-white/10 pb-1 mb-1">
            <span className="font-black uppercase tracking-widest text-slate-400">Gateway Status</span>
            <span className={`font-black uppercase ${delivery.status === 'delivered' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {delivery.status}
            </span>
          </div>

          {delivery.deliveredAt && (
            <p className="font-bold opacity-80 italic">
              Received: {new Date(delivery.deliveredAt).toLocaleTimeString()}
            </p>
          )}

          {delivery.error && (
            <p className="text-rose-300 font-bold border-t border-white/5 pt-1 mt-1">
              ERR_CODE: {delivery.error}
            </p>
          )}

          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
        </div>
      </div>
    </div>
  );
}