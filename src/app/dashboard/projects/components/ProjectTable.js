"use client";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

// Humne yahan default functions empty rakhe hain taake "is not a function" ka error na aaye
export default function ProjectTable({
  projects = [],
  onEdit = () => { },
  onDelete = () => { },
  onView = () => { }
}) {

  // Agar projects abhi load ho rahe hain ya empty hain
  if (!projects || projects.length === 0) {
    return (
      <div className="bg-white p-20 text-center rounded-[2.5rem] border border-dashed border-slate-200">
        <p className="text-slate-400 font-bold uppercase tracking-widest italic text-sm">No Projects Found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto"> {/* Mobile responsiveness ke liye zaroori hai */}
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Project & Client</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Team</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Deadline</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {projects.map((project) => (
              <tr key={project._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-6">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                      {project.name || "Untitled Project"}
                    </span>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                      {project.client?.companyName || project.client?.name || "No Client"}
                    </span>
                  </div>
                </td>

                <td className="p-6">
                  <div className="flex -space-x-2">
                    {/* Optional Chaining (?.) use ki hai takay agar team na ho toh crash na ho */}
                    {project.team?.slice(0, 3).map((m, i) => (
                      <img
                        key={i}
                        src={m.avatar || m.user?.avatar || "https://ui-avatars.com/api/?name=Team&background=random"}
                        title={m.name || m.user?.name}
                        className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                        alt="team"
                      />
                    ))}
                    {project.team?.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                </td>

                <td className="p-6">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest 
                    ${project.status === 'active' ? 'bg-emerald-100 text-emerald-600' :
                      project.status === 'urgent' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                    {project.status || 'N/A'}
                  </span>
                </td>

                <td className="p-6 text-sm font-bold text-slate-600">
                  {project.timeline?.endDate ? new Date(project.timeline.endDate).toLocaleDateString() : 'No Date'}
                </td>

                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onView(project._id)}
                      className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-all"
                      title="View Details"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => onEdit(project)}
                      className="p-2 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-lg transition-all"
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => onDelete(project._id)}
                      className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}