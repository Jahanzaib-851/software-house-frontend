"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import clientService from "@/services/client.service";
import ClientDetailCard from "../components/ClientDetailCard";
import { FiArrowLeft, FiEdit3, FiSave, FiX, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

export default function ClientSingleView() {
  const { id } = useParams();
  const router = useRouter();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Edit Form State
  const [editData, setEditData] = useState({});

  // 1. Fetch Client Data
  const loadClient = async () => {
    try {
      setLoading(true);
      const res = await clientService.getClientById(id);
      setClient(res.data);
      setEditData(res.data); // Initial form data
    } catch (err) {
      toast.error("Client not found");
      router.push("/dashboard/clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadClient(); }, [id]);

  // 2. Update Handler (Backend: updateClientByAdmin)
  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);
      const res = await clientService.updateClientByAdmin(id, editData);
      setClient(res.data);
      setIsEditing(false);
      toast.success("Client updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  // 3. Delete Handler (Backend: deleteClient - Soft Delete)
  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This will set client to INACTIVE.")) return;
    try {
      await clientService.deleteClient(id);
      toast.success("Client deactivated");
      router.push("/dashboard/clients");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse">LOADING PROFILE...</div>;

  return (
    <div className="p-6 md:p-12 bg-[#f8fafc] min-h-screen">
      {/* Top Navigation & Actions */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-10">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors uppercase text-[10px] tracking-[0.2em]">
          <FiArrowLeft /> Back to Directory
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="p-4 bg-white text-red-400 rounded-2xl hover:bg-red-50 transition-all border border-slate-100"
          >
            <FiTrash2 />
          </button>

          <button
            onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
            disabled={updateLoading}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs transition-all shadow-xl ${isEditing ? "bg-emerald-500 text-white shadow-emerald-100" : "bg-slate-900 text-white shadow-slate-200"
              }`}
          >
            {updateLoading ? "SAVING..." : isEditing ? <><FiSave /> SAVE CHANGES</> : <><FiEdit3 /> EDIT MODE</>}
          </button>

          {isEditing && (
            <button onClick={() => setIsEditing(false)} className="p-4 bg-white text-slate-400 rounded-2xl border border-slate-100">
              <FiX />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 text-center shadow-sm">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <img
                src={client.avatar || `https://ui-avatars.com/api/?name=${client.name}`}
                className="w-full h-full rounded-[2.5rem] object-cover border-4 border-slate-50"
              />
              <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-[8px] font-black uppercase border-4 border-white ${client.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                {client.status}
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">{client.name}</h2>
            <p className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest mt-2">{client.email}</p>
          </div>
        </div>

        {/* Details or Edit Form */}
        <div className="lg:col-span-2">
          {isEditing ? (
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-4">Edit Client Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Client Name</label>
                  <input className="w-full p-4 rounded-2xl bg-slate-50 font-bold outline-none ring-indigo-500/20 focus:ring-2"
                    value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Status</label>
                  <select className="w-full p-4 rounded-2xl bg-slate-50 font-bold outline-none"
                    value={editData.status} onChange={e => setEditData({ ...editData, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Verification</label>
                  <div className="flex gap-4">
                    <button onClick={() => setEditData({ ...editData, isVerified: true })} className={`flex-1 p-4 rounded-2xl font-black text-[10px] border ${editData.isVerified ? "bg-emerald-500 text-white border-emerald-500" : "bg-slate-50 text-slate-400"}`}>VERIFIED</button>
                    <button onClick={() => setEditData({ ...editData, isVerified: false })} className={`flex-1 p-4 rounded-2xl font-black text-[10px] border ${!editData.isVerified ? "bg-amber-500 text-white border-amber-500" : "bg-slate-50 text-slate-400"}`}>PENDING</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ClientDetailCard client={client} />
          )}
        </div>
      </div>
    </div>
  );
}