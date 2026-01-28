"use client";
import { useState, useEffect } from "react";
import { FiX, FiSave, FiLayers, FiUsers, FiMapPin, FiInfo } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function RoomModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "meeting",
    capacity: 1,
    floor: "",
    remarks: ""
  });

  // Jab edit mode ho toh data load karne ke liye
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: "", type: "meeting", capacity: 1, floor: "", remarks: "" });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop / Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-white"
        >
          {/* Header */}
          <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black tracking-tight uppercase">
                {initialData ? "Refine Room" : "Initialize Room"}
              </h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                Spatial Configuration Panel
              </p>
            </div>
            <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
              <FiX size={20} />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-8 space-y-6">
            {/* Room Name Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <FiInfo className="text-indigo-500" /> Room Identity
              </label>
              <input
                autoFocus
                className="w-full p-5 bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-indigo-100 focus:bg-white transition-all font-bold text-slate-700 outline-none"
                placeholder="e.g. Delta Strategy Room"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Type & Capacity Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <FiLayers className="text-indigo-500" /> Space Type
                </label>
                <select
                  className="w-full p-5 bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-indigo-100 focus:bg-white transition-all font-bold text-slate-700 outline-none appearance-none"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="meeting">Meeting Room</option>
                  <option value="office">Private Office</option>
                  <option value="lab">Innovation Lab</option>
                  <option value="conference">Conference</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <FiUsers className="text-indigo-500" /> Max Pax
                </label>
                <input
                  type="number"
                  className="w-full p-5 bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-indigo-100 focus:bg-white transition-all font-bold text-slate-700 outline-none"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                />
              </div>
            </div>

            {/* Floor & Remarks */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                <FiMapPin className="text-indigo-500" /> Location / Floor
              </label>
              <input
                className="w-full p-5 bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-indigo-100 focus:bg-white transition-all font-bold text-slate-700 outline-none"
                placeholder="e.g. 4th Floor, East Wing"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              />
            </div>
          </div>

          {/* Actions Footer */}
          <div className="p-8 pt-0 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 p-5 rounded-[1.5rem] font-black text-xs text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(formData)}
              className="flex-[2] p-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black text-xs shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95"
            >
              <FiSave size={18} />
              {initialData ? "Confirm Update" : "Deploy Room"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}