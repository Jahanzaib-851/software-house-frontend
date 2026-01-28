"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiPlus, FiSearch, FiCpu, FiUser, FiHome,
  FiBriefcase, FiMoreVertical, FiArrowRight, FiFilter
} from "react-icons/fi";
import assetService from "@/services/asset.service";

import { toast } from "react-toastify";

export default function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const loadAssets = async () => {
    try {
      setLoading(true);
      const res = await assetService.getAssets();
      // Backend mapping for deep population
      setAssets(res.data?.assets || res.data || []);
    } catch (err) {
      toast.error("Failed to sync with Registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  // Filter Logic
  const filteredAssets = assets.filter(asset =>
    asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fancy Name Extractor (Ali Gujjar / Hassan / Room)
  const getAssigneeName = (asset) => {
    if (!asset.assignedTo) return null;
    const target = asset.assignedTo;
    const name = target.user?.name || target.user?.fullName || target.name || target.fullName || "Unit-X";
    return name.toUpperCase();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Nexus...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-6 lg:p-10 font-sans">
      <div className="max-w-[1600px] mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Asset Registry</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-2">Hardware & Resource Intelligence</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="SEARCH SERIAL / NAME..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border-none rounded-2xl py-4 pl-12 pr-6 text-[11px] font-black w-64 lg:w-80 shadow-sm focus:ring-2 focus:ring-amber-500 transition-all uppercase"
              />
            </div>
            <button
              onClick={() => router.push('/dashboard/assets/new')}
              className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-amber-500 transition-all shadow-xl group"
            >
              <FiPlus size={24} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>
        </div>

        {/* Table / Grid Container */}
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Identity</th>
                  <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Deployment Status</th>
                  <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Custodian</th>
                  <th className="px-8 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredAssets.map((asset) => (
                  <tr key={asset._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-amber-500 shadow-lg group-hover:scale-110 transition-transform">
                          <FiCpu size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{asset.name}</p>
                          <p className="text-[9px] font-mono font-bold text-slate-400 mt-1">{asset.serialNumber}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-lg">
                        {asset.category}
                      </span>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${asset.status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${asset.status === 'available' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {asset.status}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      {asset.assignedTo ? (
                        <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2 rounded-2xl w-fit shadow-md">
                          {asset.assignedToModel === 'Employee' ? <FiUser className="text-amber-500" /> : <FiHome className="text-amber-500" />}
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-tight">{getAssigneeName(asset)}</span>
                            <span className="text-[8px] font-bold text-slate-500 uppercase">{asset.assignedToModel}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300 italic uppercase">Vacant Storage</span>
                      )}
                    </td>

                    <td className="px-8 py-6">
                      <button
                        onClick={() => router.push(`/dashboard/assets/${asset._id}`)}
                        className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all flex items-center gap-2 group/btn"
                      >
                        <span className="text-[9px] font-black uppercase hidden group-hover/btn:block">Manage</span>
                        <FiArrowRight />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAssets.length === 0 && (
            <div className="p-20 text-center">
              <div className="text-slate-200 mb-4 flex justify-center"><FiBriefcase size={60} /></div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">No Intelligence Records Found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}