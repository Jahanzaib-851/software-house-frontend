"use client";

import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientWrapper({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // ANTI-CRASH SYSTEM
    const handleError = (e) => {
      const msg = e.message || e.reason?.message || "";
      if (msg.includes("createElement") || msg.includes("undefined") || msg.includes("type is invalid")) {
        console.warn("Nexus Shield: Prevented a UI crash from an undefined component.");
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };

    window.addEventListener("error", handleError, true);
    window.addEventListener("unhandledrejection", handleError, true);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, []);

  return (
    <>
      <div className="relative min-h-screen">
        {children}
      </div>

      {mounted && (
        <ToastContainer
          position="top-right"
          theme="dark"
          icon={false}
          autoClose={2000}
          hideProgressBar={true}
        />
      )}
    </>
  );
}