"use client";

import { siteHotel, siteContent } from "@/hotel-data";
import { useStoreInfo } from "@/application/hooks/useStoreInfo";
import Header from "@/ui/layout/site-header";
import Footer from "@/ui/layout/site-footer";
import HeroSection from "@/ui/home/hero-section";
import GreetingSection from "@/ui/home/greeting-section";
import AboutSection from "@/ui/home/about-section";
import RoomsSection from "@/ui/home/rooms-section";
import { OnepageReservation } from "@/ui/reservation/onepage-reservation";
import LocationSection from "@/ui/home/location-section";

export default function HomePage() {
  const { greeting, about, directions } = siteContent;

  // 동적 데이터 (객실/가격 등) — 로딩 중에도 정적 섹션은 즉시 렌더링
  const { data: store } = useStoreInfo();

  // Hero — 정적 hotel-data 기반
  const hero = {
    slides: siteHotel.heroImages.map((image, i) => ({
      image,
      title: i === 0 ? siteHotel.name : siteHotel.name,
      subtitle: i === 0 ? "WELCOME" : `GALLERY ${i}`,
    })),
  };

  // Greeting — 정적 content 기반
  const greetingProps = {
    ownerName: "",
    title: siteHotel.name,
    message: greeting.body,
    signature: greeting.signature,
    image: siteHotel.heroImages[0],
  };

  // About — 정적 content 기반
  const aboutProps = {
    headline: siteHotel.name,
    description: about[0]?.body || `${siteHotel.name}에서 특별한 순간을 만나보세요.`,
    features: about
      .filter((b) => b.type === "feature-grid")
      .flatMap((b) => b.features ?? []),
    images: siteHotel.heroImages,
  };

  // Location — 정적 content 기반
  const location = {
    address: siteHotel.address,
    addressDetail: "",
    lat: 0,
    lng: 0,
    directions: [] as { method: string; description: string }[],
  };

  // Footer — 정적 hotel-data 기반
  const footerConfig = {
    name: siteHotel.name,
    phone: siteHotel.phone,
    email: "",
    location: { address: siteHotel.address },
    checkInTime: siteHotel.checkInTime,
    checkOutTime: siteHotel.checkOutTime,
  };

  return (
    <main className="min-h-screen bg-background">
      <Header transparent />
      <HeroSection hero={hero} hotelName={siteHotel.name} />
      <GreetingSection greeting={greetingProps} />
      <AboutSection about={aboutProps} />
      <RoomsSection
        rooms={store?.rooms ?? []}
        storeKey={store?.motelKey ?? ""}
      />
      {/* ── 예약 (4단계 인라인 플로우) ── */}
      <section id="reservation" className="py-24 md:py-32 lg:py-40 bg-[var(--warm-50)]">
        <div className="relative max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
          <div className="mb-10 md:mb-14">
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="w-8 md:w-10 h-px bg-warm-400" />
              <p className="text-warm-900 text-[10px] md:text-[11px] tracking-[0.35em] uppercase font-medium">
                Reservation
              </p>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-[2.25rem] text-warm-900 font-light leading-snug tracking-tight">
              온라인 예약
            </h2>
          </div>
          <OnepageReservation />
        </div>
      </section>
      <LocationSection location={location} hotelName={siteHotel.name} />
      <Footer footerData={footerConfig} />
    </main>
  );
}
