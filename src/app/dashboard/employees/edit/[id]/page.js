"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EmployeeService from '@/services/employee.service';

import { toast } from "react-toastify";
import { CameraIcon, ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function EditEmployeePage() {
  const { id } = useParams();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    designation: '',
    department: '',
    qualifications: '',
    role: '',
    status: '',
    avatar: null // Ismein ya toh null hoga ya File object
  });

  // 1. Existing Data Fetch Karna
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await EmployeeService.getEmployeeById(id);
        const data = res.data?.data || res.data;

        setFormData({
          designation: data.designation || '',
          department: data.department || '',
          qualifications: data.qualifications || '',
          role: data.role || 'employee',
          status: data.status || 'active',
          avatar: null // Default null kyunke file re-select karni hogi
        });

        // Purani pic dikhane ke liye preview set karein
        if (data.avatar) {
          setPreview(data.avatar);
        }
      } catch (err) {
        toast.error("Data load nahi ho saka");
      } finally {
        setFetching(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      setPreview(URL.createObjectURL(file)); // Nayi pic ka preview
      console.log("📸 File selected:", file.name);
    }
  };

  // 2. Updated Submit Handler (Sending FormData to Backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ ZAROORI: Image ke liye FormData use karna lazmi hai
      const payload = new FormData();

      payload.append("designation", formData.designation);
      payload.append("department", formData.department);
      payload.append("qualifications", formData.qualifications);
      payload.append("role", formData.role);
      payload.append("status", formData.status);

      // Agar user ne nayi file select ki hai toh hi bhejien
      if (formData.avatar instanceof File) {
        payload.append("avatar", formData.avatar);
        console.log("🚀 Sending File to Backend...");
      }

      // API Call
      await EmployeeService.updateEmployee(id, payload);

      toast.success("Profile updated successfully!");
      router.push(`/dashboard/employees`);

    } catch (error) {
      console.error("Update Error:", error);
      const msg = error.response?.data?.message || "Update failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-20 text-center animate-pulse font-black text-slate-300 uppercase tracking-widest">Loading Employee Data...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-6">
          <ArrowLeftIcon className="w-4 h-4" /> Cancel Edit
        </button>

        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-50">
          <h1 className="text-3xl font-black text-slate-900 mb-8 text-center tracking-tight">Update Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-10">
              <div
                onClick={() => fileInputRef.current.click()}
                className="w-28 h-28 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-indigo-200 flex items-center justify-center cursor-pointer overflow-hidden relative group"
              >
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <CameraIcon className="w-8 h-8 text-indigo-300" />
                )}
                <div className="absolute inset-0 bg-indigo-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowPathIcon className="w-8 h-8 text-white animate-spin-slow" />
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-widest">Change Photo</p>
            </div>

            {/* Inputs Section */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Designation</label>
                <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Department</label>
                <select name="department" value={formData.department} onChange={handleChange} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold">
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Sales">Sales</option>
                  <option value="Accounts">Accounts</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Qualifications</label>
              <textarea name="qualifications" value={formData.qualifications} onChange={handleChange} rows="3" className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">System Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold">
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 mt-4">
              {loading ? "SAVING CHANGES..." : "UPDATE EMPLOYEE PROFILE"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}