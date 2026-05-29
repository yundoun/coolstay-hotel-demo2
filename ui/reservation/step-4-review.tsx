"use client";

import { useState, useCallback } from "react";
import {
  CalendarDays,
  Users,
  ArrowLeft,
  Banknote,
  Loader2,
  CircleCheck,
  ChevronDown,
} from "lucide-react";
import { useReservation } from "@/adapters/zustand/reservation-store";
import { useTerms } from "@/application/hooks/useTerms";
import { createGuestReservation } from "@/application/services/reservation-api";
import { nightsBetween } from "@/domain/shared/utils";
import { siteConfig } from "@/hotel-data";
import { TermsModal } from "./terms-modal";

interface Props {
  onPrev: () => void;
}

export function Step4Review({ onPrev }: Props) {
  const store = useReservation();
  const nights = nightsBetween(store.checkIn, store.checkOut);
  const { terms, refundPolicies, loading: termsLoading } = useTerms({
    storeKey: store.apiRoom?.motelKey ?? null,
    itemKey: store.roomId ?? null,
    packKey: store.apiRoom?.packageKey ?? null,
    checkIn: store.checkIn,
    checkOut: store.checkOut,
  });

  const [agreed, setAgreed] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [modalTerm, setModalTerm] = useState<{ name: string; url: string } | null>(null);

  const openTerm = useCallback((name: string, url: string) => {
    setModalTerm({ name, url });
  }, []);
  const closeTerm = useCallback(() => setModalTerm(null), []);

  const refundAgreedKey = "REFUND_POLICY";
  const hasRefund = refundPolicies.length > 0;
  const requiredTerms = terms.filter((t) => t.required);
  const allRequiredAgreed =
    requiredTerms.every((t) => agreed[t.code]) &&
    (!hasRefund || !!agreed[refundAgreedKey]);

  const toggleTerm = (code: string) => {
    setAgreed((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const toggleAll = () => {
    const allKeys = [...terms.map((t) => t.code), ...(hasRefund ? [refundAgreedKey] : [])];
    const allAgreed = allKeys.every((k) => agreed[k]);
    const next: Record<string, boolean> = {};
    allKeys.forEach((k) => { next[k] = !allAgreed; });
    setAgreed(next);
  };

  const handleSubmit = async () => {
    if (!store.apiRoom || !store.guestName) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createGuestReservation({
        hotelId: store.apiRoom.motelKey,
        roomId: store.apiRoom.packageKey,
        checkIn: store.checkIn,
        checkOut: store.checkOut,
        guestName: store.guestName,
        guestPhone: store.guestPhone,
        totalPrice: store.apiRoom.price,
        basePrice: store.apiRoom.price,
        checkInTime: store.apiRoom.checkInTime,
        checkOutTime: store.apiRoom.checkOutTime,
        smsAuthKey: store.smsAuthKey,
        smsAuthCode: store.smsAuthCode,
      });

      store.setReservationNumber(result.bookId);

      const params = new URLSearchParams({
        hotelName: siteConfig.name,
        roomName: store.apiRoom.roomName,
        roomImage: store.apiRoom.roomImage || "",
        checkIn: store.checkIn,
        checkOut: store.checkOut,
        guests: store.adults.toString(),
        totalPrice: store.apiRoom.price.toString(),
        guestName: store.guestName,
        bookingId: result.bookId,
      });
      window.location.href = `/booking/complete?${params.toString()}`;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "예약 중 오류가 발생했습니다.");
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-xl md:text-2xl text-warm-900 font-medium mb-2">
          예약 내용을 확인해 주세요
        </h3>
        <p className="text-warm-500 text-sm">
          예약 정보를 확인하고 약관에 동의한 후 예약을 완료하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
        {/* Main */}
        <div className="lg:col-span-3 space-y-6">
          {/* Reservation summary */}
          <div className="bg-white border border-warm-200/50 rounded-sm p-5 md:p-7 space-y-5">
            <h4 className="text-warm-900 font-medium text-lg">예약 정보</h4>

            {store.apiRoom && (
              <div className="flex gap-4">
                {store.apiRoom.roomImage && (
                  <div
                    className="w-24 h-24 rounded-sm bg-cover bg-center shrink-0"
                    style={{ backgroundImage: `url(${store.apiRoom.roomImage})` }}
                  />
                )}
                <div>
                  <p className="text-warm-900 font-medium">{store.apiRoom.roomName}</p>
                  <p className="text-warm-500 text-sm mt-1">최대 {store.apiRoom.maxGuests}인</p>
                </div>
              </div>
            )}

            <div className="h-px bg-warm-100" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-500 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" /> 일정
                </span>
                <span className="text-warm-900">{store.checkIn} ~ {store.checkOut} ({nights}박)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-500 flex items-center gap-2">
                  <Users className="w-4 h-4" /> 인원
                </span>
                <span className="text-warm-900">{store.adults}명</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-500">예약자</span>
                <span className="text-warm-900">{store.guestName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-500">연락처</span>
                <span className="text-warm-900">{store.guestPhone}</span>
              </div>
            </div>

            <div className="h-px bg-warm-100" />
            <div className="flex justify-between items-center">
              <span className="text-warm-500 font-medium">총 금액</span>
              <span className="text-warm-900 text-2xl font-bold">
                {store.apiRoom?.price.toLocaleString() ?? 0}원
              </span>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white border border-warm-200/50 rounded-sm p-5 md:p-7">
            <h4 className="text-warm-900 font-medium text-lg mb-4">결제 방법</h4>
            <label className="flex items-center gap-3 p-3.5 border-2 border-sig-500 bg-sig-500/[0.04] rounded-sm cursor-default">
              <CircleCheck className="w-5 h-5 text-sig-600 shrink-0" />
              <div className="flex-1">
                <span className="text-warm-900 font-medium text-sm flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-warm-500" />
                  현장결제
                </span>
                <p className="text-warm-400 text-xs mt-0.5">체크인 시 프론트에서 결제합니다</p>
              </div>
            </label>
          </div>

          {/* Terms */}
          <div className="bg-white border border-warm-200/50 rounded-sm p-5 md:p-7">
            <h4 className="text-warm-900 font-medium text-lg mb-5">약관 동의</h4>

            {termsLoading ? (
              <div className="flex items-center gap-2 py-4">
                <Loader2 className="w-4 h-4 animate-spin text-warm-400" />
                <span className="text-warm-500 text-sm">약관을 불러오는 중...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {/* All agree */}
                <label className="flex items-center gap-3 p-3 border border-warm-200 rounded-sm cursor-pointer hover:bg-warm-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={
                      terms.length > 0 &&
                      [...terms.map((t) => t.code), ...(hasRefund ? [refundAgreedKey] : [])].every((k) => agreed[k])
                    }
                    onChange={toggleAll}
                    className="w-5 h-5 accent-sig-500"
                  />
                  <span className="text-warm-900 font-medium text-sm">전체 동의</span>
                </label>

                <div className="h-px bg-warm-100" />

                {terms.map((t) => (
                  <label key={t.code} className="flex items-center gap-3 px-3 py-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!agreed[t.code]}
                      onChange={() => toggleTerm(t.code)}
                      className="w-4 h-4 accent-sig-500"
                    />
                    <span className="text-warm-700 text-sm flex-1">
                      {t.name}
                      {t.required && (
                        <span className="text-red-500 ml-1 text-xs">(필수)</span>
                      )}
                    </span>
                    {t.url && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          openTerm(t.name, t.url);
                        }}
                        className="text-warm-400 text-xs underline hover:text-warm-600 transition-colors"
                      >
                        보기
                      </button>
                    )}
                  </label>
                ))}

                {/* 취소·환불 규정 */}
                {hasRefund && (
                  <RefundPolicyItem
                    policies={refundPolicies}
                    agreed={!!agreed[refundAgreedKey]}
                    onToggle={() => toggleTerm(refundAgreedKey)}
                  />
                )}
              </div>
            )}
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3">
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onPrev}
              className="flex items-center gap-2 text-warm-500 text-sm hover:text-warm-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              예약자 정보 수정
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !allRequiredAgreed}
              className="px-10 py-3.5 bg-sig-500 text-warm-900 font-bold text-lg rounded-sm hover:bg-sig-400 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(255,198,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
            >
              {isSubmitting ? "예약 처리 중..." : "예약하기"}
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
                  <h3 className="text-warm-900 font-medium text-lg">{siteConfig.name}</h3>
                  <p className="text-warm-500 text-sm">{store.apiRoom.roomName}</p>
                </div>
                <div className="h-px bg-warm-100" />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-warm-500">체크인</span>
                    <span className="text-warm-900">{store.checkIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warm-500">체크아웃</span>
                    <span className="text-warm-900">{store.checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warm-500">인원</span>
                    <span className="text-warm-900">{store.adults}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-warm-500">예약자</span>
                    <span className="text-warm-900">{store.guestName}</span>
                  </div>
                </div>
                <div className="h-px bg-warm-100" />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-warm-900 font-medium">총 금액</span>
                    <span className="text-warm-900 text-2xl font-bold">
                      {store.apiRoom.price.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-warm-400 text-xs">
                    <Banknote className="w-3.5 h-3.5" />
                    <span>현장결제</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <TermsModal
        open={!!modalTerm}
        title={modalTerm?.name ?? ""}
        url={modalTerm?.url ?? ""}
        onClose={closeTerm}
      />
    </div>
  );
}

/* ── 취소·환불 규정 접이식 컴포넌트 ── */

function RefundPolicyItem({
  policies,
  agreed,
  onToggle,
}: {
  policies: { until: string; percent: number; amount: number }[];
  agreed: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);

  const freeCancel = policies.find((p) => p.percent === 100);
  const summary = freeCancel
    ? `${freeCancel.until.replace(/:\d{2}$/, "")}까지 무료 취소 가능`
    : "취소 시 수수료가 발생합니다";

  return (
    <div className="px-3 py-2">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={agreed}
          onChange={onToggle}
          className="w-4 h-4 accent-sig-500"
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex-1 flex items-center justify-between gap-2 text-left"
        >
          <span className="text-warm-700 text-sm">
            취소·환불 규정 동의
            <span className="text-red-500 ml-1 text-xs">(필수)</span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-warm-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* 요약 */}
      <p className="text-warm-400 text-xs mt-1 ml-7">{summary}</p>

      {/* 상세 테이블 */}
      {open && (
        <div className="mt-3 ml-7 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-warm-200">
                <th className="pb-2 pr-4 font-medium text-warm-500">취소 기한</th>
                <th className="pb-2 pr-4 font-medium text-warm-500 text-right">환불률</th>
                <th className="pb-2 font-medium text-warm-500 text-right">환불 금액</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p, i) => (
                <tr key={i} className="border-b border-warm-100 last:border-b-0">
                  <td className="py-2 pr-4 text-warm-600">
                    {p.until.replace(/:\d{2}$/, "")} 까지
                  </td>
                  <td className="py-2 pr-4 text-right text-warm-700">{p.percent}%</td>
                  <td className="py-2 text-right text-warm-700">
                    {p.amount.toLocaleString()}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
