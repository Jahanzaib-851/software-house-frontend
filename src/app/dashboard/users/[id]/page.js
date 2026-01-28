"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiShield, FiMail, FiGlobe, FiClock, FiSettings, FiActivity, FiZap } from "react-icons/fi";
import { toast } from "react-toastify";
import userService from "@/services/user.service";
import AvatarUpload from "../components/AvatarUpload";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await userService.getUserById(id);
        setUser(res?.data || res);
      } catch (err) {
        toast.error("Access Denied: Terminal connection failed");
        router.push("/dashboard/users");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id, router]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-indigo-400 font-black tracking-[0.3em] uppercase animate-pulse">Decrypting User Profile</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 pb-20 selection:bg-indigo-500 selection:text-white">
      {/* 🛠️ Top Control Bar */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-8 py-4 flex justify-between items-center">
        <button onClick={() => router.back()} className="flex items-center gap-3 text-sm font-black tracking-tighter hover:text-white transition-colors">
          <FiArrowLeft className="text-indigo-500" /> TERMINAL_BACK
        </button>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Security Status</span>
            <span className={`text-xs font-black uppercase ${user?.status === 'blocked' ? 'text-rose-500' : 'text-emerald-500'}`}>
              ● {user?.status || 'Active'}
            </span>
          </div>
          <button className="p-3 bg-slate-800 rounded-xl hover:bg-indigo-600 transition-all">
            <FiSettings size={18} className="text-white" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-12 gap-8">

          {/* 🟦 Left Column: Profile Hub */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="relative bg-slate-900 rounded-[3rem] p-10 border border-slate-800 overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative group/avatar">
                  <div className="w-44 h-44 rounded-[3.5rem] overflow-hidden border-4 border-slate-800 shadow-2xl transition-transform duration-500 group-hover/avatar:scale-105">
                    <img
                      src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff&size=256`}
                      className="w-full h-full object-cover"
                      alt="Avatar"
                    />
                  </div>
                  <AvatarUpload type="avatar" userId={id} onUpdate={(url) => setUser({ ...user, avatar: url })} />
                </div>

                <div>
                  <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic italic">{user?.name}</h1>
                  <div className="inline-block mt-2 px-4 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                    ID: {id.substring(0, 8)}...
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-4 border-t border-slate-800 pt-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-bold uppercase tracking-tighter">Access Level</span>
                  <span className="text-white font-black uppercase">{user?.role}</span>
                </div>
                <div className="flex justify-center gap-3 pt-4">
                  <button className="flex-1 h-12 bg-slate-800 rounded-2xl hover:bg-white hover:text-black transition-all font-black text-[10px] uppercase tracking-widest">Message</button>
                  <button className="flex-1 h-12 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest border border-rose-500/20">Restrict</button>
                </div>
              </div>
            </div>
          </div>

          {/* 🟩 Right Column: Data Blocks */}
          <div className="col-span-12 lg:col-span-8 space-y-8">

            {/* 🎥 Cover Visual Container */}
            <div className="relative h-72 w-full rounded-[4rem] overflow-hidden border border-slate-800 shadow-2xl group">
              <img
                src={user?.coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072'}
                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
                alt="Cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent" />
              <div className="absolute bottom-8 left-10">
                <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none opacity-20">INTELLIGENCE_CORE</h2>
              </div>
              <AvatarUpload type="cover" userId={id} onUpdate={(url) => setUser({ ...user, coverImage: url })} />
            </div>

            {/* 📊 Matrix Info Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 flex items-start gap-6 hover:bg-slate-800/50 transition-colors">
                <div className="p-4 bg-indigo-500/10 rounded-3xl text-indigo-500"><FiMail size={24} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Primary Endpoint</p>
                  <p className="text-lg font-bold text-white tracking-tight">{user?.email}</p>
                </div>
              </div>
              <div className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800 flex items-start gap-6 hover:bg-slate-800/50 transition-colors">
                <div className="p-4 bg-emerald-500/10 rounded-3xl text-emerald-500"><FiClock size={24} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">System Entry</p>
                  <p className="text-lg font-bold text-white tracking-tight">{new Date(user?.createdAt).toLocaleDateString('en-GB')}</p>
                </div>
              </div>
            </div>

            {/* 📝 Biography Section */}
            <div className="bg-gradient-to-br from-indigo-600/10 to-transparent p-10 rounded-[3.5rem] border border-indigo-500/20 relative overflow-hidden group">
              <FiZap className="absolute -right-10 -bottom-10 w-48 h-48 text-indigo-500/5 group-hover:rotate-12 transition-transform duration-700" />
              <h4 className="flex items-center gap-3 text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-6">
                <FiActivity size={14} className="animate-pulse" /> Operator Intelligence Bio
              </h4>
              <p className="text-xl text-slate-200 leading-relaxed font-medium italic opacity-90 relative z-10">
                "{user?.bio || 'This operative has not yet initialized a biography protocol. Profile remains under classified observation.'}"
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}