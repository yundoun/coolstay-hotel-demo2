"use client";

import { Hotel } from "@/domain/entities";
import Link from "next/link";
import { Star, MapPin, ArrowRight } from "lucide-react";

interface Props {
  hotels: Hotel[];
}

export default function HotelListClient({ hotels }: Props) {
  return (
    <section className="py-12 md:py-20 bg-[var(--warm-50)]">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-7">
          {hotels.map((hotel) => (
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
      </div>
    </section>
  );
}
