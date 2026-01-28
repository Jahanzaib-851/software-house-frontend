// src/store/auth.store.js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  login: (userData, token) => set({ user: userData, token, isLoggedIn: true }),
  logout: () => set({ user: null, token: null, isLoggedIn: false }),
  updateUser: (userData) => set((state) => ({ ...state, user: { ...state.user, ...userData } })),
}));
