import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { hotelRepository } from "@/providers/repositories";
import HotelListClient from "./HotelListClient";

export default async function HotelsPage() {
  const hotels = await hotelRepository.getAll();

  return (
    <main className="min-h-screen bg-[var(--warm-50)] flex flex-col">
      <Header
        transparent
        navItems={[
          { label: "예약", href: "/booking", variant: "button" },
        ]}
      />

      {/* Hero Banner */}
      <section className="relative h-[50vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(https://picsum.photos/seed/hotellist/1920/800)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/15 to-[var(--warm-50)]/70" />
        </div>
        <div className="relative text-center">
          <p className="text-white/50 text-xs tracking-wider uppercase mb-3">
            Hotels
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl text-white mb-3">
            호텔 컬렉션
          </h1>
          <p className="text-white/50 text-base font-light">
            전국 {hotels.length}개 제휴 호텔에서 특별한 경험을 만나보세요
          </p>
        </div>
      </section>

      <HotelListClient hotels={hotels} />

      <Footer />
    </main>
  );
}
