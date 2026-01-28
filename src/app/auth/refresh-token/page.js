"use client";

import { useState } from "react";
import authService from "@/services/auth.service";

export default function RefreshTokenPage() {
  const [msg, setMsg] = useState("");

  const handleRefresh = async () => {
    try {
      const refreshTok = localStorage.getItem("softwarehouse_refresh");
      const data = await authService.refreshToken(refreshTok);
      if (data.accessToken) {
        localStorage.setItem("softwarehouse_token", data.accessToken);
      }
      if (data.refreshToken) {
        localStorage.setItem("softwarehouse_refresh", data.refreshToken);
      }
      setMsg("Token refreshed successfully!");
    } catch {
      setMsg("Refresh failed — please login again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <button
        onClick={handleRefresh}
        className="bg-blue-600 text-white px-5 py-2 rounded"
      >
        Refresh Token
      </button>

      {msg && <p className="mt-2 text-center text-indigo-600">{msg}</p>}
    </div>
  );
}
