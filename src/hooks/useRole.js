"use client";
import { useEffect, useState } from "react";
import useAuth from "./useAuth";

export default function useRole(allowedRoles = []) {
  const { getProfile } = useAuth();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const user = await getProfile();

      if (user && allowedRoles.includes(user.role)) {
        setAllowed(true);
      } else {
        setAllowed(false);
      }

      setLoading(false);
    };

    checkRole();
  }, []);

  return { allowed, loading };
}
