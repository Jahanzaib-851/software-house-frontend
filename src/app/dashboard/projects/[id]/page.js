"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import projectService from "@/services/project.service";
import { FiArrowLeft, FiCalendar, FiUser, FiGlobe, FiClock, FiCheckCircle } from "react-icons/fi";

import { toast } from "react-toastify";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await projectService.getProjectById(id);
        setProject(res.data);
      } catch (error) {
        toast.error("Project details load nahi ho sakeen");
        router.push("/dashboard/projects");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-black animate-pulse uppercase tracking-widest text-slate-400">Loading Intelligence...</div>;
  if (!project) return null;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Top Navigation */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-black text-xs uppercase tracking-widest mb-8 transition-all"
      >
        <FiArrowLeft strokeWidth={3} /> Back to Projects
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                {project.status}
              </span>
              <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                Priority: {project.priority}
              </span>
            </div>

            <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic mb-6 leading-tight">
              {project.name}
            </h1>

            <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10 border-l-4 border-indigo-100 pl-6 italic">
              {project.description}
            </p>

            {/* Timeline Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-[2rem]">
              <div className="flex items-center gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm text-indigo-600">
                  <FiCalendar size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commencement</p>
                  <p className="font-bold text-slate-700">{new Date(project.timeline?.startDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm text-rose-500">
                  <FiClock size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Deadline</p>
                  <p className="font-bold text-slate-700">{new Date(project.timeline?.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar (Client & Team) */}
        <div className="space-y-8">
          {/* Client Info */}
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6 flex items-center gap-2">
              <FiGlobe /> Client Entity
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={project.client?.avatar || `https://ui-avatars.com/api/?name=${project.client?.name}`}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10"
              />
              <div>
                <h4 className="text-xl font-black">{project.client?.companyName}</h4>
                <p className="text-slate-400 text-sm font-bold">{project.client?.name}</p>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
              <FiUser /> Deployed Resources
            </h3>
            <div className="space-y-4">
              {project.team?.map((member, i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all group">
                  <img
                    src={member.user?.avatar || "/default-avatar.png"}
                    className="w-12 h-12 rounded-full object-cover group-hover:ring-2 ring-indigo-500 transition-all"
                  />
                  <div>
                    <p className="font-black text-slate-800 leading-none mb-1">{member.user?.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{member.designation || 'Specialist'}</p>
                  </div>
                </div>
              ))}
              {project.team?.length === 0 && <p className="text-slate-400 text-xs font-bold italic">No resources deployed yet.</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}