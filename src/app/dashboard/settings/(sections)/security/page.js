"use client";

import React, { useState, useEffect } from "react";
import SectionHeader from "../../components/SectionHeader";
import FormLayout, { SettingField } from "../../components/FormLayout";
import * as FiIcons from "react-icons/fi";
import settingsService from "@/services/settings.service";
import { toast } from "react-toastify";
import useBrandingStore from "@/store/useBrandingStore";

export default function SecuritySettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const fetchBranding = useBrandingStore((state) => state.fetchBranding);

  const [formData, setFormData] = useState({
    passwordMinLength: 8,
    sessionTimeout: 3600,
    enableTwoFactor: false,
  });

  const renderIcon = (IconName, props = {}) => {
    const Icon = FiIcons[IconName];
    return Icon ? <Icon {...props} /> : <FiIcons.FiShield {...props} />;
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsService.getSettings();
        const data = res?.data || res;
        if (data && typeof data === 'object') {
          setFormData({
            passwordMinLength: Number(data.passwordMinLength) || 8,
            sessionTimeout: Number(data.sessionTimeout) || 3600,
            enableTwoFactor: !!data.enableTwoFactor,
          });
        }
      } catch (err) {
        toast.error("SECURITY_PROTOCOL_SYNC_FAILED");
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
      await settingsService.updateSecuritySettings(formData);
      await fetchBranding();
      setSuccess(true);
      toast.success("Security Protocols Hardened");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      toast.error("Failed to update security firewall");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center animate-pulse">
      <div className="flex justify-center mb-6">
        {renderIcon("FiShield", { className: "text-indigo-500 animate-bounce", size: 50 })}
      </div>
      <p className="font-black text-slate-400 tracking-[0.5em] uppercase">Scanning Security Vectors...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <SectionHeader
        title="Security Fortress"
        subtitle="Manage authentication layers and session persistence"
        onSave={handleSave}
        isLoading={saving}
        isSuccess={success}
      />

      <div className="mt-8 bg-slate-950/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 p-8 shadow-2xl">
        <FormLayout
          title="Access Control"
          description="Configure how users interact with the system entry points"
          icon={renderIcon("FiLock")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <SettingField label="Min Password Strength" icon={renderIcon("FiKey")} helperText="Minimum characters required">
              <div className="flex items-center gap-6 bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                <input
                  type="range"
                  min="6" max="20"
                  value={formData.passwordMinLength}
                  onChange={(e) => setFormData({ ...formData, passwordMinLength: parseInt(e.target.value) })}
                  className="flex-1 accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <span className="font-black text-2xl text-indigo-500 w-12 text-center">
                  {formData.passwordMinLength}
                </span>
              </div>
            </SettingField>

            <SettingField label="Session Persistence" icon={renderIcon("FiClock")} helperText="Auto-logout time in seconds">
              <div className="relative">
                <input
                  type="number"
                  value={formData.sessionTimeout}
                  onChange={(e) => setFormData({ ...formData, sessionTimeout: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900/50 p-5 rounded-2xl border border-white/5 focus:border-indigo-500 outline-none font-bold text-white pl-12"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  {renderIcon("FiClock")}
                </div>
              </div>
            </SettingField>
          </div>
        </FormLayout>
      </div>

      <div className="mt-12 bg-indigo-600 rounded-[3rem] p-1">
        <div className="bg-slate-950 rounded-[2.8rem] p-10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-white italic uppercase">2FA Authentication</h3>
              <p className="text-slate-400 text-sm italic">Add an extra layer of security.</p>
            </div>
            <button
              onClick={() => setFormData({ ...formData, enableTwoFactor: !formData.enableTwoFactor })}
              className={`w-full md:w-[280px] p-8 rounded-[2.5rem] border-2 transition-all duration-700 flex flex-col items-center gap-4 
                ${formData.enableTwoFactor ? "bg-indigo-600 border-indigo-400 text-white shadow-xl" : "bg-slate-900 border-white/10 text-slate-500"}`}
            >
              {renderIcon("FiShield", { size: 40, className: formData.enableTwoFactor ? "animate-pulse" : "" })}
              <span className="text-[12px] font-black uppercase tracking-widest">
                {formData.enableTwoFactor ? "Shield Active" : "Shield Offline"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}