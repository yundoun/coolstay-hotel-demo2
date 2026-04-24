import { Room } from "@/domain/entities";

export const mockRooms: Room[] = [
  // Hotel 1 - 그랜드 서울
  {
    id: "room-1-1",
    hotelId: "hotel-1",
    name: "디럭스 더블",
    description:
      "넓은 창을 통해 서울 시내 전경을 감상할 수 있는 디럭스 더블룸. 킹사이즈 침대와 대리석 욕실이 편안한 휴식을 보장합니다.",
    price: 350000,
    originalPrice: 420000,
    capacity: 2,
    maxCapacity: 3,
    bedType: "킹",
    size: 38,
    images: [
      "https://picsum.photos/seed/room1-1a/800/600",
      "https://picsum.photos/seed/room1-1b/800/600",
    ],
    amenities: ["시티뷰", "킹베드", "레인샤워", "미니바", "네스프레소"],
    available: true,
  },
  {
    id: "room-1-2",
    hotelId: "hotel-1",
    name: "프리미엄 스위트",
    description:
      "거실과 침실이 분리된 프리미엄 스위트. 남산타워 뷰와 함께 자쿠지 욕조, 전용 라운지 이용 혜택이 포함됩니다.",
    price: 580000,
    originalPrice: 680000,
    capacity: 2,
    maxCapacity: 4,
    bedType: "킹",
    size: 65,
    images: [
      "https://picsum.photos/seed/room1-2a/800/600",
      "https://picsum.photos/seed/room1-2b/800/600",
    ],
    amenities: [
      "남산뷰",
      "킹베드",
      "자쿠지",
      "라운지 이용",
      "미니바",
      "네스프레소",
    ],
    available: true,
  },
  {
    id: "room-1-3",
    hotelId: "hotel-1",
    name: "로열 펜트하우스",
    description:
      "최상층에 위치한 로열 펜트하우스. 360도 파노라마 뷰와 개인 버틀러 서비스, 전용 다이닝룸이 갖춰진 최고급 스위트입니다.",
    price: 1200000,
    capacity: 2,
    maxCapacity: 4,
    bedType: "킹",
    size: 120,
    images: [
      "https://picsum.photos/seed/room1-3a/800/600",
      "https://picsum.photos/seed/room1-3b/800/600",
    ],
    amenities: [
      "파노라마뷰",
      "버틀러 서비스",
      "전용 다이닝",
      "자쿠지",
      "사우나",
    ],
    available: true,
  },

  // Hotel 2 - 리조트 제주
  {
    id: "room-2-1",
    hotelId: "hotel-2",
    name: "오션뷰 디럭스",
    description:
      "탁 트인 제주 바다를 객실에서 바로 감상할 수 있는 오션뷰 디럭스. 프라이빗 발코니에서 일출과 일몰을 동시에 즐겨보세요.",
    price: 420000,
    originalPrice: 500000,
    capacity: 2,
    maxCapacity: 3,
    bedType: "킹",
    size: 42,
    images: [
      "https://picsum.photos/seed/room2-1a/800/600",
      "https://picsum.photos/seed/room2-1b/800/600",
    ],
    amenities: ["오션뷰", "발코니", "킹베드", "레인샤워", "미니바"],
    available: true,
  },
  {
    id: "room-2-2",
    hotelId: "hotel-2",
    name: "풀빌라 스위트",
    description:
      "프라이빗 풀이 딸린 독립형 빌라. 넓은 정원과 야외 테라스에서 제주의 자연을 온전히 만끽할 수 있습니다.",
    price: 780000,
    originalPrice: 900000,
    capacity: 2,
    maxCapacity: 5,
    bedType: "킹",
    size: 95,
    images: [
      "https://picsum.photos/seed/room2-2a/800/600",
      "https://picsum.photos/seed/room2-2b/800/600",
    ],
    amenities: [
      "프라이빗 풀",
      "정원",
      "테라스",
      "킹베드",
      "키친",
      "바베큐",
    ],
    available: true,
  },
  {
    id: "room-2-3",
    hotelId: "hotel-2",
    name: "패밀리 트윈",
    description:
      "가족 단위 투숙객을 위한 넓은 트윈룸. 키즈 어메니티와 안전 시설이 완비되어 있어 어린 자녀와 함께 편안하게 머물 수 있습니다.",
    price: 380000,
    capacity: 2,
    maxCapacity: 4,
    bedType: "트윈",
    size: 48,
    images: [
      "https://picsum.photos/seed/room2-3a/800/600",
      "https://picsum.photos/seed/room2-3b/800/600",
    ],
    amenities: [
      "가든뷰",
      "트윈베드",
      "키즈 어메니티",
      "욕조",
      "미니바",
    ],
    available: true,
  },

  // Hotel 3 - 부티크 강남
  {
    id: "room-3-1",
    hotelId: "hotel-3",
    name: "아트 스탠다드",
    description:
      "현대 미술 작품으로 꾸며진 스탠다드 룸. 감각적인 인테리어와 큐레이션된 미니바로 특별한 하룻밤을 선사합니다.",
    price: 220000,
    originalPrice: 260000,
    capacity: 2,
    maxCapacity: 2,
    bedType: "퀸",
    size: 28,
    images: [
      "https://picsum.photos/seed/room3-1a/800/600",
      "https://picsum.photos/seed/room3-1b/800/600",
    ],
    amenities: ["시티뷰", "퀸베드", "큐레이션 미니바", "블루투스 스피커"],
    available: true,
  },
  {
    id: "room-3-2",
    hotelId: "hotel-3",
    name: "갤러리 스위트",
    description:
      "아트 갤러리를 연상시키는 넓은 스위트. 유명 작가의 원화가 전시된 공간에서 예술적 영감을 받으며 쉬어보세요.",
    price: 380000,
    capacity: 2,
    maxCapacity: 3,
    bedType: "킹",
    size: 52,
    images: [
      "https://picsum.photos/seed/room3-2a/800/600",
      "https://picsum.photos/seed/room3-2b/800/600",
    ],
    amenities: [
      "시티뷰",
      "킹베드",
      "아트 컬렉션",
      "욕조",
      "네스프레소",
      "턴테이블",
    ],
    available: true,
  },

  // Hotel 4 - 오션 부산
  {
    id: "room-4-1",
    hotelId: "hotel-4",
    name: "오션 디럭스",
    description:
      "해운대 해변을 정면으로 바라보는 오션 디럭스. 넓은 발코니에서 파도소리와 함께 여유로운 시간을 보내보세요.",
    price: 380000,
    originalPrice: 450000,
    capacity: 2,
    maxCapacity: 3,
    bedType: "킹",
    size: 40,
    images: [
      "https://picsum.photos/seed/room4-1a/800/600",
      "https://picsum.photos/seed/room4-1b/800/600",
    ],
    amenities: ["오션뷰", "발코니", "킹베드", "욕조", "미니바"],
    available: true,
  },
  {
    id: "room-4-2",
    hotelId: "hotel-4",
    name: "프레지덴셜 스위트",
    description:
      "해운대의 랜드마크, 프레지덴셜 스위트. 180도 오션뷰와 프라이빗 자쿠지, 전용 라운지에서 최상의 럭셔리를 경험하세요.",
    price: 950000,
    capacity: 2,
    maxCapacity: 4,
    bedType: "킹",
    size: 110,
    images: [
      "https://picsum.photos/seed/room4-2a/800/600",
      "https://picsum.photos/seed/room4-2b/800/600",
    ],
    amenities: [
      "파노라마 오션뷰",
      "프라이빗 자쿠지",
      "라운지",
      "버틀러",
      "다이닝",
    ],
    available: true,
  },

  // Hotel 5 - 포레스트 경주
  {
    id: "room-5-1",
    hotelId: "hotel-5",
    name: "한옥 온돌방",
    description:
      "전통 한옥 양식의 온돌방. 따뜻한 바닥과 한지 창호를 통해 들어오는 은은한 빛이 고즈넉한 분위기를 자아냅니다.",
    price: 180000,
    originalPrice: 220000,
    capacity: 2,
    maxCapacity: 3,
    bedType: "온돌",
    size: 33,
    images: [
      "https://picsum.photos/seed/room5-1a/800/600",
      "https://picsum.photos/seed/room5-1b/800/600",
    ],
    amenities: ["포레스트뷰", "온돌", "차 세트", "욕조", "테라스"],
    available: true,
  },
  {
    id: "room-5-2",
    hotelId: "hotel-5",
    name: "프리미엄 독채",
    description:
      "독립된 한옥 독채에서 프라이빗한 힐링을 즐기세요. 전용 노천 온천과 정원이 딸려 있어 자연 속 완벽한 휴식을 보장합니다.",
    price: 450000,
    capacity: 2,
    maxCapacity: 4,
    bedType: "킹",
    size: 75,
    images: [
      "https://picsum.photos/seed/room5-2a/800/600",
      "https://picsum.photos/seed/room5-2b/800/600",
    ],
    amenities: [
      "노천 온천",
      "전용 정원",
      "킹베드",
      "다도 체험",
      "조식 포함",
    ],
    available: true,
  },

  // Hotel 6 - 스카이 여의도
  {
    id: "room-6-1",
    hotelId: "hotel-6",
    name: "한강뷰 디럭스",
    description:
      "한강이 한눈에 내려다보이는 디럭스룸. 야경과 함께 특별한 밤을 보내세요.",
    price: 310000,
    originalPrice: 370000,
    capacity: 2,
    maxCapacity: 3,
    bedType: "킹",
    size: 36,
    images: [
      "https://picsum.photos/seed/room6-1a/800/600",
      "https://picsum.photos/seed/room6-1b/800/600",
    ],
    amenities: ["한강뷰", "킹베드", "레인샤워", "미니바", "네스프레소"],
    available: true,
  },
  {
    id: "room-6-2",
    hotelId: "hotel-6",
    name: "스카이 스위트",
    description:
      "50층 이상에 위치한 스카이 스위트. 서울 전경을 파노라마로 감상하며, 전용 라운지와 조식이 포함됩니다.",
    price: 650000,
    capacity: 2,
    maxCapacity: 4,
    bedType: "킹",
    size: 72,
    images: [
      "https://picsum.photos/seed/room6-2a/800/600",
      "https://picsum.photos/seed/room6-2b/800/600",
    ],
    amenities: [
      "파노라마뷰",
      "라운지 이용",
      "조식 포함",
      "자쿠지",
      "버틀러",
    ],
    available: true,
  },
];
