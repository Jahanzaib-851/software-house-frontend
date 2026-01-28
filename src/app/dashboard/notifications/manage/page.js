"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiShield, FiAlertCircle } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Services
import notificationService from "@/services/notification.service";
import employeeService from "@/services/employee.service";
import userService from "@/services/user.service";
import clientService from "@/services/client.service";

// Hook
import useAuth from "@/hooks/useAuth";

const ManageNotifications = () => {
  const { user: currentUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [availableRecipients, setAvailableRecipients] = useState([]);

  const [formData, setFormData] = useState({
    notificationType: "system",
    message: "",
    recipientId: "ALL",
    recipientModel: "Employee",
    channels: ["in-app"]
  });

  // Fetch recipients logic
  const fetchRecipients = useCallback(async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      let res;
      if (formData.recipientModel === "Employee") {
        res = await employeeService.getEmployees();
      } else if (formData.recipientModel === "User") {
        res = await userService.getUsers();
      } else if (formData.recipientModel === "Client") {
        res = await clientService.getClients();
      }

      const data = res?.data?.data || res?.data || [];
      setAvailableRecipients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Error:", error);
      if (error.response?.status !== 401) {
        toast.error(`Error fetching ${formData.recipientModel} list.`);
      }
    } finally {
      setIsFetching(false);
    }
  }, [formData.recipientModel]);

  useEffect(() => {
    fetchRecipients();
  }, [fetchRecipients]);

  const getDisplayName = (item) => {
    if (!item) return "Loading...";
    return (item.name || item.fullName || item.username || item.email || "Unnamed").trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return toast.error("Please enter a message!");
    if (!currentUser) return toast.error("Profile not ready. Refreshing...");

    setLoading(true);
    try {
      // Create recipients array
      const recipientsArray = formData.recipientId === "ALL"
        ? availableRecipients.map(i => ({ id: i._id || i.id, model: formData.recipientModel }))
        : [{ id: formData.recipientId, model: formData.recipientModel }];

      if (recipientsArray.length === 0) {
        setLoading(false);
        return toast.warn("No recipients found in the selected category.");
      }

      await notificationService.createNotification({
        ...formData,
        recipients: recipientsArray,
        remarks: "Admin Broadcast",
        senderId: currentUser?._id
      });

      toast.success("Broadcast Dispatched Successfully!");
      setFormData(prev => ({ ...prev, message: "" }));
    } catch (err) {
      console.error("Dispatch Error:", err);
      toast.error(err.response?.data?.message || "Dispatch failed. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto min-h-screen bg-slate-50/50">
      {/* Toast Container with fixed settings to avoid 'removalReason' error */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header */}
      <div className="mb-10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-indigo-600 rounded-3xl text-white shadow-xl">
            <FiShield size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold uppercase italic text-slate-800">
              Broadcast <span className="text-indigo-600">Protocol</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase italic">
              Operator: {getDisplayName(currentUser)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Category</label>
                <select
                  className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold"
                  value={formData.recipientModel}
                  onChange={(e) => setFormData({ ...formData, recipientModel: e.target.value, recipientId: "ALL" })}
                >
                  <option value="Employee">Employee Unit</option>
                  <option value="User">System Users</option>
                  <option value="Client">Client Unit</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Target</label>
                <select
                  className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold"
                  value={formData.recipientId}
                  onChange={(e) => setFormData({ ...formData, recipientId: e.target.value })}
                  disabled={isFetching}
                >
                  <option value="ALL">📢 BROADCAST TO ALL</option>
                  {availableRecipients.map(item => (
                    <option key={item._id || item.id} value={item._id || item.id}>
                      {getDisplayName(item)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <textarea
              rows="5"
              className="w-full p-6 bg-slate-50 border-none rounded-[2rem] font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="Enter transmission message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading || isFetching || !currentUser}
                className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl disabled:opacity-50 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                {loading ? "Transmitting..." : "Dispatch Now"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Sidebar */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl">
          <h3 className="text-xl font-bold italic uppercase mb-6">Security Monitor</h3>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[9px] text-slate-400 uppercase">Operator Status:</p>
              <p className="text-sm font-bold text-indigo-300">ADMINISTRATOR VERIFIED</p>
            </div>
            <div className="mt-4 flex items-start gap-2 text-[9px] text-slate-500 uppercase italic leading-relaxed">
              <FiAlertCircle className="mt-0.5 text-amber-500" />
              <span>Broadcast system active. All transmissions are logged under admin ID.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageNotifications;