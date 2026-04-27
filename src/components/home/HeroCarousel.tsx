"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { HeroSlide } from "@/domain/entities";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";

interface Props {
  slides: HeroSlide[];
}

export default function HeroCarousel({ slides }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        loop
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <div
                className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[8000ms] ease-out"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-black/10" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Content overlay */}
      <div className="absolute inset-0 z-10 flex items-end pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 w-full pb-36 md:pb-40">
          <div className="max-w-lg md:max-w-xl pointer-events-auto">
            <p className="text-white/50 text-[11px] md:text-xs tracking-widest uppercase mb-3 md:mb-4 opacity-0 animate-fade-in-up">
              {slides[activeIndex]?.subtitle}
            </p>

            <h1
              key={activeIndex}
              className="font-serif text-[2rem] md:text-[3rem] lg:text-[3.8rem] text-white leading-[1.12] mb-4 md:mb-6 whitespace-pre-line opacity-0 animate-fade-in-up animation-delay-100"
            >
              {slides[activeIndex]?.title}
            </h1>

            <p className="text-white/55 text-sm md:text-base leading-relaxed mb-6 md:mb-8 max-w-sm font-light opacity-0 animate-fade-in-up animation-delay-200">
              {slides[activeIndex]?.description}
            </p>

            {slides[activeIndex]?.cta && (
              <Link
                href={slides[activeIndex]?.ctaLink || "/hotels"}
                className="inline-flex items-center gap-2.5 text-white/80 text-sm hover:text-white transition-colors group opacity-0 animate-fade-in-up animation-delay-300"
              >
                <span className="border-b border-white/25 pb-0.5 group-hover:border-white/60 transition-colors">
                  {slides[activeIndex]?.cta}
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Pagination - minimal */}
      <div className="absolute bottom-36 md:bottom-40 right-5 md:right-8 lg:right-12 z-10 flex items-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => swiperInstance?.slideTo(i + 1)}
            className={`transition-all duration-500 rounded-full h-1.5 ${
              i === activeIndex
                ? "w-6 bg-white"
                : "w-1.5 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
