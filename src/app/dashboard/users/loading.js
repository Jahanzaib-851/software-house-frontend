export default function Loading() {
  return (
    <div className="p-8 space-y-10 animate-pulse">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-slate-200 rounded-[3rem]" />
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="h-20 bg-slate-100 rounded-[2.5rem] w-full" />

      {/* Table Skeleton */}
      <div className="bg-white/50 rounded-[2.5rem] border border-slate-100 overflow-hidden">
        <div className="h-16 bg-slate-200 mb-4" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 p-6 border-b border-slate-50">
            <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-3 bg-slate-100 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 animate-bounce">
          Establishing Secure Connection...
        </p>
      </div>
    </div>
  );
}