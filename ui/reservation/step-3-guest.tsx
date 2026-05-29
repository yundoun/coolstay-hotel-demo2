"use client";

import { useRef, useState } from "react";
import {
  CalendarDays,
  Users,
  ArrowRight,
  ArrowLeft,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useReservation } from "@/adapters/zustand/reservation-store";
import { useShallow } from "zustand/react/shallow";
import { usePhoneVerification } from "@/application/hooks/usePhoneVerification";
import { prefetchTerms } from "@/application/hooks/useTerms";
import { nightsBetween, formatKoDate } from "@/domain/shared/utils";

/** 숫자만 추출 후 전화번호 형식(010-1234-5678)으로 포맷 */
function formatPhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

export function Step3Guest({ onNext, onPrev }: Props) {
  const store = useReservation(useShallow((s) => ({
    checkIn: s.checkIn,
    checkOut: s.checkOut,
    adults: s.adults,
    apiRoom: s.apiRoom,
    roomId: s.roomId,
    guestName: s.guestName,
    guestPhone: s.guestPhone,
    setGuestInfo: s.setGuestInfo,
    setPhoneVerified: s.setPhoneVerified,
    setSmsAuth: s.setSmsAuth,
  })));
  const phoneVerify = usePhoneVerification();
  const nights = nightsBetween(store.checkIn, store.checkOut);

  const [guestName, setGuestName] = useState(store.guestName);
  const [guestPhone, setGuestPhone] = useState(store.guestPhone);
  const [code, setCode] = useState("");

  const isVerified = phoneVerify.status === "verified";
  const isExpired = phoneVerify.status === "expired";

  // 만료 시 인증코드 초기화 + 재발송 시 인증코드 초기화
  const prevStatus = useRef(phoneVerify.status);
  const statusChanged = prevStatus.current !== phoneVerify.status;
  if (statusChanged) {
    if (phoneVerify.status === "expired" || (phoneVerify.status === "sent" && prevStatus.current !== "verifying")) {
      setCode("");
    }
    prevStatus.current = phoneVerify.status;
  }

  const handleNext = () => {
    if (!guestName || !isVerified) return;
    store.setGuestInfo({ name: guestName, phone: guestPhone.replace(/\D/g, "") });
    store.setPhoneVerified(true);
    if (phoneVerify.authKey) {
      store.setSmsAuth(phoneVerify.authKey, code);
    }
    // Step 4 진입 전에 약관 데이터를 미리 불러오기 시작
    prefetchTerms({
      storeKey: store.apiRoom?.motelKey ?? null,
      itemKey: store.roomId ?? null,
      packKey: store.apiRoom?.packageKey ?? null,
      checkIn: store.checkIn,
      checkOut: store.checkOut,
    });
    onNext();
  };

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-xl md:text-2xl text-warm-900 font-medium mb-2">
          예약자 정보를 입력해 주세요
        </h3>
        <p className="text-warm-500 text-sm">
          투숙하실 분의 이름과 연락처를 입력해 주세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Selected room summary */}
          {store.apiRoom && (
            <div className="bg-white border border-warm-200/50 rounded-sm p-5 flex gap-4">
              {store.apiRoom.roomImage && (
                <div
                  className="w-24 h-24 rounded-sm bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url(${store.apiRoom.roomImage})` }}
                />
              )}
              <div>
                <p className="text-warm-900 font-medium mb-1">{store.apiRoom.roomName}</p>
                <div className="flex items-center gap-4 text-warm-500 text-xs">
                  <span>최대 {store.apiRoom.maxGuests}인</span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="flex items-center gap-1.5 text-warm-600 bg-warm-50 px-2 py-1 rounded">
                    <CalendarDays className="w-3 h-3 text-warm-500" />
                    {store.checkIn} ~ {store.checkOut} ({nights}박)
                  </span>
                  <span className="flex items-center gap-1.5 text-warm-600 bg-warm-50 px-2 py-1 rounded">
                    <Users className="w-3 h-3 text-warm-500" />
                    {store.adults}명
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Guest info */}
          <div className="bg-white border border-warm-200/50 rounded-sm p-5 md:p-7">
            <h3 className="text-warm-900 text-lg font-medium mb-5">예약자 정보</h3>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-warm-500 text-[10px] tracking-[0.2em] uppercase mb-2">이름</label>
                <input
                  type="text"
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
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(formatPhoneNumber(e.target.value))}
                      disabled={isVerified}
                      className="w-full bg-warm-50 border border-warm-200 rounded-sm pl-10 pr-4 py-3 text-warm-900 placeholder:text-warm-300 focus:border-sig-500 focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="010-1234-5678"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => phoneVerify.send(guestPhone.replace(/\D/g, ""))}
                    disabled={isVerified || phoneVerify.status === "sending" || !guestPhone || guestPhone.replace(/\D/g, "").length < 10}
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

              {/* Verification code */}
              {(phoneVerify.status === "sent" || phoneVerify.status === "expired" || phoneVerify.status === "verifying") && (
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
                        disabled={isExpired}
                        className="w-full bg-warm-50 border border-warm-200 rounded-sm px-4 py-3 text-warm-900 placeholder:text-warm-300 focus:border-sig-500 focus:outline-none transition-colors tracking-[0.3em] text-center font-medium disabled:opacity-60 disabled:cursor-not-allowed"
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
                      onClick={() => phoneVerify.verify(code, guestPhone.replace(/\D/g, ""))}
                      disabled={code.length < 6 || isExpired}
                      className="shrink-0 px-5 py-3 bg-sig-500 text-warm-900 text-sm font-semibold rounded-sm hover:bg-sig-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      확인
                    </button>
                  </div>
                  <p className={`text-xs mt-2 ${isExpired ? "text-red-500" : "text-warm-400"}`}>
                    {isExpired
                      ? "인증 시간이 만료되었습니다. 재발송 버튼을 눌러 다시 인증해 주세요."
                      : "입력하신 휴대폰 번호로 인증번호가 발송되었습니다."}
                  </p>
                </div>
              )}

              {/* Verified badge */}
              {isVerified && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 rounded-sm px-4 py-3 animate-fade-in">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 text-sm font-medium">휴대폰 인증이 완료되었습니다</span>
                </div>
              )}

              {phoneVerify.error && (
                <p className="text-red-500 text-xs">{phoneVerify.error}</p>
              )}
            </div>
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onPrev}
              className="flex items-center gap-2 text-warm-500 text-sm hover:text-warm-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              객실 다시 선택
            </button>
            <button
              onClick={handleNext}
              disabled={!guestName || !isVerified}
              className="flex items-center gap-2 px-8 py-3 bg-sig-500 text-warm-900 font-semibold rounded-sm hover:bg-sig-400 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              예약 확인
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2">
          {store.apiRoom && (
            <div className="lg:sticky lg:top-28 bg-white border border-warm-200/50 rounded-sm overflow-hidden">
              {store.apiRoom.roomImage && (
                <div
                  className="h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${store.apiRoom.roomImage})` }}
                />
              )}
              <div className="p-6 space-y-5">
                <div>
                  <h3 className="text-warm-900 font-medium text-lg">{store.apiRoom.storeName}</h3>
                  <p className="text-warm-500 text-sm">{store.apiRoom.roomName}</p>
                </div>
                <div className="h-px bg-warm-100" />
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-warm-500">체크인</span>
                    <span className="text-warm-900">{store.checkIn}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-warm-500">체크아웃</span>
                    <span className="text-warm-900">{store.checkOut}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-warm-500">인원</span>
                    <span className="text-warm-900">{store.adults}명</span>
                  </div>
                </div>
                <div className="h-px bg-warm-100" />
                <div className="flex justify-between items-center">
                  <span className="text-warm-900 font-medium">총 금액</span>
                  <span className="text-warm-900 text-2xl font-bold">
                    {store.apiRoom.price.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
