import { HotelRepository } from "@/domain/ports";
import { Hotel, SearchParams } from "@/domain/entities";
import { mockHotels } from "./data/hotels";

export class MockHotelRepository implements HotelRepository {
  async getAll(): Promise<Hotel[]> {
    return mockHotels;
  }

  async getById(id: string): Promise<Hotel | null> {
    return mockHotels.find((h) => h.id === id) ?? null;
  }

  async search(params: SearchParams): Promise<Hotel[]> {
    let results = [...mockHotels];
    if (params.location) {
      const loc = params.location.toLowerCase();
      results = results.filter(
        (h) =>
          h.location.toLowerCase().includes(loc) ||
          h.name.toLowerCase().includes(loc)
      );
    }
    return results;
  }

  async getFeatured(): Promise<Hotel[]> {
    return mockHotels.slice(0, 4);
  }
}
