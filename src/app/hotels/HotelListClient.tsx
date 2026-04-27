"use client";

import { useState, useMemo } from "react";
import { Hotel } from "@/domain/entities";
import Link from "next/link";
import { Star, MapPin, ArrowRight } from "lucide-react";

const REGIONS = [
  { id: "", label: "전체" },
  { id: "서울", label: "서울" },
  { id: "제주", label: "제주" },
  { id: "부산", label: "부산" },
  { id: "경주", label: "경주" },
  { id: "강원", label: "강원" },
  { id: "경기", label: "경기" },
  { id: "전라", label: "전라" },
  { id: "충청", label: "충청" },
];

const PAGE_SIZE = 12;

interface Props {
  hotels: Hotel[];
}

export default function HotelListClient({ hotels }: Props) {
  const [activeRegion, setActiveRegion] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    if (!activeRegion) return hotels;
    return hotels.filter((h) => h.location.includes(activeRegion));
  }, [hotels, activeRegion]);

  // 지역 변경 시 보이는 개수 리셋
  const handleRegionChange = (regionId: string) => {
    setActiveRegion(regionId);
    setVisibleCount(PAGE_SIZE);
  };

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // 지역별 호텔 수 계산
  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = { "": hotels.length };
    REGIONS.forEach((r) => {
      if (r.id) {
        counts[r.id] = hotels.filter((h) => h.location.includes(r.id)).length;
      }
    });
    return counts;
  }, [hotels]);

  return (
    <section className="py-12 md:py-20 bg-[var(--warm-50)]">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">

        {/* Region Filter Chips */}
        <div className="mb-8 md:mb-10">
          <div className="flex flex-wrap gap-2 md:gap-2.5">
            {REGIONS.map((region) => {
              const isActive = activeRegion === region.id;
              const count = regionCounts[region.id] ?? 0;
              return (
                <button
                  key={region.id || "all"}
                  onClick={() => handleRegionChange(region.id)}
                  className={`
                    inline-flex items-center gap-1.5 px-4 py-2 md:px-5 md:py-2.5
                    rounded-full text-sm md:text-[15px] font-medium
                    transition-all duration-300 cursor-pointer
                    ${isActive
                      ? "bg-warm-900 text-white shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
                      : "bg-white text-warm-500 border border-warm-200/70 hover:border-warm-300 hover:text-warm-700"
                    }
                  `}
                >
                  <span>{region.label}</span>
                  <span className={`
                    text-xs tabular-nums
                    ${isActive ? "text-white/60" : "text-warm-300"}
                  `}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Result Count */}
          <p className="mt-4 md:mt-5 text-warm-400 text-sm">
            {activeRegion ? (
              <>
                <span className="text-warm-700 font-medium">{activeRegion}</span>
                {" "}지역{" "}
                <span className="text-brand-700 font-medium">{filtered.length}</span>개 제휴 호텔
              </>
            ) : (
              <>
                전체{" "}
                <span className="text-brand-700 font-medium">{filtered.length}</span>개 제휴 호텔
              </>
            )}
          </p>
        </div>

        {/* Hotel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-7">
          {visible.map((hotel) => (
            <Link
              key={hotel.id}
              href={`/hotels/${hotel.id}`}
              className="group block"
            >
              <div className="flex flex-col md:flex-row bg-white border border-warm-200/50 rounded-sm overflow-hidden hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] transition-all duration-500">
                {/* Image */}
                <div className="relative h-48 md:h-auto md:w-72 shrink-0 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                    style={{ backgroundImage: `url(${hotel.thumbnail})` }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 p-5 md:p-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: hotel.starRating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-brand-500 text-brand-500" />
                      ))}
                    </div>
                    <h3 className="text-lg md:text-xl text-warm-900 font-medium mb-1 group-hover:text-brand-700 transition-colors duration-300">
                      {hotel.name}
                    </h3>
                    <p className="text-warm-400 text-xs tracking-wider uppercase mb-2 md:mb-3 hidden md:block">
                      {hotel.nameEn}
                    </p>
                    <div className="flex items-center gap-1.5 text-warm-500 text-sm mb-2 md:mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{hotel.location}</span>
                      <span className="mx-2 text-warm-200">|</span>
                      <span className="text-brand-700">{hotel.rating}</span>
                      <span className="text-warm-400">({hotel.reviewCount})</span>
                    </div>
                    <p className="text-warm-500 text-sm line-clamp-2 hidden md:block">
                      {hotel.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-end justify-between mt-4 md:mt-5 pt-4 md:pt-5 border-t border-warm-100">
                    <div>
                      <p className="text-warm-400 text-xs mb-0.5">1박 기준</p>
                      <p className="text-brand-700 text-lg md:text-xl font-serif">
                        {hotel.priceFrom.toLocaleString()}
                        <span className="text-sm text-warm-400 ml-0.5">원~</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-warm-400 group-hover:text-brand-700 transition-colors text-sm">
                      <span className="hidden md:inline">자세히 보기</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="mt-10 md:mt-14 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="
                px-8 py-3.5 text-sm font-medium tracking-wide
                text-warm-600 bg-white border border-warm-200
                rounded-sm hover:border-warm-400 hover:text-warm-900
                transition-all duration-300 cursor-pointer
                hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]
              "
            >
              더 보기
              <span className="ml-2 text-warm-300 text-xs">
                {visibleCount} / {filtered.length}
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
