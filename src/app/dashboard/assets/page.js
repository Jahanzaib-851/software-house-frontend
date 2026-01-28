"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Components
import AssetHeader from "./components/AssetHeader";
import AssetStats from "./components/AssetStats";
import AssetTable from "./components/AssetTable";
import AssetModal from "./components/AssetModal";

// Services
import assetService from "@/services/asset.service";
import roomService from "@/services/room.service";

export default function AssetsPage() {
  const router = useRouter();

  // States
  const [assets, setAssets] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  // Fetch Assets - Logic optimized for Table only
  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        limit: 100,
        category: category || undefined,
        name: searchTerm || undefined
      };
      const res = await assetService.getAssets(params);
      const data = res.data?.assets || res.data?.data || res.data || [];
      setAssets(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Vault synchronization failed ❌");
    } finally {
      setLoading(false);
    }
  }, [category, searchTerm]);

  // Fetch Rooms for Modal
  const fetchRooms = useCallback(async () => {
    try {
      const res = await roomService.getRooms({ limit: 50 });
      const data = res.data?.rooms || res.data?.data || res.data || [];
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Room sync error");
    }
  }, []);

  useEffect(() => {
    fetchAssets();
    fetchRooms();
  }, [fetchAssets, fetchRooms]);

  // Handle Create
  const handleCreateAsset = async (formData) => {
    try {
      await assetService.createAsset(formData);
      toast.success("Asset Authorized Successfully! 🚀");
      setIsModalOpen(false);
      fetchAssets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Denied ⚠️");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10">
      <div className="max-w-[1600px] mx-auto space-y-8">

        {/* 1. Header Section */}
        <AssetHeader
          onAddClick={() => setIsModalOpen(true)}
          totalAssets={assets.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory}
        />

        {/* 2. Stats Section */}
        <AssetStats assets={assets} />

        {/* 3. Content Area - Strictly Table */}
        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-12 h-12 border-4 border-slate-900 border-t-amber-500 rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Registry...</p>
            </div>
          ) : (
            <>
              {assets.length > 0 ? (
                <AssetTable
                  assets={assets}
                  onView={(id) => router.push(`/dashboard/assets/${id}`)}
                  // Agar aap edit/delete handle karna chahte hain toh yahan props add kar dein
                  onEdit={(asset) => { /* logic */ }}
                  onDelete={(id) => { /* logic */ }}
                />
              ) : (
                <div className="py-40 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] mx-auto flex items-center justify-center text-slate-200 mb-6">
                    <FiList size={40} />
                  </div>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Empty Sector - No Records Found</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* 4. Modal Component */}
        <AssetModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateAsset}
          rooms={rooms}
        />

      </div>
    </div>
  );
}