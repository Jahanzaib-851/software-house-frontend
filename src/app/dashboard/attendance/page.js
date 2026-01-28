"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import attendanceService from "@/services/attendance.service";
import AttendanceTable from "./components/AttendanceTable";
import AttendanceFilters from "./components/AttendanceFilters";
import AttendanceStats from "./components/AttendanceStats";
import { FiRefreshCw, FiDatabase, FiChevronDown, FiUser } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

export default function AttendanceListPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, avgHours: 0 });
  const [expandedEmployee, setExpandedEmployee] = useState(null);

  const getInitialFilters = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = today.toISOString().split('T')[0];
    return { page: 1, limit: 500, status: "", q: "", from: firstDay, to: lastDay };
  };

  const [filters, setFilters] = useState(getInitialFilters());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editForm, setEditForm] = useState({ checkIn: "", checkOut: "", status: "" });

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const res = await attendanceService.getAttendanceList(filters);
      const attendanceArray = res.data?.data || [];
      setData(attendanceArray);

      const totalPresent = attendanceArray.filter(i => i.attendanceStatus === 'present').length;
      const totalAbsent = attendanceArray.filter(i => i.attendanceStatus === 'absent').length;
      const uniqueEmployees = [...new Set(attendanceArray.map(item => item.employee?._id))].length;

      setStats({
        total: uniqueEmployees,
        present: totalPresent,
        absent: totalAbsent,
        avgHours: attendanceArray.length > 0 ?
          (attendanceArray.reduce((acc, curr) => acc + (Number(curr.totalHours) || 0), 0) / attendanceArray.length).toFixed(1) : 0
      });
    } catch (err) {
      // ✅ Safe string error
      toast.error("Records load karne mein masla hua");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchAttendance(); }, [fetchAttendance]);

  const groupedData = useMemo(() => {
    const groups = data.reduce((acc, item) => {
      const empId = item.employee?._id || 'unknown';
      if (!acc[empId]) acc[empId] = { info: item.employee, records: [] };
      acc[empId].records.push(item);
      return acc;
    }, {});

    Object.values(groups).forEach(group => {
      group.records.sort((a, b) => {
        const statusOrder = { 'present': 1, 'half-day': 2, 'leave': 3, 'absent': 4 };
        return statusOrder[a.attendanceStatus] - statusOrder[b.attendanceStatus];
      });
    });

    return Object.values(groups);
  }, [data]);

  // 🔥 FIXED TOAST LOGIC: Update Existing Toast instead of creating new ones
  const handleUpdate = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating attendance record...");

    try {
      await attendanceService.updateAttendance(String(selectedRecord._id), {
        checkIn: new Date(editForm.checkIn).toISOString(),
        checkOut: editForm.checkOut ? new Date(editForm.checkOut).toISOString() : null,
        attendanceStatus: editForm.status,
      });

      // ✅ Update loading toast to SUCCESS
      toast.update(toastId, {
        render: "Record updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });

      setIsEditModalOpen(false);
      fetchAttendance();
    } catch (err) {
      // ✅ Update loading toast to ERROR
      const errorMsg = err?.response?.data?.message || "Update failed!";
      toast.update(toastId, {
        render: errorMsg,
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  const openEditModal = (record) => {
    setSelectedRecord(record);
    const formatDate = (d) => d ? new Date(new Date(d).getTime() - new Date(d).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";
    setEditForm({
      checkIn: formatDate(record.checkIn || record.date),
      checkOut: formatDate(record.checkOut),
      status: record.attendanceStatus || "present"
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6 lg:p-10 bg-[#f8fafc] min-h-screen font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <FiDatabase className="text-indigo-600" /> Attendance Manager
          </h1>
          <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-[0.2em]">
            System Online | {stats.total} Staff Members Tracked
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchAttendance} className="bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all text-slate-600 hover:bg-slate-50 shadow-sm">
            <FiRefreshCw className={loading ? "animate-spin" : ""} /> Sync Data
          </button>
        </div>
      </div>

      <AttendanceStats stats={stats} />
      <AttendanceFilters filters={filters} setFilters={setFilters} />

      <div className="mt-10 space-y-6">
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-bold italic animate-pulse">Synchronizing records...</div>
        ) : groupedData.map((group) => (
          <div key={group.info?._id} className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden transition-all hover:shadow-2xl">
            <div
              onClick={() => setExpandedEmployee(expandedEmployee === group.info?._id ? null : group.info?._id)}
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <FiUser size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">{group.info?.fullName || "Staff Member"}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Employee ID: {group.info?.employeeId || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden md:flex gap-4">
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs font-bold border border-green-100">
                    {group.records.filter(r => r.attendanceStatus === 'present').length} Present
                  </span>
                  <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-xs font-bold border border-red-100">
                    {group.records.filter(r => r.attendanceStatus === 'absent').length} Absent
                  </span>
                </div>
                <motion.div animate={{ rotate: expandedEmployee === group.info?._id ? 180 : 0 }}>
                  <FiChevronDown className="text-slate-400 text-xl" />
                </motion.div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {expandedEmployee === group.info?._id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-slate-50"
                >
                  <AttendanceTable
                    data={group.records}
                    loading={false}
                    onEdit={openEditModal}
                    onDelete={fetchAttendance}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <form onSubmit={handleUpdate} className="p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Modify Attendance</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-1">Ref: {selectedRecord?._id}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Check-in Timestamp</label>
                    <input
                      type="datetime-local"
                      value={editForm.checkIn}
                      onChange={(e) => setEditForm({ ...editForm, checkIn: e.target.value })}
                      className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Status Designation</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 appearance-none"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="half-day">Half Day</option>
                      <option value="leave">Leave</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-[2] bg-indigo-600 py-4 rounded-2xl font-black text-white text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                    Apply Changes
                  </button>
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 font-black text-slate-400 text-xs uppercase tracking-widest hover:text-slate-600">
                    Abort
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}