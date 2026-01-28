"use client";

import React, { useState, useEffect } from "react";
import SectionHeader from "../../components/SectionHeader";
import FormLayout, { SettingField } from "../../components/FormLayout";
import * as FiIcons from "react-icons/fi"; // Safe Icon Import
import settingsService from "@/services/settings.service";
import { toast } from "react-toastify";
import useBrandingStore from "@/store/useBrandingStore";

export default function GeneralSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const updateBranding = useBrandingStore((state) => state.updateBranding);

  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
    timezone: "UTC",
    currency: "USD",
    dateFormat: "DD/MM/YYYY",
    language: "en"
  });

  // Helper function for safe icons
  const renderIcon = (IconName, props = {}) => {
    const Icon = FiIcons[IconName];
    return Icon ? <Icon {...props} /> : <FiIcons.FiSettings {...props} />;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsService.getSettings();
        const settingsData = res?.data || res;
        // 🛡️ Safe Check: Agar data object hai tabhi state update karein
        if (settingsData && typeof settingsData === 'object') {
          setFormData(prev => ({ ...prev, ...settingsData }));
        }
      } catch (err) {
        toast.error("Failed to sync with central registry");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await settingsService.updateSettings(formData);
      updateBranding(formData.companyName, formData.timezone);
      setSuccess(true);
      toast.success("System Identity Updated");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      toast.error("Update Protocol Failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center animate-pulse font-black text-slate-300 tracking-[0.5em]">
      INITIALIZING CORE...
    </div>
  );

  return (
    <div className="animate-in fade-in duration-1000">
      <SectionHeader
        title="General Identity"
        subtitle="Manage global branding and regional configurations"
        onSave={handleSave}
        isLoading={saving}
        isSuccess={success}
      />

      <FormLayout
        title="Corporate Profile"
        description="Public facing identity of the platform"
        icon={renderIcon("FiBriefcase")}
      >
        <SettingField label="Company Name" icon={renderIcon("FiHash")}>
          <input
            type="text"
            value={formData.companyName || ""}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
            placeholder="Enter Company Name"
          />
        </SettingField>

        <SettingField label="Support Email" icon={renderIcon("FiGlobe")}>
          <input
            type="email"
            value={formData.companyEmail || ""}
            onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
            className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
            placeholder="support@company.com"
          />
        </SettingField>

        <SettingField label="Physical Address" icon={renderIcon("FiMapPin")}>
          <input
            type="text"
            value={formData.companyAddress || ""}
            onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
            className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
            placeholder="Office Address"
          />
        </SettingField>
      </FormLayout>

      <FormLayout
        title="Localization"
        description="Region specific date, time and currency protocols"
        icon={renderIcon("FiGlobe")}
      >
        <SettingField label="System Timezone" helperText="Used for all activity logs">
          <select
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-500 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
          >
            <option value="UTC">UTC (Universal)</option>
            <option value="PKT">PKT (Pakistan)</option>
            <option value="EST">EST (Eastern)</option>
            <option value="GMT">GMT (London)</option>
          </select>
        </SettingField>

        <SettingField label="Base Currency">
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="w-full bg-slate-50 p-4 rounded-2xl border-2 border-slate-50 focus:border-indigo-500 outline-none font-bold text-slate-700 appearance-none cursor-pointer"
          >
            <option value="USD">USD ($)</option>
            <option value="PKR">PKR (Rs.)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </SettingField>
      </FormLayout>
    </div>
  );
}