import fetcher from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";

/**
 * Payroll API Service
 */

// 👇 Generate payroll
const generatePayroll = async (data) => {
  const res = await fetcher.post(API_ENDPOINTS.PAYROLL, data);
  return res.data; // Standard response
};

// 👇 Get logged-in employee’s payrolls
const getMyPayroll = async () => {
  const res = await fetcher.get(`${API_ENDPOINTS.PAYROLL}/me`);
  return res.data;
};

// 👇 Admin/Manager: List & manage payrolls
const getPayrollList = async (params = {}) => {
  const res = await fetcher.get(API_ENDPOINTS.PAYROLL, { params });
  // Mashwara: Yahan direct res return karein taake page.jsx ko pura object mile
  return res;
};

// 👇 Get single payroll by ID
const getPayrollById = async (id) => {
  const res = await fetcher.get(`${API_ENDPOINTS.PAYROLL}/${id}`);
  return res.data;
};

// 👇 Update payroll
const updatePayroll = async (id, data) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.PAYROLL}/${id}`, data);
  return res.data;
};

// 👇 Mark payroll as paid
const markPayrollPaid = async (id) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.PAYROLL}/${id}/pay`);
  return res.data;
};

// 👇 Delete payroll
const deletePayroll = async (id) => {
  const res = await fetcher.delete(`${API_ENDPOINTS.PAYROLL}/${id}`);
  return res.data;
};

export default {
  generatePayroll,
  getMyPayroll,
  getPayrollList,
  getPayrollById,
  updatePayroll,
  markPayrollPaid,
  deletePayroll,
};