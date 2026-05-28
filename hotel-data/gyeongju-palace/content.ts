import type { SiteContent } from "@/domain/content/types";

export const siteContent: SiteContent = {
  greeting: {
    headline: "황리단길 한복판,\n경주의 프리미엄.",
    body: "경주 황리단길 호텔 팰리스에 오신것을 환영합니다!\n경주에서 최고의 추억을 만들수 있도록 최선을 다하겠습니다!",
    signature: "경주 황리단길 팰리스 호텔 일동",
  },
  about: [
    {
      type: "image-text",
      eyebrow: "Story",
      title: "경주의 중심,\n황리단길의 프리미엄 호텔.",
      body: "경주 황리단길에 위치한 팰리스 호텔은 전 객실 주차 가능, 편리한 위치와 함께 경주 여행의 최적의 베이스캠프입니다. 경주 중앙시장 도보 2분, 황리단길 도보 6분, 대릉원과 첨성대까지 차량 10분 이내의 편리한 입지를 자랑합니다.",
      image:
        "https://cdn.coolstay.co.kr/upload/etc/shark1230/2024/03/14/15/74393ea6ef564f4585db7fb62fccbd93.jpg",
      imagePosition: "right",
    },
  ],
  directions: {
    mapQuery: "경북 경주시 봉황로51번길 11",
    items: [
      { label: "주소", value: "경북 경주시 봉황로51번길 11" },
      { label: "연락처", value: "010-2881-4995" },
      { label: "체크인", value: "15:00" },
      { label: "체크아웃", value: "11:00" },
      {
        label: "주차",
        value: "전 객실 주차 가능 (만차 시 도보 1분거리 제1공영 주차장, 주차비 지원)",
      },
      { label: "경주 중앙시장", value: "도보 2분" },
      { label: "경주 황리단길", value: "차량 6분" },
    ],
  },
};
