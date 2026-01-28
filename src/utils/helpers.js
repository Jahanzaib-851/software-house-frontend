/**
 * Avatar URL generate karne ke liye. 
 * Agar backend se Cloudinary URL milta hai toh wo dikhayega, 
 * warna name ke initials se ek khoobsurat default avatar bana dega.
 */
export const getAvatarUrl = (url, name) => {
  if (url && url.trim() !== "") {
    return url;
  }
  const safeName = name ? encodeURIComponent(name) : "User";
  // Indigo background aur White text ke saath default avatar
  return `https://ui-avatars.com/api/?name=${safeName}&background=6366f1&color=fff&bold=true&size=128`;
};

/**
 * MongoDB ki ISO date ko readable format mein convert karne ke liye.
 * Example: 2024-03-20T... -> 20 Mar 2024
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    return "Invalid Date";
  }
};

/**
 * File size ko readable format mein dikhane ke liye (Optional: Profile upload ke liye kaam ayega)
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Status colors return karne ke liye (UI consistency ke liye)
 */
export const getStatusDetails = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return { color: "text-emerald-600", bg: "bg-emerald-100", dot: "bg-emerald-500" };
    case "inactive":
      return { color: "text-red-600", bg: "bg-red-100", dot: "bg-red-500" };
    default:
      return { color: "text-slate-600", bg: "bg-slate-100", dot: "bg-slate-500" };
  }
};