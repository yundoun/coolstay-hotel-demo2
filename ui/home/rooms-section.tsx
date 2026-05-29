"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Users, ChevronLeft, ChevronRight } from "lucide-react";
import type { RoomType } from "@/adapters/coolstay/types";

interface Props {
  rooms: RoomType[];
  storeKey: string;
  onSelectRoom?: (roomId: string) => void;
}

export default function RoomsSection({ rooms, onSelectRoom }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [needsScroll, setNeedsScroll] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollable = el.scrollWidth > el.clientWidth + 2;
    const left = el.scrollLeft > 4;
    const right = el.scrollLeft < el.scrollWidth - el.clientWidth - 4;

    setNeedsScroll(scrollable);
    setCanScrollLeft(scrollable && left);
    setCanScrollRight(scrollable && right);
  }, [rooms.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // 초기 체크 + 이미지 로드 후 재계산
    checkScroll();
    const timer = setTimeout(checkScroll, 300);

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>("[data-room-card]")?.offsetWidth ?? 320;
    const gap = 24;
    el.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });
  };

  const handleClick = (roomId: string) => {
    onSelectRoom?.(roomId);
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

        {/* Cards Container */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-5 md:gap-6 overflow-x-auto pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >

            {rooms.map((room) => {
              const thumbImage = room.images[0]?.thumbUrl || room.images[0]?.url || "";
              return (
                <div
                  key={room.itemKey}
                  data-room-card
                  className="group shrink-0 w-[85vw] md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-72px)/4)] bg-white border border-warm-200/50 rounded-sm overflow-hidden hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)] transition-shadow duration-300 snap-start flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-56 md:h-60 overflow-hidden">
                    {thumbImage && (
                      <Image
                        src={thumbImage}
                        alt={room.name}
                        fill
                        sizes="(max-width: 768px) 85vw, (max-width: 1024px) calc(50% - 12px), calc(25% - 18px)"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    )}
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
                          <span className="text-sm text-warm-400 font-normal ml-1">원~</span>
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
          </div>

          {/* Arrow Buttons — needsScroll일 때만 렌더 */}
          {needsScroll && (
            <>
              <button
                onClick={() => scroll("left")}
                className={`hidden md:flex absolute -left-5 lg:-left-6 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white/90 border border-warm-200 backdrop-blur-sm text-warm-700 hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer z-10 ${
                  canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                aria-label="이전 객실"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className={`hidden md:flex absolute -right-5 lg:-right-6 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white/90 border border-warm-200 backdrop-blur-sm text-warm-700 hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer z-10 ${
                  canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                aria-label="다음 객실"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
