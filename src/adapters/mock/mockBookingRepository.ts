import { BookingRepository } from "@/domain/ports";
import { Booking } from "@/domain/entities";

const bookings: Booking[] = [];

export class MockBookingRepository implements BookingRepository {
  async create(
    data: Omit<Booking, "id" | "status" | "createdAt">
  ): Promise<Booking> {
    const booking: Booking = {
      ...data,
      id: `BK-${Date.now()}`,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    bookings.push(booking);
    return booking;
  }

  async getById(id: string): Promise<Booking | null> {
    return bookings.find((b) => b.id === id) ?? null;
  }
}
