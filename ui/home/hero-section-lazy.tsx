"use client";

import dynamic from "next/dynamic";

const HeroSection = dynamic(() => import("./hero-section"), {
  ssr: false,
  loading: () => (
    <section className="relative h-screen w-full overflow-hidden bg-warm-900">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
    </section>
  ),
});

export default HeroSection;
