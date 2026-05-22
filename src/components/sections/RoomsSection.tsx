"use client";

import { Users, Maximize, Check } from "lucide-react";
import type { Room } from "@/domain/entities";

interface Props {
  rooms: Room[];
  onSelectRoom?: (roomId: string) => void;
}

export default function RoomsSection({ rooms, onSelectRoom }: Props) {
  const handleClick = (roomId: string) => {
    if (onSelectRoom) {
      onSelectRoom(roomId);
    }
    const bookingEl = document.getElementById("booking");
    if (bookingEl) bookingEl.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="rooms" className="relative py-24 md:py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="w-8 md:w-10 h-px bg-warm-400" />
            <p className="text-warm-500 text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-medium">
              Rooms
            </p>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-[2.25rem] text-warm-900 font-light leading-snug tracking-tight">
            객실 안내
          </h2>
          <p className="text-warm-500 text-[15px] mt-3">
            {rooms.length}개의 객실 타입을 만나보세요
          </p>
        </div>

        {/* Room Cards */}
        <div className="space-y-6 md:space-y-8">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="flex flex-col md:flex-row bg-white border border-warm-200/50 rounded-sm overflow-hidden hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)] transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-56 md:h-auto md:w-[380px] shrink-0 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${room.images[0]})` }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg md:text-xl text-warm-900 font-medium mb-3">
                    {room.name}
                  </h3>
                  <p className="text-warm-500 text-sm mb-5 line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>

                  <div className="flex items-center gap-5 text-warm-500 text-sm mb-5">
                    <div className="flex items-center gap-1.5">
                      <Maximize className="w-4 h-4" />
                      <span>{room.size}m&sup2;</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>최대 {room.maxCapacity}인</span>
                    </div>
                    <span>{room.bedType} 베드</span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {room.amenities.slice(0, 5).map((a) => (
                      <span
                        key={a}
                        className="flex items-center gap-1.5 text-warm-600 text-xs"
                      >
                        <Check className="w-3 h-3 text-warm-400" />
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
                    <p className="text-warm-900 text-2xl font-bold">
                      {room.price.toLocaleString()}
                      <span className="text-sm text-warm-400 font-normal ml-1">
                        원 / 1박
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleClick(room.id)}
                    className="px-7 py-3 bg-sig-500 text-warm-900 font-semibold rounded-sm hover:bg-sig-400 transition-colors duration-200 text-sm tracking-wide"
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
  );
}
