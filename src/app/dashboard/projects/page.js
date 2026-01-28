"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation"; // Router zaroori hai navigation ke liye
import projectService from "@/services/project.service";
import ProjectHeader from "./components/ProjectHeader";
import ProjectStats from "./components/ProjectStats";
import ProjectFilters from "./components/ProjectFilters";
import ProjectCard from "./components/ProjectCard";
import ProjectTable from "./components/ProjectTable";
import ProjectModal from "./components/ProjectModal";
import { toast } from "react-toastify";
import { FiGrid, FiList } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ totalProjects: 0, active: 0, completed: 0, urgent: 0 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); // Edit ke liye

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // 1. Fetch Stats
  const fetchStats = async () => {
    try {
      const response = await projectService.getProjectStats();
      if (response.data) setStats(response.data);
    } catch (error) {
      console.error("Stats error", error);
    }
  };

  // 2. Fetch Projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects({
        q: searchTerm,
        status: statusFilter
      });
      setProjects(response.data || []);
    } catch (error) {
      toast.error("Data fetch karne mein masla hua");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchStats();
    const delayDebounce = setTimeout(() => {
      fetchProjects();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchProjects]);

  // 3. Create / Update Handler
  const handleCreateOrUpdate = async (formData) => {
    try {
      if (selectedProject) {
        await projectService.updateProject(selectedProject._id, formData);
        toast.success("Project Updated!");
      } else {
        await projectService.createProject(formData);
        toast.success("New Project Successfully Launched!");
      }
      setIsModalOpen(false);
      setSelectedProject(null);
      fetchProjects();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation Error");
    }
  };

  // 4. Delete Handler
  const handleDelete = async (id) => {
    if (window.confirm("Kya aap waqai ye project delete karna chahte hain?")) {
      try {
        await projectService.deleteProject(id);
        toast.success("Project Deleted");
        fetchProjects();
        fetchStats();
      } catch (error) {
        toast.error("Delete nahi ho saka");
      }
    }
  };

  return (
    <div className="p-4 md:p-10 bg-[#fbfcfd] min-h-screen">
      <ProjectHeader
        onAddClick={() => {
          setSelectedProject(null);
          setIsModalOpen(true);
        }}
        totalProjects={stats.totalProjects}
      />

      <ProjectStats stats={stats} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex-1">
          <ProjectFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            status={statusFilter}
            setStatus={setStatusFilter}
          />
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 self-end md:self-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'}`}
          >
            <FiGrid size={20} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-3 rounded-xl transition-all ${viewMode === 'table' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'}`}
          >
            <FiList size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-64 bg-slate-100 animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {projects.length > 0 ? (
            viewMode === "grid" ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {projects.map(project => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    onEdit={() => { setSelectedProject(project); setIsModalOpen(true); }}
                    onDelete={() => handleDelete(project._id)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* FIXED: Added functions here */}
                <ProjectTable
                  projects={projects}
                  onView={(id) => router.push(`/dashboard/projects/${id}`)}
                  onEdit={(project) => { setSelectedProject(project); setIsModalOpen(true); }}
                  onDelete={(id) => handleDelete(id)}
                />
              </motion.div>
            )
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-black uppercase tracking-widest italic">No Projects Identified</p>
            </div>
          )}
        </AnimatePresence>
      )}

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedProject(null); }}
        onSubmit={handleCreateOrUpdate}
        initialData={selectedProject} // Edit ke liye data
      />
    </div>
  );
}