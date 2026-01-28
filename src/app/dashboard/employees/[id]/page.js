"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EmployeeService from '@/services/employee.service';
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  DocumentArrowDownIcon,
  CalendarDaysIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { toast } from "react-toastify";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await EmployeeService.getEmployeeById(id);
        // Backend mapping: res.data.data (Kyunke aapka controller ApiResponse bhej raha hai)
        setEmployee(res.data?.data || res.data);
      } catch (err) {
        toast.error("Employee details load nahi ho saki");
        router.push('/dashboard/employees');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-slate-200"></div>
    </div>
  );

  if (!employee) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12">
      <div className="max-w-4xl mx-auto">

        {/* Top Navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-8 hover:text-indigo-600 transition-all"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Back to Directory
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-50">

          {/* Header/Banner Section */}
          <div className="h-44 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 relative">
            <div className="absolute -bottom-16 left-12">
              <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-xl">
                <img
                  src={employee.avatar || `https://ui-avatars.com/api/?name=${employee.user?.name}&background=6366f1&color=fff`}
                  className="w-full h-full object-cover rounded-[2rem]"
                  alt="Profile"
                />
              </div>
            </div>
          </div>

          {/* Profile Basic Info */}
          <div className="pt-20 px-12 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-3xl font-black text-slate-900">{employee.user?.name}</h1>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${employee.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {employee.status}
                  </span>
                </div>
                <p className="text-indigo-600 font-black uppercase text-[10px] tracking-[0.2em]">{employee.designation}</p>
              </div>

              <div className="flex gap-3">
                {employee.cv_file && (
                  <a
                    href={employee.cv_file}
                    target="_blank"
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg"
                  >
                    <DocumentArrowDownIcon className="w-5 h-5" /> Download CV
                  </a>
                )}
              </div>
            </div>

            <hr className="my-10 border-slate-100" />

            {/* Detailed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

              {/* Left Column: Official Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    <BriefcaseIcon className="w-4 h-4" /> Work Information
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Employee ID</p>
                      <p className="font-bold text-slate-800">{employee.employeeId}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Department</p>
                      <p className="font-bold text-slate-800">{employee.department}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    <EnvelopeIcon className="w-4 h-4" /> Contact & Access
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Official Email</p>
                    <p className="font-bold text-slate-800">{employee.email}</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Qualifications & Role */}
              <div className="space-y-8">
                <div>
                  <h3 className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
                    <AcademicCapIcon className="w-4 h-4" /> Academic Profile
                  </h3>
                  <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100">
                    <p className="text-slate-700 font-bold leading-relaxed italic text-sm">
                      "{employee.qualifications || 'No qualifications listed.'}"
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase mb-1">
                      <ShieldCheckIcon className="w-3 h-3" /> System Role
                    </p>
                    <p className="font-black text-indigo-600 uppercase text-xs">{employee.role}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase mb-1">
                      <CalendarDaysIcon className="w-3 h-3" /> Join Date
                    </p>
                    <p className="font-bold text-slate-800 text-xs">
                      {new Date(employee.createdAt).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center mt-10 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Internal Document • Software House Management System
        </p>
      </div>
    </div>
  );
}