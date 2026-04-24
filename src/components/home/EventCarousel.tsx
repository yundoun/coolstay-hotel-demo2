"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { Event } from "@/domain/entities";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import "swiper/css";

interface Props {
  events: Event[];
}

export default function EventCarousel({ events }: Props) {
  return (
    <section className="py-14 md:py-24 bg-warm-100/50 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 md:mb-10">
          <div>
            <p className="text-warm-400 text-xs tracking-wider mb-1.5">
              Events
            </p>
            <h2 className="font-serif text-2xl md:text-[2.2rem] text-warm-900 leading-tight">
              특별한 혜택
            </h2>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <button className="event-prev w-9 h-9 rounded-full border border-warm-300/80 flex items-center justify-center hover:bg-warm-900 hover:border-warm-900 hover:text-white transition-all duration-200 text-warm-400">
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button className="event-next w-9 h-9 rounded-full border border-warm-300/80 flex items-center justify-center hover:bg-warm-900 hover:border-warm-900 hover:text-white transition-all duration-200 text-warm-400">
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={12}
          slidesPerView={1.15}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3.2, spaceBetween: 20 },
          }}
          navigation={{
            prevEl: ".event-prev",
            nextEl: ".event-next",
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <Link href={event.link} className="group block">
                <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url(${event.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                    {event.badge && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-warm-800 text-[10px] tracking-wide px-2.5 py-1 rounded-full font-medium">
                        {event.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-5">
                    <h3 className="text-warm-900 text-base font-medium mb-1.5 group-hover:text-brand-700 transition-colors duration-200">
                      {event.title}
                    </h3>
                    <p className="text-warm-400 text-sm leading-relaxed line-clamp-2">
                      {event.description}
                    </p>

                    <div className="mt-4 flex items-center gap-1.5 text-warm-400 text-xs group-hover:text-warm-700 transition-colors">
                      <span>자세히 보기</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
