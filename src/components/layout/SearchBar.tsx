"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Users,
  Search,
  Minus,
  Plus,
  BedDouble,
  MapPin,
  ChevronDown,
  Check,
  ArrowRight,
} from "lucide-react";
import { addDays, format, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import BookingCalendar from "./BookingCalendar";

const REGIONS = [
  { id: "", name: "전체 지역" },
  { id: "서울", name: "서울" },
  { id: "제주", name: "제주" },
  { id: "부산", name: "부산" },
  { id: "경주", name: "경주" },
  { id: "강원", name: "강원" },
  { id: "경기", name: "경기" },
  { id: "전라", name: "전라" },
  { id: "충청", name: "충청" },
];

type DropdownType = "region" | "calendar" | "guest" | null;

// Click-outside hook
function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [ref, handler]);
}

interface SearchBarProps {
  mode?: "search" | "booking";
  variant?: "fixed" | "inline";
  hotelId?: string;
  hotelName?: string;
}

export default function SearchBar({
  mode = "search",
  variant = "fixed",
  hotelId,
  hotelName,
}: SearchBarProps) {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);
  const [checkIn, setCheckIn] = useState<Date | undefined>(addDays(new Date(), 7));
  const [checkOut, setCheckOut] = useState<Date | undefined>(addDays(new Date(), 8));
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);

  const barRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback((type: DropdownType) => {
    setActiveDropdown((prev) => (prev === type ? null : type));
  }, []);

  const closeDropdown = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  useClickOutside(barRef, closeDropdown);

  const totalGuests = adults + children;
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;

  const handleDateSelect = (ci: Date | undefined, co: Date | undefined) => {
    setCheckIn(ci);
    setCheckOut(co);
    if (ci && co) closeDropdown();
  };

  const handleSearch = () => {
    closeDropdown();
    if (mode === "booking" && hotelId) {
      const roomsSection = document.getElementById("rooms");
      if (roomsSection) roomsSection.scrollIntoView({ behavior: "smooth" });
      return;
    }
    const params = new URLSearchParams({
      checkIn: checkIn ? format(checkIn, "yyyy-MM-dd") : "",
      checkOut: checkOut ? format(checkOut, "yyyy-MM-dd") : "",
      guests: totalGuests.toString(),
      rooms: rooms.toString(),
      ...(selectedRegion.id ? { region: selectedRegion.id } : {}),
    });
    router.push(`/booking?${params.toString()}`);
  };

  const formatDateShort = (date: Date | undefined) => {
    if (!date) return "날짜 선택";
    return format(date, "M.dd (EEE)", { locale: ko });
  };

  const isBookingMode = mode === "booking";
  const isInline = variant === "inline";

  if (isInline) {
    return (
      <InlineSearchBar
        isBookingMode={isBookingMode}
        hotelName={hotelName}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        checkIn={checkIn}
        checkOut={checkOut}
        handleDateSelect={handleDateSelect}
        nights={nights}
        rooms={rooms}
        setRooms={setRooms}
        adults={adults}
        setAdults={setAdults}
        children={children}
        setChildren={setChildren}
        totalGuests={totalGuests}
        handleSearch={handleSearch}
        formatDateShort={formatDateShort}
        activeDropdown={activeDropdown}
        toggleDropdown={toggleDropdown}
        closeDropdown={closeDropdown}
      />
    );
  }

  // ─── Home / Hotels: Glassmorphism Fixed Bar ───
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="bg-black/25 backdrop-blur-2xl border-t border-white/15">
        <div ref={barRef} className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 relative">
          {/* ── Desktop ── */}
          <div className="hidden md:flex items-center justify-center h-[72px] gap-6">
            {/* Region / Hotel */}
            {isBookingMode ? (
              <div className="flex items-center gap-3 shrink-0">
                <MapPin className="w-[18px] h-[18px] text-brand-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase leading-none mb-1">호텔</p>
                  <p className="text-white text-[15px] font-medium truncate">{hotelName || "선택된 호텔"}</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => toggleDropdown("region")}
                className="flex items-center gap-3 shrink-0 cursor-pointer text-left"
              >
                <MapPin className="w-[18px] h-[18px] text-brand-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase leading-none mb-1">지역</p>
                  <p className="text-white text-[15px] font-medium">
                    {selectedRegion.name}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/30 shrink-0 transition-transform ${activeDropdown === "region" ? "rotate-180 text-white/50" : ""}`} />
              </button>
            )}

            {/* Check-in */}
            <button
              onClick={() => toggleDropdown("calendar")}
              className="flex items-center gap-3 shrink-0 cursor-pointer text-left"
            >
              <CalendarDays className="w-[18px] h-[18px] text-brand-400 shrink-0" />
              <div>
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase leading-none mb-1">체크인</p>
                <p className="text-white text-[15px] font-medium">
                  {formatDateShort(checkIn)}
                </p>
              </div>
            </button>

            {/* Nights Badge */}
            {nights > 0 && (
              <button
                onClick={() => toggleDropdown("calendar")}
                className="flex items-center justify-center shrink-0 cursor-pointer"
              >
                <span className="bg-brand-500/20 border border-brand-400/30 text-brand-400 text-[13px] font-bold px-3 py-1 rounded-full">{nights}박</span>
              </button>
            )}

            {/* Check-out */}
            <button
              onClick={() => toggleDropdown("calendar")}
              className="flex items-center gap-3 shrink-0 cursor-pointer text-left"
            >
              <CalendarDays className="w-[18px] h-[18px] text-brand-400 shrink-0" />
              <div>
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase leading-none mb-1">체크아웃</p>
                <p className="text-white text-[15px] font-medium">
                  {formatDateShort(checkOut)}
                </p>
              </div>
            </button>

            {/* Guest & Room */}
            <button
              onClick={() => toggleDropdown("guest")}
              className="flex items-center gap-3 shrink-0 cursor-pointer text-left"
            >
              <Users className="w-[18px] h-[18px] text-brand-400 shrink-0" />
              <div>
                <p className="text-[10px] text-white/40 tracking-[0.15em] uppercase leading-none mb-1">객실 · 인원</p>
                <p className="text-white text-[15px] font-medium">
                  {rooms}실 · {totalGuests}명
                </p>
              </div>
            </button>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="flex items-center gap-2.5 h-11 px-8 bg-brand-500 text-warm-900 font-semibold rounded-full active:scale-[0.97] text-sm tracking-wide whitespace-nowrap shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{isBookingMode ? "객실 보기" : "검색"}</span>
            </button>
          </div>

          {/* ── Mobile ── */}
          <div className="flex md:hidden flex-col py-3 gap-3">
            {/* Row 1: Region + Guests */}
            <div className="flex items-center">
              {isBookingMode ? (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] text-white/40 tracking-wider uppercase leading-none mb-0.5">호텔</p>
                    <p className="text-white text-xs font-medium truncate">{hotelName || "선택된 호텔"}</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => toggleDropdown("region")}
                  className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer text-left"
                >
                  <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] text-white/40 tracking-wider uppercase leading-none mb-0.5">지역</p>
                    <p className="text-white text-xs font-medium truncate">{selectedRegion.name}</p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/30 shrink-0 transition-transform ${activeDropdown === "region" ? "rotate-180" : ""}`} />
                </button>
              )}

              <button
                onClick={() => toggleDropdown("guest")}
                className="flex items-center gap-2 cursor-pointer shrink-0"
              >
                <Users className="w-4 h-4 text-brand-400 shrink-0" />
                <div>
                  <p className="text-[9px] text-white/40 tracking-wider uppercase leading-none mb-0.5">객실 · 인원</p>
                  <p className="text-white text-xs font-medium">{rooms}실 · {totalGuests}명</p>
                </div>
              </button>
            </div>

            {/* Row 2: Dates + Search */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleDropdown("calendar")}
                className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
              >
                <CalendarDays className="w-4 h-4 text-brand-400 shrink-0" />
                <span className="text-white text-xs font-medium">{formatDateShort(checkIn)}</span>
                {nights > 0 && (
                  <span className="bg-brand-500/20 border border-brand-400/30 text-brand-400 text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0">{nights}박</span>
                )}
                <ArrowRight className="w-3 h-3 text-white/25 shrink-0" />
                <span className="text-white text-xs font-medium">{formatDateShort(checkOut)}</span>
              </button>

              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-1.5 h-9 px-5 bg-brand-500 text-warm-900 font-semibold rounded-full text-xs tracking-wide active:scale-[0.97] shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isBookingMode ? "객실 보기" : "검색"}</span>
              </button>
            </div>
          </div>

          {/* ── Dropdown Panels (positioned above bar) ── */}
          {activeDropdown === "region" && (
            <div className="absolute bottom-full mb-3 left-5 md:left-8 lg:left-12 z-50 w-48 rounded-xl border border-white/15 bg-warm-900/90 backdrop-blur-2xl shadow-[0_12px_48px_rgba(0,0,0,0.4)] py-1.5 animate-fade-in">
              {REGIONS.map((region) => (
                <button
                  key={region.id || "all"}
                  onClick={() => { setSelectedRegion(region); closeDropdown(); }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-white/10 transition-colors ${
                    selectedRegion.id === region.id ? "bg-white/5" : ""
                  }`}
                >
                  <span className="text-sm text-white/90">{region.name}</span>
                  {selectedRegion.id === region.id && <Check className="w-4 h-4 text-brand-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}

          {activeDropdown === "calendar" && (
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-warm-200 bg-white shadow-[0_12px_48px_rgba(0,0,0,0.15)] animate-fade-in">
              <BookingCalendar
                checkIn={checkIn}
                checkOut={checkOut}
                onSelect={handleDateSelect}
                months={typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 2}
              />
            </div>
          )}

          {activeDropdown === "guest" && (
            <div className="absolute bottom-full mb-3 right-5 md:right-8 lg:right-12 z-50 w-80 rounded-xl border border-warm-200 bg-white shadow-[0_12px_48px_rgba(0,0,0,0.15)] animate-fade-in">
              <div className="p-5 space-y-4">
                <GuestCounter label="객실" icon={<BedDouble className="w-4 h-4 text-warm-400" />} value={rooms} min={1} max={5} onChange={setRooms} />
                <div className="h-px bg-warm-100" />
                <GuestCounter label="성인" description="만 13세 이상" value={adults} min={1} max={6} onChange={setAdults} />
                <div className="h-px bg-warm-100" />
                <GuestCounter label="아동" description="만 2~12세" value={children} min={0} max={4} onChange={setChildren} />
                <p className="text-warm-400 text-[11px] leading-relaxed pt-1">기준인원 초과 시 추가 요금이 발생할 수 있습니다.</p>
              </div>
              <div className="border-t border-warm-100 px-5 py-3">
                <button onClick={closeDropdown} className="w-full py-2.5 bg-brand-500 text-warm-900 font-semibold rounded-lg text-sm hover:bg-brand-400 transition-colors">
                  적용
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Inline Search Bar (Booking Page) ───
function InlineSearchBar({
  isBookingMode,
  hotelName,
  selectedRegion,
  setSelectedRegion,
  checkIn,
  checkOut,
  handleDateSelect,
  nights,
  rooms,
  setRooms,
  adults,
  setAdults,
  children,
  setChildren,
  totalGuests,
  handleSearch,
  formatDateShort,
  activeDropdown,
  toggleDropdown,
  closeDropdown,
}: {
  isBookingMode: boolean;
  hotelName?: string;
  selectedRegion: (typeof REGIONS)[number];
  setSelectedRegion: (r: (typeof REGIONS)[number]) => void;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  handleDateSelect: (ci: Date | undefined, co: Date | undefined) => void;
  nights: number;
  rooms: number;
  setRooms: (v: number) => void;
  adults: number;
  setAdults: (v: number) => void;
  children: number;
  setChildren: (v: number) => void;
  totalGuests: number;
  handleSearch: () => void;
  formatDateShort: (d: Date | undefined) => string;
  activeDropdown: DropdownType;
  toggleDropdown: (type: DropdownType) => void;
  closeDropdown: () => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  useClickOutside(barRef, closeDropdown);

  return (
    <div className="w-full bg-warm-100/60 border-y border-warm-200/40">
      <div ref={barRef} className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 relative">
        {/* Desktop */}
        <div className="hidden md:flex items-center justify-center h-[56px] gap-5">
          {/* Region */}
          {isBookingMode ? (
            <div className="flex items-center gap-2.5 shrink-0">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="text-warm-900 text-[13px] font-medium truncate">{hotelName || "선택된 호텔"}</span>
            </div>
          ) : (
            <button
              onClick={() => toggleDropdown("region")}
              className="flex items-center gap-2.5 shrink-0 cursor-pointer text-left"
            >
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <span className="text-warm-900 text-[13px] font-medium">
                {selectedRegion.name}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-warm-400 shrink-0 transition-transform ${activeDropdown === "region" ? "rotate-180" : ""}`} />
            </button>
          )}

          {/* Check-in */}
          <button
            onClick={() => toggleDropdown("calendar")}
            className="flex items-center gap-2.5 shrink-0 cursor-pointer text-left"
          >
            <CalendarDays className="w-4 h-4 text-brand-600 shrink-0" />
            <div>
              <p className="text-[10px] text-warm-400 tracking-[0.12em] uppercase leading-none mb-1">체크인</p>
              <p className="text-warm-900 text-[13px] font-medium">{formatDateShort(checkIn)}</p>
            </div>
          </button>

          {/* Nights Badge */}
          {nights > 0 && (
            <button
              onClick={() => toggleDropdown("calendar")}
              className="flex items-center justify-center shrink-0 cursor-pointer"
            >
              <span className="bg-brand-500/15 border border-brand-500/20 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-full">{nights}박</span>
            </button>
          )}

          {/* Check-out */}
          <button
            onClick={() => toggleDropdown("calendar")}
            className="flex items-center gap-2.5 shrink-0 cursor-pointer text-left"
          >
            <CalendarDays className="w-4 h-4 text-brand-600 shrink-0" />
            <div>
              <p className="text-[10px] text-warm-400 tracking-[0.12em] uppercase leading-none mb-1">체크아웃</p>
              <p className="text-warm-900 text-[13px] font-medium">{formatDateShort(checkOut)}</p>
            </div>
          </button>

          {/* Guests */}
          <button
            onClick={() => toggleDropdown("guest")}
            className="flex items-center gap-2.5 shrink-0 cursor-pointer text-left"
          >
            <Users className="w-4 h-4 text-brand-600 shrink-0" />
            <div>
              <p className="text-[10px] text-warm-400 tracking-[0.12em] uppercase leading-none mb-1">객실 · 인원</p>
              <p className="text-warm-900 text-[13px] font-medium">{rooms}실 · {totalGuests}명</p>
            </div>
          </button>

          {/* Search */}
          <button
            onClick={handleSearch}
            className="flex items-center gap-1.5 h-9 px-6 bg-brand-500 text-warm-900 font-semibold rounded-full active:scale-[0.97] text-[13px] tracking-wide shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isBookingMode ? "객실 보기" : "검색"}</span>
          </button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden flex-col gap-2 py-3">
          <div className="flex gap-2">
            {isBookingMode ? (
              <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-warm-200/60">
                <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span className="text-warm-900 text-xs font-medium truncate">{hotelName || "선택된 호텔"}</span>
              </div>
            ) : (
              <button
                onClick={() => toggleDropdown("region")}
                className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-warm-200/60 cursor-pointer text-left"
              >
                <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span className="text-warm-900 text-xs font-medium truncate">{selectedRegion.name}</span>
                <ChevronDown className="w-3 h-3 text-warm-400 shrink-0 ml-auto" />
              </button>
            )}

            <button
              onClick={() => toggleDropdown("guest")}
              className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-warm-200/60 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="text-warm-900 text-xs font-medium">{rooms}실 · {totalGuests}명</span>
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => toggleDropdown("calendar")}
              className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-warm-200/60 cursor-pointer"
            >
              <CalendarDays className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="text-warm-900 text-xs font-medium">{formatDateShort(checkIn)}</span>
              {nights > 0 && (
                <span className="bg-brand-500/15 border border-brand-500/20 text-brand-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">{nights}박</span>
              )}
              <ArrowRight className="w-3 h-3 text-warm-300 shrink-0" />
              <span className="text-warm-900 text-xs font-medium">{formatDateShort(checkOut)}</span>
            </button>

            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-500 text-warm-900 font-semibold rounded-lg text-xs tracking-wide active:scale-[0.97] whitespace-nowrap"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isBookingMode ? "객실 보기" : "검색"}</span>
            </button>
          </div>
        </div>

        {/* ── Dropdown Panels (positioned below bar) ── */}
        {activeDropdown === "region" && (
          <div className="absolute top-full mt-2 left-5 md:left-8 lg:left-12 z-50 w-44 rounded-xl border border-warm-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)] py-1.5 animate-fade-in">
            {REGIONS.map((region) => (
              <button
                key={region.id || "all"}
                onClick={() => { setSelectedRegion(region); closeDropdown(); }}
                className={`w-full flex items-center justify-between px-4 py-2 text-left hover:bg-warm-50 transition-colors ${
                  selectedRegion.id === region.id ? "bg-brand-500/5" : ""
                }`}
              >
                <span className="text-sm text-warm-900">{region.name}</span>
                {selectedRegion.id === region.id && <Check className="w-4 h-4 text-brand-600 shrink-0" />}
              </button>
            ))}
          </div>
        )}

        {activeDropdown === "calendar" && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-warm-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)] animate-fade-in">
            <BookingCalendar
              checkIn={checkIn}
              checkOut={checkOut}
              onSelect={handleDateSelect}
              months={typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 2}
            />
          </div>
        )}

        {activeDropdown === "guest" && (
          <div className="absolute top-full mt-2 right-5 md:right-8 lg:right-12 z-50 w-80 rounded-xl border border-warm-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)] animate-fade-in">
            <div className="p-5 space-y-4">
              <GuestCounter label="객실" icon={<BedDouble className="w-4 h-4 text-warm-400" />} value={rooms} min={1} max={5} onChange={setRooms} />
              <div className="h-px bg-warm-100" />
              <GuestCounter label="성인" description="만 13세 이상" value={adults} min={1} max={6} onChange={setAdults} />
              <div className="h-px bg-warm-100" />
              <GuestCounter label="아동" description="만 2~12세" value={children} min={0} max={4} onChange={setChildren} />
              <p className="text-warm-400 text-[11px] leading-relaxed pt-1">기준인원 초과 시 추가 요금이 발생할 수 있습니다.</p>
            </div>
            <div className="border-t border-warm-100 px-5 py-3">
              <button onClick={closeDropdown} className="w-full py-2.5 bg-brand-500 text-warm-900 font-semibold rounded-lg text-sm hover:bg-brand-400 transition-colors">
                적용
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GuestCounter({
  label, description, icon, value, min, max, onChange,
}: {
  label: string; description?: string; icon?: React.ReactNode;
  value: number; min: number; max: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        {icon}
        <div>
          <p className="text-warm-900 text-sm font-medium">{label}</p>
          {description && <p className="text-warm-400 text-xs">{description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border border-warm-200 flex items-center justify-center text-warm-500 hover:border-brand-500 hover:text-brand-700 transition-colors disabled:opacity-30"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-warm-900 text-sm font-semibold w-5 text-center tabular-nums">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border border-warm-200 flex items-center justify-center text-warm-500 hover:border-brand-500 hover:text-brand-700 transition-colors disabled:opacity-30"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
