"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import clientService from "@/services/client.service";
import ClientHeader from "./components/ClientHeader";
import ClientFilters from "./components/ClientFilters";
import ClientCard from "./components/ClientCard";
import ClientModal from "./components/ClientModal";
import ClientDetailCard from "./components/ClientDetailCard";

import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientListingPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  // --- Fetch Clients Logic ---
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await clientService.getClients({
        q: searchTerm,
        status: statusFilter,
        limit: 50
      });
      setClients(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load clients");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { fetchClients(); }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchClients]);

  // --- Stats Calculation ---
  const stats = useMemo(() => {
    const now = new Date();
    return {
      total: clients.length,
      active: clients.filter(c => c.status !== 'inactive').length,
      newThisMonth: clients.filter(c => {
        const created = new Date(c.createdAt);
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length
    };
  }, [clients]);

  // --- FIXED: Delete Handler (Ab card foran gayab hoga) ---
  const handleDeleteClient = async (id) => {
    try {
      // 1. Backend call
      await clientService.deleteClient(id);

      // 2. SUCCESS: Pehle toast dikhayein
      toast.success("Client removed successfully");

      // 3. UI UPDATE: Clients ki state se is ID ko nikal dein
      // Is se card refresh ke bagair foran gayab ho jayega
      setClients((prevClients) => prevClients.filter(client => client._id !== id));

      // 4. Agar profile sidebar khula hai toh usay band kar dein
      if (selectedClient?._id === id) {
        setSelectedClient(null);
      }

      // 5. Optional: Data sync karne ke liye backend se dubara mangwa lein
      // fetchClients(); 

    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Delete karne mein masla aya");
    }
  };

  const handleCreateClient = async (formData) => {
    try {
      setSubmitLoading(true);
      await clientService.createClient(formData);
      toast.success("Client registered successfully!");
      setIsModalOpen(false);
      fetchClients();
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen relative overflow-hidden">

      <ClientHeader
        onAddClick={() => setIsModalOpen(true)}
        stats={stats}
      />

      <ClientFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        status={statusFilter}
        setStatus={setStatusFilter}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-white/50 animate-pulse rounded-[2.5rem] border border-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {clients.map((client) => (
              <motion.div
                layout // Smooth layout transition jab card delete ho
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={client._id}
                onClick={() => setSelectedClient(client)}
                className="cursor-pointer"
              >
                <ClientCard
                  client={client}
                  onDelete={(id) => handleDeleteClient(id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* --- Detail Sidebar --- */}
      <AnimatePresence>
        {selectedClient && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedClient(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-[120] overflow-y-auto"
            >
              <div className="p-6 flex justify-between items-center border-b sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <h3 className="font-black text-slate-800 tracking-tight italic uppercase">Client Profile</h3>
                <button onClick={() => setSelectedClient(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <FiX size={20} />
                </button>
              </div>
              <div className="p-4">
                <ClientDetailCard client={selectedClient} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateClient}
        loading={submitLoading}
      />
    </div>
  );
}