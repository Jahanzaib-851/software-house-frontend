"use client";
import { useState, useRef } from "react";
import { FiX, FiCamera, FiCheck, FiLoader } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientModal({ isOpen, onClose, onSubmit, loading }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", companyName: "", phone: "", address: "", notes: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    // Text fields append kar rahe hain
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    // Image file append kar rahe hain (Backend expects 'avatar')
    if (avatarFile) data.append("avatar", avatarFile);
    
    onSubmit(data);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          <button onClick={onClose} className="absolute right-8 top-8 text-slate-400 hover:text-slate-900 transition-colors">
            <FiX size={24} />
          </button>
          
          <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter italic">Register New Client</h2>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center mb-8">
              <div 
                onClick={() => fileInputRef.current.click()}
                className="w-28 h-28 rounded-[2.5rem] bg-slate-100 border-4 border-white shadow-lg cursor-pointer overflow-hidden flex items-center justify-center group relative"
              >
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <FiCamera size={32} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-[10px] text-white font-black uppercase tracking-widest">Change</p>
                </div>
              </div>
              <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
              <p className="text-[10px] font-black text-slate-400 uppercase mt-3 tracking-widest">Upload Profile Picture</p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Client Name</label>
                <input required className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 ring-indigo-500/20 font-bold" 
                  onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Email Address</label>
                <input required type="email" className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 ring-indigo-500/20 font-bold"
                  onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Password</label>
                <input required type="password" className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 ring-indigo-500/20 font-bold"
                  onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Company Name</label>
                <input className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 ring-indigo-500/20 font-bold"
                  onChange={e => setFormData({...formData, companyName: e.target.value})} />
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-70">
               {loading ? <FiLoader className="animate-spin" size={20} /> : <><FiCheck size={20} /> COMPLETE REGISTRATION</>}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}