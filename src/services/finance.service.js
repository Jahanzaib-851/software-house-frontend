import fetcher from "@/utils/fetcher";
import { API_ENDPOINTS } from "@/utils/constants";

/**
 * Finance / Transaction API Service
 * Token automatically attached via fetcher interceptor
 */

// Create a new transaction
const createTransaction = async (data) => {
  const res = await fetcher.post(API_ENDPOINTS.FINANCE, data);
  return res.data;
};

// Get all transactions (with optional filters)
const getTransactions = async (params = {}) => {
  const res = await fetcher.get(API_ENDPOINTS.FINANCE, { params });
  return res.data;
};

// Get a single transaction by ID
const getTransactionById = async (id) => {
  const res = await fetcher.get(`${API_ENDPOINTS.FINANCE}/${id}`);
  return res.data;
};

// Update a transaction
const updateTransaction = async (id, data) => {
  const res = await fetcher.patch(`${API_ENDPOINTS.FINANCE}/${id}`, data);
  return res.data;
};

// Delete a transaction
const deleteTransaction = async (id) => {
  const res = await fetcher.delete(`${API_ENDPOINTS.FINANCE}/${id}`);
  return res.data;
};

export default {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
}; 
