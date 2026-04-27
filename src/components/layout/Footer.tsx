import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-warm-900">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 py-8 md:py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: Brand + Description */}
          <div className="flex items-center gap-6 md:gap-10">
            <div className="flex items-center gap-2 shrink-0">
              <Image
                src="/coolstay_logo.png"
                alt="꿀스테이"
                width={80}
                height={22}
                className="h-4 w-auto brightness-0 invert opacity-60"
              />
              <span className="font-serif text-brand-500/70 italic text-xs">Hotel</span>
            </div>
            <div className="hidden md:flex items-center gap-5 text-warm-400 text-xs">
              <Link href="/hotels" className="hover:text-warm-200 transition-colors">호텔</Link>
              <Link href="/booking" className="hover:text-warm-200 transition-colors">예약</Link>
              <span className="text-warm-500">1588-0000</span>
            </div>
          </div>

          {/* Right: Legal */}
          <div className="flex items-center gap-4 text-warm-500 text-[11px]">
            <span className="cursor-pointer hover:text-warm-300 transition-colors">이용약관</span>
            <span className="cursor-pointer hover:text-warm-300 transition-colors">개인정보처리방침</span>
            <span className="text-warm-500">&copy; 2024 CoolStay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
