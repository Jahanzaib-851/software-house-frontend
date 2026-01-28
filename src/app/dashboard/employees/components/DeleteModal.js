"use client";

import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function DeleteModal({ isOpen, onClose, onConfirm, employeeName, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center mb-6">
            <ExclamationTriangleIcon className="w-10 h-10 text-rose-500" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-2">Are you sure?</h2>
          <p className="text-slate-400 text-sm font-bold leading-relaxed">
            Aap <span className="text-slate-900">"{employeeName}"</span> ki profile ko deactivate karne ja rahe hain. Yeh record dashboard se hat jayega.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-10">
          <button
            onClick={onClose}
            className="py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Yes, Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}