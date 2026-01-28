"use client";
import { FiCalendar, FiUser, FiExternalLink, FiClock, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

export default function ProjectCard({ project, onClick }) {
  // Status-based styles
  const statusConfig = {
    active: { color: "bg-emerald-100 text-emerald-600", label: "Ongoing" },
    completed: { color: "bg-indigo-100 text-indigo-600", label: "Finished" },
    "on-hold": { color: "bg-amber-100 text-amber-600", label: "Paused" },
    urgent: { color: "bg-red-100 text-red-600", label: "Urgent" },
  };

  const currentStatus = statusConfig[project.status] || statusConfig.active;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all cursor-pointer group flex flex-col h-full"
    >
      {/* Card Top: Status & Priority */}
      <div className="flex justify-between items-start mb-6">
        <div className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${currentStatus.color}`}>
          {currentStatus.label}
        </div>
        <div className="flex -space-x-2">
          {project.team?.slice(0, 3).map((member, i) => (
            <img
              key={i}
              src={member.user?.avatar || `https://ui-avatars.com/api/?name=${member.user?.name || 'User'}&background=random`}
              className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm"
              title={member.user?.name}
            />
          ))}
          {project.team?.length > 3 && (
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
              +{project.team.length - 3}
            </div>
          )}
        </div>
      </div>

      {/* Project Info */}
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{project.client?.companyName || "Personal Project"}</p>
          <div className="h-1 w-1 bg-slate-300 rounded-full" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors mb-3">
          {project.name}
        </h3>
        <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Card Bottom: Timeline & Metadata */}
      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-slate-50 p-2 rounded-lg text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
            <FiClock size={14} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none">Deadline</span>
            <span className="text-xs font-bold text-slate-700 leading-tight">
              {project.timeline?.endDate ? new Date(project.timeline.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : "TBD"}
            </span>
          </div>
        </div>

        <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 opacity-0 group-hover:opacity-100 group-hover:bg-slate-900 group-hover:text-white transition-all transform translate-x-2 group-hover:translate-x-0">
          <FiExternalLink size={18} />
        </button>
      </div>
    </motion.div>
  );
}