import { Room } from "@/domain/entities";

export interface HotelConfig {
  // 기본 정보
  name: string;
  nameEn: string;
  starRating: number;
  phone: string;
  email: string;
  checkInTime: string;
  checkOutTime: string;

  // 사장님 인사말
  greeting: {
    ownerName: string;
    title: string;
    message: string;
    signature: string;
    image?: string;
  };

  // 호텔 소개
  about: {
    headline: string;
    description: string;
    features: { icon: string; title: string; description: string }[];
    images: string[];
  };

  // 히어로 슬라이드
  hero: {
    slides: {
      image: string;
      title: string;
      subtitle: string;
    }[];
  };

  // 객실 목록
  rooms: Room[];

  // 위치 정보
  location: {
    address: string;
    addressDetail: string;
    lat: number;
    lng: number;
    directions: { method: string; description: string }[];
  };
}

// ─── 샘플 호텔: 꿀스테이 제주 리조트 ───
const hotelConfig: HotelConfig = {
  name: "꿀스테이 제주 리조트",
  nameEn: "CoolStay Jeju Resort",
  starRating: 5,
  phone: "064-123-4567",
  email: "jeju@coolstay.kr",
  checkInTime: "15:00",
  checkOutTime: "11:00",

  greeting: {
    ownerName: "김태호",
    title: "자연이 선물하는\n최고의 휴식을 드립니다",
    message:
      "안녕하세요, 꿀스테이 제주 리조트 대표 김태호입니다.\n\n제주의 맑은 바람과 에메랄드빛 바다, 그리고 한라산이 품어주는 이곳에서 일상의 무게를 내려놓으시길 바랍니다. 저희 리조트는 제주 서귀포 중문 해안에 자리하여, 객실 어디서든 탁 트인 수평선을 만나실 수 있습니다.\n\n15년간 호텔리어로서 쌓아온 경험과 진심을 담아, 투숙하시는 모든 분께 잊지 못할 순간을 선사하겠습니다. 작은 것 하나도 놓치지 않는 세심한 서비스로 여러분의 제주 여행을 완성해 드리겠습니다.\n\n감사합니다.",
    signature: "꿀스테이 제주 리조트 대표 김태호 드림",
    image: "https://picsum.photos/seed/owner-portrait/400/500",
  },

  about: {
    headline: "제주 중문, 바다 위의 프라이빗 리조트",
    description:
      "꿀스테이 제주 리조트는 중문관광단지 해안 절벽 위에 자리한 프리미엄 리조트입니다. 천혜의 자연경관과 현대적 감각이 조화를 이루는 공간에서, 오직 당신만을 위한 특별한 시간을 선사합니다. 인피니티 풀에서 바라보는 석양, 제주 로컬 식재료로 준비하는 조식, 그리고 제주 돌담길을 따라 이어지는 프라이빗 산책로까지 — 모든 것이 완벽한 휴식을 위해 설계되었습니다.",
    features: [
      {
        icon: "waves",
        title: "오션뷰 인피니티 풀",
        description: "수평선과 하나 되는 야외 인피니티 풀에서 제주 바다를 온몸으로 느끼세요",
      },
      {
        icon: "utensils",
        title: "팜투테이블 다이닝",
        description: "제주 로컬 농장에서 매일 공수하는 신선한 식재료로 준비하는 조식과 디너",
      },
      {
        icon: "sparkles",
        title: "프라이빗 스파",
        description: "제주 용암 해수를 활용한 시그니처 스파 프로그램으로 깊은 힐링을 경험하세요",
      },
      {
        icon: "mountain",
        title: "제주 자연 산책로",
        description: "리조트 전용 해안 산책로와 올레길 연결 코스로 제주의 자연을 만끽하세요",
      },
    ],
    images: [
      "https://picsum.photos/seed/about-resort-1/900/600",
      "https://picsum.photos/seed/about-resort-2/900/600",
      "https://picsum.photos/seed/about-resort-3/900/600",
      "https://picsum.photos/seed/about-pool/900/600",
    ],
  },

  hero: {
    slides: [
      {
        image: "https://picsum.photos/seed/jeju-hero-1/1920/1080",
        title: "바다 위의\n프라이빗 리조트",
        subtitle: "COOLSTAY JEJU RESORT",
      },
      {
        image: "https://picsum.photos/seed/jeju-hero-2/1920/1080",
        title: "제주의 품에서\n만나는 휴식",
        subtitle: "OCEAN VIEW PARADISE",
      },
      {
        image: "https://picsum.photos/seed/jeju-hero-3/1920/1080",
        title: "당신만을 위한\n특별한 순간",
        subtitle: "EXCLUSIVE MOMENTS",
      },
    ],
  },

  rooms: [
    {
      id: "room-1",
      hotelId: "coolstay-jeju",
      name: "오션뷰 디럭스",
      description:
        "탁 트인 제주 바다를 객실에서 바로 감상할 수 있는 오션뷰 디럭스. 프라이빗 발코니에서 일출과 일몰을 동시에 즐겨보세요.",
      price: 280000,
      originalPrice: 350000,
      capacity: 2,
      maxCapacity: 3,
      bedType: "킹",
      size: 42,
      images: [
        "https://picsum.photos/seed/jr-ocean-1/800/600",
        "https://picsum.photos/seed/jr-ocean-2/800/600",
      ],
      amenities: ["오션뷰", "발코니", "킹베드", "레인샤워", "미니바"],
      available: true,
    },
    {
      id: "room-2",
      hotelId: "coolstay-jeju",
      name: "가든뷰 트윈",
      description:
        "제주 돌담 정원이 펼쳐지는 트윈룸. 가족이나 친구와 함께 여유로운 제주의 아침을 맞이하세요.",
      price: 220000,
      originalPrice: 280000,
      capacity: 2,
      maxCapacity: 3,
      bedType: "트윈",
      size: 38,
      images: [
        "https://picsum.photos/seed/jr-garden-1/800/600",
        "https://picsum.photos/seed/jr-garden-2/800/600",
      ],
      amenities: ["가든뷰", "트윈베드", "테라스", "미니바", "네스프레소"],
      available: true,
    },
    {
      id: "room-3",
      hotelId: "coolstay-jeju",
      name: "풀빌라 스위트",
      description:
        "프라이빗 풀이 딸린 독립형 빌라. 넓은 정원과 야외 테라스에서 제주의 자연을 온전히 만끽할 수 있습니다.",
      price: 520000,
      originalPrice: 650000,
      capacity: 2,
      maxCapacity: 4,
      bedType: "킹",
      size: 85,
      images: [
        "https://picsum.photos/seed/jr-villa-1/800/600",
        "https://picsum.photos/seed/jr-villa-2/800/600",
      ],
      amenities: ["프라이빗 풀", "정원", "테라스", "킹베드", "키친", "바베큐"],
      available: true,
    },
    {
      id: "room-4",
      hotelId: "coolstay-jeju",
      name: "로열 펜트하우스",
      description:
        "최상층에 위치한 로열 펜트하우스. 360도 파노라마 오션뷰와 전용 자쿠지, 프라이빗 다이닝이 갖춰진 최고급 스위트입니다.",
      price: 980000,
      capacity: 2,
      maxCapacity: 4,
      bedType: "킹",
      size: 120,
      images: [
        "https://picsum.photos/seed/jr-pent-1/800/600",
        "https://picsum.photos/seed/jr-pent-2/800/600",
      ],
      amenities: [
        "파노라마 오션뷰",
        "전용 자쿠지",
        "프라이빗 다이닝",
        "버틀러 서비스",
        "사우나",
      ],
      available: true,
    },
  ],

  location: {
    address: "제주특별자치도 서귀포시 중문관광로 72번길 75",
    addressDetail: "중문관광단지 내",
    lat: 33.2541,
    lng: 126.4122,
    directions: [
      {
        method: "자가용",
        description: "제주공항에서 약 50분 (1132번 해안도로 경유)",
      },
      {
        method: "대중교통",
        description: "제주공항 → 600번 급행버스 → 중문관광단지 하차 (약 60분)",
      },
      {
        method: "셔틀버스",
        description: "제주공항 픽업 서비스 운영 (사전 예약 필수, 무료)",
      },
    ],
  },
};

export default hotelConfig;
