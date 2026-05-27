"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  about: {
    headline: string;
    description: string;
    features: { icon: string; title: string; description: string }[];
    images: string[];
  };
}

export default function AboutSection({ about }: Props) {
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
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section
      id="about"
      className="relative py-24 md:py-32 lg:py-40 bg-warm-900 text-white overflow-hidden"
    >
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: `url(${about.images[0]})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-warm-900 via-warm-900/95 to-warm-900" />

      <div className="relative max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
        {/* Header */}
        <div className="max-w-2xl mb-16 md:mb-20">
          <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="w-8 md:w-10 h-px bg-white/30" />
            <p className="text-white/50 text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-medium">
              About
            </p>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-[2.25rem] font-light leading-snug mb-6 md:mb-8 tracking-tight">
            {about.headline}
          </h2>

          <p className="text-white/50 text-[15px] leading-[1.85]">
            {about.description}
          </p>
        </div>

        {/* Horizontal Scroll Gallery */}
        <div className="relative -mx-5 md:-mx-8 lg:-mx-12">
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-5 overflow-x-auto px-5 md:px-8 lg:px-12 pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {about.images.map((img, i) => (
              <div
                key={i}
                className="relative shrink-0 w-[75vw] md:w-[45vw] lg:w-[35vw] aspect-[3/2] overflow-hidden rounded-sm snap-start"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out hover:scale-105"
                  style={{ backgroundImage: `url(${img})` }}
                />
              </div>
            ))}
          </div>

          {/* Arrow buttons — md 이상에서만 표시 */}
          <button
            onClick={() => scroll("left")}
            className={`hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-warm-900/70 border border-white/15 backdrop-blur-sm text-white hover:bg-warm-900/90 transition-all duration-300 cursor-pointer ${
              canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-warm-900/70 border border-white/15 backdrop-blur-sm text-white hover:bg-warm-900/90 transition-all duration-300 cursor-pointer ${
              canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
