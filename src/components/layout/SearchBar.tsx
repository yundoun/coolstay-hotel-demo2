"use client";

import { useState } from "react";
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
} from "lucide-react";
import { addDays, format, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  const [regionOpen, setRegionOpen] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    addDays(new Date(), 7)
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    addDays(new Date(), 8)
  );
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);

  const totalGuests = adults + children;
  const nights =
    checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;

  const handleDateSelect = (ci: Date | undefined, co: Date | undefined) => {
    setCheckIn(ci);
    setCheckOut(co);
    if (ci && co) setCalendarOpen(false);
  };

  const handleSearch = () => {
    if (mode === "booking" && hotelId) {
      // 호텔 상세에서: 같은 페이지의 객실 섹션으로 스크롤
      const roomsSection = document.getElementById("rooms");
      if (roomsSection) {
        roomsSection.scrollIntoView({ behavior: "smooth" });
      }
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
  const popoverSide = isInline ? "bottom" : "top";

  return (
    <div className={isInline ? "w-full" : "fixed bottom-0 left-0 right-0 z-40"}>
      <div className={isInline
        ? "bg-[#e8e4e0] border-y border-warm-200/50"
        : "bg-white/40 backdrop-blur-xl border-t border-white/30 shadow-[0_-8px_32px_rgba(0,0,0,0.08)]"
      }>
        <div className={isInline ? "max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-5" : "max-w-4xl mx-auto px-4 md:px-6 py-3 md:py-3.5"}>
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Region Picker (search mode) / Hotel Name (booking mode) */}
            {isBookingMode ? (
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-warm-50/80 rounded-lg border border-warm-200/60 min-w-[160px]">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <p className="text-[10px] text-warm-400 tracking-[0.15em] uppercase mb-0.5">
                    호텔
                  </p>
                  <p className="text-warm-900 text-sm font-medium truncate">
                    {hotelName || "선택된 호텔"}
                  </p>
                </div>
              </div>
            ) : (
              <Popover open={regionOpen} onOpenChange={setRegionOpen}>
                <PopoverTrigger className="flex items-center gap-2.5 px-4 py-2.5 bg-warm-50/80 rounded-lg border border-warm-200/60 cursor-pointer hover:border-warm-300 transition-colors min-w-[140px]">
                  <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-[10px] text-warm-400 tracking-[0.15em] uppercase mb-0.5">
                      지역
                    </p>
                    <p className="text-warm-900 text-sm font-medium truncate">
                      {selectedRegion.name}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-warm-400 shrink-0" />
                </PopoverTrigger>
                <PopoverContent
                  side={popoverSide}
                  sideOffset={12}
                  align="start"
                  className="w-48 p-0 rounded-lg border border-warm-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
                >
                  <div className="py-1.5">
                    {REGIONS.map((region) => (
                      <button
                        key={region.id || "all"}
                        onClick={() => {
                          setSelectedRegion(region);
                          setRegionOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2 text-left hover:bg-warm-50 transition-colors ${
                          selectedRegion.id === region.id ? "bg-brand-500/5" : ""
                        }`}
                      >
                        <span className="text-sm text-warm-900">{region.name}</span>
                        {selectedRegion.id === region.id && (
                          <Check className="w-4 h-4 text-brand-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Date Picker */}
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger className="flex items-center gap-0 bg-warm-50/80 rounded-lg border border-warm-200/60 overflow-hidden cursor-pointer hover:border-warm-300 transition-colors">
                <div className="flex items-center gap-2.5 px-4 py-2.5">
                  <CalendarDays className="w-4 h-4 text-brand-600 shrink-0" />
                  <div className="text-left">
                    <p className="text-[10px] text-warm-400 tracking-[0.15em] uppercase mb-0.5">
                      체크인
                    </p>
                    <p className="text-warm-900 text-sm font-medium">
                      {formatDateShort(checkIn)}
                    </p>
                  </div>
                </div>

                {nights > 0 && (
                  <div className="px-2 flex items-center">
                    <span className="text-brand-700 text-[11px] font-semibold bg-brand-500/10 px-2.5 py-0.5 rounded-full">
                      {nights}박
                    </span>
                  </div>
                )}

                <div className="w-px h-8 bg-warm-200/60" />

                <div className="flex items-center gap-2.5 px-4 py-2.5">
                  <CalendarDays className="w-4 h-4 text-brand-600 shrink-0" />
                  <div className="text-left">
                    <p className="text-[10px] text-warm-400 tracking-[0.15em] uppercase mb-0.5">
                      체크아웃
                    </p>
                    <p className="text-warm-900 text-sm font-medium">
                      {formatDateShort(checkOut)}
                    </p>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent
                side={popoverSide}
                sideOffset={12}
                align="center"
                className="w-auto p-0 rounded-lg border border-warm-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
              >
                <BookingCalendar
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onSelect={handleDateSelect}
                  months={2}
                />
              </PopoverContent>
            </Popover>

            {/* Guest & Room Picker */}
            <Popover open={guestOpen} onOpenChange={setGuestOpen}>
              <PopoverTrigger className="flex items-center gap-2.5 px-4 py-2.5 bg-warm-50/80 rounded-lg border border-warm-200/60 cursor-pointer hover:border-warm-300 transition-colors">
                <Users className="w-4 h-4 text-brand-600 shrink-0" />
                <div className="text-left">
                  <p className="text-[10px] text-warm-400 tracking-[0.15em] uppercase mb-0.5">
                    객실 · 인원
                  </p>
                  <p className="text-warm-900 text-sm font-medium">
                    {rooms}실 · {totalGuests}명
                  </p>
                </div>
              </PopoverTrigger>
              <PopoverContent
                side={popoverSide}
                sideOffset={12}
                align="end"
                className="w-80 p-0 rounded-lg border border-warm-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
              >
                <div className="p-5 space-y-4">
                  <GuestCounter
                    label="객실"
                    icon={<BedDouble className="w-4 h-4 text-warm-400" />}
                    value={rooms}
                    min={1}
                    max={5}
                    onChange={setRooms}
                  />
                  <div className="h-px bg-warm-100" />
                  <GuestCounter
                    label="성인"
                    description="만 13세 이상"
                    value={adults}
                    min={1}
                    max={6}
                    onChange={setAdults}
                  />
                  <div className="h-px bg-warm-100" />
                  <GuestCounter
                    label="아동"
                    description="만 2~12세"
                    value={children}
                    min={0}
                    max={4}
                    onChange={setChildren}
                  />
                  <p className="text-warm-400 text-[11px] leading-relaxed pt-1">
                    기준인원 초과 시 추가 요금이 발생할 수 있습니다.
                  </p>
                </div>
                <div className="border-t border-warm-100 px-5 py-3">
                  <button
                    onClick={() => setGuestOpen(false)}
                    className="w-full py-2.5 bg-brand-500 text-warm-900 font-semibold rounded-lg text-sm hover:bg-brand-400 transition-colors"
                  >
                    적용
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Action Button */}
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-warm-900 font-semibold rounded-lg hover:bg-brand-400 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(255,198,0,0.4)] active:scale-[0.98] text-sm tracking-wide whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span>{isBookingMode ? "객실 보기" : "검색"}</span>
            </button>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden flex-col gap-2.5">
            {/* Region (search) / Hotel (booking) - Mobile */}
            {isBookingMode ? (
              <div className="flex items-center gap-2 bg-warm-50/80 rounded-lg px-3 py-2.5 border border-warm-200/60">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                <div className="text-left flex-1 min-w-0">
                  <p className="text-[9px] text-warm-400 tracking-wider uppercase">호텔</p>
                  <p className="text-warm-900 text-xs font-medium truncate">{hotelName || "선택된 호텔"}</p>
                </div>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger className="flex items-center gap-2 bg-warm-50/80 rounded-lg px-3 py-2.5 border border-warm-200/60 cursor-pointer">
                  <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-[9px] text-warm-400 tracking-wider uppercase">지역</p>
                    <p className="text-warm-900 text-xs font-medium truncate">{selectedRegion.name}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-warm-400 shrink-0" />
                </PopoverTrigger>
                <PopoverContent
                  side={popoverSide}
                  sideOffset={8}
                  className="w-44 p-0 rounded-lg border border-warm-200 bg-white"
                >
                  <div className="py-1.5">
                    {REGIONS.map((region) => (
                      <button
                        key={region.id || "all"}
                        onClick={() => setSelectedRegion(region)}
                        className={`w-full flex items-center justify-between px-4 py-2 text-left hover:bg-warm-50 transition-colors ${
                          selectedRegion.id === region.id ? "bg-brand-500/5" : ""
                        }`}
                      >
                        <span className="text-xs text-warm-900">{region.name}</span>
                        {selectedRegion.id === region.id && (
                          <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <div className="flex gap-2 items-center">
              <Popover>
                <PopoverTrigger className="flex-1 flex items-center gap-2 bg-warm-50/80 rounded-lg px-3 py-2.5 border border-warm-200/60 cursor-pointer">
                  <CalendarDays className="w-4 h-4 text-brand-600 shrink-0" />
                  <div className="text-left min-w-0">
                    <p className="text-[9px] text-warm-400 tracking-wider uppercase">체크인</p>
                    <p className="text-warm-900 text-xs font-medium truncate">{formatDateShort(checkIn)}</p>
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  side={popoverSide}
                  sideOffset={8}
                  className="w-auto p-0 rounded-lg border border-warm-200 bg-white"
                >
                  <BookingCalendar
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onSelect={handleDateSelect}
                    months={1}
                  />
                </PopoverContent>
              </Popover>

              {nights > 0 && (
                <span className="text-brand-700 text-[10px] font-semibold bg-brand-500/10 px-2 py-0.5 rounded-full shrink-0">
                  {nights}박
                </span>
              )}

              <div className="flex-1 flex items-center gap-2 bg-warm-50/80 rounded-lg px-3 py-2.5 border border-warm-200/60">
                <CalendarDays className="w-4 h-4 text-brand-600 shrink-0" />
                <div className="text-left min-w-0">
                  <p className="text-[9px] text-warm-400 tracking-wider uppercase">체크아웃</p>
                  <p className="text-warm-900 text-xs font-medium truncate">{formatDateShort(checkOut)}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger className="flex items-center gap-2 bg-warm-50/80 rounded-lg px-3 py-2.5 border border-warm-200/60 cursor-pointer">
                  <Users className="w-4 h-4 text-brand-600 shrink-0" />
                  <div className="text-left">
                    <p className="text-[9px] text-warm-400 tracking-wider uppercase">객실 · 인원</p>
                    <p className="text-warm-900 text-xs font-medium">{rooms}실 · {totalGuests}명</p>
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  side={popoverSide}
                  sideOffset={8}
                  className="w-72 p-0 rounded-lg border border-warm-200 bg-white"
                >
                  <div className="p-4 space-y-3">
                    <GuestCounter label="객실" icon={<BedDouble className="w-4 h-4 text-warm-400" />} value={rooms} min={1} max={5} onChange={setRooms} />
                    <div className="h-px bg-warm-100" />
                    <GuestCounter label="성인" description="만 13세 이상" value={adults} min={1} max={6} onChange={setAdults} />
                    <div className="h-px bg-warm-100" />
                    <GuestCounter label="아동" description="만 2~12세" value={children} min={0} max={4} onChange={setChildren} />
                  </div>
                  <div className="border-t border-warm-100 px-4 py-3">
                    <button className="w-full py-2 bg-brand-500 text-warm-900 font-semibold rounded-lg text-xs hover:bg-brand-400 transition-colors">
                      적용
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              <button
                onClick={handleSearch}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-500 text-warm-900 font-semibold rounded-lg text-xs tracking-wide active:scale-[0.98]"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isBookingMode ? "객실 보기" : "검색"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuestCounter({
  label,
  description,
  icon,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
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
        <span className="text-warm-900 text-sm font-semibold w-5 text-center tabular-nums">
          {value}
        </span>
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
