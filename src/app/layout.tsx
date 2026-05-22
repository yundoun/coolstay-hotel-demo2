import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "꿀스테이 제주 리조트 | 공식 예약 사이트",
  description: "제주 중문 해안 프리미엄 리조트 — 오션뷰 객실, 인피니티 풀, 프라이빗 스파. 꿀스테이 제주 리조트 공식 온라인 예약.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
