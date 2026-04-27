"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2, CalendarDays, Users, MapPin, Download, Home } from "lucide-react";

function BookingCompleteContent() {
  const params = useSearchParams();
  const bookingId = params.get("bookingId") || "BK-000000";
  const hotelName = params.get("hotelName") || "";
  const roomName = params.get("roomName") || "";
  const checkIn = params.get("checkIn") || "";
  const checkOut = params.get("checkOut") || "";
  const guests = params.get("guests") || "2";
  const totalPrice = params.get("totalPrice") || "0";
  const guestName = params.get("guestName") || "";

  return (
    <section className="pt-32 pb-20 bg-[var(--warm-50)]">
      <div className="max-w-2xl mx-auto px-8 lg:px-12 text-center">
        <div className="mb-10">
          <div className="w-20 h-20 rounded-full bg-brand-500 mx-auto flex items-center justify-center mb-7">
            <CheckCircle2 className="w-10 h-10 text-warm-900" />
          </div>
          <h1 className="font-serif text-4xl text-warm-900 mb-3">
            예약이 완료되었습니다
          </h1>
          <p className="text-warm-500">
            예약 확인 메일이 발송되었습니다. 즐거운 여행 되세요!
          </p>
        </div>

        <div className="bg-white border border-warm-200/50 rounded-sm p-8 text-left mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-warm-900 font-medium text-lg">예약 정보</h2>
            <span className="text-brand-700 text-sm font-mono bg-brand-500/10 px-3 py-1 rounded-sm">
              {bookingId}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-warm-100">
              <div className="flex items-center gap-3 text-warm-500">
                <MapPin className="w-4 h-4" />
                <span>호텔</span>
              </div>
              <div className="text-right">
                <p className="text-warm-900">{hotelName}</p>
                <p className="text-warm-500 text-sm">{roomName}</p>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-warm-100">
              <div className="flex items-center gap-3 text-warm-500">
                <CalendarDays className="w-4 h-4" />
                <span>일정</span>
              </div>
              <span className="text-warm-900">
                {checkIn} ~ {checkOut}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-warm-100">
              <div className="flex items-center gap-3 text-warm-500">
                <Users className="w-4 h-4" />
                <span>투숙객</span>
              </div>
              <span className="text-warm-900">
                {guestName} ({guests}명)
              </span>
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className="text-warm-900 font-medium text-lg">
                총 결제금액
              </span>
              <span className="text-brand-700 text-2xl font-serif">
                {Number(totalPrice).toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-8 py-3 border border-warm-200 rounded-sm text-warm-600 hover:border-brand-500 hover:text-warm-900 transition-all"
          >
            <Home className="w-4 h-4" />
            홈으로
          </Link>
          <button className="flex items-center gap-2 px-8 py-3 bg-brand-500 text-warm-900 font-semibold rounded-sm hover:bg-brand-400 transition-all hover:shadow-[0_4px_16px_rgba(255,198,0,0.35)]">
            <Download className="w-4 h-4" />
            예약 확인서 다운로드
          </button>
        </div>
      </div>
    </section>
  );
}

export default function BookingCompletePage() {
  return (
    <main className="min-h-screen bg-[var(--warm-50)] flex flex-col">
      <Header />
      <Suspense
        fallback={
          <div className="pt-32 pb-20 text-center text-warm-500 flex-1">
            로딩 중...
          </div>
        }
      >
        <BookingCompleteContent />
      </Suspense>
      <div className="flex-1" />
      <Footer />
    </main>
  );
}
