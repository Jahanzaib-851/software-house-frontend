// src/store/user.store.js
import { create } from "zustand";

export const useUserStore = create((set) => ({
  users: [],
  selectedUser: null,

  setUsers: (users) => set({ users }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (updatedUser) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    })),
  removeUser: (id) => set((state) => ({ users: state.users.filter((u) => u.id !== id) })),
}));
