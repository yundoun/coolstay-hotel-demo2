"use client";

import { useState } from "react";
import { Hotel, Room } from "@/domain/entities";
import { useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Clock,
  Users,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

interface Props {
  hotel: Hotel;
  rooms: Room[];
}

export default function HotelDetailClient({ hotel, rooms }: Props) {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);

  const handleBookRoom = (room: Room) => {
    const params = new URLSearchParams({
      hotelId: hotel.id,
      roomId: room.id,
      checkIn: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      checkOut: new Date(Date.now() + 8 * 86400000).toISOString().split("T")[0],
      guests: "2",
    });
    router.push(`/booking/confirm?${params.toString()}`);
  };

  return (
    <>
      {/* Gallery */}
      <section className="relative h-[50vh] md:h-[60vh] mt-14 md:mt-16">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url(${hotel.images[currentImage]})` }}
        />

        {/* Gallery Navigation */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2.5 z-20">
          <button
            onClick={() =>
              setCurrentImage((prev) =>
                prev === 0 ? hotel.images.length - 1 : prev - 1
              )
            }
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <span className="text-white/80 text-xs tabular-nums">
            {currentImage + 1} / {hotel.images.length}
          </span>
          <button
            onClick={() =>
              setCurrentImage((prev) =>
                prev === hotel.images.length - 1 ? 0 : prev + 1
              )
            }
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </section>

      {/* Hotel Title - separated from image */}
      <section className="bg-white border-b border-warm-200/50">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 py-6 md:py-8">
          <div className="flex items-center gap-0.5 mb-2">
            {Array.from({ length: hotel.starRating }).map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-brand-500 text-brand-500"
              />
            ))}
          </div>
          <h1 className="font-serif text-2xl md:text-3xl text-warm-900 mb-1">
            {hotel.name}
          </h1>
          <p className="text-warm-400 text-sm">
            {hotel.nameEn}
          </p>
        </div>
      </section>

      {/* Hotel Info */}
      <section className="py-10 md:py-16 border-b border-warm-200/50 bg-[var(--warm-50)]">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            <div className="md:col-span-2">
              <p className="text-warm-600 text-base md:text-lg leading-[1.9] mb-6 md:mb-8">
                {hotel.description}
              </p>
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-8 text-warm-500 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-600" />
                  <span>{hotel.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-600" />
                  <span>
                    체크인 {hotel.checkInTime} / 체크아웃 {hotel.checkOutTime}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white border border-warm-200/50 rounded-sm p-7 mb-6">
                <div className="text-center">
                  <p className="text-brand-700 text-4xl font-serif mb-1">
                    {hotel.rating}
                  </p>
                  <p className="text-warm-400 text-sm">
                    {hotel.reviewCount}개의 리뷰
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-warm-500 text-[10px] tracking-[0.3em] uppercase mb-4">
                  편의시설
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="text-warm-600 text-xs bg-warm-100 px-3 py-1.5 rounded-sm border border-warm-200/50"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room List */}
      <section className="py-12 md:py-20 bg-warm-100">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
          <div className="mb-6 md:mb-10" id="rooms">
            <p className="text-warm-400 text-xs tracking-wider mb-1.5">Rooms</p>
            <h2 className="font-serif text-2xl md:text-[2rem] text-warm-900">
              객실 선택
            </h2>
          </div>

          <div className="space-y-5 md:space-y-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="flex flex-col md:flex-row bg-white border border-warm-200/50 rounded-sm overflow-hidden hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] transition-all duration-500 group"
              >
                <div className="relative h-48 md:h-auto md:w-80 shrink-0 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                    style={{ backgroundImage: `url(${room.images[0]})` }}
                  />
                </div>

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
                          {room.originalPrice.toLocaleString()}원
                        </p>
                      )}
                      <p className="text-brand-700 text-2xl font-serif">
                        {room.price.toLocaleString()}
                        <span className="text-sm text-warm-400 font-sans ml-1">
                          원 / 1박
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleBookRoom(room)}
                      className="px-8 py-3 bg-brand-500 text-warm-900 font-semibold rounded-sm hover:bg-brand-400 transition-all duration-300 hover:shadow-[0_4px_16px_rgba(255,198,0,0.35)] active:scale-[0.98] text-sm tracking-wide"
                    >
                      예약하기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
