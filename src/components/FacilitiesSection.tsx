interface FacilitiesProps {
  facilities: string[];
  floors: { floor: string; description: string }[];
}

// Simple icon map per facility keyword
const FACILITY_ICONS: Record<string, string> = {
  "스터디룸": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  "런닝머신": "M13 10V3L4 14h7v7l9-11h-7z",
  "안마의자": "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  "다이닝": "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z",
  "매점": "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4",
  "휴식": "M3 12h18M3 12a9 9 0 019-9m-9 9a9 9 0 019 9m9-9a9 9 0 00-9-9m9 9a9 9 0 01-9 9",
  "책상": "M4 6h16M4 10h16M10 14h10M4 14h2M10 18h10M4 18h2",
  "Wi-Fi": "M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0",
  "프린터": "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z",
  "사물함": "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
};

function iconFor(name: string) {
  for (const [k, v] of Object.entries(FACILITY_ICONS)) {
    if (name.includes(k)) return v;
  }
  return "M5 13l4 4L19 7";
}

export default function FacilitiesSection({ facilities, floors }: FacilitiesProps) {
  return (
    <section id="facilities" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-yellow font-bold text-sm tracking-widest uppercase mb-3">
            Facilities
          </p>
          <h2 className="text-navy text-3xl sm:text-4xl font-black mb-6">
            시설 안내
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
            각 층마다 다른 분위기, 다양한 편의시설로 최적의 학습 환경을 제공합니다.
          </p>
        </div>

        {/* Floors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {floors.map((f) => (
            <div
              key={f.floor}
              className="group relative bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-yellow hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="text-yellow font-black text-2xl mb-2 group-hover:scale-110 transition-transform">
                {f.floor}
              </div>
              <div className="text-navy font-medium text-sm">
                {f.description}
              </div>
            </div>
          ))}
        </div>

        {/* Facilities List */}
        <div className="bg-white rounded-2xl p-8 sm:p-10">
          <h3 className="text-navy font-bold text-xl mb-6 text-center">
            편의시설
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {facilities.map((facility) => (
              <div
                key={facility}
                className="flex items-center gap-3 bg-gray-50 hover:bg-yellow/10 rounded-xl px-4 py-3 transition-colors"
              >
                <div className="w-8 h-8 bg-navy/5 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={iconFor(facility)} />
                  </svg>
                </div>
                <span className="text-gray-700 text-sm font-medium">{facility}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
