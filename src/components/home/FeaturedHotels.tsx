"use client";

import { Hotel } from "@/domain/entities";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

interface Props {
  hotels: Hotel[];
}

export default function FeaturedHotels({ hotels }: Props) {
  return (
    <section className="py-14 md:py-24">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 md:mb-14">
          <div>
            <p className="text-warm-400 text-xs tracking-wider mb-1.5">
              Hotels
            </p>
            <h2 className="font-serif text-2xl md:text-[2.2rem] text-warm-900 leading-tight">
              엄선된 호텔
            </h2>
          </div>
          <Link
            href="/hotels"
            className="hidden md:flex items-center gap-1.5 text-warm-400 hover:text-warm-700 transition-colors text-sm group"
          >
            <span>전체 보기</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
          {hotels[0] && (
            <div className="md:col-span-7">
              <HotelCard hotel={hotels[0]} variant="hero" />
            </div>
          )}
          {hotels[1] && (
            <div className="md:col-span-5">
              <HotelCard hotel={hotels[1]} variant="tall" />
            </div>
          )}
          {hotels[2] && (
            <div className="md:col-span-5">
              <HotelCard hotel={hotels[2]} variant="standard" />
            </div>
          )}
          {hotels[3] && (
            <div className="md:col-span-7">
              <HotelCard hotel={hotels[3]} variant="wide" />
            </div>
          )}
        </div>

        {/* Mobile link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/hotels"
            className="inline-flex items-center gap-1.5 text-warm-400 hover:text-warm-700 transition-colors text-sm"
          >
            <span>전체 보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function HotelCard({
  hotel,
  variant,
}: {
  hotel: Hotel;
  variant: "hero" | "tall" | "standard" | "wide";
}) {
  const heightClass = {
    hero: "h-[260px] md:h-[440px]",
    tall: "h-[260px] md:h-[440px]",
    standard: "h-[240px] md:h-[340px]",
    wide: "h-[240px] md:h-[340px]",
  }[variant];

  return (
    <Link href={`/hotels/${hotel.id}`} className="group block">
      <div
        className={`relative ${heightClass} rounded-lg overflow-hidden cursor-pointer`}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          style={{ backgroundImage: `url(${hotel.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

        {/* Tag */}
        {hotel.tags[0] && (
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-warm-800 text-[10px] tracking-wide px-2.5 py-1 rounded-full font-medium">
              {hotel.tags[0]}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-white text-lg md:text-xl font-medium mb-1 group-hover:text-brand-300 transition-colors duration-300">
                {hotel.name}
              </h3>
              <div className="flex items-center gap-1 text-white/45 text-xs">
                <MapPin className="w-3 h-3" />
                <span>{hotel.location}</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-white/35 text-[10px] mb-0.5">1박</p>
              <p className="text-white text-lg font-medium tabular-nums">
                {hotel.priceFrom.toLocaleString()}
                <span className="text-xs text-white/40 ml-0.5">원</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
