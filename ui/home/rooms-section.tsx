"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Users, Maximize, ChevronLeft, ChevronRight } from "lucide-react";
import type { RoomType } from "@/adapters/coolstay/types";

interface Props {
  rooms: RoomType[];
  storeKey: string;
  onSelectRoom?: (roomId: string) => void;
}

export default function RoomsSection({ rooms, onSelectRoom }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const handleClick = (roomId: string) => {
    if (onSelectRoom) {
      onSelectRoom(roomId);
    }
    const bookingEl = document.getElementById("reservation");
    if (bookingEl) bookingEl.scrollIntoView({ behavior: "smooth" });
  };

  if (rooms.length === 0) return null;

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
      </div>

      {/* Horizontal Scroll Cards */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-5 md:gap-6 overflow-x-auto px-5 md:px-8 lg:px-12 pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* 왼쪽 여백: max-w-[1400px] 센터 정렬 맞추기 */}
          <div
            className="shrink-0 hidden lg:block"
            style={{ width: "calc((100vw - 1400px) / 2)" }}
          />

          {rooms.map((room) => {
            const thumbImage = room.images[0]?.thumbUrl || room.images[0]?.url || "";
            return (
              <div
                key={room.itemKey}
                className="group shrink-0 w-[85vw] md:w-[45vw] lg:w-[380px] bg-white border border-warm-200/50 rounded-sm overflow-hidden hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)] transition-shadow duration-300 snap-start flex flex-col"
              >
                {/* Image */}
                <div className="relative h-56 md:h-60 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${thumbImage})` }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg md:text-xl text-warm-900 font-medium mb-2">
                      {room.name}
                    </h3>
                    {room.description && (
                      <p className="text-warm-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {room.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-warm-500 text-sm mb-4">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>최대 {room.maxGuests}인</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-5 pt-5 border-t border-warm-100">
                    <div>
                      <p className="text-warm-900 text-xl font-bold">
                        {room.basePrice.toLocaleString()}
                        <span className="text-sm text-warm-400 font-normal ml-1">
                          원~
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleClick(room.itemKey)}
                      className="px-5 py-2.5 bg-sig-500 text-warm-900 font-semibold rounded-sm hover:bg-sig-400 transition-colors duration-200 text-sm tracking-wide"
                    >
                      예약하기
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 오른쪽 여백 */}
          <div className="shrink-0 w-1" />
        </div>

        {/* Arrow Buttons */}
        <button
          onClick={() => scroll("left")}
          className={`hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white/80 border border-warm-200 backdrop-blur-sm text-warm-700 hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer ${
            canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll("right")}
          className={`hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white/80 border border-warm-200 backdrop-blur-sm text-warm-700 hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer ${
            canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
