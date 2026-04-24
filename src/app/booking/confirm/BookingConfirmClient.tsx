"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hotel, Room } from "@/domain/entities";
import { Star, CalendarDays, Users, CreditCard, Shield } from "lucide-react";

interface Props {
  hotel: Hotel;
  room: Room;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
}

export default function BookingConfirmClient({
  hotel,
  room,
  checkIn,
  checkOut,
  nights,
  guests,
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    guestName: "",
    guestPhone: "",
    guestEmail: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = room.price * nights;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const params = new URLSearchParams({
      hotelName: hotel.name,
      roomName: room.name,
      checkIn,
      checkOut,
      guests: guests.toString(),
      totalPrice: totalPrice.toString(),
      guestName: form.guestName,
      bookingId: `BK-${Date.now()}`,
    });

    router.push(`/booking/complete?${params.toString()}`);
  };

  return (
    <section className="pt-24 md:pt-32 pb-20 bg-[var(--warm-50)]">
      <div className="max-w-5xl mx-auto px-5 md:px-8 lg:px-12">
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-5">
            <div className="w-6 md:w-8 h-px bg-brand-600" />
            <p className="text-brand-700 text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-medium">
              Booking Confirmation
            </p>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-warm-900">예약 확인</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-10">
          {/* Form */}
          <div className="md:col-span-3 order-2 md:order-1">
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <div className="bg-white border border-warm-200/50 rounded-sm p-5 md:p-8">
                <h2 className="text-warm-900 text-lg font-medium mb-6">
                  투숙객 정보
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-warm-500 text-[10px] tracking-[0.2em] uppercase mb-2">
                      이름
                    </label>
                    <input
                      type="text"
                      required
                      value={form.guestName}
                      onChange={(e) =>
                        setForm({ ...form, guestName: e.target.value })
                      }
                      className="w-full bg-warm-50 border border-warm-200 rounded-sm px-4 py-3 text-warm-900 placeholder:text-warm-300 focus:border-brand-500 focus:outline-none transition-colors"
                      placeholder="홍길동"
                    />
                  </div>
                  <div>
                    <label className="block text-warm-500 text-[10px] tracking-[0.2em] uppercase mb-2">
                      연락처
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.guestPhone}
                      onChange={(e) =>
                        setForm({ ...form, guestPhone: e.target.value })
                      }
                      className="w-full bg-warm-50 border border-warm-200 rounded-sm px-4 py-3 text-warm-900 placeholder:text-warm-300 focus:border-brand-500 focus:outline-none transition-colors"
                      placeholder="010-1234-5678"
                    />
                  </div>
                  <div>
                    <label className="block text-warm-500 text-[10px] tracking-[0.2em] uppercase mb-2">
                      이메일
                    </label>
                    <input
                      type="email"
                      required
                      value={form.guestEmail}
                      onChange={(e) =>
                        setForm({ ...form, guestEmail: e.target.value })
                      }
                      className="w-full bg-warm-50 border border-warm-200 rounded-sm px-4 py-3 text-warm-900 placeholder:text-warm-300 focus:border-brand-500 focus:outline-none transition-colors"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-warm-200/50 rounded-sm p-5 md:p-8">
                <h2 className="text-warm-900 text-lg font-medium mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-600" />
                  결제 정보
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-warm-500 text-[10px] tracking-[0.2em] uppercase mb-2">
                      카드 번호
                    </label>
                    <input
                      type="text"
                      className="w-full bg-warm-50 border border-warm-200 rounded-sm px-4 py-3 text-warm-900 placeholder:text-warm-300 focus:border-brand-500 focus:outline-none transition-colors"
                      placeholder="0000 0000 0000 0000"
                      defaultValue="4242 4242 4242 4242"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-warm-500 text-[10px] tracking-[0.2em] uppercase mb-2">
                        유효기간
                      </label>
                      <input
                        type="text"
                        className="w-full bg-warm-50 border border-warm-200 rounded-sm px-4 py-3 text-warm-900 placeholder:text-warm-300 focus:border-brand-500 focus:outline-none transition-colors"
                        placeholder="MM/YY"
                        defaultValue="12/28"
                      />
                    </div>
                    <div>
                      <label className="block text-warm-500 text-[10px] tracking-[0.2em] uppercase mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        className="w-full bg-warm-50 border border-warm-200 rounded-sm px-4 py-3 text-warm-900 placeholder:text-warm-300 focus:border-brand-500 focus:outline-none transition-colors"
                        placeholder="000"
                        defaultValue="123"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 text-warm-400 text-xs">
                  <Shield className="w-4 h-4 text-brand-600" />
                  <span>모든 결제 정보는 SSL로 암호화되어 안전하게 처리됩니다 (데모)</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-brand-500 text-warm-900 font-bold text-lg rounded-sm hover:bg-brand-400 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(255,198,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
              >
                {isSubmitting
                  ? "예약 처리 중..."
                  : `${totalPrice.toLocaleString()}원 결제하기`}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-2 order-1 md:order-2">
            <div className="md:sticky md:top-28 bg-white border border-warm-200/50 rounded-sm overflow-hidden">
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${room.images[0]})` }}
              />
              <div className="p-7 space-y-5">
                <div>
                  <div className="flex items-center gap-0.5 mb-1">
                    {Array.from({ length: hotel.starRating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-brand-500 text-brand-500"
                      />
                    ))}
                  </div>
                  <h3 className="text-warm-900 font-medium text-lg">
                    {hotel.name}
                  </h3>
                  <p className="text-warm-500 text-sm">{room.name}</p>
                </div>

                <div className="h-px bg-warm-100" />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-warm-500">
                      <CalendarDays className="w-4 h-4" />
                      <span>체크인</span>
                    </div>
                    <span className="text-warm-900">{checkIn}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-warm-500">
                      <CalendarDays className="w-4 h-4" />
                      <span>체크아웃</span>
                    </div>
                    <span className="text-warm-900">{checkOut}</span>
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
                    <div className="flex justify-between text-brand-700">
                      <span>할인</span>
                      <span>
                        -{((room.originalPrice - room.price) * nights).toLocaleString()}원
                      </span>
                    </div>
                  )}
                </div>

                <div className="h-px bg-warm-100" />

                <div className="flex justify-between items-center">
                  <span className="text-warm-900 font-medium">총 결제금액</span>
                  <span className="text-brand-700 text-2xl font-serif">
                    {totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
