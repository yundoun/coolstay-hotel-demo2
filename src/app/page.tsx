import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import GreetingSection from "@/components/sections/GreetingSection";
import AboutSection from "@/components/sections/AboutSection";
import RoomsSection from "@/components/sections/RoomsSection";
import BookingSection from "@/components/sections/BookingSection";
import LocationSection from "@/components/sections/LocationSection";
import hotelConfig from "@/config/hotel";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header transparent />
      <HeroSection hero={hotelConfig.hero} hotelName={hotelConfig.name} />
      <GreetingSection greeting={hotelConfig.greeting} />
      <AboutSection about={hotelConfig.about} />
      <RoomsSection rooms={hotelConfig.rooms} />
      <BookingSection hotelConfig={hotelConfig} />
      <LocationSection location={hotelConfig.location} hotelName={hotelConfig.name} />
      <Footer hotelConfig={hotelConfig} />
    </main>
  );
}
