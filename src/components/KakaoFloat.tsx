"use client";

import { useEffect, useState } from "react";

interface KakaoFloatProps {
  href: string;
  telephone: string;
}

export default function KakaoFloat({ href, telephone }: KakaoFloatProps) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fab-stack">
      <button
        type="button"
        className={`fab fab-top ${showTop ? "" : "hidden"}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="맨 위로"
        data-tooltip="맨 위로"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <a
        href={`tel:${telephone}`}
        className="fab fab-phone"
        aria-label="전화 걸기"
        data-tooltip="전화 걸기"
      >
        <svg className="w-6 h-6 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </a>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="fab fab-kakao"
        aria-label="카카오톡 상담"
        data-tooltip="카카오톡 상담"
      >
        <svg width="28" height="28" viewBox="0 0 256 256" fill="none">
          <path
            d="M128 36C70.6 36 24 72.6 24 117.4c0 29 19.2 54.4 48 69.2l-10 36.4c-.8 2.8 2.6 5 4.8 3.4l42.6-28.2c6 .8 12.2 1.2 18.6 1.2 57.4 0 104-36.6 104-81.4S185.4 36 128 36z"
            fill="#3C1E1E"
          />
        </svg>
      </a>
    </div>
  );
}
