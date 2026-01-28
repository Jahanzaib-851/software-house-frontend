import fetcher from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";

const EmployeeService = {
  // -------------------- CREATE EMPLOYEE --------------------
  createEmployee: async (formData) => {
    // Note: Jab aap fetcher ko directly formData bhejte hain, 
    // toh axios automatically 'Content-Type' set kar deta hai.
    const res = await fetcher.post(API_ENDPOINTS.EMPLOYEES, formData);
    return res.data;
  },

  // -------------------- GET ALL EMPLOYEES --------------------
  getEmployees: async (params = {}) => {
    const res = await fetcher.get(API_ENDPOINTS.EMPLOYEES, { params });
    return res.data;
  },

  // -------------------- GET SINGLE EMPLOYEE --------------------
  getEmployeeById: async (id) => {
    const res = await fetcher.get(`${API_ENDPOINTS.EMPLOYEES}/${id}`);
    return res.data;
  },

  // -------------------- UPDATE EMPLOYEE --------------------
  updateEmployee: async (id, data) => {
    // CHECK: Agar data 'FormData' hai, toh humein JSON header remove karna hoga 
    // taake browser automatically sahi 'boundary' set kar sake
    const isFormData = data instanceof FormData;

    const res = await fetcher.put(`${API_ENDPOINTS.EMPLOYEES}/${id}`, data, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" }
    });
    return res.data;
  },

  // -------------------- UPDATE AVATAR ONLY --------------------
  updateEmployeeAvatar: async (id, formData) => {
    const res = await fetcher.put(
      `${API_ENDPOINTS.EMPLOYEES}/${id}/avatar`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  },

  // -------------------- CHANGE STATUS --------------------
  changeEmployeeStatus: async (id, statusData) => {
    const res = await fetcher.patch(
      `${API_ENDPOINTS.EMPLOYEES}/${id}/status`,
      statusData
    );
    return res.data;
  },

  // -------------------- SOFT DELETE --------------------
  deleteEmployee: async (id) => {
    const res = await fetcher.delete(`${API_ENDPOINTS.EMPLOYEES}/${id}`);
    return res.data;
  },
};

export default EmployeeService;