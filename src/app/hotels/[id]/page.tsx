import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
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
    <main className="min-h-screen bg-[var(--warm-50)] flex flex-col">
      <Header
        transparent
        navItems={[
          { label: "예약", href: "/booking", variant: "button" },
        ]}
      />
      <HotelDetailClient hotel={hotel} rooms={rooms} />
      <div className="flex-1" />
      <Footer />
    </main>
  );
}
