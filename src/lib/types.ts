export interface PlaceData {
  name: string;
  branch: string;
  address: string;
  address_short: string;
  telephone: string;
  category: string;
  business_hours: string;
  slogan: string;
  description: string;
  x: string;
  y: string;
  highlights: { label: string; value: string }[];
  features: { title: string; description: string }[];
  facilities: string[];
  floors: { floor: string; description: string }[];
  price_info: { name: string; price: string }[];
  hero_images: string[];
  gallery: { src: string; label: string }[];
  directions: { subway: string; address_detail: string };
  place_id: string;
  naver_place_url: string;
  kakao_channel: string;
  blog_url: string;
  instagram: string;
  images: string[];
  fetchedAt: string;
}
