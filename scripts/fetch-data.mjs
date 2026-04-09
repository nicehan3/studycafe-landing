/**
 * 옵티멈스터디카페 네이버 플레이스 데이터 수집 스크립트 (Node.js)
 * - Place ID: 1333416518
 * - REST API로 매장 정보, 사진 수집
 * - 결과를 data/place-data.json에 저장
 */
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.resolve(__dirname, "..");
const DATA_DIR = path.join(BASE_DIR, "data");
const GALLERY_DIR = path.join(BASE_DIR, "public", "images", "gallery");
const PLACE_ID = "1333416518";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Referer: "https://m.place.naver.com/",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "ko-KR,ko;q=0.9",
};

function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: "GET",
      headers: { ...HEADERS, ...headers },
    };
    const req = https.request(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        httpsGet(res.headers.location, headers).then(resolve).catch(reject);
        return;
      }
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.end();
  });
}

function httpsPost(url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(body);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: "POST",
      headers: {
        ...HEADERS,
        ...headers,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.write(postData);
    req.end();
  });
}

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: { "User-Agent": HEADERS["User-Agent"] },
    };
    https
      .get(options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          downloadFile(res.headers.location, filepath).then(resolve).catch(reject);
          return;
        }
        const ws = fs.createWriteStream(filepath);
        res.pipe(ws);
        ws.on("finish", () => {
          ws.close();
          resolve(true);
        });
      })
      .on("error", reject);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchViaGraphQL() {
  console.log("  GraphQL API 호출 중...");
  const payload = [
    {
      operationName: "getPlaceDetail",
      variables: { id: PLACE_ID },
      query: `
        query getPlaceDetail($id: String!) {
          placeDetail(id: $id) {
            id name roadAddress address phone category
            visitorReviewCount blogReviewCount visitorReviewScore
            businessHours
            menuInfo { menuList { name price } }
            facilityInfo { facilityList }
            imageUrl description x y
          }
        }
      `,
    },
  ];

  try {
    const raw = await httpsPost("https://pcmap-api.place.naver.com/graphql", payload);
    const data = JSON.parse(raw);
    if (Array.isArray(data) && data[0]?.data?.placeDetail) {
      const p = data[0].data.placeDetail;
      return parsePlaceDetail(p);
    }
  } catch (e) {
    console.log(`  GraphQL 오류: ${e.message}`);
  }
  return null;
}

async function fetchViaRestAPI() {
  console.log("  REST API fallback...");
  const result = {};

  // 기본 정보
  try {
    const raw = await httpsGet(`https://map.naver.com/p/api/sites/summary/${PLACE_ID}?lang=ko`);
    const data = JSON.parse(raw);
    Object.assign(result, {
      name: data.name || "",
      address: data.roadAddress || data.address || "",
      telephone: data.phone || "",
      category: data.category || "",
      rating: data.averageRating || data.visitorReviewScore || 0,
      visitor_review_count: data.visitorReviewCount || 0,
      blog_review_count: data.blogCafeReviewCount || 0,
      business_hours: data.businessHours || "",
      description: data.description || "",
      x: data.x,
      y: data.y,
    });
  } catch (e) {
    console.log(`  기본 정보 오류: ${e.message}`);
  }

  await sleep(800);

  // 메뉴/요금
  try {
    const raw = await httpsGet(`https://map.naver.com/p/api/sites/summary/${PLACE_ID}/menu?lang=ko`);
    const data = JSON.parse(raw);
    const menus = Array.isArray(data) ? data : data.menus || [];
    result.price_info = menus
      .slice(0, 30)
      .map((m) => ({ name: m.name || m.menuName || "", price: m.price || m.unitPrice || "" }))
      .filter((m) => m.name);
  } catch (e) {
    console.log(`  메뉴 정보 오류: ${e.message}`);
  }

  await sleep(800);

  // 시설 정보
  try {
    const raw = await httpsGet(`https://map.naver.com/p/api/sites/summary/${PLACE_ID}/detailed?lang=ko`);
    const data = JSON.parse(raw);
    result.facilities = [...(data.facilities || []), ...(data.convenience || [])];
  } catch (e) {
    console.log(`  시설 정보 오류: ${e.message}`);
  }

  return result.name ? result : null;
}

async function fetchPhotos() {
  const photos = [];
  try {
    const raw = await httpsGet(`https://map.naver.com/p/api/sites/summary/${PLACE_ID}/photo?lang=ko`);
    const data = JSON.parse(raw);
    const list = Array.isArray(data) ? data : data.photos || data.list || [];
    for (const item of list.slice(0, 20)) {
      const url = typeof item === "string" ? item : item.url || item.imageUrl || item.thumbnailUrl || "";
      if (url) photos.push(url);
    }
    console.log(`  사진 ${photos.length}장 수집`);
  } catch (e) {
    console.log(`  사진 수집 오류: ${e.message}`);
  }
  return photos;
}

async function downloadImages(photoUrls) {
  fs.mkdirSync(GALLERY_DIR, { recursive: true });
  const downloaded = [];

  for (let i = 0; i < photoUrls.length; i++) {
    const filename = `gallery_${String(i + 1).padStart(2, "0")}.jpg`;
    const filepath = path.join(GALLERY_DIR, filename);
    try {
      await downloadFile(photoUrls[i], filepath);
      downloaded.push(`/images/gallery/${filename}`);
      console.log(`  다운로드: ${filename}`);
    } catch (e) {
      console.log(`  다운로드 실패: ${e.message}`);
      downloaded.push(photoUrls[i]);
    }
  }
  return downloaded;
}

function parsePlaceDetail(data) {
  const priceInfo = [];
  const menuList = data.menuInfo?.menuList || [];
  for (const menu of menuList) {
    priceInfo.push({ name: menu.name || "", price: menu.price || "" });
  }

  const facilities = data.facilityInfo?.facilityList || [];

  return {
    name: data.name || "",
    address: data.roadAddress || data.address || "",
    telephone: data.phone || "",
    category: data.category || "",
    visitor_review_count: data.visitorReviewCount || 0,
    blog_review_count: data.blogReviewCount || 0,
    rating: data.visitorReviewScore || 0,
    business_hours: data.businessHours || "",
    price_info: priceInfo,
    facilities: Array.isArray(facilities) ? facilities : [],
    description: data.description || "",
    x: data.x,
    y: data.y,
  };
}

async function main() {
  console.log("==================================================");
  console.log("옵티멈스터디카페 데이터 수집 시작");
  console.log(`Place ID: ${PLACE_ID}`);
  console.log("==================================================");

  // 1. 매장 정보
  console.log("\n[1] 매장 정보 수집 중...");
  let detail = await fetchViaGraphQL();
  if (!detail) {
    await sleep(1500);
    detail = await fetchViaRestAPI();
  }

  if (!detail) {
    console.log("[기본 정보로 대체합니다]");
    detail = {
      name: "옵티멈스터디카페",
      address: "서울 관악구 신림로15길 31",
      telephone: "0507-1365-5966",
      category: "스터디카페",
      visitor_review_count: 0,
      blog_review_count: 0,
      rating: 0,
      business_hours: "24시간 연중무휴",
      price_info: [],
      facilities: [],
      description: "신림동 최초 단독 건물형 스터디카페. 300평 5개층 220석.",
      x: "126.9285",
      y: "37.4687",
    };
  }

  console.log(`  매장명: ${detail.name}`);
  console.log(`  주소: ${detail.address}`);
  console.log(`  요금 항목: ${detail.price_info?.length || 0}개`);
  console.log(`  편의시설: ${detail.facilities?.length || 0}개`);

  // 2. 사진 수집
  console.log("\n[2] 사진 수집 중...");
  await sleep(1500);
  const photoUrls = await fetchPhotos();

  // 3. 이미지 다운로드
  let localImages = [];
  if (photoUrls.length > 0) {
    console.log(`\n[3] ${photoUrls.length}장 이미지 다운로드 중...`);
    localImages = await downloadImages(photoUrls);
  } else {
    console.log("\n[3] 수집된 사진이 없습니다.");
  }

  // 4. JSON 저장
  const result = {
    ...detail,
    place_id: PLACE_ID,
    images: localImages,
    image_urls_original: photoUrls,
    naver_place_url: `https://map.naver.com/p/entry/place/${PLACE_ID}`,
    kakao_channel: "https://pf.kakao.com/_vxgxjIn",
    blog_url: "https://blog.naver.com/optimumstudycafe",
    instagram: "https://www.instagram.com/opt_studycafe/",
    fetchedAt: new Date().toISOString(),
  };

  fs.mkdirSync(DATA_DIR, { recursive: true });
  const outputPath = path.join(DATA_DIR, "place-data.json");
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");

  console.log(`\n[완료] 데이터 저장: ${outputPath}`);
  console.log(`  이미지: ${localImages.length}장`);
  console.log("==================================================");
}

main().catch(console.error);
