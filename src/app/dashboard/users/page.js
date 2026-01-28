"use client";
import { useState, useEffect, useCallback } from "react";
import { FiPlus, FiDatabase, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { toast } from "react-toastify";

// ✅ Components Import (Ye aapki files se aa rahe hain)
import ProfileStats from "./components/ProfileStats";
import UserFilters from "./components/UserFilters";
import UserTable from "./components/UserTable";
import UserCard from "./components/UserCard";
import UserModal from "./components/UserModal";
import userService from "@/services/user.service";

export default function UsersPage() {
  const [view, setView] = useState("table");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, blocked: 0 });

  const [filters, setFilters] = useState({
    page: 1,
    limit: 8,
    search: "",
    role: ""
  });

  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // 🛰️ Backend Fetch Logic
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers(filters);

      if (response?.success) {
        setUsers(response.data.items); // Backend array
        const { total, limit, page } = response.data.meta;

        setPagination({
          total,
          totalPages: Math.ceil(total / limit)
        });

        // 📊 Stats calculation based on your backend logic
        setStats({
          total: total,
          active: response.data.items.filter(u => u.status === 'active').length,
          blocked: response.data.items.filter(u => u.status === 'blocked').length
        });
      }
    } catch (err) {
      toast.error("DATABASE_OFFLINE: Connection failed");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 400);
    return () => clearTimeout(timer);
  }, [filters, fetchUsers]);

  return (
    <div className="min-h-screen bg-[#FBFBFE] p-6 lg:p-10 space-y-8 pb-20">

      {/* 🚀 Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-indigo-400 shadow-2xl rotate-3">
            <FiDatabase size={30} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Terminal_Users</h1>
            <p className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase mt-2">Access: Root Admin</p>
          </div>
        </div>
        <button
          onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
          className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
        >
          <FiPlus size={18} /> Add New Operative
        </button>
      </div>

      {/* 📊 1. ProfileStats Component - Backend data passed as props */}
      <ProfileStats stats={stats} />

      {/* 🛠️ 2. UserFilters Component - Handles Search & Role Filter */}
      <UserFilters
        view={view}
        setView={setView}
        onSearch={(val) => setFilters({ ...filters, search: val, page: 1 })}
        onRoleChange={(val) => setFilters({ ...filters, role: val, page: 1 })}
      />

      {/* 🖥️ 3. Main Data Layer (Table or Grid) */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {view === "table" ? (
            <UserTable
              users={users}
              onEdit={(u) => { setSelectedUser(u); setIsModalOpen(true); }}
              onRefresh={fetchUsers}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {users.map(u => (
                <UserCard
                  key={u._id}
                  user={u}
                  onEdit={(user) => { setSelectedUser(user); setIsModalOpen(true); }}
                  onRefresh={fetchUsers}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 🔢 Pagination Controls */}
      <div className="flex items-center justify-between pt-10 border-t border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Showing {users.length} of {pagination.total} operatives
        </p>
        <div className="flex gap-4">
          <button
            disabled={filters.page === 1}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            className="p-4 bg-white rounded-2xl shadow-sm hover:text-indigo-600 disabled:opacity-20"
          ><FiChevronLeft size={20} /></button>
          <button
            disabled={filters.page >= pagination.totalPages}
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            className="p-4 bg-white rounded-2xl shadow-sm hover:text-indigo-600 disabled:opacity-20"
          ><FiChevronRight size={20} /></button>
        </div>
      </div>

      {/* 📝 4. UserModal - Only for Add/Edit */}
      <UserModal
        isOpen={isModalOpen}
        editUser={selectedUser}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchUsers}
      />
    </div>
  );
}