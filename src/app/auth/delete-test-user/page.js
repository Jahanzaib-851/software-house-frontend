"use client";

import { useState } from "react";
import authService from "@/services/auth.service";

export default function DeleteTestUser() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleDelete = async () => {
    try {
      await authService.deleteTestUser(email);
      setMsg("User deleted!");
    } catch {
      setMsg("Deletion failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <input
          type="email"
          placeholder="Email to delete"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />

        <button
          onClick={handleDelete}
          className="bg-red-500 text-white py-2 rounded w-full"
        >
          Delete User
        </button>

        {msg && <p className="mt-3 text-center text-red-500">{msg}</p>}
      </div>
    </div>
  );
}
