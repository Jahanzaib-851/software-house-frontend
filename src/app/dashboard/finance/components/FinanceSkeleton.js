"use client";

export default function FinanceSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">

      {/* 1. Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
              <div className="w-16 h-6 bg-slate-100 rounded-full" />
            </div>
            <div className="space-y-3">
              <div className="w-24 h-2 bg-slate-100 rounded-full" />
              <div className="w-40 h-8 bg-slate-200 rounded-xl" />
            </div>
            <div className="mt-6 w-full h-1.5 bg-slate-50 rounded-full" />
          </div>
        ))}
      </div>

      {/* 2. Table Section Skeleton */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* Table Header Placeholder */}
        <div className="p-8 border-b border-slate-50 flex justify-between">
          <div className="w-32 h-4 bg-slate-200 rounded-full" />
          <div className="w-48 h-8 bg-slate-100 rounded-xl" />
        </div>

        {/* Table Rows Placeholder */}
        <div className="p-8 space-y-6">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                <div className="space-y-2">
                  <div className="w-64 h-4 bg-slate-200 rounded-full" />
                  <div className="w-32 h-2 bg-slate-100 rounded-full" />
                </div>
              </div>
              <div className="hidden md:block space-y-2">
                <div className="w-24 h-3 bg-slate-100 rounded-full" />
              </div>
              <div className="text-right space-y-2">
                <div className="w-28 h-5 bg-slate-200 rounded-lg ml-auto" />
                <div className="w-12 h-2 bg-slate-100 rounded-full ml-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Footer Placeholder */}
        <div className="p-8 bg-slate-50/50 flex justify-between items-center">
          <div className="w-32 h-4 bg-slate-200 rounded-full" />
          <div className="flex gap-4">
            <div className="w-28 h-10 bg-slate-200 rounded-xl" />
            <div className="w-28 h-10 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}