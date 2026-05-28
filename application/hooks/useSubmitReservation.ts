"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useReservation } from "@/adapters/zustand/reservation-store";
import { createGuestReservation } from "@/application/services/reservation-api";

/**
 * 예약 확정 mutation을 캡슐화한다.
 * Store 값 검증 → API 호출 → 결과 저장 → 라우팅.
 */
export function useSubmitReservation() {
  const s = useReservation();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = Boolean(s.apiRoom?.packageKey && s.guestName && s.guestPhone);

  const submit = async () => {
    if (!s.apiRoom || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const { apiRoom } = s;
      const result = await createGuestReservation({
        hotelId: apiRoom.motelKey,
        roomId: apiRoom.packageKey,
        checkIn: s.checkIn,
        checkOut: s.checkOut,
        guestName: s.guestName,
        guestPhone: s.guestPhone,
        totalPrice: apiRoom.price,
        basePrice: apiRoom.price,
        checkInTime: apiRoom.checkInTime,
        checkOutTime: apiRoom.checkOutTime,
        smsAuthKey: s.smsAuthKey,
        smsAuthCode: s.smsAuthCode,
      });
      s.setReservationNumber(result.bookId);
      router.push("/reservation/complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "예약 중 오류가 발생했습니다.");
      setSubmitting(false);
    }
  };

  return { submit, submitting, error, canSubmit };
}
