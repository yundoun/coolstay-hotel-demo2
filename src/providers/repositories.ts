import {
  HotelRepository,
  RoomRepository,
  BookingRepository,
  ContentRepository,
} from "@/domain/ports";
import { MockHotelRepository } from "@/adapters/mock/mockHotelRepository";
import { MockRoomRepository } from "@/adapters/mock/mockRoomRepository";
import { MockBookingRepository } from "@/adapters/mock/mockBookingRepository";
import { MockContentRepository } from "@/adapters/mock/mockContentRepository";

// Swap these implementations to switch from mock to real API
export const hotelRepository: HotelRepository = new MockHotelRepository();
export const roomRepository: RoomRepository = new MockRoomRepository();
export const bookingRepository: BookingRepository = new MockBookingRepository();
export const contentRepository: ContentRepository = new MockContentRepository();
