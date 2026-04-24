import {
  Hotel,
  Room,
  Booking,
  SearchParams,
  Event,
  HeroSlide,
} from "./entities";

export interface HotelRepository {
  getAll(): Promise<Hotel[]>;
  getById(id: string): Promise<Hotel | null>;
  search(params: SearchParams): Promise<Hotel[]>;
  getFeatured(): Promise<Hotel[]>;
}

export interface RoomRepository {
  getByHotelId(hotelId: string): Promise<Room[]>;
  getById(hotelId: string, roomId: string): Promise<Room | null>;
  checkAvailability(
    roomId: string,
    checkIn: string,
    checkOut: string
  ): Promise<boolean>;
}

export interface BookingRepository {
  create(
    booking: Omit<Booking, "id" | "status" | "createdAt">
  ): Promise<Booking>;
  getById(id: string): Promise<Booking | null>;
}

export interface ContentRepository {
  getHeroSlides(): Promise<HeroSlide[]>;
  getEvents(): Promise<Event[]>;
}
