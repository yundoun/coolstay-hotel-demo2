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

/* ── 모듈 레벨 캐시 ── */

let termsCache: Term[] | null = null;
let termsFetchPromise: Promise<Term[]> | null = null;

async function loadTerms(): Promise<Term[]> {
  if (termsCache) return termsCache;
  if (termsFetchPromise) return termsFetchPromise;

  termsFetchPromise = (async () => {
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
    termsCache = filtered;
    return filtered;
  })();

  try {
    return await termsFetchPromise;
  } catch (e) {
    termsFetchPromise = null;
    throw e;
  }
}

let refundCache = new Map<string, RefundPolicy[]>();
let refundFetchPromises = new Map<string, Promise<RefundPolicy[]>>();

function refundCacheKey(p: { storeKey: string; itemKey: string; packKey: string; checkIn: string; checkOut: string }) {
  return `${p.storeKey}:${p.itemKey}:${p.packKey}:${p.checkIn}:${p.checkOut}`;
}

async function loadRefundPolicy(params: {
  storeKey: string;
  itemKey: string;
  packKey: string;
  checkIn: string;
  checkOut: string;
}): Promise<RefundPolicy[]> {
  const key = refundCacheKey(params);
  if (refundCache.has(key)) return refundCache.get(key)!;
  if (refundFetchPromises.has(key)) return refundFetchPromises.get(key)!;

  const promise = (async () => {
    const qs = new URLSearchParams({
      store_key: params.storeKey,
      item_key: params.itemKey,
      pack_key: params.packKey,
      check_in: params.checkIn,
      check_out: params.checkOut,
    });
    const res = await fetchWithRetry(`/api/refund-policy?${qs}`);
    const data = await res.json();
    const policies = data.refund_policies ?? [];
    refundCache.set(key, policies);
    return policies;
  })();

  refundFetchPromises.set(key, promise);
  try {
    return await promise;
  } catch (e) {
    refundFetchPromises.delete(key);
    throw e;
  }
}

/**
 * Step 3에서 미리 호출하여 Step 4 진입 시 즉시 표시.
 * 실패해도 무시 — Step 4에서 다시 시도한다.
 */
export function prefetchTerms(params: {
  storeKey: string | null;
  itemKey: string | null;
  packKey: string | null;
  checkIn: string;
  checkOut: string;
}) {
  loadTerms().catch(() => {});
  if (params.storeKey && params.itemKey && params.packKey) {
    loadRefundPolicy({
      storeKey: params.storeKey,
      itemKey: params.itemKey,
      packKey: params.packKey,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
    }).catch(() => {});
  }
}

export function useTerms(params: {
  storeKey: string | null;
  itemKey: string | null;
  packKey: string | null;
  checkIn: string;
  checkOut: string;
}) {
  const [terms, setTerms] = useState<Term[]>(() => termsCache ?? []);
  const [refundPolicies, setRefundPolicies] = useState<RefundPolicy[]>([]);
  const [loading, setLoading] = useState(() => !termsCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // 이미 캐시가 있으면 로딩 표시 없이 즉시 반영
      if (termsCache) {
        setTerms(termsCache);
        setLoading(false);
      } else {
        setLoading(true);
      }
      setError(null);

      // 병렬 호출
      const termsPromise = loadTerms();
      const refundPromise =
        params.storeKey && params.itemKey && params.packKey
          ? loadRefundPolicy({
              storeKey: params.storeKey,
              itemKey: params.itemKey,
              packKey: params.packKey,
              checkIn: params.checkIn,
              checkOut: params.checkOut,
            })
          : Promise.resolve([] as RefundPolicy[]);

      try {
        const [termsResult, refundResult] = await Promise.all([termsPromise, refundPromise]);
        if (!cancelled) {
          setTerms(termsResult);
          setRefundPolicies(refundResult);
        }
      } catch (e) {
        if (!cancelled) {
          setError("약관 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
          console.error("[useTerms] load failed:", e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [params.storeKey, params.itemKey, params.packKey, params.checkIn, params.checkOut]);

  return { terms, refundPolicies, loading, error };
}
