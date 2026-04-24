import { RoomRepository } from "@/domain/ports";
import { Room } from "@/domain/entities";
import { mockRooms } from "./data/rooms";

export class MockRoomRepository implements RoomRepository {
  async getByHotelId(hotelId: string): Promise<Room[]> {
    return mockRooms.filter((r) => r.hotelId === hotelId);
  }

  async getById(hotelId: string, roomId: string): Promise<Room | null> {
    return (
      mockRooms.find((r) => r.hotelId === hotelId && r.id === roomId) ?? null
    );
  }

  async checkAvailability(): Promise<boolean> {
    return true;
  }
}
