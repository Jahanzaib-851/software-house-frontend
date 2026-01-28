export default function Loading() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-pulse">

      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-200 rounded-2xl"></div>
          <div className="h-4 w-40 bg-slate-100 rounded-lg"></div>
        </div>
        <div className="h-14 w-48 bg-slate-200 rounded-[2rem]"></div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="h-20 w-full bg-white rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center px-6 gap-4">
        <div className="h-10 w-32 bg-slate-100 rounded-xl"></div>
        <div className="h-10 w-32 bg-slate-100 rounded-xl"></div>
        <div className="h-10 w-32 bg-slate-100 rounded-xl"></div>
        <div className="ml-auto h-12 w-64 bg-slate-100 rounded-2xl"></div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-[3rem] border border-slate-50 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 flex justify-between">
          <div className="h-4 w-20 bg-slate-100 rounded"></div>
          <div className="h-4 w-20 bg-slate-100 rounded"></div>
          <div className="h-4 w-20 bg-slate-100 rounded"></div>
          <div className="h-4 w-20 bg-slate-100 rounded"></div>
        </div>

        {/* Repeating Rows */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-8 flex items-center justify-between border-b border-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-200 rounded-lg"></div>
                <div className="h-3 w-20 bg-slate-100 rounded-lg"></div>
              </div>
            </div>
            <div className="h-4 w-40 bg-slate-100 rounded-lg"></div>
            <div className="h-4 w-24 bg-slate-100 rounded-lg"></div>
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-slate-50 rounded-xl"></div>
              <div className="w-10 h-10 bg-slate-50 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}