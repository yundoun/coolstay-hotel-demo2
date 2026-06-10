import type { SiteConfig } from "@/domain/site-config/types";

/**
 * ┌─────────────────────────────────────────────┐
 * │  경주 황리단길 팰리스 호텔 — 웹사이트 설정    │
 * │                                             │
 * │  새 호텔 세팅 시                              │
 * │  아래 값들만 교체하면 됩니다.                  │
 * └─────────────────────────────────────────────┘
 */

const config: SiteConfig = {

  /* ── 기본 정보 ─────────────────────────────── */
  /** 호텔 고유 ID (폴더명과 동일하게) */
  id: "gyeongju-palace",
  /** 호텔 정식 명칭 */
  name: "경주 황리단길 팰리스 호텔",
  /** 소재 도시 */
  city: "경주",
  /** 등급 (4성 or 5성) */
  grade: 5,
  /** 주소 — 지도 검색에도 사용됨 */
  address: "경북 경주시 봉황로51번길 11",
  /** 대표 연락처 */
  phone: "010-2881-4995",

  /* ── Hero 섹션 (배너 슬라이드 이미지, 최대 5장) ── */
  heroImages: [
    "https://cdn.coolstay.co.kr/upload/etc/shark1230/2024/03/14/15/74393ea6ef564f4585db7fb62fccbd93.jpg",
    "https://storage.googleapis.com/coolstay-dev/v2/owner/shark1230/2024/05/28/10/5c33de52373b482eae2fc1966d7a07d5.jpg",
    "https://storage.googleapis.com/coolstay-dev/v2/owner/shark1230/2024/05/28/10/85b9dd32a5a241f0b5f2e35580b005c2.jpg",
    "https://storage.googleapis.com/coolstay-dev/v2/owner/shark1230/2024/05/28/10/95a3d91f0a65486e88f0589862da9b1e.jpg",
  ],
  /** 한 줄 컨셉 문구 — 브라우저 탭 제목에 표시 */
  shortConcept: "황리단길 도보 6분, 경주의 중심에서 만나는 프리미엄 호텔",
  /** 호텔명이 길면 "sm"으로 설정 — 히어로 제목 크기 조절 */
  heroTitleSize: "sm",

  /* ── 인사말 섹션 ────────────────────────────── */
  greeting: {
    /** 인사말 제목 (줄바꿈: \n) */
    headline: "황리단길 한복판,\n경주의 프리미엄.",
    /** 인사말 본문 (줄바꿈: \n) */
    body: "경주 황리단길 호텔 팰리스에 오신것을 환영합니다!\n경주에서 최고의 추억을 만들수 있도록 최선을 다하겠습니다!",
    /** 서명 (예: "OO호텔 일동") */
    signature: "경주 황리단길 팰리스 호텔 일동",
  },

  /* ── 호텔 소개(About) 섹션 ──────────────────── */
  about: {
    /** 섹션 소제목 — 제목 위에 작게 표시 */
    subtitle: "Story",
    /** 제목 (줄바꿈: \n) */
    title: "경주의 중심,\n황리단길의 프리미엄 호텔.",
    /** 본문 설명 */
    body: "경주 황리단길에 위치한 팰리스 호텔은 전 객실 주차 가능, 편리한 위치와 함께 경주 여행의 최적의 베이스캠프입니다. 경주 중앙시장 도보 2분, 황리단길 도보 6분, 대릉원과 첨성대까지 차량 10분 이내의 편리한 입지를 자랑합니다.",
    /** 갤러리 이미지 URL (최대 5장) */
    images: [
      "https://cdn.coolstay.co.kr/upload/etc/shark1230/2024/03/14/15/74393ea6ef564f4585db7fb62fccbd93.jpg",
      "https://storage.googleapis.com/coolstay-dev/v2/owner/shark1230/2024/05/28/10/5c33de52373b482eae2fc1966d7a07d5.jpg",
      "https://storage.googleapis.com/coolstay-dev/v2/owner/shark1230/2024/05/28/10/85b9dd32a5a241f0b5f2e35580b005c2.jpg",
      "https://storage.googleapis.com/coolstay-dev/v2/owner/shark1230/2024/05/28/10/95a3d91f0a65486e88f0589862da9b1e.jpg",
    ],
  },

  /* ── 찾아오는 길 섹션 ───────────────────────── */
  directions: {
    /** 주차 안내 — 없으면 빈 문자열 (화면에 표시되지 않음) */
    parkingInfo: "전 객실 주차 가능 (만차 시 도보 1분거리 제1공영 주차장, 주차비 지원)",
    /** 주변 관광지·교통 안내 */
    nearbyItems: [
      { label: "경주 중앙시장", value: "도보 2분" },
      { label: "경주 황리단길", value: "차량 6분" },
    ],
  },
};

export default config;
