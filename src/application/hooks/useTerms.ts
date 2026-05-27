"use client";

import { useEffect, useState } from "react";

export type Term = {
  code: string;
  name: string;
  url: string;
  required: boolean;
};

export type RefundPolicy = {
  until: string;
  percent: number;
  amount: number;
};

/** 예약 약관 코드 — 예약 동의에 표시할 약관만 필터 */
const RESERVATION_TERM_CODES = ["TC001", "TC002", "TC003"];

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    const res = await fetch(url);
    if (res.ok) return res;
    // 502/503은 토큰 만료 등 일시적 에러 — 재시도
    if ((res.status === 502 || res.status === 503) && i < retries) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      continue;
    }
    throw new Error(`${url} 요청 실패 (${res.status})`);
  }
  throw new Error(`${url} 요청 실패 (재시도 초과)`);
}

export function useTerms(params: {
  storeKey: string | null;
  itemKey: string | null;
  packKey: string | null;
  checkIn: string;
  checkOut: string;
}) {
  const [terms, setTerms] = useState<Term[]>([]);
  const [refundPolicies, setRefundPolicies] = useState<RefundPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      // 약관 조회
      try {
        const res = await fetchWithRetry("/api/terms");
        const data = await res.json();
        const raw: { code: string; name: string; url: string; required_yn: string }[] = data.terms ?? [];
        const seen = new Set<string>();
        const filtered: Term[] = [];
        for (const t of raw) {
          if (!RESERVATION_TERM_CODES.includes(t.code)) continue;
          if (seen.has(t.code)) continue;
          seen.add(t.code);
          filtered.push({
            code: t.code,
            name: t.name,
            url: t.url,
            required: t.required_yn === "Y",
          });
        }
        if (!cancelled) setTerms(filtered);
      } catch (e) {
        if (!cancelled) setError("약관 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
        console.error("[useTerms] terms load failed:", e);
      }

      // 환불 규정 조회
      if (params.storeKey && params.itemKey && params.packKey) {
        try {
          const qs = new URLSearchParams({
            store_key: params.storeKey,
            item_key: params.itemKey,
            pack_key: params.packKey,
            check_in: params.checkIn,
            check_out: params.checkOut,
          });
          const res = await fetchWithRetry(`/api/refund-policy?${qs}`);
          const data = await res.json();
          if (!cancelled) setRefundPolicies(data.refund_policies ?? []);
        } catch (e) {
          if (!cancelled) setError("환불 규정을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
          console.error("[useTerms] refund policy load failed:", e);
        }
      }

      if (!cancelled) setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [params.storeKey, params.itemKey, params.packKey, params.checkIn, params.checkOut]);

  return { terms, refundPolicies, loading, error };
}
