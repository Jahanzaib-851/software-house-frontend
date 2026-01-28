"use client";

import { useEffect, useState } from "react";
import authService from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const doLogout = async () => {
      try {
        const refreshToken = localStorage.getItem("softwarehouse_refresh");
        await authService.logout(refreshToken);
        localStorage.removeItem("softwarehouse_token");
        localStorage.removeItem("softwarehouse_refresh");
        setMessage("Logged out successfully!");
      } catch {
        setMessage("Logout error");
      }
      router.push("/auth/login");
    };
    doLogout();
  }, []);

  return <p className="text-center p-4">{message}</p>;
}
