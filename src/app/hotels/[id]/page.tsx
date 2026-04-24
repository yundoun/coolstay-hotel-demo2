import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import SearchBar from "@/components/layout/SearchBar";
import Footer from "@/components/layout/Footer";
import HotelDetailClient from "./HotelDetailClient";
import { hotelRepository, roomRepository } from "@/providers/repositories";

interface Props {
  params: { id: string };
}

export default async function HotelDetailPage({ params }: Props) {
  const [hotel, rooms] = await Promise.all([
    hotelRepository.getById(params.id),
    roomRepository.getByHotelId(params.id),
  ]);

  if (!hotel) return notFound();

  return (
    <main className="min-h-screen bg-[var(--warm-50)]">
      <Header
        transparent
        backHref="/hotels"
        backLabel="호텔 목록"
        navItems={[{ label: "예약", href: `/hotels/${hotel.id}#rooms`, variant: "button" }]}
      />
      <HotelDetailClient hotel={hotel} rooms={rooms} />
      <Footer />
      <SearchBar mode="booking" hotelId={hotel.id} hotelName={hotel.name} />
    </main>
  );
}
