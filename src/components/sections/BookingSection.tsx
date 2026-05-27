"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  CalendarDays,
  Users,
  Minus,
  Plus,
  Maximize,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Phone,
  ShieldCheck,
  Banknote,
  Loader2,
} from "lucide-react";
import { addDays, format, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import BookingCalendar from "@/components/layout/BookingCalendar";
import { useApiRooms } from "@/application/hooks/useApiRooms";
import { usePhoneVerification } from "@/application/hooks/usePhoneVerification";
import { createGuestReservation } from "@/application/services/reservation-api";
import type { ApiRoom } from "@/adapters/coolstay/types";

interface Props {
  storeKey: string;
  storeName: string;
  sitePayment: boolean;
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

export default function BookingSection({ storeKey, storeName, sitePayment }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);

  // Booking state
  const [step, setStep] = useState<BookingStep>("select");
  const [checkIn, setCheckIn] = useState<Date | undefined>(new Date());
  const [checkOut, setCheckOut] = useState<Date | undefined>(addDays(new Date(), 1));
  const [adults, setAdults] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState<ApiRoom | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);

  // Form state
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;

  // API 객실 조회 (날짜 기반 실시간 가격)
  const checkInISO = checkIn ? format(checkIn, "yyyy-MM-dd") : "";
  const checkOutISO = checkOut ? format(checkOut, "yyyy-MM-dd") : "";
  const { storeData, loading: roomsLoading, error: roomsError } = useApiRooms(checkInISO, checkOutISO, nights);

  // 실제 SMS 인증
  const phoneVerify = usePhoneVerification();

  const toggleDropdown = useCallback((type: DropdownType) => {
    setActiveDropdown((prev) => (prev === type ? null : type));
  }, []);

  const closeDropdown = useCallback(() => setActiveDropdown(null), []);
  useClickOutside(controlRef, closeDropdown);

  const handleDateSelect = (ci: Date | undefined, co: Date | undefined) => {
    setCheckIn(ci);
    setCheckOut(co);
    if (ci && co) closeDropdown();
    // 날짜 변경 시 선택 초기화
    setSelectedRoom(null);
    setStep("select");
  };

  const formatDateShort = (date: Date | undefined) => {
    if (!date) return "날짜 선택";
    return format(date, "M.dd (EEE)", { locale: ko });
  };

  const handleSelectRoom = (room: ApiRoom) => {
    setSelectedRoom(room);
    setStep("confirm");
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleBack = () => {
    setStep("select");
    setSelectedRoom(null);
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !checkIn || !checkOut) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createGuestReservation({
        hotelId: storeData?.motelKey || storeKey,
        roomId: selectedRoom.packageKey,
        checkIn: checkInISO,
        checkOut: checkOutISO,
        guestName,
        guestPhone,
        totalPrice: selectedRoom.price,
        basePrice: selectedRoom.price,
        checkInTime: selectedRoom.checkInTime,
        checkOutTime: selectedRoom.checkOutTime,
      });

      // 예약 완료 페이지로 이동
      const params = new URLSearchParams({
        hotelName: storeName,
        roomName: selectedRoom.name,
        roomImage: selectedRoom.image || "",
        checkIn: checkInISO,
        checkOut: checkOutISO,
        guests: adults.toString(),
        totalPrice: selectedRoom.price.toString(),
        guestName,
        bookingId: result.bookId,
      });
      window.location.href = `/booking/complete?${params.toString()}`;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "예약 중 오류가 발생했습니다.");
      setIsSubmitting(false);
    }
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

        {/* Step Content */}
        {step === "select" && (
          <RoomSelectStep
            rooms={storeData?.rooms ?? []}
            loading={roomsLoading}
            error={roomsError}
            nights={nights}
            onSelect={handleSelectRoom}
          />
        )}

        {step === "confirm" && selectedRoom && (
          <ConfirmStep
            storeName={storeName}
            room={selectedRoom}
            checkIn={checkIn}
            checkOut={checkOut}
            nights={nights}
            guests={adults}
            guestName={guestName}
            setGuestName={setGuestName}
            guestPhone={guestPhone}
            setGuestPhone={setGuestPhone}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onSubmit={handleSubmit}
            onBack={handleBack}
            formatDateShort={formatDateShort}
            phoneVerify={phoneVerify}
            sitePayment={sitePayment}
          />
        )}
      </div>
    </section>
  );
}

/* ─── Room Select Step ─── */
function RoomSelectStep({
  rooms,
  loading,
  error,
  nights,
  onSelect,
}: {
  rooms: ApiRoom[];
  loading: boolean;
  error: string | null;
  nights: number;
  onSelect: (room: ApiRoom) => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-warm-400 animate-spin mr-3" />
        <span className="text-warm-500 text-sm">객실 정보를 조회 중입니다...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-warm-500 text-sm">{error}</p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-warm-500 text-sm">선택하신 날짜에 예약 가능한 객실이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-warm-500 text-sm mb-2">
        객실을 선택하시면 예약 정보를 입력하실 수 있습니다.
      </p>
      {rooms.map((room) => (
        <div
          key={room.packageKey}
          className="flex flex-col md:flex-row bg-white border border-warm-200/50 rounded-sm overflow-hidden hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] transition-all duration-500 group"
        >
          {/* Image */}
          <div className="relative h-48 md:h-auto md:w-72 shrink-0 overflow-hidden">
            {room.image ? (
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                style={{ backgroundImage: `url(${room.image})` }}
              />
            ) : (
              <div className="absolute inset-0 bg-warm-200 flex items-center justify-center">
                <span className="text-warm-400 text-sm">이미지 없음</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 p-5 md:p-7 flex flex-col justify-between">
            <div>
              <h3 className="text-lg text-warm-900 font-medium mb-2">{room.name}</h3>
              <div className="flex items-center gap-5 text-warm-500 text-sm mb-3">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>최대 {room.maxGuests}인</span>
                </div>
                {room.checkInTime && (
                  <span>체크인 {room.checkInTime}시</span>
                )}
              </div>
              {room.dailyPrices.length > 1 && (
                <div className="flex flex-wrap gap-1.5 text-xs text-warm-400">
                  {room.dailyPrices.map((p, i) => (
                    <span key={i} className="bg-warm-50 px-2 py-0.5 rounded">
                      {i + 1}박: {p.toLocaleString()}원
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-end justify-between mt-5 pt-5 border-t border-warm-100">
              <div>
                <p className="text-warm-900 text-xl font-bold">
                  {room.price.toLocaleString()}
                  <span className="text-sm text-warm-400 font-sans ml-1">
                    원{nights > 0 ? ` / ${nights}박` : ""}
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
      ))}
    </div>
  );
}

/* ─── Confirm Step ─── */
function ConfirmStep({
  storeName,
  room,
  checkIn,
  checkOut,
  nights,
  guests,
  guestName,
  setGuestName,
  guestPhone,
  setGuestPhone,
  isSubmitting,
  submitError,
  onSubmit,
  onBack,
  formatDateShort,
  phoneVerify,
  sitePayment,
}: {
  storeName: string;
  room: ApiRoom;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  nights: number;
  guests: number;
  guestName: string;
  setGuestName: (v: string) => void;
  guestPhone: string;
  setGuestPhone: (v: string) => void;
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  formatDateShort: (d: Date | undefined) => string;
  phoneVerify: ReturnType<typeof usePhoneVerification>;
  sitePayment: boolean;
}) {
  const isVerified = phoneVerify.status === "verified";

  return (
    <div>
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
              {room.image && (
                <div
                  className="w-24 h-24 rounded-sm bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url(${room.image})` }}
                />
              )}
              <div>
                <p className="text-warm-900 font-medium mb-1">{room.name}</p>
                <div className="flex items-center gap-4 text-warm-500 text-xs">
                  <span>최대 {room.maxGuests}인</span>
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
              <h3 className="text-warm-900 text-lg font-medium mb-5">예약자 정보</h3>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-warm-500 text-[10px] tracking-[0.2em] uppercase mb-2">이름</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-warm-50 border border-warm-200 rounded-sm px-4 py-3 text-warm-900 placeholder:text-warm-300 focus:border-sig-500 focus:outline-none transition-colors"
                    placeholder="홍길동"
                  />
                </div>

                {/* Phone + Send code */}
                <div>
                  <label className="block text-warm-500 text-[10px] tracking-[0.2em] uppercase mb-2">휴대폰 번호</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        disabled={isVerified}
                        className="w-full bg-warm-50 border border-warm-200 rounded-sm pl-10 pr-4 py-3 text-warm-900 placeholder:text-warm-300 focus:border-sig-500 focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        placeholder="01012345678"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => phoneVerify.send(guestPhone)}
                      disabled={isVerified || phoneVerify.status === "sending" || !guestPhone || guestPhone.replace(/[^0-9]/g, "").length < 10}
                      className="shrink-0 px-5 py-3 bg-warm-800 text-white text-sm font-medium rounded-sm hover:bg-warm-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {phoneVerify.status === "idle" && "인증번호 발송"}
                      {phoneVerify.status === "sending" && "발송 중..."}
                      {(phoneVerify.status === "sent" || phoneVerify.status === "expired") && "재발송"}
                      {phoneVerify.status === "verifying" && "확인 중..."}
                      {isVerified && "인증완료"}
                    </button>
                  </div>
                </div>

                {/* Verification code input */}
                {(phoneVerify.status === "sent" || phoneVerify.status === "expired") && (
                  <VerifyCodeInput phoneVerify={phoneVerify} guestPhone={guestPhone} />
                )}

                {/* Verified badge */}
                {isVerified && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 rounded-sm px-4 py-3 animate-fade-in">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 text-sm font-medium">휴대폰 인증이 완료되었습니다</span>
                  </div>
                )}

                {/* Phone verification error */}
                {phoneVerify.error && (
                  <p className="text-red-500 text-xs">{phoneVerify.error}</p>
                )}
              </div>
            </div>

            {/* Payment method */}
            {sitePayment && (
              <div className="bg-white border border-warm-200/50 rounded-sm p-5 md:p-7">
                <h3 className="text-warm-900 text-lg font-medium mb-5 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-warm-500" />
                  결제 방법
                </h3>
                <div className="border-2 border-sig-500 bg-sig-500/5 rounded-sm p-4 flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full border-2 border-sig-500 flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-sig-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-warm-900 font-medium text-sm">현장결제</p>
                    <p className="text-warm-500 text-xs mt-0.5">체크인 시 프론트에서 결제해 주세요</p>
                  </div>
                </div>
              </div>
            )}

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !isVerified || !guestName}
              className="w-full py-4 bg-sig-500 text-warm-900 font-bold text-lg rounded-sm hover:bg-sig-400 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(255,198,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
            >
              {isSubmitting ? "예약 처리 중..." : "예약하기"}
            </button>

            {!isVerified && (
              <p className="text-center text-warm-400 text-xs -mt-2">
                휴대폰 인증을 완료해야 예약할 수 있습니다.
              </p>
            )}
          </form>
        </div>

        {/* Sidebar summary */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-28 bg-white border border-warm-200/50 rounded-sm overflow-hidden">
            {room.image && (
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${room.image})` }}
              />
            )}
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-warm-900 font-medium text-lg">{storeName}</h3>
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
              {room.dailyPrices.length > 1 && (
                <div className="space-y-1 text-sm">
                  {room.dailyPrices.map((p, i) => (
                    <div key={i} className="flex justify-between text-warm-500">
                      <span>{i + 1}박차</span>
                      <span>{p.toLocaleString()}원</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="h-px bg-warm-100" />
              <div className="flex justify-between items-center">
                <span className="text-warm-900 font-medium">현장결제 금액</span>
                <span className="text-warm-900 text-2xl font-bold">
                  {room.price.toLocaleString()}원
                </span>
              </div>
              {sitePayment && (
                <div className="flex items-center gap-2 bg-warm-50 rounded-sm px-3 py-2">
                  <Banknote className="w-4 h-4 text-warm-500 shrink-0" />
                  <span className="text-warm-500 text-xs">체크인 시 현장결제</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Verify Code Input ─── */
function VerifyCodeInput({
  phoneVerify,
  guestPhone,
}: {
  phoneVerify: ReturnType<typeof usePhoneVerification>;
  guestPhone: string;
}) {
  const [code, setCode] = useState("");

  return (
    <div className="animate-fade-in">
      <label className="block text-warm-500 text-[10px] tracking-[0.2em] uppercase mb-2">인증번호</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="w-full bg-warm-50 border border-warm-200 rounded-sm px-4 py-3 text-warm-900 placeholder:text-warm-300 focus:border-sig-500 focus:outline-none transition-colors tracking-[0.3em] text-center font-medium"
            placeholder="인증번호 6자리"
          />
          {phoneVerify.remaining > 0 && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-500 text-sm font-medium tabular-nums">
              {phoneVerify.formatRemaining}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => phoneVerify.verify(code, guestPhone)}
          disabled={code.length < 6 || phoneVerify.status === "verifying"}
          className="shrink-0 px-5 py-3 bg-sig-500 text-warm-900 text-sm font-semibold rounded-sm hover:bg-sig-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          확인
        </button>
      </div>
      <p className="text-warm-400 text-xs mt-2">
        입력하신 휴대폰 번호로 인증번호가 발송되었습니다.
      </p>
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
