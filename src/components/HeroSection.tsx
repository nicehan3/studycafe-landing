"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface HeroProps {
  slogan: string;
  highlights: { label: string; value: string }[];
  heroImages: string[];
}

export default function HeroSection({ slogan, highlights, heroImages }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (heroImages.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length, paused]);

  const next = () => setCurrent((p) => (p + 1) % heroImages.length);
  const prev = () => setCurrent((p) => (p - 1 + heroImages.length) % heroImages.length);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
        touchStartX.current = null;
      }}
    >
      {/* Background Images */}
      {heroImages.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          <Image
            src={src}
            alt={`옵티멈스터디카페 ${i + 1}`}
            fill
            className="object-cover scale-105"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-navy-dark/65" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/20 to-navy-dark/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
          <svg className="w-4 h-4 text-yellow" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-white text-xs sm:text-sm font-medium">
            네이버 리뷰 696개 · 방문자 후기 검증
          </span>
        </div>

        <p className="text-yellow font-bold text-sm sm:text-base tracking-widest uppercase mb-4">
          Optimum Study Cafe
        </p>
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
          옵티멈스터디카페
          <br />
          <span className="relative inline-block">
            <span className="relative z-10 text-yellow">신림대학점</span>
            <span className="absolute left-0 right-0 bottom-1 h-3 bg-yellow/20 -z-0" aria-hidden />
          </span>
        </h1>
        <p className="text-white/80 text-lg sm:text-xl md:text-2xl font-light mb-10">
          {slogan}
        </p>

        {/* Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-10">
          {highlights.map((h) => (
            <div
              key={h.label}
              className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-5 border border-white/15 hover:border-yellow/40 transition-colors"
            >
              <div className="text-yellow text-2xl sm:text-3xl font-black mb-1">
                {h.value}
              </div>
              <div className="text-white/60 text-xs sm:text-sm">{h.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="#pricing"
            className="inline-block bg-yellow text-navy-dark font-bold px-8 py-3.5 rounded-full hover:bg-yellow-light hover:shadow-xl hover:shadow-yellow/20 transition-all text-sm sm:text-base"
          >
            요금 확인하기
          </a>
          <a
            href="#map"
            className="inline-block border-2 border-white/40 text-white font-medium px-8 py-3.5 rounded-full hover:border-yellow hover:text-yellow hover:bg-white/5 transition-all text-sm sm:text-base"
          >
            오시는 길
          </a>
        </div>
      </div>

      {/* Prev/Next arrows (desktop) */}
      {heroImages.length > 1 && (
        <>
          <button
            onClick={prev}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-yellow hover:text-navy-dark transition-colors z-10"
            aria-label="이전 이미지"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-yellow hover:text-navy-dark transition-colors z-10"
            aria-label="다음 이미지"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Slide indicators */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === current ? "bg-yellow w-8" : "bg-white/40 w-2.5 hover:bg-white/70"
              }`}
              aria-label={`슬라이드 ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
