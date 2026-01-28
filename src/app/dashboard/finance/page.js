"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FiPlus, FiFilter } from "react-icons/fi";

// Import Hooks & Services
import { useFinance } from "@/hooks/useFinance";
import financeService from "@/services/finance.service";



import FinanceStats from "./components/FinanceStats";
import TransactionTable from "./components/TransactionTable";
import TransactionModal from "./components/TransactionModal";
import FinanceFilters from "./components/FinanceFilters";
import FinanceSkeleton from "./components/FinanceSkeleton";

// Import Components

export default function FinancePage() {
  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    type: "",
    from: "",
    to: "",
    limit: 10
  });

  // Hook se data aur loading nikalna
  const { data, loading, fetchFinance, addTransaction } = useFinance();

  // Data load karne ka function
  const loadData = useCallback(() => {
    fetchFinance({ page, ...filters });
  }, [page, filters, fetchFinance]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Naya transaction save karne ka handler
  const handleCreateSubmit = async (formData) => {
    const success = await addTransaction(formData);
    if (success) {
      setIsModalOpen(false);
      loadData(); // Table aur Stats refresh karein
    }
  };

  // Filters update karne ka handler
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Filter change ho to page 1 par wapis jayein
  };

  // Loading State (Skeleton)
  if (loading && page === 1 && data.items.length === 0) {
    return (
      <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen">
        <div className="mb-10 w-48 h-10 bg-slate-200 rounded-xl animate-pulse" />
        <FinanceSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 space-y-10">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Financial Ledger</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time overview of revenue and project expenditures.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          <FiPlus size={22} />
          <span>New Transaction</span>
        </button>
      </div>

      {/* 1. Fancy Stats (Top Section) */}
      <FinanceStats summary={data.summary} />

      {/* 2. Filters & Data Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900 text-white rounded-xl">
              <FiFilter size={18} />
            </div>
            <h2 className="font-black text-slate-900 uppercase tracking-widest text-xs">Quick Filters</h2>
          </div>
          <FinanceFilters onFilterChange={handleFilterChange} />
        </div>

        {/* 3. Transaction Table Section */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-2 md:p-8">
            <TransactionTable transactions={data.items} />
          </div>

          {/* Pagination Footer */}
          <div className="px-10 py-8 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/20">
            <p className="text-sm font-bold text-slate-400 italic">
              Record {((page - 1) * filters.limit) + 1} to {Math.min(page * filters.limit, data.meta?.total || 0)} of {data.meta?.total || 0}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-8 py-3 rounded-2xl font-bold bg-white border border-slate-200 text-slate-700 disabled:opacity-30 transition-all shadow-sm active:scale-95"
              >
                Back
              </button>

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil((data.meta?.total || 0) / filters.limit)}
                className="px-8 py-3 rounded-2xl font-bold bg-slate-900 text-white hover:bg-indigo-600 disabled:opacity-30 transition-all shadow-lg active:scale-95"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Add Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
}