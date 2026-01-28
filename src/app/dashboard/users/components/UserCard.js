"use client";
import { useRouter } from "next/navigation";
import { FiEye, FiEdit3, FiTrash2, FiMail, FiShield, FiMoreVertical } from "react-icons/fi";
import { toast } from "react-toastify";
import userService from "@/services/user.service";

export default function UserCard({ user, onRefresh, onEdit }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this operative?")) return;
    try {
      await userService.deleteUser(user._id);
      toast.success("OPERATIVE REMOVED FROM SYSTEM");
      onRefresh();
    } catch (err) {
      toast.error("Deletion protocol failed");
    }
  };

  return (
    <div className="group relative bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">

      {/* 🟢 Status Glow Badge */}
      <div className="absolute top-6 right-8 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full animate-pulse ${user.status === 'blocked' ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`} />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {user.status || 'Active'}
        </span>
      </div>

      {/* 👤 Profile Identity Section */}
      <div className="flex flex-col items-center text-center mt-4">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden border-4 border-slate-50 shadow-inner group-hover:scale-105 transition-transform duration-500">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&size=256`}
              className="w-full h-full object-cover"
              alt={user.name}
            />
          </div>
          {/* Role Icon Overlay */}
          <div className="absolute -bottom-2 -right-2 p-2 bg-slate-900 text-white rounded-xl shadow-lg border-2 border-white">
            <FiShield size={14} />
          </div>
        </div>

        <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter mb-1">
          {user.name}
        </h3>
        <p className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          {user.role} // Clearance Alpha
        </p>

        {/* 📧 Contact Info Mini-Bar */}
        <div className="w-full bg-slate-50 rounded-2xl p-4 mb-8 flex flex-col gap-2 items-center">
          <div className="flex items-center gap-2 text-slate-500">
            <FiMail size={14} className="text-indigo-400" />
            <span className="text-xs font-bold truncate max-w-[180px]">{user.email}</span>
          </div>
        </div>
      </div>

      {/* ⚡ Strategic Action Bar */}
      <div className="grid grid-cols-3 gap-3 border-t border-slate-50 pt-6">
        <button
          onClick={() => router.push(`/dashboard/users/${user._id}`)}
          className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all"
        >
          <FiEye size={18} />
          <span className="text-[8px] font-black uppercase">Profile</span>
        </button>

        <button
          onClick={() => onEdit(user)}
          className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all"
        >
          <FiEdit3 size={18} />
          <span className="text-[8px] font-black uppercase">Edit</span>
        </button>

        <button
          onClick={handleDelete}
          className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all"
        >
          <FiTrash2 size={18} />
          <span className="text-[8px] font-black uppercase">Purge</span>
        </button>
      </div>
    </div>
  );
}