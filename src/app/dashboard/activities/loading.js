export default function Loading() {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-200 rounded-2xl" />
          <div className="h-4 w-48 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-12 w-32 bg-slate-200 rounded-2xl" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-[2.5rem] border-2 border-slate-50" />
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="h-16 bg-slate-50 rounded-3xl border-2 border-slate-100" />

      {/* Table Skeleton */}
      <div className="bg-white rounded-[3rem] border-2 border-slate-100 overflow-hidden">
        <div className="h-16 bg-slate-50 border-b border-slate-100" />
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl" />
              <div className="flex-1 h-8 bg-slate-50 rounded-lg" />
              <div className="w-24 h-8 bg-slate-100 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}