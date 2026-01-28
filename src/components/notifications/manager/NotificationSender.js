"use client";
import { useState, useEffect } from "react";
import { FiX, FiSend, FiMail, FiMessageSquare, FiGlobe, FiUsers, FiInfo, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import notificationService from "@/services/notification.service";
import userService from "@/services/user.service"; // All users fetch karne ke liye

export default function NotificationSender({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [sendToAll, setSendToAll] = useState(false);

  const [formData, setFormData] = useState({
    notificationType: "info",
    message: "",
    recipients: [], // Array of { id, model }
    channels: ["in-app"], // Default hamesha dashboard par dikhega
    remarks: ""
  });

  const [availableUsers, setAvailableUsers] = useState([]); // Searchable list

  // 1. Load users for selection (Polymorphic dropdown ki tayyari)
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await userService.getAllUsers(); // Backend se sab users mangwaye
        setAvailableUsers(res.data);
      } catch (err) {
        console.error("User fetch error", err);
      }
    };
    loadUsers();
  }, []);

  // 2. Multi-channel toggle logic
  const toggleChannel = (ch) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(ch)
        ? prev.channels.filter(c => c !== ch)
        : [...prev.channels, ch]
    }));
  };

  // 3. Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message) return toast.error("Message content is required");
    if (!sendToAll && formData.recipients.length === 0) return toast.error("Select at least one recipient");
    if (formData.channels.length === 0) return toast.error("Select at least one delivery channel");

    setLoading(true);
    try {
      let finalRecipients = formData.recipients;

      // Agar "Send to All" checked hai, toh sab users ki list banao
      if (sendToAll) {
        finalRecipients = availableUsers.map(u => ({ id: u._id, model: "User" }));
      }

      const payload = { ...formData, recipients: finalRecipients };
      await notificationService.create(payload);

      toast.success(`Protocol Executed: Broadcast sent to ${finalRecipients.length} operatives`);
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Transmission Interrupted");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[90vh]">
      {/* Header */}
      <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
            <FiSend className="text-indigo-400" /> New Broadcast
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Multi-Channel Protocol</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><FiX size={24} /></button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6 bg-white">

        {/* 1. Notification Type & Priority */}
        <div className="grid grid-cols-2 gap-4">
          {['info', 'alert', 'system'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, notificationType: type })}
              className={`py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${formData.notificationType === type
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xl'
                  : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'
                }`}
            >
              {type === 'alert' && <FiAlertCircle />} {type}
            </button>
          ))}
        </div>

        {/* 2. Content Area */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Message Content</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full h-32 p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700"
            placeholder="Enter transmission details..."
          />
        </div>

        {/* 3. Recipient Selection (Advanced All-in-One Logic) */}
        <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiUsers className="text-indigo-600" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-700">Recipients</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={sendToAll} onChange={() => setSendToAll(!sendToAll)} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ml-3 text-[10px] font-black uppercase text-indigo-600">Send to All</span>
            </label>
          </div>

          {!sendToAll && (
            <select
              multiple
              className="w-full p-4 bg-white border border-indigo-100 rounded-2xl outline-none text-sm font-bold h-24"
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(opt => ({ id: opt.value, model: "User" }));
                setFormData({ ...formData, recipients: selected });
              }}
            >
              {availableUsers.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
          )}
        </div>

        {/* 4. Delivery Channels (The Advanced Multi-Channel Part) */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Transmission Channels</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'in-app', icon: <FiGlobe />, label: 'Dashboard' },
              { id: 'email', icon: <FiMail />, label: 'Email' },
              { id: 'sms', icon: <FiMessageSquare />, label: 'SMS' }
            ].map(channel => (
              <div
                key={channel.id}
                onClick={() => toggleChannel(channel.id)}
                className={`cursor-pointer p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${formData.channels.includes(channel.id)
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-slate-100 text-slate-400 grayscale'
                  }`}
              >
                {channel.icon}
                <span className="text-[9px] font-black uppercase tracking-tighter">{channel.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="pt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? "Transmitting..." : <><FiSend /> Initiate Broadcast</>}
          </button>
        </div>
      </form>
    </div>
  );
}