"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Header from "@/ui/layout/site-header";
import Footer from "@/ui/layout/site-footer";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Phone,
  Hash,
  Calendar,
  User,
  CreditCard,
  MapPin,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowLeft,
  Loader2,
  ChevronRight,
} from "lucide-react";
import type { BookingItem } from "@/domain/reservation/types";

/* ── 헤더 네비게이션 ── */
const HEADER_NAV = [
  { label: "홈으로", href: "/" as const },
  { label: "객실 예약", href: "/#reservation" as const, variant: "button" as const },
];

/* ── 상태 배지 ── */
const STATUS_CONFIG: Record<
  string,
  { label: string; icon: typeof CheckCircle2; className: string; bg: string }
> = {
  BEFORE: {
    label: "예약 확정",
    icon: CheckCircle2,
    className: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200/60",
  },
  AFTER: {
    label: "이용 완료",
    icon: Clock,
    className: "text-warm-500",
    bg: "bg-warm-100 border-warm-200/60",
  },
  CANCEL: {
    label: "취소됨",
    icon: XCircle,
    className: "text-red-500",
    bg: "bg-red-50 border-red-200/60",
  },
};

/* ── 날짜 파싱 (timestamp / "20260601" / "2026-06-01" 모두 지원) ── */
function parseDate(raw: string): Date {
  // Unix timestamp (초 단위) — 숫자로만 구성되고 길이 10자리 내외
  if (/^\d{9,11}$/.test(raw)) {
    return new Date(Number(raw) * 1000);
  }
  // "20260601" or "2026-06-01" 등
  const cleaned = raw.replace(/[-T:]/g, "").slice(0, 8);
  return new Date(Number(cleaned.slice(0, 4)), Number(cleaned.slice(4, 6)) - 1, Number(cleaned.slice(6, 8)));
}

function formatDate(raw: string): string {
  if (!raw) return "";
  const date = parseDate(raw);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${y}.${m}.${d}(${days[date.getDay()]})`;
}

function nightCount(checkIn: string, checkOut: string): number {
  const diff = parseDate(checkOut).getTime() - parseDate(checkIn).getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/* ── 전화번호 포맷 ── */
function formatPhone(v: string): string {
  const digits = v.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

/* ===================================================================
   메인 페이지
   =================================================================== */

export default function ReservationLookupPage() {
  return (
    <main className="min-h-screen bg-[var(--warm-50)] flex flex-col">
      <Header navItems={HEADER_NAV} />
      <div className="pt-14 md:pt-16" />
      <LookupContent />
      <Footer />
    </main>
  );
}

/* ===================================================================
   컨텐츠 (form → result → cancel 흐름)
   =================================================================== */

type ViewState =
  | { step: "form" }
  | { step: "loading" }
  | { step: "result"; booking: BookingItem }
  | { step: "error"; message: string }
  | { step: "cancel-confirm"; booking: BookingItem }
  | { step: "cancelling"; booking: BookingItem }
  | { step: "cancelled" };

function LookupContent() {
  const [view, setView] = useState<ViewState>({ step: "form" });
  const [bookId, setBookId] = useState("");
  const [phone, setPhone] = useState("");

  /* ── 조회 ── */
  const handleLookup = useCallback(async () => {
    if (!bookId.trim() || !phone.trim()) return;
    setView({ step: "loading" });

    try {
      const qs = new URLSearchParams({
        book_id: bookId.trim(),
        phone_number: phone.replace(/-/g, ""),
      });
      const res = await fetch(`/api/reservation/lookup?${qs}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "예약 정보를 찾을 수 없습니다.");
      }
      const data = await res.json();
      const books: BookingItem[] = data.books ?? [];
      if (books.length === 0) {
        throw new Error("입력하신 정보와 일치하는 예약을 찾을 수 없습니다.\n예약번호와 전화번호를 다시 확인해 주세요.");
      }
      setView({ step: "result", booking: books[0] });
    } catch (e) {
      setView({ step: "error", message: e instanceof Error ? e.message : "조회에 실패했습니다." });
    }
  }, [bookId, phone]);

  /* ── 취소 ── */
  const handleCancel = useCallback(async (booking: BookingItem) => {
    setView({ step: "cancelling", booking });
    try {
      const res = await fetch("/api/reservation/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_id: booking.bookId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "취소 처리에 실패했습니다.");
      }
      setView({ step: "cancelled" });
    } catch (e) {
      setView({
        step: "error",
        message: e instanceof Error ? e.message : "취소 처리 중 문제가 발생했습니다.",
      });
    }
  }, []);

  /* ── 되돌리기 ── */
  const resetForm = () => {
    setView({ step: "form" });
    setBookId("");
    setPhone("");
  };

  return (
    <section className="flex-1 py-12 md:py-20">
      <div className="max-w-[520px] mx-auto px-5 md:px-8">

        {/* ────────── FORM ────────── */}
        {(view.step === "form" || view.step === "loading") && (
          <div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: "forwards" }}>
            {/* 헤딩 */}
            <div className="text-center mb-10 md:mb-12">
              <p className="text-[10px] tracking-[0.3em] uppercase text-warm-400 mb-3 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "80ms", animationFillMode: "forwards" }}>
                Reservation
              </p>
              <h1 className="text-2xl md:text-[28px] text-warm-900 font-light tracking-tight leading-snug mb-3 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "160ms", animationFillMode: "forwards" }}>
                예약 조회
              </h1>
              <p className="text-warm-400 text-sm leading-relaxed opacity-0 animate-fade-in-up"
                style={{ animationDelay: "240ms", animationFillMode: "forwards" }}>
                예약번호와 전화번호를 입력하시면<br className="md:hidden" />
                예약 내역을 확인하실 수 있습니다.
              </p>
            </div>

            {/* 폼 카드 */}
            <div className="bg-white border border-warm-200/50 rounded-xl p-6 md:p-8 shadow-[0_2px_20px_rgba(0,0,0,0.03)] opacity-0 animate-fade-in-up"
              style={{ animationDelay: "320ms", animationFillMode: "forwards" }}>

              {/* 예약번호 */}
              <div className="mb-5">
                <label className="flex items-center gap-1.5 text-xs text-warm-500 mb-2 font-medium">
                  <Hash className="w-3.5 h-3.5" />
                  예약번호
                </label>
                <input
                  type="text"
                  value={bookId}
                  onChange={(e) => setBookId(e.target.value)}
                  placeholder="예약번호를 입력해주세요"
                  className="w-full px-4 py-3 bg-warm-50/60 border border-warm-200/60 rounded-lg text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:border-sig-500/50 focus:ring-2 focus:ring-sig-500/10 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                />
              </div>

              {/* 전화번호 */}
              <div className="mb-7">
                <label className="flex items-center gap-1.5 text-xs text-warm-500 mb-2 font-medium">
                  <Phone className="w-3.5 h-3.5" />
                  전화번호
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="010-0000-0000"
                  maxLength={13}
                  className="w-full px-4 py-3 bg-warm-50/60 border border-warm-200/60 rounded-lg text-sm text-warm-900 placeholder:text-warm-300 focus:outline-none focus:border-sig-500/50 focus:ring-2 focus:ring-sig-500/10 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                />
              </div>

              {/* 조회 버튼 */}
              <button
                onClick={handleLookup}
                disabled={!bookId.trim() || !phone.trim() || view.step === "loading"}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-warm-800 text-white text-sm font-medium rounded-lg hover:bg-warm-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
              >
                {view.step === "loading" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    조회 중...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    예약 조회
                  </>
                )}
              </button>
            </div>

            {/* 안내 */}
            <p className="text-center text-warm-400 text-xs mt-5 leading-relaxed opacity-0 animate-fade-in-up"
              style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
              예약번호는 예약 완료 시 안내된 번호입니다.
            </p>
          </div>
        )}

        {/* ────────── ERROR ────────── */}
        {view.step === "error" && (
          <div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: "forwards" }}>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200/60 mx-auto flex items-center justify-center mb-5">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl text-warm-900 font-light mb-3">조회 실패</h2>
              <p className="text-warm-500 text-sm leading-relaxed whitespace-pre-line">
                {view.message}
              </p>
            </div>
            <button
              onClick={resetForm}
              className="w-full flex items-center justify-center gap-2 py-3.5 border border-warm-200 rounded-lg text-warm-600 hover:border-warm-300 hover:text-warm-900 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              다시 조회하기
            </button>
          </div>
        )}

        {/* ────────── RESULT ────────── */}
        {(view.step === "result" || view.step === "cancel-confirm") && (
          <ResultView
            booking={view.booking}
            showCancelConfirm={view.step === "cancel-confirm"}
            onCancel={() => setView({ step: "cancel-confirm", booking: view.booking })}
            onCancelConfirm={() => handleCancel(view.booking)}
            onCancelDismiss={() => setView({ step: "result", booking: view.booking })}
            onBack={resetForm}
          />
        )}

        {/* ────────── CANCELLING ────────── */}
        {view.step === "cancelling" && (
          <div className="text-center py-20 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
            <Loader2 className="w-8 h-8 text-warm-400 animate-spin mx-auto mb-4" />
            <p className="text-warm-500 text-sm">예약을 취소하고 있습니다...</p>
          </div>
        )}

        {/* ────────── CANCELLED ────────── */}
        {view.step === "cancelled" && (
          <div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: "forwards" }}>
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-full bg-warm-100 mx-auto flex items-center justify-center mb-5">
                <CheckCircle2 className="w-7 h-7 text-warm-500" />
              </div>
              <h2 className="text-2xl text-warm-900 font-light tracking-tight mb-2">
                예약이 취소되었습니다
              </h2>
              <p className="text-warm-400 text-sm leading-relaxed">
                환불은 결제 수단에 따라<br />
                영업일 기준 3~5일 내 처리됩니다.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-warm-200 rounded-lg text-warm-600 hover:border-warm-300 hover:text-warm-900 transition-colors text-sm"
              >
                <Search className="w-4 h-4" />
                다른 예약 조회
              </button>
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-warm-800 text-white rounded-lg hover:bg-warm-900 transition-colors text-sm font-medium"
              >
                홈으로
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ===================================================================
   결과 뷰
   =================================================================== */

function ResultView({
  booking,
  showCancelConfirm,
  onCancel,
  onCancelConfirm,
  onCancelDismiss,
  onBack,
}: {
  booking: BookingItem;
  showCancelConfirm: boolean;
  onCancel: () => void;
  onCancelConfirm: () => void;
  onCancelDismiss: () => void;
  onBack: () => void;
}) {
  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.BEFORE;
  const StatusIcon = status.icon;
  const nights = nightCount(booking.checkIn, booking.checkOut);
  const canCancel = booking.status === "BEFORE";

  return (
    <div className="opacity-0 animate-fade-in-up" style={{ animationFillMode: "forwards" }}>
      {/* 뒤로가기 */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-warm-400 hover:text-warm-600 text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        다시 조회
      </button>

      {/* 상태 + 예약번호 */}
      <div className="flex items-center justify-between mb-5">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${status.bg} ${status.className}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          {status.label}
        </div>
        <span className="text-warm-400 text-xs">
          No. {booking.bookId}
        </span>
      </div>

      {/* 메인 카드 */}
      <div className="bg-white border border-warm-200/50 rounded-xl overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.03)] mb-3 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>

        {/* 객실 이미지 + 숙소명 */}
        <div className="flex">
          {booking.roomImage && (
            <div className="w-[110px] md:w-[150px] flex-shrink-0 bg-warm-200 relative overflow-hidden">
              <Image
                src={booking.roomImage}
                alt={booking.roomName}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 p-4 md:p-5 flex flex-col justify-center">
            {booking.storeName && (
              <p className="text-warm-400 text-[11px] tracking-wide mb-0.5">{booking.storeName}</p>
            )}
            <p className="text-warm-900 text-base font-medium">{booking.roomName}</p>
          </div>
        </div>

        {/* 구분선 */}
        <div className="mx-5 border-t border-warm-100" />

        {/* 체크인/체크아웃 */}
        <div className="grid grid-cols-2 divide-x divide-warm-100 px-5 py-4">
          <div className="pr-4">
            <p className="text-warm-400 text-[11px] mb-1">체크인</p>
            <p className="text-warm-900 text-sm font-medium">{formatDate(booking.checkIn)}</p>
          </div>
          <div className="pl-4">
            <p className="text-warm-400 text-[11px] mb-1">체크아웃</p>
            <p className="text-warm-900 text-sm font-medium">{formatDate(booking.checkOut)}</p>
          </div>
        </div>
        <div className="mx-5 mb-0.5">
          <span className="inline-block px-2 py-0.5 rounded bg-warm-50 text-warm-500 text-[11px]">
            {nights}박
          </span>
        </div>
      </div>

      {/* 예약자 정보 */}
      <div className="bg-white border border-warm-200/50 rounded-xl px-5 py-4 mb-3 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
        <div className="flex items-center gap-2 mb-3">
          <User className="w-3.5 h-3.5 text-warm-400" />
          <span className="text-warm-500 text-xs font-medium">예약자 정보</span>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-warm-400">이름</span>
            <span className="text-warm-900">{booking.guestName || "-"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-warm-400">연락처</span>
            <span className="text-warm-900">{booking.guestPhone ? formatPhone(booking.guestPhone) : "-"}</span>
          </div>
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="bg-white border border-warm-200/50 rounded-xl px-5 py-4 mb-6 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-3.5 h-3.5 text-warm-400" />
          <span className="text-warm-500 text-xs font-medium">결제 정보</span>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-warm-400">결제 방법</span>
            <span className="text-warm-900">
              {booking.payment.method === "SITE" ? "현장결제" : booking.payment.method}
            </span>
          </div>
          {booking.originPrice > 0 && booking.originPrice !== booking.totalPrice && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-warm-400">정상가</span>
              <span className="text-warm-400 line-through">
                {booking.originPrice.toLocaleString()}원
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm pt-2 border-t border-warm-100/80">
            <span className="text-warm-900 font-medium">결제 금액</span>
            <span className="text-sig-600 font-medium text-base">
              {booking.totalPrice.toLocaleString()}원
            </span>
          </div>
          {booking.payment.refundCharge != null && booking.payment.refundCharge > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-warm-400">환불 금액</span>
              <span className="text-emerald-600">{booking.payment.refundCharge.toLocaleString()}원</span>
            </div>
          )}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-3 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-warm-200 rounded-lg text-warm-600 hover:border-warm-300 hover:text-warm-900 transition-colors text-sm"
        >
          홈으로
        </Link>
        {canCancel && (
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-red-200/60 text-red-500 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all text-sm"
          >
            예약 취소
          </button>
        )}
      </div>

      {/* ── 취소 확인 모달 (portal로 body에 렌더링) ── */}
      {showCancelConfirm && createPortal(
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[60] animate-fade-in"
            onClick={onCancelDismiss}
          />
          <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[61] max-w-[400px] mx-auto bg-white rounded-2xl p-6 shadow-xl animate-modal-pop">
            <button
              onClick={onCancelDismiss}
              className="absolute top-4 right-4 text-warm-400 hover:text-warm-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-red-50 mx-auto flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg text-warm-900 font-medium mb-1.5">예약을 취소하시겠습니까?</h3>
              <p className="text-warm-400 text-sm leading-relaxed">
                취소 후에는 복구가 불가능합니다.<br />
                환불 규정에 따라 환불이 진행됩니다.
              </p>
            </div>

            <div className="bg-warm-50 rounded-lg px-4 py-3 mb-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-warm-500">{booking.roomName}</span>
                <span className="text-warm-900 font-medium">{booking.totalPrice.toLocaleString()}원</span>
              </div>
              <p className="text-warm-400 text-xs mt-1">
                {formatDate(booking.checkIn)} ~ {formatDate(booking.checkOut)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancelDismiss}
                className="flex-1 py-3 border border-warm-200 rounded-lg text-warm-600 hover:border-warm-300 text-sm transition-colors"
              >
                돌아가기
              </button>
              <button
                onClick={onCancelConfirm}
                className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors"
              >
                취소하기
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
