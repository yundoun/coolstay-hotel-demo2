import type { Hotel } from "@/domain/hotel/types";

export const SITE_HOTEL_ID = "gyeongju-palace";

export const siteHotel: Hotel = {
  id: SITE_HOTEL_ID,
  name: "경주 황리단길 팰리스 호텔",
  city: "경주",
  grade: 5,
  heroImages: [
    "https://cdn.coolstay.co.kr/upload/etc/shark1230/2024/03/14/15/74393ea6ef564f4585db7fb62fccbd93.jpg",
    "https://storage.googleapis.com/coolstay-dev/v2/owner/shark1230/2024/05/28/10/5c33de52373b482eae2fc1966d7a07d5.jpg",
    "https://storage.googleapis.com/coolstay-dev/v2/owner/shark1230/2024/05/28/10/85b9dd32a5a241f0b5f2e35580b005c2.jpg",
    "https://storage.googleapis.com/coolstay-dev/v2/owner/shark1230/2024/05/28/10/95a3d91f0a65486e88f0589862da9b1e.jpg",
  ],
  shortConcept: "황리단길 도보 6분, 경주의 중심에서 만나는 프리미엄 호텔",
  address: "경북 경주시 봉황로51번길 11",
  checkInTime: "15:00",
  checkOutTime: "11:00",
  phone: "010-2881-4995",
};
