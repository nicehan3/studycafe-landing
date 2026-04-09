"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface GalleryItem {
  src: string;
  label: string;
}

interface GalleryProps {
  gallery: GalleryItem[];
}

export default function GallerySection({ gallery }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const close = useCallback(() => setSelectedIndex(null), []);
  const prev = useCallback(
    () => setSelectedIndex((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length)),
    [gallery.length]
  );
  const next = useCallback(
    () => setSelectedIndex((i) => (i === null ? null : (i + 1) % gallery.length)),
    [gallery.length]
  );

  // Keyboard navigation + body scroll lock
  useEffect(() => {
    if (selectedIndex === null) return;
    document.body.classList.add("no-scroll");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("no-scroll");
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedIndex, close, prev, next]);

  if (gallery.length === 0) {
    return (
      <section id="gallery" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-yellow font-bold text-sm tracking-widest uppercase mb-3">Gallery</p>
            <h2 className="text-navy text-3xl sm:text-4xl font-black mb-6">매장 갤러리</h2>
          </div>
          <div className="bg-white rounded-2xl p-10 text-center">
            <p className="text-gray-400 text-sm mb-4">매장 사진은 준비 중입니다.</p>
            <a
              href="https://www.instagram.com/opt_studycafe/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-navy font-medium text-sm hover:text-yellow transition-colors"
            >
              인스타그램에서 매장 사진 보기 &rarr;
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-yellow font-bold text-sm tracking-widest uppercase mb-3">Gallery</p>
          <h2 className="text-navy text-3xl sm:text-4xl font-black mb-6">매장 갤러리</h2>
          <p className="text-gray-500 text-sm">
            총 {gallery.length}장 · 클릭하면 크게 볼 수 있습니다
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {gallery.map((item, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer bg-gray-100"
              aria-label={`${item.label} 크게 보기`}
            >
              <Image
                src={item.src}
                alt={item.label}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/30 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-dark/80 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                <span className="text-white text-xs font-semibold">{item.label}</span>
              </div>
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/0 group-hover:bg-white/90 flex items-center justify-center transition-all">
                <svg className="w-4 h-4 text-navy opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6M7 10h6" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="이미지 크게 보기"
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10 transition-colors"
            onClick={(e) => { e.stopPropagation(); close(); }}
            aria-label="닫기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full z-10">
            {selectedIndex + 1} / {gallery.length}
          </div>

          <button
            className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10 transition-colors"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="이전"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="relative max-w-5xl max-h-[80vh] w-full h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={gallery[selectedIndex].src}
              alt={gallery[selectedIndex].label}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Label */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full">
            {gallery[selectedIndex].label}
          </div>

          <button
            className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center z-10 transition-colors"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="다음"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
