import { HeroSlide, Event } from "@/domain/entities";

export const mockHeroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    title: "당신만을 위한\n특별한 순간",
    subtitle: "EXCLUSIVE MOMENTS",
    description: "꿀스테이가 엄선한 프리미엄 호텔에서 잊을 수 없는 경험을 만나보세요",
    image: "https://picsum.photos/seed/hero1/1920/1080",
    cta: "호텔 둘러보기",
    ctaLink: "/hotels",
  },
  {
    id: "slide-2",
    title: "제주의 품에서\n만나는 럭셔리",
    subtitle: "JEJU PARADISE",
    description: "에메랄드빛 바다와 프라이빗 풀빌라가 함께하는 완벽한 휴가",
    image: "https://picsum.photos/seed/hero2/1920/1080",
    cta: "제주 호텔 보기",
    ctaLink: "/hotels",
  },
  {
    id: "slide-3",
    title: "도심 속\n하이엔드 스테이",
    subtitle: "URBAN RETREAT",
    description: "서울 스카이라인과 함께하는 세련된 도심 속 휴식",
    image: "https://picsum.photos/seed/hero3/1920/1080",
    cta: "서울 호텔 보기",
    ctaLink: "/hotels",
  },
];

export const mockEvents: Event[] = [
  {
    id: "event-1",
    title: "얼리버드 서머 특가",
    description: "여름 성수기 예약을 지금 시작하면 최대 40% 할인",
    image: "https://picsum.photos/seed/event1/600/400",
    badge: "EARLY BIRD",
    link: "/booking",
  },
  {
    id: "event-2",
    title: "허니문 패키지",
    description: "스파, 디너, 룸 업그레이드가 포함된 신혼 특별 패키지",
    image: "https://picsum.photos/seed/event2/600/400",
    badge: "HONEYMOON",
    link: "/booking",
  },
  {
    id: "event-3",
    title: "장기 투숙 혜택",
    description: "3박 이상 연박 시 1박 무료 + 조식 제공",
    image: "https://picsum.photos/seed/event3/600/400",
    badge: "LONG STAY",
    link: "/booking",
  },
  {
    id: "event-4",
    title: "꿀스테이 멤버십",
    description: "가입 즉시 10% 할인 + 포인트 2배 적립",
    image: "https://picsum.photos/seed/event4/600/400",
    badge: "MEMBERSHIP",
    link: "/booking",
  },
  {
    id: "event-5",
    title: "주중 힐링 특가",
    description: "일~목 투숙 시 스파 이용권 무료 증정",
    image: "https://picsum.photos/seed/event5/600/400",
    badge: "WEEKDAY",
    link: "/booking",
  },
];
