"use client";
import { useState, useEffect } from "react";
import clientService from "@/services/client.service";
import {
  FiCamera, FiUser, FiMail, FiPhone,
  FiBriefcase, FiMapPin, FiCheckCircle, FiImage, FiLoader
} from "react-icons/fi";
import { toast } from "react-toastify";
import { getAvatarUrl } from "@/utils/helpers";

export default function ClientSelfProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upLoading, setUpLoading] = useState(false);

  // Profile fetch karna (Backend: controller.getMyProfile)
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await clientService.getMyProfile();
      setProfile(res.data);
    } catch (err) {
      toast.error("Profile load nahi ho saki");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  // Avatar aur Cover upload logic
  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(type === "avatar" ? "avatar" : "coverImage", file);

    try {
      setUpLoading(true);
      if (type === "avatar") {
        await clientService.updateAvatar(formData);
      } else {
        await clientService.updateCoverImage(formData);
      }
      toast.success("Image update ho gayi!");
      fetchProfile();
    } catch (err) {
      toast.error("Upload fail ho gaya");
    } finally {
      setUpLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-slate-300">LOADING...</div>;

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto">
      {/* Cover Section */}
      <div className="relative h-60 w-full rounded-[2.5rem] overflow-hidden bg-slate-100 group">
        {profile?.coverImage ? (
          <img src={profile.coverImage} className="w-full h-full object-cover" alt="Cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xs">No Cover Image</div>
        )}
        <label className="absolute bottom-4 right-4 p-3 bg-white/80 backdrop-blur rounded-xl cursor-pointer opacity-0 group-hover:opacity-100 transition-all shadow-sm">
          {upLoading ? <FiLoader className="animate-spin" /> : <FiImage size={18} />}
          <input type="file" hidden onChange={(e) => handleUpload(e, "coverImage")} />
        </label>
      </div>

      {/* Avatar & Basic Info */}
      <div className="px-6 -mt-12 flex flex-col md:flex-row items-end gap-6 mb-10">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[2rem] bg-white p-1.5 shadow-xl">
            <img
              src={getAvatarUrl(profile?.avatar, profile?.name)}
              className="w-full h-full rounded-[1.8rem] object-cover"
              alt="Avatar"
            />
          </div>
          <label className="absolute bottom-1 right-1 p-2.5 bg-indigo-600 text-white rounded-xl cursor-pointer shadow-lg">
            <FiCamera size={14} />
            <input type="file" hidden onChange={(e) => handleUpload(e, "avatar")} />
          </label>
        </div>
        <div className="pb-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            {profile?.name} {profile?.isVerified && <FiCheckCircle className="text-emerald-500" size={20} />}
          </h1>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest">{profile?.companyName || "Individual"}</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
          <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6">Contact Info</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-slate-600 font-bold text-sm">
              <FiMail className="text-indigo-400" /> {profile?.email}
            </div>
            <div className="flex items-center gap-4 text-slate-600 font-bold text-sm">
              <FiPhone className="text-indigo-400" /> {profile?.phone || "N/A"}
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
          <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6">Location</h4>
          <div className="flex items-start gap-4 text-slate-600 font-bold text-sm">
            <FiMapPin className="text-indigo-400 mt-1" />
            <span>{profile?.address || "No address added."}</span>
          </div>
        </div>
      </div>
    </div>
  );
}