"use client";
import { useState, useCallback } from "react";
import financeService from "@/services/finance.service";
import { toast } from "react-toastify";

export function useFinance() {
  const [loading, setLoading] = useState(false);
  // 🛡️ Initial State Safety: Meta aur items ko define rakha hai taake UI na phate
  const [data, setData] = useState({
    items: [],
    summary: {},
    meta: { total: 0 }
  });

  const fetchFinance = useCallback(async (params) => {
    setLoading(true);
    try {
      const res = await financeService.getTransactions(params);

      // 🛡️ Data mapping protection
      const result = res?.data || res || { items: [], summary: {}, meta: { total: 0 } };
      setData(result);
    } catch (err) {
      // 🛡️ Safe Toast: icon: false crash ko rokta hai
      const msg = err?.response?.data?.message || "Ledger sync failed";
      toast.error(msg, { icon: false });
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = async (formData) => {
    try {
      await financeService.createTransaction(formData);

      // 🛡️ Fixed Toast: Emoji aur default icons crash kar sakte hain, isliye clean rakha hai
      toast.success("Transaction Record Added Successfully", { icon: false });
      return true;
    } catch (err) {
      // 🛡️ Error handling for API responses
      const errorMsg = err?.response?.data?.message || err.message || "Operation failed";
      toast.error(errorMsg, { icon: false });
      return false;
    }
  };

  return { data, loading, fetchFinance, addTransaction };
}