"use client";

import { useState } from "react";

interface MapProps {
  directions: { subway: string; address_detail: string };
  telephone: string;
  naverPlaceUrl: string;
}

export default function MapSection({
  directions,
  telephone,
  naverPlaceUrl,
}: MapProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <section id="map" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-yellow font-bold text-sm tracking-widest uppercase mb-3">
            Location
          </p>
          <h2 className="text-navy text-3xl sm:text-4xl font-black mb-6">
            오시는 길
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            서울대벤처타운역 2번출구 도보 7분
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Naver Place Embed */}
          <div className="lg:col-span-2">
            <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
              {!loaded && (
                <div className="absolute inset-0 iframe-shimmer flex items-center justify-center">
                  <div className="text-gray-400 text-sm flex items-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    네이버 지도 불러오는 중...
                  </div>
                </div>
              )}
              <iframe
                src={naverPlaceUrl}
                className="w-full h-full border-0 relative"
                title="옵티멈스터디카페 신림대학점 네이버 지도"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setLoaded(true)}
              />
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-navy font-bold text-sm mb-1">주소</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{directions.address_detail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-navy font-bold text-sm mb-1">교통편</p>
                  <p className="text-gray-600 text-sm">{directions.subway}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-navy font-bold text-sm mb-1">전화</p>
                  <a
                    href={`tel:${telephone}`}
                    className="text-gray-600 text-sm hover:text-yellow transition-colors"
                  >
                    {telephone}
                  </a>
                </div>
              </div>
            </div>

            {/* Naver Map Link */}
            <a
              href={naverPlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#03C75A] text-white font-bold px-6 py-3.5 rounded-xl hover:shadow-lg hover:shadow-[#03C75A]/30 transition-all w-full"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.5 10.5L7.5 17.5V10.5H3.5L10.5 3.5V10.5H13.5Z" />
              </svg>
              네이버 지도에서 크게 보기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
