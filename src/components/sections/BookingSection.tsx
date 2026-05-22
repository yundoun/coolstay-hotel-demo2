"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Users,
  Minus,
  Plus,
  BedDouble,
  Check,
  Maximize,
  CreditCard,
  Shield,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { addDays, format, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import BookingCalendar from "@/components/layout/BookingCalendar";
import type { Room } from "@/domain/entities";
import type { HotelConfig } from "@/config/hotel";

interface Props {
  hotelConfig: HotelConfig;
  preselectedRoomId?: string;
}

type BookingStep = "select" | "confirm";
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

export default function BookingSection({ hotelConfig, preselectedRoomId }: Props) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);

  // Booking state
  const [step, setStep] = useState<BookingStep>("select");
  const [checkIn, setCheckIn] = useState<Date | undefined>(addDays(new Date(), 7));
  const [checkOut, setCheckOut] = useState<Date | undefined>(addDays(new Date(), 8));
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);

  // Form state
  const [form, setForm] = useState({ guestName: "", guestPhone: "", guestEmail: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalGuests = adults + children;
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;

  // Preselect room from rooms section
  useEffect(() => {
    if (preselectedRoomId) {
      const room = hotelConfig.rooms.find((r) => r.id === preselectedRoomId);
      if (room) setSelectedRoom(room);
    }
  }, [preselectedRoomId, hotelConfig.rooms]);

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

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
    setStep("confirm");
    // Scroll to top of booking section
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleBack = () => {
    setStep("select");
    setSelectedRoom(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !checkIn || !checkOut) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const totalPrice = selectedRoom.price * nights;
    const params = new URLSearchParams({
      hotelName: hotelConfig.name,
      roomName: selectedRoom.name,
      roomImage: selectedRoom.images[0],
      checkIn: format(checkIn, "yyyy-MM-dd"),
      checkOut: format(checkOut, "yyyy-MM-dd"),
      guests: totalGuests.toString(),
      totalPrice: totalPrice.toString(),
      guestName: form.guestName,
      bookingId: `BK-${Date.now()}`,
    });
    router.push(`/booking/complete?${params.toString()}`);
  };

  return (
    <section
      id="booking"
      ref={sectionRef}
      className="relative py-24 md:py-32 lg:py-40 bg-[var(--warm-50)]"
    >

      <div className="relative max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="w-8 md:w-10 h-px bg-warm-400" />
            <p className="text-warm-900 text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-medium">
              Reservation
            </p>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-[2.25rem] text-warm-900 font-light leading-snug tracking-tight">
            온라인 예약
          </h2>
        </div>

        {/* Date & Guest Selector Bar */}
        <div
          ref={controlRef}
          className="relative bg-white border border-warm-200/60 rounded-sm p-4 md:p-0 mb-10"
        >
          {/* Desktop */}
          <div className="hidden md:flex items-center h-[64px] divide-x divide-warm-200/40">
            {/* Check-in */}
            <button
              onClick={() => toggleDropdown("calendar")}
              className="flex-1 flex items-center gap-3 px-6 h-full cursor-pointer text-left hover:bg-warm-50/50 transition-colors"
            >
              <CalendarDays className="w-[18px] h-[18px] text-warm-500 shrink-0" />
              <div>
                <p className="text-[10px] text-warm-400 tracking-[0.12em] uppercase leading-none mb-1">체크인</p>
                <p className="text-warm-900 text-[14px] font-medium">{formatDateShort(checkIn)}</p>
              </div>
            </button>

            {/* Nights badge */}
            <div className="flex items-center justify-center px-5 h-full">
              <span className="bg-sig-500/15 border border-sig-500/30 text-sig-600 text-xs font-bold px-3 py-1 rounded-full">
                {nights > 0 ? `${nights}박` : "-"}
              </span>
            </div>

            {/* Check-out */}
            <button
              onClick={() => toggleDropdown("calendar")}
              className="flex-1 flex items-center gap-3 px-6 h-full cursor-pointer text-left hover:bg-warm-50/50 transition-colors"
            >
              <CalendarDays className="w-[18px] h-[18px] text-warm-500 shrink-0" />
              <div>
                <p className="text-[10px] text-warm-400 tracking-[0.12em] uppercase leading-none mb-1">체크아웃</p>
                <p className="text-warm-900 text-[14px] font-medium">{formatDateShort(checkOut)}</p>
              </div>
            </button>

            {/* Guests */}
            <button
              onClick={() => toggleDropdown("guest")}
              className="flex-1 flex items-center gap-3 px-6 h-full cursor-pointer text-left hover:bg-warm-50/50 transition-colors"
            >
              <Users className="w-[18px] h-[18px] text-warm-500 shrink-0" />
              <div>
                <p className="text-[10px] text-warm-400 tracking-[0.12em] uppercase leading-none mb-1">객실 &middot; 인원</p>
                <p className="text-warm-900 text-[14px] font-medium">{rooms}실 &middot; {totalGuests}명</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-warm-300 ml-auto transition-transform ${activeDropdown === "guest" ? "rotate-180" : ""}`} />
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
              <span className="bg-sig-500/15 border border-sig-500/30 text-sig-600 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                {nights > 0 ? `${nights}박` : "-"}
              </span>
              <span className="text-warm-900 text-xs font-medium">{formatDateShort(checkOut)}</span>
            </button>

            <button
              onClick={() => toggleDropdown("guest")}
              className="flex items-center gap-2 bg-warm-50 rounded-lg px-3 py-2.5 border border-warm-200/60"
            >
              <Users className="w-4 h-4 text-warm-500 shrink-0" />
              <span className="text-warm-900 text-xs font-medium">{rooms}실 &middot; {totalGuests}명</span>
              <ChevronDown className="w-3.5 h-3.5 text-warm-400 ml-auto" />
            </button>
          </div>

          {/* Dropdowns */}
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
            <div className="absolute top-full mt-2 right-0 md:right-4 z-50 w-80 rounded-xl border border-warm-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)] animate-fade-in">
              <div className="p-5 space-y-4">
                <GuestCounter label="객실" icon={<BedDouble className="w-4 h-4 text-warm-400" />} value={rooms} min={1} max={5} onChange={setRooms} />
                <div className="h-px bg-warm-100" />
                <GuestCounter label="성인" description="만 13세 이상" value={adults} min={1} max={6} onChange={setAdults} />
                <div className="h-px bg-warm-100" />
                <GuestCounter label="아동" description="만 2~12세" value={children} min={0} max={4} onChange={setChildren} />
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

        {/* Step Content */}
        {step === "select" && (
          <RoomSelectStep
            rooms={hotelConfig.rooms}
            nights={nights}
            onSelect={handleSelectRoom}
          />
        )}

        {step === "confirm" && selectedRoom && (
          <ConfirmStep
            hotel={hotelConfig}
            room={selectedRoom}
            checkIn={checkIn}
            checkOut={checkOut}
            nights={nights}
            guests={totalGuests}
            form={form}
            setForm={setForm}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onBack={handleBack}
            formatDateShort={formatDateShort}
          />
        )}
      </div>
    </section>
  );
}

/* ─── Room Select Step ─── */
function RoomSelectStep({
  rooms,
  nights,
  onSelect,
}: {
  rooms: Room[];
  nights: number;
  onSelect: (room: Room) => void;
}) {
  return (
    <div className="space-y-5">
      <p className="text-warm-500 text-sm mb-2">
        객실을 선택하시면 예약 정보를 입력하실 수 있습니다.
      </p>
      {rooms.map((room) => {
        const totalPrice = room.price * (nights || 1);
        return (
          <div
            key={room.id}
            className="flex flex-col md:flex-row bg-white border border-warm-200/50 rounded-sm overflow-hidden hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] transition-all duration-500 group"
          >
            {/* Image */}
            <div className="relative h-48 md:h-auto md:w-72 shrink-0 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                style={{ backgroundImage: `url(${room.images[0]})` }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 p-5 md:p-7 flex flex-col justify-between">
              <div>
                <h3 className="text-lg text-warm-900 font-medium mb-2">{room.name}</h3>
                <div className="flex items-center gap-5 text-warm-500 text-sm mb-3">
                  <div className="flex items-center gap-1.5">
                    <Maximize className="w-3.5 h-3.5" />
                    <span>{room.size}m&sup2;</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>최대 {room.maxCapacity}인</span>
                  </div>
                  <span>{room.bedType} 베드</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {room.amenities.slice(0, 4).map((a) => (
                    <span key={a} className="flex items-center gap-1 text-warm-600 text-xs">
                      <Check className="w-3 h-3 text-warm-500" />
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-end justify-between mt-5 pt-5 border-t border-warm-100">
                <div>
                  {room.originalPrice && (
                    <p className="text-warm-300 text-sm line-through">
                      {(room.originalPrice * (nights || 1)).toLocaleString()}원
                    </p>
                  )}
                  <p className="text-warm-900 text-xl font-bold">
                    {totalPrice.toLocaleString()}
                    <span className="text-sm text-warm-400 font-sans ml-1">
                      원{nights > 0 ? ` / ${nights}박` : " / 1박"}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => onSelect(room)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-sig-500 text-warm-900 font-semibold rounded-sm hover:bg-sig-400 transition-all duration-300 active:scale-[0.98] text-sm"
                >
                  선택하기
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Confirm Step ─── */
function ConfirmStep({
  hotel,
  room,
  checkIn,
  checkOut,
  nights,
  guests,
  form,
  setForm,
  isSubmitting,
  onSubmit,
  onBack,
  formatDateShort,
}: {
  hotel: HotelConfig;
  room: Room;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  nights: number;
  guests: number;
  form: { guestName: string; guestPhone: string; guestEmail: string };
  setForm: (f: { guestName: string; guestPhone: string; guestEmail: string }) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  formatDateShort: (d: Date | undefined) => string;
}) {
  const totalPrice = room.price * nights;

  return (
    <div>
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-warm-500 text-sm mb-6 hover:text-warm-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        객실 다시 선택
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
        {/* Form */}
        <div className="lg:col-span-3">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Selected room summary */}
            <div className="bg-white border border-warm-200/50 rounded-sm p-5 flex gap-4">
              <div
                className="w-24 h-24 rounded-sm bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url(${room.images[0]})` }}
              />
              <div>
                <p className="text-warm-900 font-medium mb-1">{room.name}</p>
                <div className="flex items-center gap-4 text-warm-500 text-xs">
                  <span>{room.size}m&sup2;</span>
                  <span>최대 {room.maxCapacity}인</span>
                  <span>{room.bedType} 베드</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="flex items-center gap-1.5 text-warm-600 bg-warm-50 px-2 py-1 rounded">
                    <CalendarDays className="w-3 h-3 text-warm-500" />
                    {formatDateShort(checkIn)} ~ {formatDateShort(checkOut)} ({nights}박)
                  </span>
                  <span className="flex items-center gap-1.5 text-warm-600 bg-warm-50 px-2 py-1 rounded">
                    <Users className="w-3 h-3 text-warm-500" />
                    {guests}명
                  </span>
                </div>
              </div>
            </div>

            {/* Guest info */}
            <div className="bg-white border border-warm-200/50 rounded-sm p-5 md:p-7">
              <h3 className="text-warm-900 text-lg font-medium mb-5">투숙객 정보</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-warm-500 text-[10px] tracking-[0.2em] uppercase mb-2">이름</label>
                  <input
                    type="text"
                    required
                    value={form.guestName}
                    onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                    className="w-full bg-warm-50 border border-warm-200 rounded-sm px-4 py-3 text-warm-900 placeholder:text-warm-300 focus:border-sig-500 focus:outline-none transition-colors"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-warm-500 text-[10px] tracking-[0.2em] uppercase mb-2">연락처</label>
                  <input
                    type="tel"
                    required
                    value={form.guestPhone}
                    onChange={(e) => setForm({ ...form, guestPhone: e.target.value })}
                    className="w-full bg-warm-50 border border-warm-200 rounded-sm px-4 py-3 text-warm-900 placeholder:text-warm-300 focus:border-sig-500 focus:outline-none transition-colors"
                    placeholder="010-1234-5678"
                  />
                </div>
                <div>
                  <label className="block text-warm-500 text-[10px] tracking-[0.2em] uppercase mb-2">이메일</label>
                  <input
                    type="email"
                    required
                    value={form.guestEmail}
                    onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
                    className="w-full bg-warm-50 border border-warm-200 rounded-sm px-4 py-3 text-warm-900 placeholder:text-warm-300 focus:border-sig-500 focus:outline-none transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white border border-warm-200/50 rounded-sm p-5 md:p-7">
              <h3 className="text-warm-900 text-lg font-medium mb-5 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-warm-500" />
                결제 정보
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-warm-500 text-[10px] tracking-[0.2em] uppercase mb-2">카드 번호</label>
                  <input
                    type="text"
                    className="w-full bg-warm-50 border border-warm-200 rounded-sm px-4 py-3 text-warm-900 placeholder:text-warm-300 focus:border-sig-500 focus:outline-none transition-colors"
                    placeholder="0000 0000 0000 0000"
                    defaultValue="4242 4242 4242 4242"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-warm-500 text-[10px] tracking-[0.2em] uppercase mb-2">유효기간</label>
                    <input
                      type="text"
                      className="w-full bg-warm-50 border border-warm-200 rounded-sm px-4 py-3 text-warm-900 placeholder:text-warm-300 focus:border-sig-500 focus:outline-none transition-colors"
                      placeholder="MM/YY"
                      defaultValue="12/28"
                    />
                  </div>
                  <div>
                    <label className="block text-warm-500 text-[10px] tracking-[0.2em] uppercase mb-2">CVC</label>
                    <input
                      type="text"
                      className="w-full bg-warm-50 border border-warm-200 rounded-sm px-4 py-3 text-warm-900 placeholder:text-warm-300 focus:border-sig-500 focus:outline-none transition-colors"
                      placeholder="000"
                      defaultValue="123"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-warm-400 text-xs">
                <Shield className="w-4 h-4 text-warm-500" />
                <span>모든 결제 정보는 SSL로 암호화되어 안전하게 처리됩니다 (데모)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-sig-500 text-warm-900 font-bold text-lg rounded-sm hover:bg-sig-400 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(255,198,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
            >
              {isSubmitting ? "예약 처리 중..." : `${totalPrice.toLocaleString()}원 결제하기`}
            </button>
          </form>
        </div>

        {/* Sidebar summary */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-28 bg-white border border-warm-200/50 rounded-sm overflow-hidden">
            <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${room.images[0]})` }}
            />
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-warm-900 font-medium text-lg">{hotel.name}</h3>
                <p className="text-warm-500 text-sm">{room.name}</p>
              </div>
              <div className="h-px bg-warm-100" />
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-warm-500">
                    <CalendarDays className="w-4 h-4" />
                    <span>체크인</span>
                  </div>
                  <span className="text-warm-900">{checkIn ? format(checkIn, "yyyy.MM.dd") : "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-warm-500">
                    <CalendarDays className="w-4 h-4" />
                    <span>체크아웃</span>
                  </div>
                  <span className="text-warm-900">{checkOut ? format(checkOut, "yyyy.MM.dd") : "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-warm-500">
                    <Users className="w-4 h-4" />
                    <span>인원</span>
                  </div>
                  <span className="text-warm-900">{guests}명</span>
                </div>
              </div>
              <div className="h-px bg-warm-100" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-warm-500">
                  <span>{room.price.toLocaleString()}원 x {nights}박</span>
                  <span>{totalPrice.toLocaleString()}원</span>
                </div>
                {room.originalPrice && (
                  <div className="flex justify-between text-warm-900">
                    <span>할인</span>
                    <span>-{((room.originalPrice - room.price) * nights).toLocaleString()}원</span>
                  </div>
                )}
              </div>
              <div className="h-px bg-warm-100" />
              <div className="flex justify-between items-center">
                <span className="text-warm-900 font-medium">총 결제금액</span>
                <span className="text-warm-900 text-2xl font-bold">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Guest Counter ─── */
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
