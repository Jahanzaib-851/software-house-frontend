import fetcher from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";

/**
 * Report API Service
 * Token is automatically attached via fetcher interceptor
 */

const generateReport = async (data) => {
  const res = await fetcher.post(API_ENDPOINTS.REPORTS, data);
  return res.data;
};

const getReports = async (params = {}) => {
  const res = await fetcher.get(API_ENDPOINTS.REPORTS, { params });
  return res.data;
};

const getReportById = async (id) => {
  const res = await fetcher.get(`${API_ENDPOINTS.REPORTS}/${id}`);
  return res.data;
};

const updateReport = async (id, data) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.REPORTS}/${id}`, data);
  return res.data;
};

const deleteReport = async (id) => {
  const res = await fetcher.delete(`${API_ENDPOINTS.REPORTS}/${id}`);
  return res.data;
};

export default {
  generateReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
};
