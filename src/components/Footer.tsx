interface FooterProps {
  telephone: string;
  address: string;
  businessHours: string;
  kakaoChannel: string;
  blogUrl: string;
  instagram: string;
  naverPlaceUrl: string;
}

export default function Footer({
  telephone,
  address,
  businessHours,
  kakaoChannel,
  blogUrl,
  instagram,
  naverPlaceUrl,
}: FooterProps) {
  return (
    <footer className="bg-navy-dark text-white/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span className="text-yellow font-black text-2xl">OPTIMUM</span>
              <div className="text-white/50 text-sm mt-1">스터디카페 신림대학점</div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              최적의 공간이<br />
              최상의 결과를 만든다.
            </p>
          </div>

          {/* Info */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-sm mb-4">매장 정보</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-yellow shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{address}</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-yellow shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${telephone}`} className="hover:text-yellow transition-colors">
                  {telephone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-yellow shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{businessHours}</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">채널</h3>
            <div className="flex flex-col gap-2">
              <a
                href={kakaoChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/5 hover:bg-yellow/20 px-4 py-2.5 rounded-lg text-sm transition-colors"
              >
                <span className="w-5 text-center">💬</span> 카카오톡 채널
              </a>
              <a
                href={naverPlaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/5 hover:bg-yellow/20 px-4 py-2.5 rounded-lg text-sm transition-colors"
              >
                <span className="w-5 text-center text-[#03C75A] font-black">N</span> 네이버 플레이스
              </a>
              <a
                href={blogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/5 hover:bg-yellow/20 px-4 py-2.5 rounded-lg text-sm transition-colors"
              >
                <span className="w-5 text-center">📝</span> 블로그
              </a>
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/5 hover:bg-yellow/20 px-4 py-2.5 rounded-lg text-sm transition-colors"
              >
                <span className="w-5 text-center">📷</span> 인스타그램
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
          <p>&copy; {new Date().getFullYear()} 옵티멈스터디카페 신림대학점. All rights reserved.</p>
          <p>24시간 연중무휴 운영</p>
        </div>
      </div>
    </footer>
  );
}
