import fetcher from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";

/**
 * Project API Service
 */

// --- NEW: Stats Function (Isi ki wajah se dashboard khali ho sakta hai) ---
const getProjectStats = async () => {
  const res = await fetcher.get(`${API_ENDPOINTS.PROJECTS}/stats`);
  return res.data;
};

const createProject = async (data) => {
  const res = await fetcher.post(API_ENDPOINTS.PROJECTS, data);
  return res.data;
};

const getProjects = async (params = {}) => {
  const res = await fetcher.get(API_ENDPOINTS.PROJECTS, { params });
  return res.data;
};

const getProjectById = async (id) => {
  const res = await fetcher.get(`${API_ENDPOINTS.PROJECTS}/${id}`);
  return res.data;
};

const updateProject = async (id, data) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.PROJECTS}/${id}`, data);
  return res.data;
};

const deleteProject = async (id) => {
  const res = await fetcher.delete(`${API_ENDPOINTS.PROJECTS}/${id}`);
  return res.data;
};

export default {
  getProjectStats, // Isay export zaroor karein
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};