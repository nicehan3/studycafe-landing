"use client";

import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { label: "소개", href: "#intro", id: "intro" },
  { label: "시설", href: "#facilities", id: "facilities" },
  { label: "요금표", href: "#pricing", id: "pricing" },
  { label: "갤러리", href: "#gallery", id: "gallery" },
  { label: "오시는 길", href: "#map", id: "map" },
];

interface HeaderProps {
  telephone: string;
}

export default function Header({ telephone }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll-spy: highlight the currently-visible section in the nav
  useEffect(() => {
    const sections = NAV_ITEMS
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-navy/90 backdrop-blur-md shadow-lg"
          : "bg-gradient-to-b from-navy-dark/50 to-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2" aria-label="홈으로">
            <span className="text-yellow font-black text-xl tracking-tight">
              OPTIMUM
            </span>
            <span className="text-white text-sm font-medium hidden sm:inline">
              스터디카페
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="주요 메뉴">
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors ${
                    isActive ? "text-yellow" : "text-white/80 hover:text-yellow"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-yellow rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right actions: call (mobile) + menu */}
          <div className="flex items-center gap-1">
            <a
              href={`tel:${telephone}`}
              className="md:hidden flex items-center justify-center w-10 h-10 text-yellow"
              aria-label="전화 걸기"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
            <button
              className="md:hidden text-white w-10 h-10 flex items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={menuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-navy/95 backdrop-blur-md border-t border-white/10" aria-label="모바일 메뉴">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`block px-6 py-4 text-sm font-medium border-b border-white/5 ${
                activeId === item.id
                  ? "text-yellow bg-white/5"
                  : "text-white/80 hover:text-yellow hover:bg-white/5"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
