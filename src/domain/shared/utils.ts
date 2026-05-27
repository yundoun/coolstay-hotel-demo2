import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

export const KRW = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0,
});

export function krw(n: number): string {
  return KRW.format(n).replace("₩", "₩ ");
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const d = differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));
  return d > 0 ? d : 0;
}

export function formatKoDate(iso: string): string {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "yyyy년 M월 d일 (EEE)", { locale: ko });
  } catch {
    return iso;
  }
}

export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function addDaysISO(iso: string, n: number): string {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return format(d, "yyyy-MM-dd");
}

export function generateReservationNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4).padEnd(4, "X");
  return `CS-${ymd}-${rand}`;
}
