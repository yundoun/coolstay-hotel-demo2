"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { addDaysISO, todayISO } from "@/domain/shared/utils";
import type { ApiRoomSelection } from "@/domain/reservation/types";

/* ── Re-export for consumer convenience ── */
export type { ApiRoomSelection } from "@/domain/reservation/types";

/* ── State + Actions ── */

export type ReservationState = {
  // Step 1
  checkIn: string;
  checkOut: string;
  adults: number;
  // Step 2
  hotelId: string | null;
  roomId: string | null;
  apiRoom: ApiRoomSelection | null;
  // Step 3
  guestName: string;
  guestPhone: string;
  phoneVerified: boolean;
  // Step 4 outcome
  reservationNumber: string | null;
  // Actions
  setDates: (checkIn: string, checkOut: string) => void;
  setAdults: (adults: number) => void;
  setHotel: (hotelId: string | null) => void;
  setRoom: (roomId: string | null) => void;
  setApiRoom: (room: ApiRoomSelection) => void;
  clearApiRoom: () => void;
  setPhoneVerified: (v: boolean) => void;
  setGuestInfo: (info: { name: string; phone: string }) => void;
  setReservationNumber: (n: string) => void;
  reset: () => void;
};

/* ── 초기값 (reset에서 재사용) ── */

const defaultCheckIn = todayISO();
const defaultCheckOut = addDaysISO(defaultCheckIn, 1);

const INITIAL_STATE = {
  checkIn: defaultCheckIn,
  checkOut: defaultCheckOut,
  adults: 2,
  hotelId: null as string | null,
  roomId: null as string | null,
  apiRoom: null as ApiRoomSelection | null,
  guestName: "",
  guestPhone: "",
  phoneVerified: false,
  reservationNumber: null as string | null,
} as const satisfies Omit<ReservationState,
  "setDates" | "setAdults" | "setHotel" | "setRoom" |
  "setApiRoom" | "clearApiRoom" | "setPhoneVerified" | "setGuestInfo" | "setReservationNumber" | "reset"
>;

/* ── Store ── */

export const useReservation = create<ReservationState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
      setAdults: (adults) => set({ adults }),
      setHotel: (hotelId) => set({ hotelId, roomId: null, apiRoom: null }),
      setRoom: (roomId) => set({ roomId }),
      setApiRoom: (room) => set({ apiRoom: room }),
      clearApiRoom: () => set({ apiRoom: null }),
      setPhoneVerified: (v) => set({ phoneVerified: v }),
      setGuestInfo: (info) =>
        set({
          guestName: info.name,
          guestPhone: info.phone,
        }),
      setReservationNumber: (n) => set({ reservationNumber: n }),
      reset: () => set({ ...INITIAL_STATE }),
    }),
    {
      name: "coolstay-reservation",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
