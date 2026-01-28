"use client";

import React, { useState, useEffect } from "react";
import SectionHeader from "../../components/SectionHeader";
import FormLayout, { SettingField } from "../../components/FormLayout";
import * as FiIcons from "react-icons/fi"; // Safe Import Pattern
import settingsService from "@/services/settings.service";
import { toast } from "react-toastify";
import useBrandingStore from "@/store/useBrandingStore";

export default function CommunicationSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchBranding = useBrandingStore((state) => state.fetchBranding);

  const [formData, setFormData] = useState({
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpFromEmail: "",
    emailEnabled: true,
    smsEnabled: false,
    inAppEnabled: true
  });

  // Helper function for safe icons
  const renderIcon = (name, props = {}) => {
    const Icon = FiIcons[name];
    return Icon ? <Icon {...props} /> : <FiIcons.FiMail {...props} />;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsService.getSettings();
        const data = res?.data || res;
        if (data && typeof data === 'object') {
          // Merge default state with incoming data
          setFormData(prev => ({ ...prev, ...data }));
        }
      } catch (err) {
        toast.error("COMMUNICATION_SYNC_ERROR");
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
      await settingsService.updateEmailSettings(formData);
      await fetchBranding();
      setSuccess(true);
      toast.success("Mail Engine Protocol Updated");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      toast.error("Failed to update mail settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center animate-pulse">
      <div className="flex justify-center mb-4 text-indigo-500">
        {renderIcon("FiLoader", { className: "animate-spin", size: 40 })}
      </div>
      <p className="font-black text-slate-300 tracking-[0.5em] uppercase">Connecting to Mail Engine...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader
        title="Mail & Notifications"
        subtitle="Manage SMTP relay and system-wide alert channels"
        onSave={handleSave}
        isLoading={saving}
        isSuccess={success}
      />

      <FormLayout
        title="Delivery Channels"
        description="Enable or disable system-wide communication protocols"
        icon={renderIcon("FiBell")}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ToggleCard
            label="Email Alerts"
            icon={renderIcon("FiMail")}
            isActive={formData.emailEnabled}
            onClick={() => setFormData({ ...formData, emailEnabled: !formData.emailEnabled })}
          />
          <ToggleCard
            label="SMS Gateway"
            icon={renderIcon("FiSmartphone")}
            isActive={formData.smsEnabled}
            onClick={() => setFormData({ ...formData, smsEnabled: !formData.smsEnabled })}
          />
          <ToggleCard
            label="In-App Push"
            icon={renderIcon("FiBell")}
            isActive={formData.inAppEnabled}
            onClick={() => setFormData({ ...formData, inAppEnabled: !formData.inAppEnabled })}
          />
        </div>
      </FormLayout>

      <div className="mt-12 bg-slate-950 p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] -z-10" />

        <FormLayout
          title="SMTP Relay Node"
          description="Configure secure outbound mail transmission"
          icon={renderIcon("FiServer")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SettingField label="SMTP Host" icon={renderIcon("FiServer")}>
              <input
                type="text"
                placeholder="e.g. smtp.gmail.com"
                value={formData.smtpHost || ""}
                onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                className="w-full bg-slate-900/50 p-4 rounded-2xl border border-white/10 focus:border-indigo-500 outline-none font-bold text-white transition-all"
              />
            </SettingField>

            <SettingField label="Port" icon={renderIcon("FiHash")}>
              <input
                type="number"
                placeholder="587"
                value={formData.smtpPort || ""}
                onChange={(e) => setFormData({ ...formData, smtpPort: e.target.value })}
                className="w-full bg-slate-900/50 p-4 rounded-2xl border border-white/10 focus:border-indigo-500 outline-none font-bold text-white transition-all"
              />
            </SettingField>

            <SettingField label="Username" icon={renderIcon("FiLock")}>
              <input
                type="text"
                placeholder="SMTP User ID"
                value={formData.smtpUser || ""}
                onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
                className="w-full bg-slate-900/50 p-4 rounded-2xl border border-white/10 focus:border-indigo-500 outline-none font-bold text-white transition-all"
              />
            </SettingField>

            <SettingField label="From Email" icon={renderIcon("FiNavigation")}>
              <input
                type="email"
                placeholder="noreply@company.com"
                value={formData.smtpFromEmail || ""}
                onChange={(e) => setFormData({ ...formData, smtpFromEmail: e.target.value })}
                className="w-full bg-slate-900/50 p-4 rounded-2xl border border-white/10 focus:border-indigo-500 outline-none font-bold text-white transition-all"
              />
            </SettingField>
          </div>
        </FormLayout>
      </div>
    </div>
  );
}

const ToggleCard = ({ label, icon, isActive, onClick }) => (
  <button
    type="button" // Form submit honay say bachata hai
    onClick={onClick}
    className={`
      flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-500
      ${isActive
        ? "bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/20 translate-y-[-4px]"
        : "bg-slate-900 border-white/5 text-slate-500 hover:border-white/10"
      }
    `}
  >
    <div className="flex items-center gap-4">
      <div className={`text-xl ${isActive ? "text-white" : "text-slate-600"}`}>
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className={`w-10 h-6 rounded-full relative transition-colors duration-500 ${isActive ? 'bg-white/20' : 'bg-slate-800'}`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-500 ${isActive ? 'left-5 bg-white' : 'left-1 bg-slate-600'}`} />
    </div>
  </button>
);