"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsMainPage() {
  const router = useRouter();
  const [status, setStatus] = useState("INITIALIZING");

  useEffect(() => {
    // 2026 UX: Status cycling during redirect
    const statusCodes = ["ESTABLISHING_HANDSHAKE", "ACCESSING_VAULT", "DECRYPTING_PROTOCOLS", "READY"];
    let i = 0;
    const interval = setInterval(() => {
      if (i < statusCodes.length) setStatus(statusCodes[i++]);
    }, 300);

    const timer = setTimeout(() => {
      router.push("/dashboard/settings/general");
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <div className="fixed inset-0 bg-[#0A0A0B] z-[100] flex items-center justify-center overflow-hidden font-mono">

      {/* --- LAYER 1: NEON GRID BACKGROUND --- */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

      {/* --- LAYER 2: RADIAL GLOW --- */}
      <div className="absolute w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />

      <div className="relative flex flex-col items-center">

        {/* --- LAYER 3: THE CORE ENGINE (CYBER HEX) --- */}
        <div className="relative w-40 h-40 mb-12">
          {/* Rotating Outer Rings */}
          <div className="absolute inset-0 border-[1px] border-dashed border-indigo-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute inset-4 border-[1px] border-indigo-500/50 rounded-[2.5rem] rotate-45 animate-[spin_6s_linear_infinite] opacity-20" />

          {/* Central Glass Core */}
          <div className="absolute inset-8 bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-[0_0_50px_rgba(79,70,229,0.3)] border border-white/10 flex items-center justify-center overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent animate-pulse" />
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />

            {/* Digital Scan Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-400/50 shadow-[0_0_15px_indigo] animate-[scan_2s_ease-in-out_infinite]" />
          </div>
        </div>

        {/* --- LAYER 4: SYSTEM STATUS INTERFACE --- */}
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-[10px] font-black uppercase tracking-[1em] text-indigo-400">
              Settings Terminal
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-white text-lg font-black tracking-tighter italic">0x{status}</span>
              <span className="w-2 h-4 bg-indigo-500 animate-[blink_1s_steps(1)_infinite]" />
            </div>
          </div>

          {/* Progress Bar with Digital Steps */}
          <div className="flex gap-1 justify-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-10 h-[3px] bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 animate-[loading_1s_ease-in-out_infinite]"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              </div>
            ))}
          </div>

          <p className="text-[7px] text-slate-500 font-bold uppercase tracking-[0.4em]">
            System Integrity Check: <span className="text-emerald-500">OPTIMAL</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes loading {
          0% { transform: scaleX(0); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: left; }
          50.1% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}