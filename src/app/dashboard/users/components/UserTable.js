"use client";
import { useRouter } from "next/navigation";
import { FiEye, FiShieldOff, FiMail, FiUser, FiShield, FiActivity, FiExternalLink } from "react-icons/fi";
import { toast } from "react-toastify";
import userService from "@/services/user.service";

// 🌐 CONFIGURATION
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function UserTable({ users = [], onRefresh }) {
  const router = useRouter();

  const handleBlock = async (id) => {
    if (!confirm("⚠️ PROTOCOL_WARNING: Restrict this operative's access?")) return;
    try {
      await userService.deleteUser(id);
      toast.warning("ACCESS_REVOKED: Security clearance updated");
      onRefresh();
    } catch (err) {
      toast.error("OVERRIDE_FAILED: System rejection");
    }
  };

  // ✅ Helper to get correct image URL
  const getImageUrl = (avatar, name) => {
    if (!avatar) return `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff&bold=true`;

    // Agar avatar pura URL hai (Cloudinary)
    if (avatar.startsWith('http')) return avatar;

    // Agar avatar sirf path hai (Local Backend)
    // Hum check karte hain ke path mein 'uploads' pehle se hai ya nahi
    const cleanPath = avatar.startsWith('/') ? avatar.slice(1) : avatar;
    return `${BACKEND_URL}/${cleanPath}`;
  };

  return (
    <div className="w-full bg-slate-50/50 backdrop-blur-xl rounded-[3rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/5">
              <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Operative Identity</th>
              <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-center">Security Level</th>
              <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Access Status</th>
              <th className="px-10 py-7 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-right">Commands</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50">
            {users.map((user, index) => (
              <tr
                key={user._id}
                className="group hover:bg-white transition-all duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* 👤 IDENTITY SECTION */}
                <td className="px-10 py-6">
                  <div className="flex items-center gap-6">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 bg-white">
                        <img
                          src={getImageUrl(user.avatar, user.name)}
                          className="w-full h-full object-cover"
                          alt={user.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`;
                          }}
                        />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-4 border-white rounded-full ${user.status === 'blocked' ? 'bg-rose-500' : 'bg-emerald-500'
                        } shadow-lg`} />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-black text-slate-900 text-base uppercase tracking-tighter leading-none group-hover:text-indigo-600 transition-colors italic">
                        {user.name}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        <FiMail className="text-indigo-400" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 🛡️ SECURITY LEVEL */}
                <td className="px-8 py-6 text-center">
                  <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-2xl border-2 transition-all duration-500 ${user.role === 'admin'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200'
                      : 'bg-white text-indigo-600 border-indigo-100'
                    }`}>
                    {user.role === 'admin' ? <FiShield size={14} className="animate-pulse" /> : <FiUser size={14} />}
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {user.role === 'admin' ? 'ROOT_ADMIN' : 'SYSTEM_OPERATIVE'}
                    </span>
                  </div>
                </td>

                {/* ⚡ SYSTEM STATUS */}
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${user.status === 'blocked' ? 'bg-rose-500' : 'bg-emerald-500 animate-ping'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${user.status === 'blocked' ? 'text-rose-500' : 'text-emerald-600'
                      }`}>
                      {user.status || 'Active'}
                    </span>
                  </div>
                </td>

                {/* 🛠️ OPERATIONS */}
                <td className="px-10 py-6 text-right">
                  <div className="flex justify-end items-center gap-3">
                    <button
                      onClick={() => router.push(`/dashboard/users/${user._id}`)}
                      className="group/btn relative p-4 bg-slate-100 text-slate-600 rounded-[1.5rem] hover:bg-slate-900 hover:text-white transition-all duration-300 overflow-hidden"
                    >
                      <FiEye size={20} className="relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </button>

                    <button
                      onClick={() => handleBlock(user._id)}
                      className={`p-4 rounded-[1.5rem] transition-all duration-300 ${user.status === 'blocked'
                          ? 'bg-rose-500 text-white'
                          : 'bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white'
                        }`}
                    >
                      <FiShieldOff size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="bg-slate-900/5 px-10 py-4 flex justify-between items-center border-t border-white">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Registered Operatives: {users.length}</p>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <div className="w-2 h-2 rounded-full bg-slate-300" />
        </div>
      </div>
    </div>
  );
}