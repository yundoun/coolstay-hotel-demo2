import { ContentRepository } from "@/domain/ports";
import { HeroSlide, Event } from "@/domain/entities";
import { mockHeroSlides, mockEvents } from "./data/content";

export class MockContentRepository implements ContentRepository {
  async getHeroSlides(): Promise<HeroSlide[]> {
    return mockHeroSlides;
  }

  async getEvents(): Promise<Event[]> {
    return mockEvents;
  }
}
