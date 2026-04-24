export interface Hotel {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  shortDescription: string;
  location: string;
  address: string;
  rating: number;
  starRating: number;
  reviewCount: number;
  priceFrom: number;
  images: string[];
  thumbnail: string;
  amenities: string[];
  tags: string[];
  checkInTime: string;
  checkOutTime: string;
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  capacity: number;
  maxCapacity: number;
  bedType: string;
  size: number; // sqm
  images: string[];
  amenities: string[];
  available: boolean;
}

export interface Booking {
  id: string;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  totalPrice: number;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

export interface SearchParams {
  checkIn: string;
  checkOut: string;
  guests: number;
  location?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  badge?: string;
  link: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta?: string;
  ctaLink?: string;
}
