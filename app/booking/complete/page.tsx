"use client";

import Header from "@/ui/layout/site-header";
import Footer from "@/ui/layout/site-footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  Check,
  Download,
  Home,
  Phone,
  Clock,
  Sparkles,
} from "lucide-react";

const HEADER_NAV = [
  { label: "홈으로", href: "/" as const },
];

function BookingCompleteContent() {
  const params = useSearchParams();
  const bookingId = params.get("bookingId") || "BK-000000";
  const hotelName = params.get("hotelName") || "";
  const roomName = params.get("roomName") || "";
  const roomImage = params.get("roomImage") || "";
  const checkIn = params.get("checkIn") || "";
  const checkOut = params.get("checkOut") || "";
  const guests = params.get("guests") || "2";
  const totalPrice = params.get("totalPrice") || "0";
  const guestName = params.get("guestName") || "";

  const checkInDate = checkIn ? new Date(checkIn) : null;
  const checkOutDate = checkOut ? new Date(checkOut) : null;
  const nights =
    checkInDate && checkOutDate
      ? Math.ceil(
          (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 1;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}(${days[d.getDay()]})`;
  };

  return (
    <section className="pt-16 pb-24 flex-1">
      <div className="max-w-[640px] mx-auto px-5 md:px-8">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-sig-500 mx-auto flex items-center justify-center mb-5">
            <Check className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl md:text-3xl text-warm-900 font-light tracking-tight mb-2">
            예약이 완료되었습니다
          </h1>
          <p className="text-warm-400 text-sm">
            예약번호: {bookingId}
          </p>
        </div>

        {/* Hotel & Room hero card */}
        <div className="bg-white border border-warm-200/50 rounded-lg overflow-hidden mb-3">
          <div className="flex">
            {roomImage && (
              <div
                className="w-[140px] md:w-[180px] flex-shrink-0 bg-warm-200 bg-cover bg-center"
                style={{ backgroundImage: `url(${roomImage})` }}
              />
            )}
            <div className="flex-1 px-5 py-5 md:px-6 md:py-5">
              <p className="text-lg text-warm-900 font-medium mb-1">{hotelName}</p>
              <p className="text-warm-400 text-sm mb-3">
                {formatDate(checkIn)} ~ {formatDate(checkOut)} / {nights}박
              </p>
              <div className="flex items-center gap-4 text-sm text-warm-500">
                <span>객실 {1}</span>
                <span className="text-warm-200">|</span>
                <span>대인 {guests} / 소인 0</span>
              </div>
            </div>
            <div className="hidden md:flex flex-col justify-center px-6 py-5 border-l border-warm-100">
              <p className="text-warm-400 text-xs mb-1">이용자</p>
              <p className="text-warm-900 text-sm font-medium">{guestName}</p>
            </div>
          </div>
        </div>

        {/* Room type */}
        <div className="bg-white border border-warm-200/50 rounded-lg px-5 py-3.5 mb-3">
          <p className="text-warm-600 text-sm">
            <span className="text-warm-400 mr-2">&middot;</span>
            {roomName}
          </p>
        </div>

        {/* Mobile guest info */}
        <div className="md:hidden bg-white border border-warm-200/50 rounded-lg px-5 py-3.5 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-warm-400">이용자</span>
            <span className="text-warm-900">{guestName}</span>
          </div>
        </div>

        {/* Payment summary */}
        <div className="bg-white border border-warm-200/50 rounded-lg px-5 py-4 mb-8">
          <div className="flex items-center justify-between py-1 text-sm">
            <span className="text-warm-500">객실요금</span>
            <span className="text-warm-900">{Number(totalPrice).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-warm-100 text-sm">
            <span className="text-warm-900 font-medium">현장결제 금액</span>
            <span className="text-sig-600 font-medium">
              &#8361; {Number(totalPrice).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 justify-center mb-10">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-warm-200 rounded-lg text-warm-600 hover:border-warm-300 hover:text-warm-900 transition-colors text-sm"
          >
            <Home className="w-4 h-4" />
            홈으로
          </Link>
          <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-warm-800 text-white rounded-lg hover:bg-warm-900 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            예약내역 확인
          </button>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center bg-white border border-warm-200/30 rounded-lg px-3 py-5">
            <div className="w-9 h-9 rounded-full bg-warm-100 flex items-center justify-center mx-auto mb-2.5">
              <Clock className="w-4 h-4 text-warm-500" />
            </div>
            <p className="text-warm-900 text-xs font-medium">현장결제</p>
            <p className="text-warm-400 text-xs mt-0.5">체크인 시</p>
          </div>
          <div className="text-center bg-white border border-warm-200/30 rounded-lg px-3 py-5">
            <div className="w-9 h-9 rounded-full bg-warm-100 flex items-center justify-center mx-auto mb-2.5">
              <Sparkles className="w-4 h-4 text-warm-500" />
            </div>
            <p className="text-warm-900 text-xs font-medium">무료 취소</p>
            <p className="text-warm-400 text-xs mt-0.5">환불규정 확인</p>
          </div>
          <div className="text-center bg-white border border-warm-200/30 rounded-lg px-3 py-5">
            <div className="w-9 h-9 rounded-full bg-warm-100 flex items-center justify-center mx-auto mb-2.5">
              <Phone className="w-4 h-4 text-warm-500" />
            </div>
            <p className="text-warm-900 text-xs font-medium">고객센터</p>
            <p className="text-warm-400 text-xs mt-0.5">꿀스테이</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function BookingCompletePage() {
  return (
    <main className="min-h-screen bg-[var(--warm-50)] flex flex-col">
      <Header navItems={HEADER_NAV} />
      <div className="pt-14 md:pt-16" />
      <Suspense
        fallback={
          <div className="pt-32 pb-20 text-center text-warm-500 flex-1">
            로딩 중...
          </div>
        }
      >
        <BookingCompleteContent />
      </Suspense>
      <Footer />
    </main>
  );
}
