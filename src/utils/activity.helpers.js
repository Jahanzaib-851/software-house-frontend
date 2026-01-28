import { FiPlus, FiEdit, FiTrash, FiLogIn, FiSettings, FiActivity } from "react-icons/fi";

export const getActivityConfig = (action) => {
  const configs = {
    CREATE: { color: "text-emerald-600 bg-emerald-50 border-emerald-100", icon: <FiPlus />, label: "Addition" },
    UPDATE: { color: "text-blue-600 bg-blue-50 border-blue-100", icon: <FiEdit />, label: "Update" },
    DELETE: { color: "text-rose-600 bg-rose-50 border-rose-100", icon: <FiTrash />, label: "Deletion" },
    LOGIN: { color: "text-indigo-600 bg-indigo-50 border-indigo-100", icon: <FiLogIn />, label: "Login" },
  };
  return configs[action] || { color: "text-slate-600 bg-slate-50 border-slate-100", icon: <FiActivity />, label: action };
};

export const getModuleIcon = (module) => {
  // Module ke hisab se icon (optional)
  return <FiSettings className="text-slate-400" />;
};