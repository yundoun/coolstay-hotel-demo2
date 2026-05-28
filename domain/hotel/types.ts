export type Hotel = {
  id: string;
  name: string;
  city: string;
  grade: 4 | 5;
  heroImages: string[];
  shortConcept: string;
  address: string;
  checkInTime: string;
  checkOutTime: string;
  phone: string;
  /** 히어로 타이틀 크기 — 호텔명이 길면 "sm" 사용 (기본 "base") */
  heroTitleSize?: "base" | "sm";
};
