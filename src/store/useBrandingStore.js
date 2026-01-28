import { create } from "zustand";
import settingsService from "@/services/settings.service";

const useBrandingStore = create((set) => ({
  branding: { name: "DevSync", version: "OS V1.0" },
  loading: true,

  fetchBranding: async () => {
    // Shuru mein loading true lazmi karein agar dubara fetch ho raha ho
    set({ loading: true });
    try {
      const res = await settingsService.getSettings();

      // 🚨 Sab se bari wajah: Aapka backend response 'res.data' mein ho sakta hai
      const data = res?.data || res;

      if (data && data.companyName) {
        set({
          branding: {
            name: data.companyName,
            version: data.timezone ? `${data.timezone} NODE` : "OS V1.0"
          },
          loading: false // ✅ Data mil gaya, loading khatam
        });
      } else {
        // Agar data structure sahi nahi mila toh default par loading band karo
        set({ loading: false });
      }
    } catch (err) {
      console.error("Store sync failed:", err);
      set({ loading: false }); // ✅ Error mein bhi loading band karna zaroori hai
    }
  },

  updateBranding: (newName, newTimezone) => {
    set({
      branding: {
        name: newName,
        version: newTimezone ? `${newTimezone} NODE` : "OS V1.0"
      },
      loading: false // ✅ Update hote hi loading band
    });
  }
}));

export default useBrandingStore;