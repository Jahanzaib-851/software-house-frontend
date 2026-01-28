"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
// Icons
import {
  FiUser, FiHome, FiBriefcase, FiTool, FiTrash2,
  FiActivity, FiRefreshCw, FiArrowLeft, FiCpu,
  FiArrowRight, FiShield, FiDollarSign, FiCheckCircle, FiLayers
} from "react-icons/fi";

// Services
import assetService from "@/services/asset.service";
import employeeService from "@/services/employee.service";
import roomService from "@/services/room.service";
import projectService from "@/services/project.service";

export default function AssetIntelPage() {
  const { id } = useParams();
  const router = useRouter();

  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignMode, setAssignMode] = useState("Employee");
  const [targets, setTargets] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Fixed Target Fetching Logic
  const fetchTargets = async (mode) => {
    setAssignMode(mode);
    setSelectedTarget("");
    try {
      let res;
      if (mode === "Employee") res = await employeeService.getEmployees();
      if (mode === "Room") res = await roomService.getRooms();
      if (mode === "Project") res = await projectService.getProjects();

      // Professional Data Mapping: 
      // Hum check kar rahe hain ke data res.data mein hai ya res.data.employees mein
      const rawData = res.data?.employees || res.data?.rooms || res.data?.projects || res.data?.data || res.data || [];

      console.log(`Debug ${mode} Data:`, rawData); // F12 dabakar console check karein
      setTargets(Array.isArray(rawData) ? rawData : []);
    } catch (err) {
      toast.error(`Registry Unreachable`);
    }
  };

  const loadAssetData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await assetService.getAssetById(id);
      setAsset(res.data);
      await fetchTargets("Employee");
    } catch (err) {
      toast.error("Access Denied");
      router.push("/dashboard/assets");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    loadAssetData();
  }, [loadAssetData]);

  const handleDeployment = async () => {
    if (!selectedTarget) return toast.error("Selection Required");
    try {
      setIsProcessing(true);
      await assetService.assignAsset(id, {
        assignedTo: selectedTarget,
        assignedToModel: assignMode
      });
      toast.success(`Success: Asset Deployed`);
      loadAssetData();
    } catch (err) {
      toast.error("Authorization Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to extract name from deep objects (Ali Gujjar / Hassan)
  const getDisplayName = (target) => {
    // Agar employee object ke andar user object hai (jaise Ali Gujjar)
    if (target.user?.name) return target.user.name;
    if (target.user?.fullName) return target.user.fullName;

    // Agar direct object mein hai
    return target.name || target.fullName || target.userName || target.title || "Unknown Resource";
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
      <div className="w-10 h-10 border-4 border-slate-900 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5] p-4 lg:p-12 font-sans selection:bg-amber-200">
      <div className="max-w-[1400px] mx-auto">

        <button onClick={() => router.back()} className="flex items-center gap-3 text-slate-500 hover:text-black font-black text-[11px] uppercase tracking-[0.3em] mb-12 transition-all group bg-white/50 backdrop-blur-md px-6 py-3 rounded-full border border-white w-fit shadow-sm">
          <FiArrowLeft className="group-hover:-translate-x-2 transition-transform" /> Back to Nexus
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left Panel */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[4rem] p-12 shadow-xl border border-white text-center relative overflow-hidden group">
              <div className="w-20 h-20 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-amber-500 mx-auto mb-6 shadow-2xl">
                <FiCpu size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">{asset?.name}</h2>
              <div className="inline-block px-4 py-1 bg-slate-100 rounded-lg font-mono text-[9px] font-bold text-slate-400 tracking-widest mb-8">
                REF: {asset?.serialNumber}
              </div>

              <div className="flex justify-center">
                <div className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg
                  ${asset?.status === 'available' ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-amber-500 text-white shadow-amber-200'}`}>
                  {asset?.status}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Deployment Hub */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[4.5rem] p-10 lg:p-16 border border-white shadow-2xl">

              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-5 mb-12">
                <span className="w-12 h-1 bg-amber-500 rounded-full"></span> Deployment Matrix
              </h3>

              {/* Tabs */}
              <div className="grid grid-cols-3 gap-6 mb-16">
                {[
                  { id: 'Employee', label: 'Employee', icon: FiUser },
                  { id: 'Room', label: 'Room', icon: FiHome },
                  { id: 'Project', label: 'Project', icon: FiBriefcase }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => fetchTargets(tab.id)}
                    className={`flex flex-col items-center gap-4 py-8 rounded-[2.5rem] transition-all duration-500 ${assignMode === tab.id ? 'bg-slate-900 text-white shadow-2xl -translate-y-2' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    <tab.icon size={24} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Selection Dropdown - Deep Name Extraction */}
              <div className="space-y-10">
                <div className="relative group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8 mb-4 block italic">Target Identity</label>
                  <select
                    value={selectedTarget}
                    onChange={(e) => setSelectedTarget(e.target.value)}
                    className="w-full p-8 bg-slate-50 text-slate-900 border-2 border-transparent rounded-[2.5rem] font-black text-lg outline-none focus:bg-white focus:border-amber-500 appearance-none cursor-pointer shadow-inner transition-all hover:bg-slate-100"
                    style={{ color: 'black' }} // High Contrast
                  >
                    <option value="" className="text-slate-400">Select {assignMode}...</option>
                    {targets.map(t => (
                      <option key={t._id} value={t._id} className="text-slate-900 font-bold bg-white">
                        {/* Final Logic: Check User Name, then Name, then FullName */}
                        {getDisplayName(t).toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-10 bottom-8 pointer-events-none text-amber-500">
                    {isProcessing ? <FiRefreshCw className="animate-spin" /> : <FiArrowRight size={24} className="rotate-90" />}
                  </div>
                </div>

                <button
                  disabled={isProcessing || !selectedTarget}
                  onClick={handleDeployment}
                  className="w-full py-9 bg-slate-900 hover:bg-amber-500 text-white rounded-[2.5rem] font-black uppercase text-sm tracking-[0.4em] transition-all duration-500 shadow-2xl disabled:opacity-20 flex items-center justify-center gap-5"
                >
                  {isProcessing ? "Processing..." : "Confirm Deployment"}
                  <FiCheckCircle size={22} />
                </button>
              </div>

              {targets.length === 0 && !isProcessing && (
                <div className="mt-8 text-center">
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">⚠️ No {assignMode} Registry Data Available</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}