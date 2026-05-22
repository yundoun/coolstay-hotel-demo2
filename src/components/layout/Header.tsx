"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  variant?: "default" | "button";
}

interface HeaderProps {
  transparent?: boolean;
  navItems?: NavItem[];
}

const DEFAULT_NAV: NavItem[] = [
  { label: "인사말", href: "#greeting" },
  { label: "호텔 소개", href: "#about" },
  { label: "객실", href: "#rooms" },
  { label: "예약", href: "#booking", variant: "button" },
  { label: "오시는 길", href: "#location" },
];

export default function Header({
  transparent = false,
  navItems = DEFAULT_NAV,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    if (!transparent) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparent]);

  const showLight = !transparent || scrolled;

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("#")) {
      const el = document.getElementById(href.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          showLight
            ? "bg-white/90 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.04)]"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
          <div className="h-14 md:h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <Image
                  src="/coolstay_logo.png"
                  alt="꿀스테이"
                  width={110}
                  height={28}
                  className={`h-5 md:h-6 w-auto transition-all duration-500 group-hover:opacity-80 ${
                    !showLight ? "brightness-0 invert" : ""
                  }`}
                />
                <span className={`text-xs font-medium tracking-widest uppercase transition-colors duration-500 ${
                  showLight ? "text-warm-500" : "text-white/60"
                }`}>
                  Hotel
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-7">
              {navItems.map((item) =>
                item.variant === "button" ? (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                    className="text-xs tracking-wider px-5 py-2 bg-sig-500 text-warm-900 font-medium rounded-lg hover:bg-sig-400 transition-all duration-300"
                  >
                    {item.label}
                  </a>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                    className={`text-sm transition-colors duration-500 hover:text-warm-500 ${
                      showLight ? "text-warm-500" : "text-white/70"
                    }`}
                  >
                    {item.label}
                  </a>
                )
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 transition-colors relative z-[60] ${
                mobileOpen ? "text-warm-700" : showLight ? "text-warm-700" : "text-white"
              }`}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Backdrop */}
      <div
        className={`fixed inset-0 z-[48] bg-black/40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[49] w-[70%] max-w-[300px] bg-white md:hidden transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-16 px-6 pb-8">
          <div className="flex flex-col gap-1 flex-1">
            {navItems.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                className="flex items-center justify-between py-4 text-warm-800 text-[15px] font-medium border-b border-warm-100/80 group"
                style={{ transitionDelay: mobileOpen ? `${(i + 1) * 50}ms` : "0ms" }}
              >
                <span className="group-hover:text-warm-500 transition-colors">{item.label}</span>
                <ArrowRight className="w-4 h-4 text-warm-300 group-hover:text-sig-500 group-hover:translate-x-0.5 transition-all" />
              </a>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-warm-100">
            <p className="text-warm-400 text-[11px]">1588-0000</p>
            <p className="text-warm-300 text-[10px] mt-1">&copy; 2024 CoolStay Hotel</p>
          </div>
        </div>
      </div>
    </>
  );
}
