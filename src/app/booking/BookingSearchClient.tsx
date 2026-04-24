"use client";

import { Hotel } from "@/domain/entities";
import Link from "next/link";
import { Star, MapPin, ArrowRight } from "lucide-react";

interface Props {
  hotels: Hotel[];
  searchParams: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
}

export default function BookingSearchClient({ hotels }: Props) {
  return (
    <section className="py-12 bg-[var(--warm-50)]">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
        <p className="text-warm-500 text-sm mb-8">
          총 <span className="text-brand-700 font-semibold">{hotels.length}</span>개의 호텔
        </p>

        <div className="space-y-5">
          {hotels.map((hotel) => (
            <Link
              key={hotel.id}
              href={`/hotels/${hotel.id}`}
              className="group block"
            >
              <div className="flex flex-col md:flex-row bg-white border border-warm-200/50 rounded-sm overflow-hidden hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] transition-all duration-500">
                <div className="relative h-48 md:h-52 md:w-64 shrink-0 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                    style={{ backgroundImage: `url(${hotel.thumbnail})` }}
                  />
                </div>

                <div className="flex-1 p-5 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: hotel.starRating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-brand-500 text-brand-500"
                        />
                      ))}
                      <span className="ml-2 text-warm-400 text-sm">
                        {hotel.rating} ({hotel.reviewCount})
                      </span>
                    </div>
                    <h3 className="text-xl text-warm-900 font-medium mb-1 group-hover:text-brand-700 transition-colors duration-300">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-warm-500 text-sm mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{hotel.location}</span>
                    </div>
                    <p className="text-warm-500 text-sm">
                      {hotel.shortDescription}
                    </p>
                  </div>

                  <div className="text-right shrink-0 ml-8">
                    <p className="text-warm-400 text-xs mb-1">1박 기준</p>
                    <p className="text-brand-700 text-2xl font-serif mb-4">
                      {hotel.priceFrom.toLocaleString()}
                      <span className="text-sm text-warm-400 font-sans ml-0.5">원~</span>
                    </p>
                    <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-500 text-warm-900 font-semibold rounded-sm text-sm tracking-wide">
                      객실 선택
                      <ArrowRight className="w-4 h-4" />
                    </span>
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
