const ICONS: Record<string, string> = {
  "24시간 연중무휴": "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  "300평 통건물": "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  "5개층 다양한 분위기": "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
  "와이드 책상": "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  "고급 안마의자": "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
  "푸드존 & 무인매점": "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z",
};

interface IntroProps {
  description: string;
  features: { title: string; description: string }[];
}

export default function IntroSection({ description, features }: IntroProps) {
  return (
    <section id="intro" className="relative py-20 sm:py-28 bg-white overflow-hidden">
      {/* Decorative dot grid */}
      <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" aria-hidden />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-yellow font-bold text-sm tracking-widest uppercase mb-3">
            About Us
          </p>
          <h2 className="text-navy text-3xl sm:text-4xl font-black mb-6">
            매장 소개
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-gray-50 rounded-2xl p-6 hover:bg-navy hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-yellow/10 group-hover:bg-yellow/20 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-yellow"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d={ICONS[feature.title] || "M5 13l4 4L19 7"}
                  />
                </svg>
              </div>
              <h3 className="text-navy group-hover:text-yellow font-bold text-lg mb-2 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 group-hover:text-white/70 text-sm leading-relaxed transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
