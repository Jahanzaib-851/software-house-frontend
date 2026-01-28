import { FiMail, FiTrash2, FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { getAvatarUrl } from "@/utils/helpers";

/**
 * ClientCard Component
 * @param {Object} client - Client data object
 * @param {Function} onDelete - Function to handle deletion (expects ID)
 */
export default function ClientCard({ client, onDelete }) {

  // Delete Click Handler
  const handleDeleteClick = (e) => {
    // 1. In dono lines ka hona lazmi hai taake page refresh na ho aur profile na khule
    e.preventDefault();
    e.stopPropagation();

    // Debugging ke liye (Aap browser inspect mein check kar sakte hain)
    console.log("Attempting to delete client ID:", client?._id);

    if (!client?._id) {
      alert("Error: Client ID missing!");
      return;
    }

    // 2. Confirm dialog
    if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
      // 3. Parent (Listing Page) ko ID bhej rahe hain
      onDelete(client._id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">

      {/* --- Header: Avatar & Client Info --- */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src={getAvatarUrl(client.avatar, client.name)}
            className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-slate-50"
            alt={client.name}
          />
          <div>
            <h3 className="font-black text-slate-800 leading-tight">
              {client.name}
            </h3>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
              {client.companyName || 'Private Client'}
            </p>
          </div>
        </div>

        {/* Action: Delete Button */}
        <button
          type="button"
          onClick={handleDeleteClick}
          className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95 z-30"
          title="Delete Client"
        >
          <FiTrash2 size={18} />
        </button>
      </div>

      {/* --- Body: Contact Info --- */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
          <FiMail className="text-slate-400" size={14} />
          <span className="truncate">{client.email}</span>
        </div>
      </div>

      {/* --- Footer: Status & Profile Link --- */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <span
          className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${client.status === 'active'
              ? 'bg-emerald-100 text-emerald-600'
              : 'bg-red-100 text-red-600'
            }`}
        >
          {client.status || 'pending'}
        </span>

        <Link
          href={`/dashboard/clients/${client._id}`}
          onClick={(e) => e.stopPropagation()} // Link click par bhi stop propagation
          className="text-xs font-black text-slate-900 flex items-center gap-1 hover:text-indigo-600 transition-colors z-20"
        >
          VIEW PROFILE <FiExternalLink size={14} className="mb-0.5" />
        </Link>
      </div>

      {/* Decorative Side Accent line */}
      <div className="absolute top-0 right-0 w-1 h-0 bg-indigo-500 group-hover:h-full transition-all duration-300" />
    </div>
  );
}