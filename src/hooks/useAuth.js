"use client";
import { useRouter } from "next/navigation";
import { getToken, removeTokens } from "@/utils/token";
import authService from "@/services/auth.service";
import { useState, useEffect, useCallback, useMemo } from "react";

export default function useAuth() {
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = useCallback(() => !!getToken(), []);

  const logout = useCallback(() => {
    removeTokens();
    setProfileData(null);
    router.replace("/login");
  }, [router]);

  const getProfile = useCallback(async () => {
    try {
      const res = await authService.me();
      const userData = res?.data?.data || res?.data || res;
      setProfileData(userData);
      return userData;
    } catch (error) {
      console.error("Auth Profile Error:", error);
      if (error.response?.status === 401) {
        logout();
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Page load par profile fetch karna taake data pehle se mojood ho
  useEffect(() => {
    if (isLoggedIn()) {
      getProfile();
    } else {
      setLoading(false);
    }
  }, [getProfile, isLoggedIn]);

  // 🚀 Speed Optimization: useMemo return object ko stable rakhta hai
  return useMemo(() => ({
    isLoggedIn,
    logout,
    getProfile,
    user: profileData, // Ab yeh direct data hai, function nahi
    loading
  }), [isLoggedIn, logout, getProfile, profileData, loading]);
}