"use client";
import { useState, useEffect } from "react";
import {
  FiX, FiCheck, FiCpu, FiHash, FiMapPin,
  FiDollarSign, FiActivity
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function AssetModal({ isOpen, onClose, onSubmit, initialData, rooms = [] }) {

  const defaultState = {
    name: "",
    category: "hardware",
    status: "available",
    serialNumber: "",
    purchaseDate: "",
    warrantyExpiry: "",
    cost: 0,
    remarks: "",
    location: ""
  };

  const [formData, setFormData] = useState(defaultState);

  // 🔥 SAFE DATE FORMATTER: Crash se bachane ke liye
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : "";
    } catch (e) {
      return "";
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...defaultState, // Spread defaults first for safety
          ...initialData,
          purchaseDate: formatDate(initialData.purchaseDate),
          warrantyExpiry: formatDate(initialData.warrantyExpiry),
          location: initialData.location?._id || initialData.location || ""
        });
      } else {
        setFormData(defaultState);
      }
    }
  }, [initialData, isOpen]);

  const handleInternalSubmit = async () => {
    if (!formData.name?.trim() || !formData.serialNumber?.trim()) {
      alert("Asset Name and Serial Number are mandatory.");
      return;
    }

    try {
      const cleanData = {
        ...formData,
        name: formData.name.trim(),
        serialNumber: formData.serialNumber.trim().toUpperCase()
      };

      await onSubmit(cleanData);

      if (!initialData) setFormData(defaultState);
      onClose(); // Auto-close after successful submit
    } catch (err) {
      console.error("Submission Error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex bg-slate-50 p-6 justify-between items-center border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-amber-500 shadow-md">
              <FiCpu size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {initialData ? 'Edit Asset' : 'Register Asset'}
              </h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">System Inventory Node</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[70vh] overflow-y-auto">

          <div className="col-span-2 space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Asset Identity</label>
            <input
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-4 bg-slate-50 rounded-xl border-2 border-transparent focus:border-slate-900 outline-none font-bold text-slate-700 transition-all"
              placeholder="e.g. MacBook Pro M3"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Status</label>
            <div className="relative">
              <FiActivity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-4 pl-10 bg-slate-50 rounded-xl border-2 border-transparent focus:border-slate-900 outline-none font-bold text-slate-700 appearance-none uppercase text-xs"
              >
                <option value="available">Ready to Deploy</option>
                <option value="assigned">Assigned</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Serial Number</label>
            <div className="relative">
              <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={formData.serialNumber}
                onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full p-4 pl-10 bg-slate-50 rounded-xl border-2 border-transparent focus:border-slate-900 outline-none font-mono font-bold text-slate-700"
                placeholder="SN-0000"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Location</label>
            <div className="relative">
              <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-4 pl-10 bg-slate-50 rounded-xl border-2 border-transparent focus:border-slate-900 outline-none font-bold text-slate-700 appearance-none text-xs"
              >
                <option value="">Select Room</option>
                {rooms && rooms.map(room => (
                  <option key={room._id} value={room._id}>{room.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Purchase Cost</label>
            <div className="relative">
              <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
              <input
                type="number"
                value={formData.cost}
                onChange={e => setFormData({ ...formData, cost: e.target.value })}
                className="w-full p-4 pl-10 bg-slate-50 rounded-xl border-2 border-transparent focus:border-slate-900 outline-none font-bold text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-slate-400 uppercase text-[10px]">Cancel</button>
          <button
            onClick={handleInternalSubmit}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-amber-500 transition-all flex items-center gap-2"
          >
            <FiCheck /> {initialData ? 'Confirm Changes' : 'Authorize Asset'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}