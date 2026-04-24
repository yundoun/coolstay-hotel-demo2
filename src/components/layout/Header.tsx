"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronLeft } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  variant?: "default" | "button";
}

interface HeaderProps {
  transparent?: boolean;
  backHref?: string;
  backLabel?: string;
  navItems?: NavItem[];
}

const DEFAULT_NAV: NavItem[] = [
  { label: "호텔", href: "/hotels" },
  { label: "예약", href: "/booking", variant: "button" },
];

export default function Header({
  transparent = false,
  backHref,
  backLabel,
  navItems = DEFAULT_NAV,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showLight = !transparent || scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          showLight
            ? "bg-white/90 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.04)]"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12">
          <div className="h-14 md:h-16 flex items-center justify-between">
            {/* Left: Back or Logo */}
            <div className="flex items-center gap-3">
              {backHref && (
                <Link
                  href={backHref}
                  className={`flex items-center gap-1 text-sm transition-colors ${
                    showLight
                      ? "text-warm-500 hover:text-warm-800"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden md:inline">{backLabel || "뒤로"}</span>
                </Link>
              )}
              <Link href="/" className="flex items-center gap-2 group">
                <Image
                  src="/coolstay_logo.png"
                  alt="꿀스테이"
                  width={110}
                  height={28}
                  className="h-5 md:h-6 w-auto transition-opacity duration-300 group-hover:opacity-80"
                />
                <span
                  className={`font-serif text-sm italic transition-colors duration-500 ${
                    showLight ? "text-brand-700" : "text-white"
                  }`}
                >
                  Hotel
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) =>
                item.variant === "button" ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-xs tracking-wider px-5 py-2 bg-brand-500 text-warm-900 font-medium rounded-lg hover:bg-brand-400 transition-all duration-300"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm transition-colors duration-500 hover:text-brand-600 ${
                      showLight ? "text-warm-500" : "text-white/80"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 transition-colors ${
                showLight ? "text-warm-700" : "text-white"
              }`}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[49] bg-white pt-14 px-5 md:hidden">
          <div className="flex flex-col gap-4 pt-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={
                  item.variant === "button"
                    ? "mt-2 text-center py-3 bg-brand-500 text-warm-900 font-semibold rounded-lg text-sm"
                    : "text-warm-800 text-base border-b border-warm-100 pb-3"
                }
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
