"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import EmployeeService from '@/services/employee.service';
import EmployeeTable from './components/EmployeeTable';
import StatsCards from './components/StatsCards';
import DeleteModal from './components/DeleteModal';
import { PlusIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

import { toast, ToastContainer } from 'react-toastify';

export default function EmployeeListPage() {
  const router = useRouter();

  // States
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ q: '', status: 'all' });

  // Delete Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEmployees = useCallback(async (pageNumber = 1) => {
    try {
      setLoading(true);
      const params = {
        page: pageNumber,
        limit: 10,
        q: filters.q,
        status: filters.status !== 'all' ? filters.status : undefined
      };

      const response = await EmployeeService.getEmployees(params);

      // ✅ DATA EXTRACTION (Donon backend structures ke liye flexible)
      const apiResponse = response.data;

      // Table data nikalne ka sahi tareeka
      const actualArray = apiResponse?.data?.data || apiResponse?.data || apiResponse || [];

      // Meta data (Total Personnel) nikalne ka sahi tareeka
      const actualMeta = apiResponse?.meta || apiResponse?.data?.meta || {
        total: Array.isArray(actualArray) ? actualArray.length : 0,
        page: pageNumber,
        totalPages: 1
      };

      setEmployees(Array.isArray(actualArray) ? actualArray : []);
      setMeta(actualMeta);

    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Data load nahi ho saka");
    } finally {
      setLoading(false);
    }
  }, [filters.q, filters.status]);

  // Handlers
  const handleDeleteClick = (emp) => {
    setSelectedEmp(emp);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await EmployeeService.deleteEmployee(selectedEmp._id);
      toast.success("Employee Updated");
      setIsModalOpen(false);
      fetchEmployees(meta.page);
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Search Debounce Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [filters.q, filters.status, fetchEmployees]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Staff Directory</h1>
            <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest opacity-60">Management Console</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/employees/create')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-indigo-100 transition-all active:scale-95"
          >
            <PlusIcon className="w-5 h-5" /> Onboard New Member
          </button>
        </div>

        {/* Stats Cards Section */}
        <StatsCards meta={meta} employees={employees} />

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4 mt-10 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Name or Designation..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm outline-none font-bold text-slate-600"
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />
          </div>
          <select
            className="px-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm font-bold text-slate-600 outline-none"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <EmployeeTable
            employees={employees}
            loading={loading}
            onView={(id) => router.push(`/dashboard/employees/${id}`)}
            onEdit={(id) => router.push(`/dashboard/employees/edit/${id}`)}
            onDelete={handleDeleteClick}
          />

          {/* Pagination Section */}
          <div className="p-6 border-t border-slate-50 flex items-center justify-between">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Total Personnel: {meta.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={meta.page <= 1 || loading}
                onClick={() => fetchEmployees(meta.page - 1)}
                className="p-2 rounded-xl border border-slate-100 hover:bg-slate-50 disabled:opacity-30"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <span className="text-sm font-bold text-slate-700 mx-2">
                Page {meta.page} / {meta.totalPages || 1}
              </span>
              <button
                disabled={meta.page >= meta.totalPages || loading}
                onClick={() => fetchEmployees(meta.page + 1)}
                className="p-2 rounded-xl border border-slate-100 hover:bg-slate-50 disabled:opacity-30"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <DeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
          employeeName={selectedEmp?.user?.name || selectedEmp?.employeeId}
          loading={deleteLoading}
        />

      </div>
    </div>
  );
}