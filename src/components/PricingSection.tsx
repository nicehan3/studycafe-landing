interface PricingProps {
  priceInfo: { name: string; price: string }[];
  kakaoChannel: string;
  naverPlaceUrl: string;
  telephone: string;
}

export default function PricingSection({ priceInfo, kakaoChannel, naverPlaceUrl, telephone }: PricingProps) {
  const hasPricing = priceInfo.length > 0;

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-yellow font-bold text-sm tracking-widest uppercase mb-3">
            Pricing
          </p>
          <h2 className="text-navy text-3xl sm:text-4xl font-black mb-6">
            이용 요금
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            1회권 · 기간권 · 정기권 다양한 이용권이 준비되어 있습니다
          </p>
        </div>

        {hasPricing ? (
          /* Pricing Table */
          <div className="bg-white rounded-2xl overflow-hidden mb-10 shadow-sm border border-gray-100">
            <div className="grid grid-cols-2 bg-navy text-white font-bold text-sm px-6 py-4">
              <span>이용권</span>
              <span className="text-right">가격</span>
            </div>
            {priceInfo.map((item, i) => (
              <div
                key={i}
                className={`grid grid-cols-2 px-6 py-4 text-sm ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <span className="text-gray-700 font-medium">{item.name}</span>
                <span className="text-right text-navy font-bold">{item.price}</span>
              </div>
            ))}
          </div>
        ) : (
          /* No pricing data - show notice */
          <div className="bg-white rounded-2xl p-10 text-center mb-10 shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-yellow/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-navy font-bold text-xl mb-2">
              요금 안내
            </p>
            <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              자세한 요금은 네이버 플레이스 또는<br />
              카카오톡 채널을 통해 확인하실 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={naverPlaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#03C75A] text-white font-bold px-6 py-3.5 rounded-full hover:shadow-lg hover:shadow-[#03C75A]/30 transition-all text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.5 10.5L7.5 17.5V10.5H3.5L10.5 3.5V10.5H13.5Z" />
                </svg>
                네이버에서 확인
              </a>
              <a
                href={kakaoChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#FEE500] text-[#3C1E1E] font-bold px-6 py-3.5 rounded-full hover:shadow-lg hover:shadow-yellow/30 transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M128 36C70.6 36 24 72.6 24 117.4c0 29 19.2 54.4 48 69.2l-10 36.4c-.8 2.8 2.6 5 4.8 3.4l42.6-28.2c6 .8 12.2 1.2 18.6 1.2 57.4 0 104-36.6 104-81.4S185.4 36 128 36z" />
                </svg>
                카카오톡 문의
              </a>
              <a
                href={`tel:${telephone}`}
                className="inline-flex items-center justify-center gap-2 bg-navy text-white font-bold px-6 py-3.5 rounded-full hover:shadow-lg hover:shadow-navy/30 transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                전화 걸기
              </a>
            </div>
          </div>
        )}

        {/* Note */}
        <p className="text-center text-gray-400 text-xs">
          * 요금은 변동될 수 있으며, 최신 요금은 매장 또는 카카오톡 채널을 통해 확인해 주세요.
        </p>
      </div>
    </section>
  );
}
