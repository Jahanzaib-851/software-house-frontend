"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import roomService from "@/services/room.service";
import RoomHeader from "./components/RoomHeader";
import RoomStats from "./components/RoomStats";
import RoomCard from "./components/RoomCard";
import RoomTable from "./components/RoomTable";
import RoomModal from "./components/RoomModal";
import { toast } from "react-toastify";
import { FiGrid, FiList, FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function RoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 🛡️ SAFE FETCH: Added optional chaining and icon protection
  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await roomService.getRooms({ q: searchTerm });
      setRooms(response?.data || []);
    } catch (error) {
      // Icon: false isliye lagaya taake undefined icon crash na kare
      toast.error("Rooms load karne mein masla hua", { icon: false });
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchRooms();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchRooms]);

  // 🛡️ SAFE SAVE: Added detailed error checking for toast
  const handleSaveRoom = async (formData) => {
    try {
      if (selectedRoom) {
        await roomService.updateRoom(selectedRoom._id, formData);
        toast.success("Room Updated!", { icon: false });
      } else {
        await roomService.createRoom(formData);
        toast.success("New Room Deployed!", { icon: false });
      }
      setIsModalOpen(false);
      setSelectedRoom(null);
      fetchRooms();
    } catch (error) {
      // Error handling with fallback message to prevent 500 crashes on UI
      const errorMsg = error.response?.data?.message || "Operation Failed";
      toast.error(errorMsg, { icon: false });
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm("Zaroori: Kya aap is space ko delete karna chahte hain?")) {
      try {
        await roomService.deleteRoom(id);
        toast.success("Room Removed", { icon: false });
        fetchRooms();
      } catch (error) {
        toast.error("Delete operation failed", { icon: false });
      }
    }
  };

  const handleViewDetail = (id) => {
    if (id) router.push(`/dashboard/rooms/${id}`);
  };

  return (
    <div className="p-4 md:p-10 bg-[#fbfcfd] min-h-screen">
      {/* 🚀 Render check: Components ko data milne se pehle safe rakha hai */}
      <RoomHeader
        onAddClick={() => { setSelectedRoom(null); setIsModalOpen(true); }}
        totalRooms={rooms?.length || 0}
      />

      <RoomStats rooms={rooms || []} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by room name..."
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-600 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'}`}
          >
            <FiGrid size={20} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-3 rounded-xl transition-all ${viewMode === 'table' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'}`}
          >
            <FiList size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(n => <div key={n} className="h-72 bg-slate-100 animate-pulse rounded-[2.5rem]" />)}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {rooms && rooms.length > 0 ? (
            viewMode === "grid" ? (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map(room => (
                  <RoomCard
                    key={room._id}
                    room={room}
                    onEdit={() => { setSelectedRoom(room); setIsModalOpen(true); }}
                    onDelete={handleDeleteRoom}
                    onView={handleViewDetail}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <RoomTable
                  rooms={rooms}
                  onEdit={(room) => { setSelectedRoom(room); setIsModalOpen(true); }}
                  onDelete={handleDeleteRoom}
                  onView={handleViewDetail}
                />
              </motion.div>
            )
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-black uppercase tracking-widest italic">No Spatial Data Found</p>
            </div>
          )}
        </AnimatePresence>
      )}

      {/* 🛡️ Modal data protection */}
      <RoomModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedRoom(null); }}
        onSubmit={handleSaveRoom}
        initialData={selectedRoom}
      />
    </div>
  );
}