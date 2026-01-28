"use client";
import { useState } from "react";
import { FiCamera, FiLoader, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import userService from "@/services/user.service";

export default function AvatarUpload({ currentImage, userId, onUpdate }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Validation (2MB Limit)
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("FILE_TOO_LARGE: Maximum 2MB allowed");
    }

    // 2. Client-side Preview (Immediate UI Feedback)
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // 3. Prepare Multipart Form Data
    const formData = new FormData();
    formData.append("avatar", file); // Backend expects 'avatar' field

    try {
      setUploading(true);

      // Hit Backend: patch("/me/avatar" or "/:id/avatar")
      // Note: Admin ke liye hum userId pass karenge
      const res = await userService.uploadAvatar(userId, formData);

      if (res?.success) {
        const newUrl = res.data.avatar;
        onUpdate(newUrl); // Parent component (Modal/Page) ko naya URL dena
        toast.success("BIOMETRIC_DATA_UPDATED");
        setPreview(null); // Clear preview after success
      }
    } catch (err) {
      toast.error("UPLOAD_CRITICAL_FAILURE: Protocol error");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group w-32 h-32 mx-auto">
      {/* Main Display Circle */}
      <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl relative bg-slate-100">
        <img
          src={preview || currentImage || `https://ui-avatars.com/api/?name=User&background=6366f1&color=fff`}
          alt="Avatar Preview"
          className={`w-full h-full object-cover transition-opacity duration-500 ${uploading ? 'opacity-30' : 'opacity-100'}`}
        />

        {/* Loading Overlay */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
            <FiLoader className="animate-spin text-white" size={24} />
          </div>
        )}
      </div>

      {/* Modern Floating Upload Button */}
      <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-xl border-4 border-white hover:bg-slate-900 hover:scale-110 active:scale-95 transition-all duration-300">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <FiCamera size={20} />
      </label>

      {/* Success Indicator */}
      {!uploading && preview === null && currentImage && (
        <div className="absolute -top-2 -left-2 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-lg animate-bounce">
          <FiCheckCircle size={14} />
        </div>
      )}
    </div>
  );
}