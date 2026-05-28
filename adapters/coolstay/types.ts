/** CoolStay API 응답 형상 타입 */

export type ApiRoom = {
  itemKey: string;
  packageKey: string;
  name: string;
  maxGuests: number;
  image: string | null;
  images: { url: string; thumbUrl: string }[];
  price: number;
  dailyPrices: number[];
  checkInTime: string;
  checkOutTime: string;
};

export type RoomsResponse = {
  motelKey: string;
  storeName: string;
  sitePayment: boolean;
  rooms: ApiRoom[];
};

export type RoomType = {
  itemKey: string;
  name: string;
  description: string;
  maxGuests: number;
  images: { url: string; thumbUrl: string }[];
  basePrice: number;
  checkInTime: string;
  checkOutTime: string;
};

export type StoreInfo = {
  motelKey: string;
  name: string;
  greetingMsg: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
  locationDesc: string;
  parkingYn: boolean;
  parkingInfo: string;
  sitePayment: boolean;
  images: { url: string; thumbUrl: string; description: string }[];
  rooms: RoomType[];
  benefitRoom: string;
  benefitExtra: string;
  policyMsg: string;
  refundPolicy: string;
};
