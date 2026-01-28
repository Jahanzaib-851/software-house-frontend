"use client";

import React from "react";

export default function SettingsLoading() {
  return (
    <div className="w-full h-full min-h-[500px] flex flex-col gap-10 p-4 animate-in fade-in duration-500">
      {/* 1. Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-3 w-40 bg-slate-50 rounded-full animate-pulse" />
        </div>
        <div className="h-14 w-40 bg-slate-100 rounded-[1.5rem] animate-pulse" />
      </div>

      {/* 2. Form Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-4 p-6 border border-slate-50 rounded-[2rem]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-xl animate-pulse" />
              <div className="h-3 w-24 bg-slate-100 rounded-full animate-pulse" />
            </div>
            <div className="h-14 w-full bg-slate-50 rounded-2xl animate-pulse" />
            <div className="h-2 w-32 bg-slate-50 rounded-full animate-pulse" />
          </div>
        ))}
      </div>

      {/* 3. Massive Glass Block Skeleton */}
      <div className="h-48 w-full bg-slate-50/50 rounded-[3rem] border border-slate-100/50 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 bg-white rounded-full animate-bounce shadow-sm" />
        <div className="h-2 w-48 bg-slate-100 rounded-full animate-pulse" />
      </div>
    </div>
  );
}