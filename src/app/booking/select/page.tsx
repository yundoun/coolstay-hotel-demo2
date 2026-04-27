import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StepIndicator from "@/components/booking/StepIndicator";
import RoomSelectClient from "./RoomSelectClient";
import { hotelRepository, roomRepository } from "@/providers/repositories";

interface Props {
  searchParams: {
    hotelId?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    rooms?: string;
  };
}

export default async function BookingSelectPage({ searchParams }: Props) {
  const { hotelId, checkIn, checkOut, guests, rooms: roomCount } = searchParams;

  if (!hotelId) return notFound();

  const [hotel, rooms] = await Promise.all([
    hotelRepository.getById(hotelId),
    roomRepository.getByHotelId(hotelId),
  ]);

  if (!hotel) return notFound();

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            86400000
        )
      : 1;

  return (
    <main className="min-h-screen bg-[var(--warm-50)] flex flex-col">
      <Header navItems={[{ label: "호텔", href: "/hotels" }]} />

      <div className="pt-14 md:pt-16">
        <StepIndicator currentStep={2} />
      </div>

      <RoomSelectClient
        hotel={hotel}
        rooms={rooms}
        checkIn={checkIn || ""}
        checkOut={checkOut || ""}
        nights={nights}
        guests={Number(guests) || 2}
        roomCount={Number(roomCount) || 1}
      />

      <div className="flex-1" />
      <Footer />
    </main>
  );
}
