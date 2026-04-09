import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "옵티멈스터디카페 신림대학점 | 24시간 스터디카페",
  description:
    "신림동 최초 단독 건물형 스터디카페. 300평 5개층 220석. 24시간 연중무휴. 서울대벤처타운역 도보 7분.",
  keywords: [
    "스터디카페",
    "신림",
    "신림동",
    "대학동",
    "24시간",
    "옵티멈",
    "서울대입구",
    "서울대벤처타운",
    "스터디룸",
  ],
  openGraph: {
    title: "옵티멈스터디카페 신림대학점",
    description: "최적의 공간이 최상의 결과를 만든다! 300평 5개층 24시간 스터디카페",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "옵티멈스터디카페 신림대학점",
              description: "신림동 최초 단독 건물형 스터디카페",
              address: {
                "@type": "PostalAddress",
                streetAddress: "신림로15길 31",
                addressLocality: "관악구",
                addressRegion: "서울특별시",
                addressCountry: "KR",
              },
              telephone: "0507-1365-5966",
              openingHours: "Mo-Su 00:00-23:59",
              url: "https://map.naver.com/p/entry/place/1333416518",
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="skip-link">본문 바로가기</a>
        {children}
      </body>
    </html>
  );
}
