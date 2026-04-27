import Header from "@/components/layout/Header";
import SearchBar from "@/components/layout/SearchBar";
import Footer from "@/components/layout/Footer";
import HeroCarousel from "@/components/home/HeroCarousel";
import FeaturedHotels from "@/components/home/FeaturedHotels";
import EventCarousel from "@/components/home/EventCarousel";
import { hotelRepository, contentRepository } from "@/providers/repositories";

export default async function HomePage() {
  const [heroSlides, featuredHotels, events] = await Promise.all([
    contentRepository.getHeroSlides(),
    hotelRepository.getFeatured(),
    contentRepository.getEvents(),
  ]);

  return (
    <main className="min-h-screen bg-background pb-[72px]">
      <Header transparent />
      <HeroCarousel slides={heroSlides} />
      <FeaturedHotels hotels={featuredHotels} />
      <EventCarousel events={events} />
      <Footer />
      <SearchBar />
    </main>
  );
}
