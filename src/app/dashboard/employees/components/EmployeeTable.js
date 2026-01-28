"use client";

import React from 'react';
import {
  EyeIcon,
  PencilSquareIcon,
  CheckBadgeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function EmployeeTable({ employees, loading, onView, onEdit }) {

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-4"></div>
        <p className="font-black text-slate-300 uppercase tracking-widest text-[10px]">Accessing Database...</p>
      </div>
    );
  }

  // 1. EMPTY STATE HANDLE KAREIN
  if (!employees || employees.length === 0) {
    return (
      <div className="py-24 text-center bg-white">
        <UserGroupIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">No Employees Found</p>
        <p className="text-slate-300 text-xs mt-1 font-medium">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Avatar & Identity</th>
            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Designation</th>
            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">System Role</th>
            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
            <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Quick Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {employees.map((emp) => (
            <tr key={emp._id} className="group hover:bg-slate-50/50 transition-all duration-300">

              <td className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative group/avatar">
                    <div className="w-14 h-14 rounded-[1.5rem] bg-white border-2 border-slate-100 shadow-sm overflow-hidden group-hover/avatar:border-indigo-400 transition-all duration-300">
                      {emp.avatar ? (
                        <img
                          src={emp.avatar}
                          className="w-full h-full object-cover transform group-hover/avatar:scale-110 transition-transform duration-500"
                          alt="Employee"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-500 font-black text-xl italic">
                          {/* Safe access for name */}
                          {emp.user?.name ? emp.user.name.charAt(0) : '?'}
                        </div>
                      )}
                    </div>
                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                      <CheckBadgeIcon className={`w-4 h-4 ${emp.role === 'admin' ? 'text-purple-500' : 'text-blue-500'}`} />
                    </div>
                  </div>
                  <div>
                    <p className="font-black text-slate-900 leading-tight">
                      {/* Backend key 'user.name' check karein */}
                      {emp.user?.name || "Unknown User"}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">ID: {emp.employeeId}</p>
                  </div>
                </div>
              </td>

              <td className="p-6">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-700 text-sm">{emp.designation || 'Staff'}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{emp.department}</span>
                </div>
              </td>

              <td className="p-6">
                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${emp.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  {emp.role}
                </span>
              </td>

              <td className="p-6">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${emp.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{emp.status}</span>
                </div>
              </td>

              <td className="p-6 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onView(emp._id)}
                    className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-xl transition-all shadow-sm"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(emp._id)}
                    className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 rounded-xl transition-all shadow-sm"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}