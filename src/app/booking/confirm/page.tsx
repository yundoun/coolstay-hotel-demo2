import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StepIndicator from "@/components/booking/StepIndicator";
import { hotelRepository, roomRepository } from "@/providers/repositories";
import { notFound } from "next/navigation";
import BookingConfirmClient from "./BookingConfirmClient";

interface Props {
  searchParams: {
    hotelId?: string;
    roomId?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  };
}

export default async function BookingConfirmPage({ searchParams }: Props) {
  const { hotelId, roomId, checkIn, checkOut, guests } = searchParams;

  if (!hotelId || !roomId || !checkIn || !checkOut) return notFound();

  const [hotel, room] = await Promise.all([
    hotelRepository.getById(hotelId),
    roomRepository.getById(hotelId, roomId),
  ]);

  if (!hotel || !room) return notFound();

  const nights = Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
  );

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header navItems={[{ label: "호텔", href: "/hotels" }]} />
      <div className="pt-14 md:pt-16">
        <StepIndicator currentStep={3} />
      </div>
      <BookingConfirmClient
        hotel={hotel}
        room={room}
        checkIn={checkIn}
        checkOut={checkOut}
        nights={nights}
        guests={Number(guests) || 2}
      />
      <div className="flex-1" />
      <Footer />
    </main>
  );
}
