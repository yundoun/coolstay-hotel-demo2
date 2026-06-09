"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  CalendarDays,
  Users,
  Minus,
  Plus,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { addDays, format, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import BookingCalendar from "@/ui/shared/calendar-widget";
import { useReservation } from "@/adapters/zustand/reservation-store";
import { MAX_NIGHTS } from "@/domain/shared/constants";
import { useShallow } from "zustand/react/shallow";

type DropdownType = "calendar" | "guest" | null;

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) handler();
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [ref, handler]);
}

interface Props {
  onNext: () => void;
}

export function Step1Dates({ onNext }: Props) {
  const { storeCheckIn, storeCheckOut, storeAdults, setDates, setAdults: commitAdults } =
    useReservation(useShallow((s) => ({
      storeCheckIn: s.checkIn,
      storeCheckOut: s.checkOut,
      storeAdults: s.adults,
      setDates: s.setDates,
      setAdults: s.setAdults,
    })));
  const controlRef = useRef<HTMLDivElement>(null);

  const [checkIn, setCheckIn] = useState<Date | undefined>(
    storeCheckIn ? new Date(storeCheckIn) : undefined
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    storeCheckOut ? new Date(storeCheckOut) : undefined
  );
  const [adults, setAdults] = useState(storeAdults);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!storeCheckIn) setCheckIn(new Date());
    if (!storeCheckOut) setCheckOut(addDays(new Date(), 1));
    setIsMobile(window.innerWidth < 768);
  }, [storeCheckIn, storeCheckOut]);

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const maxCheckOut = checkIn ? addDays(checkIn, MAX_NIGHTS) : undefined;

  const toggleDropdown = useCallback((type: DropdownType) => {
    setActiveDropdown((prev) => (prev === type ? null : type));
  }, []);

  const closeDropdown = useCallback(() => setActiveDropdown(null), []);
  useClickOutside(controlRef, closeDropdown);

  const handleDateSelect = (ci: Date | undefined, co: Date | undefined) => {
    setCheckIn(ci);
    setCheckOut(co);
    if (ci && co) closeDropdown();
  };

  const formatDateShort = (date: Date | undefined) => {
    if (!date) return "날짜 선택";
    return format(date, "M.dd (EEE)", { locale: ko });
  };

  const handleNext = () => {
    if (!checkIn || !checkOut || nights <= 0) return;
    setDates(format(checkIn, "yyyy-MM-dd"), format(checkOut, "yyyy-MM-dd"));
    commitAdults(adults);
    onNext();
  };

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-xl md:text-2xl text-warm-900 font-medium mb-2">
          일정을 선택해 주세요
        </h3>
        <p className="text-warm-500 text-sm">
          체크인/체크아웃 날짜와 인원을 선택하세요.
        </p>
      </div>

      {/* Date & Guest Selector */}
      <div
        ref={controlRef}
        className="relative bg-white border border-warm-200/60 rounded-sm p-4 md:p-0 mb-10"
      >
        {/* Desktop */}
        <div className="hidden md:flex items-center h-[64px] divide-x divide-warm-200/40">
          <button
            onClick={() => toggleDropdown("calendar")}
            className="flex-1 flex items-center justify-center gap-3 px-6 h-full cursor-pointer text-center hover:bg-warm-50/50 transition-colors"
          >
            <CalendarDays className="w-[18px] h-[18px] text-warm-500 shrink-0" />
            <div>
              <p className="text-[10px] text-warm-400 tracking-[0.12em] uppercase leading-none mb-1">체크인</p>
              <p className="text-warm-900 text-[14px] font-medium">{formatDateShort(checkIn)}</p>
            </div>
          </button>

          <div className="flex items-center justify-center px-5 h-full">
            <span className="bg-sig-500/15 border border-sig-500/30 text-sig-600 text-xs font-bold px-3 py-1 rounded-full min-w-[3rem] text-center">
              {nights > 0 ? `${nights}박` : "-"}
            </span>
          </div>

          <button
            onClick={() => toggleDropdown("calendar")}
            className="flex-1 flex items-center justify-center gap-3 px-6 h-full cursor-pointer text-center hover:bg-warm-50/50 transition-colors"
          >
            <CalendarDays className="w-[18px] h-[18px] text-warm-500 shrink-0" />
            <div>
              <p className="text-[10px] text-warm-400 tracking-[0.12em] uppercase leading-none mb-1">체크아웃</p>
              <p className="text-warm-900 text-[14px] font-medium">{formatDateShort(checkOut)}</p>
            </div>
          </button>

          <button
            onClick={() => toggleDropdown("guest")}
            className="flex-1 flex items-center justify-center gap-3 px-6 h-full cursor-pointer text-center hover:bg-warm-50/50 transition-colors"
          >
            <Users className="w-[18px] h-[18px] text-warm-500 shrink-0" />
            <div>
              <p className="text-[10px] text-warm-400 tracking-[0.12em] uppercase leading-none mb-1">인원</p>
              <p className="text-warm-900 text-[14px] font-medium">성인 {adults}명</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-warm-300 transition-transform ${activeDropdown === "guest" ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden flex-col gap-3">
          <button
            onClick={() => toggleDropdown("calendar")}
            className="flex items-center gap-2 bg-warm-50 rounded-lg px-3 py-2.5 border border-warm-200/60"
          >
            <CalendarDays className="w-4 h-4 text-warm-500 shrink-0" />
            <span className="text-warm-900 text-xs font-medium">{formatDateShort(checkIn)}</span>
            <span className="bg-sig-500/15 border border-sig-500/30 text-sig-600 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 min-w-[2.5rem] text-center">
              {nights > 0 ? `${nights}박` : "-"}
            </span>
            <span className="text-warm-900 text-xs font-medium">{formatDateShort(checkOut)}</span>
          </button>

          <button
            onClick={() => toggleDropdown("guest")}
            className="flex items-center gap-2 bg-warm-50 rounded-lg px-3 py-2.5 border border-warm-200/60"
          >
            <Users className="w-4 h-4 text-warm-500 shrink-0" />
            <span className="text-warm-900 text-xs font-medium">성인 {adults}명</span>
            <ChevronDown className="w-3.5 h-3.5 text-warm-400 ml-auto" />
          </button>
        </div>

        {/* Calendar Dropdown */}
        {activeDropdown === "calendar" && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-warm-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)] animate-fade-in">
            <BookingCalendar
              checkIn={checkIn}
              checkOut={checkOut}
              onSelect={handleDateSelect}
              months={isMobile ? 1 : 2}
              maxCheckOut={maxCheckOut}
            />
          </div>
        )}

        {/* Guest Dropdown */}
        {activeDropdown === "guest" && (
          <div className="absolute top-full mt-2 right-0 md:right-4 z-50 w-80 rounded-xl border border-warm-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)] animate-fade-in">
            <div className="p-5 space-y-4">
              <GuestCounter label="성인" value={adults} min={1} max={6} onChange={setAdults} />
              <p className="text-warm-400 text-[11px] leading-relaxed pt-1">기준인원 초과 시 추가 요금이 발생할 수 있습니다.</p>
            </div>
            <div className="border-t border-warm-100 px-5 py-3">
              <button onClick={closeDropdown} className="w-full py-2.5 bg-sig-500 text-warm-900 font-semibold rounded-lg text-sm hover:bg-sig-400 transition-colors">
                적용
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={nights <= 0}
          className="flex items-center gap-2 px-8 py-3 bg-sig-500 text-warm-900 font-semibold rounded-sm hover:bg-sig-400 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          객실 선택
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function GuestCounter({
  label, value, min, max, onChange,
}: {
  label: string; value: number; min: number; max: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-warm-900 text-sm font-medium">{label}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-warm-200 flex items-center justify-center text-warm-500 hover:border-warm-400 hover:text-warm-900 transition-colors disabled:opacity-30"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-warm-900 text-sm font-semibold w-5 text-center tabular-nums">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-warm-200 flex items-center justify-center text-warm-500 hover:border-warm-400 hover:text-warm-900 transition-colors disabled:opacity-30"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
