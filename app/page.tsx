import { siteConfig } from "@/hotel-data";
import Header from "@/ui/layout/site-header";
import Footer from "@/ui/layout/site-footer";
import HeroSection from "@/ui/home/hero-section-lazy";
import GreetingSection from "@/ui/home/greeting-section";
import AboutSection from "@/ui/home/about-section";
import RoomsSectionConnected from "@/ui/home/rooms-section-connected";
import { OnepageReservation } from "@/ui/reservation/onepage-reservation";
import LocationSection from "@/ui/home/location-section";

const { greeting, about, directions } = siteConfig;

const greetingData = {
  ownerName: "",
  title: siteConfig.name,
  message: greeting.body,
  signature: greeting.signature,
  image: siteConfig.heroImages[0],
};

const aboutData = {
  headline: siteConfig.name,
  description: about.body || `${siteConfig.name}에서 특별한 순간을 만나보세요.`,
  features: [] as { icon: string; title: string; description: string }[],
  images: about.images.slice(0, 5),
};

const locationData = {
  address: siteConfig.address,
  infoItems: [
    { label: "연락처", value: siteConfig.phone },
    ...(directions.parkingInfo
      ? [{ label: "주차", value: directions.parkingInfo }]
      : []),
    ...directions.nearbyItems,
  ],
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header transparent />

      <HeroSection
        images={siteConfig.heroImages.slice(0, 5)}
        hotelName={siteConfig.name}
        titleSize={siteConfig.heroTitleSize}
      />

      <GreetingSection greeting={greetingData} />

      <AboutSection about={aboutData} />

      <RoomsSectionConnected />

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
              <span className="text-lg md:text-xl lg:text-2xl text-warm-900 font-light ml-2">(Powered by 꿀스테이)</span>
            </h2>
          </div>
          <OnepageReservation />
        </div>
      </section>

      <LocationSection location={locationData} hotelName={siteConfig.name} />

      <Footer />
    </main>
  );
}
