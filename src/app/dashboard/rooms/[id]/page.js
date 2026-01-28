"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import roomService from "@/services/room.service";
import projectService from "@/services/project.service"; // Projects list lene ke liye
import { FiArrowLeft, FiUserPlus, FiLogOut, FiActivity, FiMapPin, FiUsers, FiClock } from "react-icons/fi";

import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function RoomDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [room, setRoom] = useState(null);
  const [projects, setProjects] = useState([]); // Assignment ke liye projects ki list
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomRes, projectsRes] = await Promise.all([
          roomService.getRoomById(id),
          projectService.getProjects() // Backend se projects mangwayein
        ]);
        setRoom(roomRes.data);
        setProjects(projectsRes.data || []);
      } catch (error) {
        toast.error("Data load karne mein masla hua");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 1. Assign Room Logic
  const handleAssign = async () => {
    if (!selectedProject) return toast.error("Please select a project");
    try {
      await roomService.assignRoom(id, selectedProject);
      toast.success("Room successfully assigned!");
      window.location.reload(); // Refresh to show new status
    } catch (error) {
      toast.error("Assignment failed");
    }
  };

  // 2. Release Room Logic
  const handleRelease = async () => {
    if (!window.confirm("Release this room? It will become available for others.")) return;
    try {
      await roomService.releaseRoom(id);
      toast.success("Room is now available!");
      window.location.reload();
    } catch (error) {
      toast.error("Release failed");
    }
  };

  if (loading) return <div className="p-10 animate-pulse text-slate-400 font-bold uppercase tracking-widest text-center">Loading Spatial Intel...</div>;
  if (!room) return <div className="p-10 text-center">Room not found</div>;

  return (
    <div className="p-4 md:p-10 max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest mb-8 transition-colors"
      >
        <FiArrowLeft strokeWidth={3} /> Back to Inventory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border 
                  ${room.status === 'available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                  System Status: {room.status}
                </span>
                <h1 className="text-5xl font-black text-slate-900 mt-4 tracking-tight">{room.name}</h1>
              </div>
              <div className="p-5 bg-slate-900 text-white rounded-[2rem] shadow-xl shadow-slate-200">
                <FiActivity size={32} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FiMapPin /> Location</p>
                <p className="font-bold text-slate-700">{room.floor || "Main Level"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FiUsers /> Capacity</p>
                <p className="font-bold text-slate-700">{room.capacity} Persons Max</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><FiClock /> Created</p>
                <p className="font-bold text-slate-700">{new Date(room.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Space Remarks</p>
              <p className="text-slate-500 font-medium leading-relaxed">{room.remarks || "No additional configuration notes for this space."}</p>
            </div>
          </motion.div>
        </div>

        {/* Right: Actions & Assignment */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50"
          >
            <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">Assignment Control</h3>

            {room.status === 'available' ? (
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 leading-relaxed">Select a project to authorize access to this room.</p>
                <select
                  className="w-full p-5 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 outline-none ring-2 ring-transparent focus:ring-indigo-500 transition-all"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">Choose Project...</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  <FiUserPlus size={18} /> Authorize Assignment
                </button>
              </div>
            ) : (
              <div className="space-y-6 text-center">
                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-amber-700 font-bold text-sm">Space is currently under active usage.</p>
                </div>
                <button
                  onClick={handleRelease}
                  className="w-full py-5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  <FiLogOut size={18} /> Release Space Now
                </button>
              </div>
            )}
          </motion.div>

          <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
            <h4 className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-400 mb-4">Security Advisory</h4>
            <p className="text-xs font-medium text-slate-300 leading-relaxed italic">
              "Every room assignment is logged for audit purposes. Ensure projects have valid timelines before granting access."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}