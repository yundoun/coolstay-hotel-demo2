"use client";

import Image from "next/image";
import { Phone, Mail } from "lucide-react";
import type { HotelConfig } from "@/config/hotel";

interface FooterProps {
  hotelConfig?: HotelConfig;
}

export default function Footer({ hotelConfig }: FooterProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-warm-900">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10 md:mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/coolstay_logo.png"
                alt="꿀스테이"
                width={80}
                height={22}
                className="h-4 w-auto brightness-0 invert opacity-60"
              />
              <span className="text-[10px] font-medium tracking-widest uppercase text-warm-500">Hotel</span>
            </div>
            {hotelConfig && (
              <p className="text-warm-500 text-xs leading-relaxed">
                {hotelConfig.name}<br />
                {hotelConfig.location.address}
              </p>
            )}
          </div>

          {/* Quick links */}
          <div>
            <p className="text-warm-400 text-[10px] tracking-[0.2em] uppercase mb-4">바로가기</p>
            <div className="flex flex-col gap-2.5 text-warm-500 text-xs">
              {[
                { label: "인사말", id: "greeting" },
                { label: "호텔 소개", id: "about" },
                { label: "객실 안내", id: "rooms" },
                { label: "온라인 예약", id: "booking" },
                { label: "오시는 길", id: "location" },
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="text-left hover:text-warm-200 transition-colors w-fit"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          {hotelConfig && (
            <div>
              <p className="text-warm-400 text-[10px] tracking-[0.2em] uppercase mb-4">연락처</p>
              <div className="flex flex-col gap-3 text-warm-500 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-warm-500" />
                  <span>{hotelConfig.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-warm-500" />
                  <span>{hotelConfig.email}</span>
                </div>
                <p className="text-warm-600 mt-1">
                  체크인 {hotelConfig.checkInTime} &middot; 체크아웃 {hotelConfig.checkOutTime}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-warm-600 text-[11px]">
            <span className="cursor-pointer hover:text-warm-300 transition-colors">이용약관</span>
            <span className="cursor-pointer hover:text-warm-300 transition-colors">개인정보처리방침</span>
          </div>
          <p className="text-warm-600 text-[11px]">&copy; 2024 CoolStay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
