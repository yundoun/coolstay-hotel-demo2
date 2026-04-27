"use client";

import { Hotel, Room } from "@/domain/entities";
import { useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  CalendarDays,
  Users,
  Maximize,
  Check,
  ArrowRight,
} from "lucide-react";

interface Props {
  hotel: Hotel;
  rooms: Room[];
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  roomCount: number;
}

export default function RoomSelectClient({
  hotel,
  rooms,
  checkIn,
  checkOut,
  nights,
  guests,
  roomCount,
}: Props) {
  const router = useRouter();

  const handleSelectRoom = (room: Room) => {
    const params = new URLSearchParams({
      hotelId: hotel.id,
      roomId: room.id,
      checkIn,
      checkOut,
      guests: guests.toString(),
    });
    router.push(`/booking/confirm?${params.toString()}`);
  };

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
        {/* Hotel Summary Bar */}
        <div className="bg-white border border-warm-200/50 rounded-sm p-5 md:p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-sm bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url(${hotel.thumbnail})` }}
              />
              <div>
                <div className="flex items-center gap-0.5 mb-1">
                  {Array.from({ length: hotel.starRating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-brand-500 text-brand-500"
                    />
                  ))}
                </div>
                <h1 className="text-xl md:text-2xl font-serif text-warm-900 mb-1">
                  {hotel.name}
                </h1>
                <div className="flex items-center gap-1.5 text-warm-500 text-sm">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{hotel.location}</span>
                </div>
              </div>
            </div>

            {/* Booking Context */}
            <div className="flex items-center gap-4 md:gap-6 text-sm flex-wrap">
              {checkIn && checkOut && (
                <div className="flex items-center gap-2 text-warm-600 bg-warm-50 px-3 py-2 rounded-sm border border-warm-200/50">
                  <CalendarDays className="w-4 h-4 text-brand-600" />
                  <span>
                    {checkIn} ~ {checkOut}
                  </span>
                  <span className="text-brand-700 font-semibold">{nights}박</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-warm-600 bg-warm-50 px-3 py-2 rounded-sm border border-warm-200/50">
                <Users className="w-4 h-4 text-brand-600" />
                <span>{roomCount}실 · {guests}명</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4 mb-2">
            <div className="w-6 md:w-8 h-px bg-brand-600" />
            <p className="text-brand-700 text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-medium">
              Select Room
            </p>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-warm-900">
            객실을 선택해 주세요
          </h2>
          <p className="text-warm-500 text-sm mt-2">
            {rooms.length}개의 객실 타입이 있습니다
          </p>
        </div>

        {/* Room Cards */}
        <div className="space-y-5 md:space-y-6">
          {rooms.map((room) => {
            const totalPrice = room.price * nights;

            return (
              <div
                key={room.id}
                className="flex flex-col md:flex-row bg-white border border-warm-200/50 rounded-sm overflow-hidden hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] transition-all duration-500 group"
              >
                {/* Room Image */}
                <div className="relative h-48 md:h-auto md:w-80 shrink-0 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                    style={{ backgroundImage: `url(${room.images[0]})` }}
                  />
                </div>

                {/* Room Info */}
                <div className="flex-1 p-5 md:p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg md:text-xl text-warm-900 font-medium mb-2 md:mb-3">
                      {room.name}
                    </h3>
                    <p className="text-warm-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {room.description}
                    </p>
                    <div className="flex items-center gap-6 text-warm-500 text-sm mb-4">
                      <div className="flex items-center gap-1.5">
                        <Maximize className="w-4 h-4" />
                        <span>{room.size}m²</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>최대 {room.maxCapacity}인</span>
                      </div>
                      <span>{room.bedType} 베드</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {room.amenities.slice(0, 4).map((a) => (
                        <span
                          key={a}
                          className="flex items-center gap-1.5 text-warm-600 text-xs"
                        >
                          <Check className="w-3 h-3 text-brand-600" />
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-6 pt-6 border-t border-warm-100">
                    <div>
                      {room.originalPrice && (
                        <p className="text-warm-300 text-sm line-through">
                          {(room.originalPrice * nights).toLocaleString()}원
                        </p>
                      )}
                      <p className="text-brand-700 text-2xl font-serif">
                        {totalPrice.toLocaleString()}
                        <span className="text-sm text-warm-400 font-sans ml-1">
                          원 / {nights}박
                        </span>
                      </p>
                      <p className="text-warm-400 text-xs mt-0.5">
                        1박 {room.price.toLocaleString()}원
                      </p>
                    </div>
                    <button
                      onClick={() => handleSelectRoom(room)}
                      className="flex items-center gap-2 px-8 py-3 bg-brand-500 text-warm-900 font-semibold rounded-sm hover:bg-brand-400 transition-all duration-300 hover:shadow-[0_4px_16px_rgba(255,198,0,0.35)] active:scale-[0.98] text-sm tracking-wide"
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
      </div>
    </section>
  );
}
