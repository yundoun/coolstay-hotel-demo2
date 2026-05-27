"use client";

import { useStoreInfo } from "@/application/hooks/useStoreInfo";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import GreetingSection from "@/components/sections/GreetingSection";
import AboutSection from "@/components/sections/AboutSection";
import RoomsSection from "@/components/sections/RoomsSection";
import BookingSection from "@/components/sections/BookingSection";
import LocationSection from "@/components/sections/LocationSection";

export default function HomePage() {
  const { data: store, loading, error } = useStoreInfo();

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-warm-300 border-t-warm-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-warm-500 text-sm">숙소 정보를 불러오는 중...</p>
        </div>
      </main>
    );
  }

  if (error || !store) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-warm-700 text-lg font-medium mb-2">숙소 정보를 불러올 수 없습니다</p>
          <p className="text-warm-500 text-sm">{error || "잠시 후 다시 시도해 주세요."}</p>
        </div>
      </main>
    );
  }

  // StoreInfo → 각 섹션 props 매핑
  const hero = {
    slides: store.images.slice(0, 5).map((img, i) => ({
      image: img.url,
      title: i === 0 ? store.name : img.description || store.name,
      subtitle: i === 0 ? "WELCOME" : `GALLERY ${i}`,
    })),
  };

  const greeting = {
    ownerName: "",
    title: store.name,
    message: store.greetingMsg || `${store.name}에 오신 것을 환영합니다.`,
    signature: store.name,
    image: store.images[0]?.url,
  };

  const about = {
    headline: store.name,
    description: store.policyMsg || `${store.name}에서 특별한 순간을 만나보세요.`,
    features: [] as { icon: string; title: string; description: string }[],
    images: store.images.map((img) => img.url),
  };

  // 주차, 현장결제 등 실 데이터 기반 features
  if (store.parkingYn) {
    about.features.push({
      icon: "car",
      title: "주차 가능",
      description: store.parkingInfo || "무료 주차 가능",
    });
  }
  if (store.sitePayment) {
    about.features.push({
      icon: "banknote",
      title: "현장결제",
      description: "체크인 시 프론트에서 결제",
    });
  }
  if (store.benefitRoom) {
    about.features.push({
      icon: "sparkles",
      title: "객실 혜택",
      description: store.benefitRoom,
    });
  }
  if (store.benefitExtra) {
    about.features.push({
      icon: "gift",
      title: "추가 혜택",
      description: store.benefitExtra,
    });
  }

  const location = {
    address: store.address,
    addressDetail: store.locationDesc || "",
    lat: parseFloat(store.latitude) || 0,
    lng: parseFloat(store.longitude) || 0,
    directions: [] as { method: string; description: string }[],
  };

  // Footer용 간이 config
  const footerConfig = {
    name: store.name,
    phone: store.phone,
    email: "",
    location: { address: store.address },
    checkInTime: store.rooms[0]?.checkInTime || "15:00",
    checkOutTime: store.rooms[0]?.checkOutTime || "11:00",
  };

  return (
    <main className="min-h-screen bg-background">
      <Header transparent />
      <HeroSection hero={hero} hotelName={store.name} />
      <GreetingSection greeting={greeting} />
      <AboutSection about={about} />
      <RoomsSection rooms={store.rooms} storeKey={store.motelKey} />
      <BookingSection storeKey={store.motelKey} storeName={store.name} sitePayment={store.sitePayment} />
      <LocationSection location={location} hotelName={store.name} />
      <Footer footerData={footerConfig} />
    </main>
  );
}
