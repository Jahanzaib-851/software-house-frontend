"use client";
import { useState, useEffect } from "react";
import { FiX, FiUser, FiMail, FiCheckCircle, FiType, FiLock, FiShield } from "react-icons/fi";
import { toast } from "react-toastify";
import userService from "@/services/user.service";

// Components
import AvatarUpload from "./AvatarUpload";

export default function UserModal({ isOpen, onClose, onRefresh, editUser = null }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin", // 🔒 Hardcoded to 'admin' as per your requirement
    status: "active",
    bio: "",
    avatar: ""
  });

  useEffect(() => {
    if (editUser) {
      setFormData({
        name: editUser.name || "",
        email: editUser.email || "",
        role: "admin", // Force admin on edit
        status: editUser.status || "active",
        bio: editUser.bio || "",
        avatar: editUser.avatar || ""
      });
    } else {
      setFormData({
        name: "", email: "", password: "",
        role: "admin", status: "active", bio: "", avatar: ""
      });
    }
  }, [editUser, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editUser) {
        await userService.updateUserByAdmin(editUser._id, formData);
        toast.success("ADMIN PROFILE UPDATED");
      } else {
        await userService.createUser(formData);
        toast.success("NEW ADMIN INITIALIZED");
      }
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Protocol Failure");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="bg-slate-900 p-8 text-white relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <AvatarUpload
                currentImage={formData.avatar}
                userId={editUser?._id}
                onUpdate={(url) => setFormData({ ...formData, avatar: url })}
              />
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                  {editUser ? "Modify Admin" : "New Admin"}
                </h2>
                <p className="text-indigo-400 text-[9px] font-black tracking-[0.3em] uppercase mt-2 flex items-center gap-2">
                  <FiShield className="animate-pulse" /> Access Level: Root_Admin
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all">
              <FiX size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text" required
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-indigo-500 outline-none transition-all font-bold text-sm"
                  placeholder="Admin Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Email</label>
              <div className="relative group">
                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email" required
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-indigo-500 outline-none transition-all font-bold text-sm"
                  placeholder="admin@system.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          {!editUser && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Password</label>
              <div className="relative group">
                <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password" required
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-indigo-500 outline-none transition-all font-bold text-sm"
                  placeholder="••••••••••••"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Status</label>
            <select
              className={`w-full px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-tighter outline-none transition-all cursor-pointer ${formData.status === 'blocked' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                }`}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="active">Active_Status</option>
              <option value="blocked">Restricted_Access</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admin Bio</label>
            <textarea
              className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-transparent focus:border-indigo-500 outline-none transition-all font-medium text-sm h-24 resize-none shadow-inner"
              placeholder="System privileges and notes..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? "Processing..." : (editUser ? "Update Admin" : "Create Admin")}
          </button>
        </form>
      </div>
    </div>
  );
}