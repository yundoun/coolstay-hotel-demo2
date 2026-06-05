"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronDown } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";

interface Props {
  images: string[];
  hotelName: string;
  titleSize?: "base" | "sm";
}

const TITLE_CLASSES = {
  base: "text-[2rem] md:text-[3rem] lg:text-[3.5rem]",
  sm: "text-[1.5rem] md:text-[2.25rem] lg:text-[2.75rem]",
} as const;

export default function HeroSection({ images, hotelName, titleSize = "base" }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const scrollToGreeting = () => {
    document.getElementById("greeting")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 10_000, disableOnInteraction: false }}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        loop
        className="h-full w-full"
      >
        {images.map((image, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full w-full">
              <Image
                src={image}
                alt={`${hotelName} ${i + 1}`}
                fill
                sizes="100vw"
                priority={i === 0}
                className="object-cover scale-105 transition-transform duration-[8000ms] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Content overlay — 공통 텍스트 */}
      <div className="absolute inset-0 z-10 flex items-end pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 w-full pb-28 md:pb-32">
          <div className="max-w-lg md:max-w-xl pointer-events-auto">
            <p className="text-white/40 text-[10px] md:text-[11px] tracking-[0.4em] uppercase mb-4 md:mb-5 font-medium">
              WELCOME
            </p>

            <h1 className={`${TITLE_CLASSES[titleSize]} text-white font-light leading-[1.15] mb-5 md:mb-7 whitespace-nowrap tracking-tight`}>
              {hotelName}
            </h1>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="absolute bottom-28 md:bottom-32 right-5 md:right-8 lg:right-12 z-10 flex items-center gap-1.5">
        {images.map((_, i) => (
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

      {/* Scroll indicator */}
      <button
        onClick={scrollToGreeting}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
}
