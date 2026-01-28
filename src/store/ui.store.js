// src/store/ui.store.js
import { create } from "zustand";

export const useUIStore = create((set) => ({
  isSidebarOpen: true,
  modal: null, // e.g., { type: "editUser", data: {...} }

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
}));
