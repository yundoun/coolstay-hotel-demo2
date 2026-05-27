"use client";

import { useEffect, useReducer } from "react";
import { format, parseISO } from "date-fns";
import type { RoomsResponse } from "@/adapters/coolstay/types";

type State = {
  storeData: RoomsResponse | null;
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; data: RoomsResponse }
  | { type: "FETCH_ERROR"; message: string }
  | { type: "SKIP" };

function reducer(_: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { storeData: null, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { storeData: action.data, loading: false, error: null };
    case "FETCH_ERROR":
      return { storeData: null, loading: false, error: action.message };
    case "SKIP":
      return { storeData: null, loading: false, error: null };
  }
}

/**
 * 체크인/체크아웃 날짜 기반으로 API 객실 목록을 조회한다.
 * abort 처리 및 에러 핸들링을 캡슐화.
 */
export function useApiRooms(checkIn: string, checkOut: string, nights: number) {
  const [state, dispatch] = useReducer(reducer, {
    storeData: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!checkIn || !checkOut || nights <= 0) {
      dispatch({ type: "SKIP" });
      return;
    }

    const controller = new AbortController();
    const ci = format(parseISO(checkIn), "yyyyMMdd");
    const co = format(parseISO(checkOut), "yyyyMMdd");

    dispatch({ type: "FETCH_START" });

    fetch(`/api/store/rooms?checkIn=${ci}&checkOut=${co}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("객실 조회 실패");
        return res.json();
      })
      .then((data: RoomsResponse) => {
        dispatch({ type: "FETCH_SUCCESS", data });
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          dispatch({ type: "FETCH_ERROR", message: err.message });
        }
      });

    return () => controller.abort();
  }, [checkIn, checkOut, nights]);

  return state;
}
