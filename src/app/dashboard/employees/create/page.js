"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import EmployeeService from '@/services/employee.service';
import { ArrowLeftIcon, PhotoIcon, DocumentIcon, CloudArrowUpIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { toast } from "react-toastify";
export default function CreateEmployeePage() {
  const router = useRouter();
  const avatarInputRef = useRef(null);
  const cvInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState({ avatar: null, cvName: "" });

  const [formData, setFormData] = useState({
    password: '',
    role: 'admin',
    designation: '',
    department: 'IT',
    qualifications: '',
    avatar: null,
    cv_file: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      setFormData({ ...formData, [name]: file });
      if (name === 'avatar') {
        setPreviews({ ...previews, avatar: URL.createObjectURL(file) });
      } else {
        setPreviews({ ...previews, cvName: file.name });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      // 'user' ID append karne ki zaroorat nahi, backend login token se khud nikal lega
      data.append("password", formData.password);
      data.append("role", formData.role);
      data.append("designation", formData.designation);
      data.append("department", formData.department);
      data.append("qualifications", formData.qualifications);

      if (formData.avatar) data.append("avatar", formData.avatar);
      if (formData.cv_file) data.append("cv_file", formData.cv_file);

      await EmployeeService.createEmployee(data);
      toast.success("Profile setup complete!");
      router.push('/dashboard/employees');
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-all">
            <ArrowLeftIcon className="w-4 h-4" /> Cancel
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Complete Your Profile</h1>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1 flex items-center justify-end gap-1">
              <CheckBadgeIcon className="w-3 h-3" /> Linked to your account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center">
              <div
                onClick={() => avatarInputRef.current.click()}
                className="w-32 h-32 mx-auto rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-indigo-200 flex items-center justify-center cursor-pointer overflow-hidden group relative"
              >
                {previews.avatar ? (
                  <img src={previews.avatar} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <PhotoIcon className="w-10 h-10 text-indigo-300 group-hover:scale-110 transition-transform" />
                )}
              </div>
              <input type="file" name="avatar" ref={avatarInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-widest">Avatar Photo</p>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div onClick={() => cvInputRef.current.click()} className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 border-dashed text-center cursor-pointer hover:bg-indigo-100 transition-all">
                <DocumentIcon className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                <p className="text-[9px] font-black text-indigo-600 uppercase truncate">
                  {previews.cvName || "Upload CV (PDF)"}
                </p>
              </div>
              <input type="file" name="cv_file" ref={cvInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">System Password</label>
                <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Designation</label>
                <input required name="designation" value={formData.designation} onChange={handleChange} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Lead Designer" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Department</label>
                <select name="department" value={formData.department} onChange={handleChange} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 cursor-pointer focus:ring-2 focus:ring-indigo-500">
                  <option value="IT">IT & Software</option>
                  <option value="HR">Human Resources</option>
                  <option value="Sales">Sales & Marketing</option>
                  <option value="Finance">Accounts & Finance</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Access Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 cursor-pointer focus:ring-2 focus:ring-indigo-500">
                  <option value="admin">Administrator</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Education / Qualifications</label>
              <textarea name="qualifications" value={formData.qualifications} onChange={handleChange} rows="3" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 resize-none focus:ring-2 focus:ring-indigo-500" placeholder="Describe your academic background..." />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Finish Onboarding"}
              {!loading && <CloudArrowUpIcon className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}