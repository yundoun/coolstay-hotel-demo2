"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useReservation } from "@/adapters/zustand/reservation-store";

/**
 * 예약 완료(/booking/complete) 또는 조회(/reservation-lookup) 페이지에서
 * 벗어나면 예약 스토어를 초기화하여 다음 예약 시 깨끗한 상태로 시작한다.
 */
export function ReservationResetGuard() {
  const pathname = usePathname();
  const reset = useReservation((s) => s.reset);
  const prevPath = useRef(pathname);

  useEffect(() => {
    const wasBookingRelated =
      prevPath.current.startsWith("/booking/complete") ||
      prevPath.current.startsWith("/reservation-lookup");
    const isBookingRelated =
      pathname.startsWith("/booking/complete") ||
      pathname.startsWith("/reservation-lookup");

    if (wasBookingRelated && !isBookingRelated) {
      reset();
    }

    prevPath.current = pathname;
  }, [pathname, reset]);

  return null;
}
