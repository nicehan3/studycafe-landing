import { getPlaceData } from "@/lib/data";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import PricingSection from "@/components/PricingSection";
import GallerySection from "@/components/GallerySection";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";
import KakaoFloat from "@/components/KakaoFloat";

export default function Home() {
  const data = getPlaceData();

  return (
    <>
      <Header telephone={data.telephone} />

      <main id="main">
        <HeroSection slogan={data.slogan} highlights={data.highlights} heroImages={data.hero_images} />

        <IntroSection description={data.description} features={data.features} />

        <FacilitiesSection facilities={data.facilities} floors={data.floors} />

        <PricingSection
          priceInfo={data.price_info}
          kakaoChannel={data.kakao_channel}
          naverPlaceUrl={data.naver_place_url}
          telephone={data.telephone}
        />

        <GallerySection gallery={data.gallery} />

        <MapSection
          directions={data.directions}
          telephone={data.telephone}
          naverPlaceUrl={data.naver_place_url}
        />
      </main>

      <Footer
        telephone={data.telephone}
        address={data.address}
        businessHours={data.business_hours}
        kakaoChannel={data.kakao_channel}
        blogUrl={data.blog_url}
        instagram={data.instagram}
        naverPlaceUrl={data.naver_place_url}
      />

      <KakaoFloat href={data.kakao_channel} telephone={data.telephone} />
    </>
  );
}
