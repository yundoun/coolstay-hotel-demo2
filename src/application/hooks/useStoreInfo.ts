"use client";

import { useEffect, useRef, useState } from "react";
import type { StoreInfo } from "@/adapters/coolstay/types";

export function useStoreInfo() {
  const [data, setData] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    fetch("/api/store/info")
      .then((res) => {
        if (!res.ok) throw new Error(`객실 조회 실패 (${res.status})`);
        return res.json();
      })
      .then((d: StoreInfo) => setData(d))
      .catch((err) => {
        console.error("[useStoreInfo]", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
