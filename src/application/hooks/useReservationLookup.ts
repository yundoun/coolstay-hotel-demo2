"use client";

import { useState, useCallback } from "react";
import type { BookingItem } from "@/domain/reservation/types";

type LookupState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "success"; books: BookingItem[] }
  | { phase: "error"; message: string };

type CancelState =
  | { phase: "idle" }
  | { phase: "loading"; bookId: string }
  | { phase: "completed"; bookId: string }
  | { phase: "error"; bookId: string; message: string };

export function useReservationLookup() {
  const [state, setState] = useState<LookupState>({ phase: "idle" });
  const [cancelState, setCancelState] = useState<CancelState>({ phase: "idle" });

  const lookup = useCallback(async (bookId: string, phoneNumber: string) => {
    setState({ phase: "loading" });

    try {
      const qs = new URLSearchParams({ book_id: bookId, phone_number: phoneNumber });
      const res = await fetch(`/api/reservation/lookup?${qs}`);
      const data = await res.json();

      if (!res.ok) {
        setState({ phase: "error", message: data.message ?? "조회에 실패했습니다." });
        return;
      }

      setState({ phase: "success", books: data.books });
    } catch {
      setState({ phase: "error", message: "서버와 연결할 수 없습니다." });
    }
  }, []);

  const cancel = useCallback(async (bookId: string) => {
    setCancelState({ phase: "loading", bookId });

    try {
      const res = await fetch("/api/reservation/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_id: bookId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setCancelState({ phase: "error", bookId, message: data.message ?? "취소에 실패했습니다." });
        return false;
      }

      // 취소 성공 → 목록에서 상태를 CANCEL로 업데이트
      setState((prev) => {
        if (prev.phase !== "success") return prev;
        return {
          ...prev,
          books: prev.books.map((b) =>
            b.bookId === bookId ? { ...b, status: "CANCEL" as const } : b,
          ),
        };
      });
      setCancelState({ phase: "completed", bookId });
      return true;
    } catch {
      setCancelState({ phase: "error", bookId, message: "서버와 연결할 수 없습니다." });
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ phase: "idle" });
    setCancelState({ phase: "idle" });
  }, []);

  return { state, cancelState, lookup, cancel, reset };
}
