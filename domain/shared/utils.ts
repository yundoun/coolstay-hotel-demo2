import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

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
