"""
옵티멈스터디카페 네이버 플레이스 데이터 수집 스크립트
- Place ID: 1333416518
- GraphQL API + REST API로 매장 정보, 사진 수집
- 결과를 data/place-data.json에 저장
"""
import requests
import json
import os
import time
import random
import urllib.request

PLACE_ID = "1333416518"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
GALLERY_DIR = os.path.join(BASE_DIR, "public", "images", "gallery")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://m.place.naver.com/",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "ko-KR,ko;q=0.9",
}

PLACE_API_URL = "https://pcmap-api.place.naver.com/graphql"


def fetch_via_graphql():
    """GraphQL API로 매장 상세 정보 수집"""
    payload = [
        {
            "operationName": "getPlaceDetail",
            "variables": {"id": PLACE_ID},
            "query": """
            query getPlaceDetail($id: String!) {
                placeDetail(id: $id) {
                    id
                    name
                    roadAddress
                    address
                    phone
                    category
                    visitorReviewCount
                    blogReviewCount
                    visitorReviewScore
                    businessHours
                    menuInfo {
                        menuList {
                            name
                            price
                        }
                    }
                    facilityInfo {
                        facilityList
                    }
                    imageUrl
                    description
                    x
                    y
                }
            }
            """
        }
    ]

    try:
        resp = requests.post(
            PLACE_API_URL,
            json=payload,
            headers={**HEADERS, "Content-Type": "application/json"},
            timeout=15,
        )
        if resp.status_code == 200:
            data = resp.json()
            if isinstance(data, list) and data:
                place = data[0].get("data", {}).get("placeDetail")
                if place:
                    return parse_place_detail(place)
        print(f"[GraphQL] 응답 코드: {resp.status_code}")
    except Exception as e:
        print(f"[GraphQL 오류] {e}")
    return None


def fetch_via_rest_api():
    """REST API로 매장 정보 수집 (fallback)"""
    result = {}

    # 기본 정보
    try:
        url = f"https://map.naver.com/p/api/sites/summary/{PLACE_ID}?lang=ko"
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            result.update({
                "name": data.get("name", ""),
                "address": data.get("roadAddress", "") or data.get("address", ""),
                "telephone": data.get("phone", ""),
                "category": data.get("category", ""),
                "rating": data.get("averageRating") or data.get("visitorReviewScore") or 0,
                "visitor_review_count": data.get("visitorReviewCount", 0),
                "blog_review_count": data.get("blogCafeReviewCount", 0),
                "business_hours": data.get("businessHours", ""),
                "description": data.get("description", ""),
                "x": data.get("x"),
                "y": data.get("y"),
            })
    except Exception as e:
        print(f"[REST 기본정보 오류] {e}")

    time.sleep(random.uniform(0.5, 1.0))

    # 메뉴/요금 정보
    try:
        url = f"https://map.naver.com/p/api/sites/summary/{PLACE_ID}/menu?lang=ko"
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            menus = []
            if isinstance(data, list):
                menus = data
            elif isinstance(data, dict) and "menus" in data:
                menus = data["menus"]
            result["price_info"] = [
                {"name": m.get("name", ""), "price": m.get("price", "")}
                for m in menus[:30] if m.get("name")
            ]
    except Exception as e:
        print(f"[REST 메뉴 오류] {e}")

    time.sleep(random.uniform(0.5, 1.0))

    # 시설 정보
    try:
        url = f"https://map.naver.com/p/api/sites/summary/{PLACE_ID}/detailed?lang=ko"
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            facilities = data.get("facilities", [])
            if data.get("convenience"):
                facilities += data["convenience"]
            result["facilities"] = facilities
    except Exception as e:
        print(f"[REST 시설 오류] {e}")

    return result if result.get("name") else None


def fetch_photos():
    """네이버 플레이스 사진 URL 수집"""
    photos = []
    try:
        url = f"https://map.naver.com/p/api/sites/summary/{PLACE_ID}/photo?lang=ko"
        resp = requests.get(url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            if isinstance(data, dict):
                photo_list = data.get("photos", data.get("list", []))
            elif isinstance(data, list):
                photo_list = data
            else:
                photo_list = []

            for item in photo_list[:20]:
                if isinstance(item, str):
                    photos.append(item)
                elif isinstance(item, dict):
                    photo_url = item.get("url") or item.get("imageUrl") or item.get("thumbnailUrl") or ""
                    if photo_url:
                        photos.append(photo_url)
        print(f"[사진] {len(photos)}장 수집")
    except Exception as e:
        print(f"[사진 수집 오류] {e}")
    return photos


def download_images(photo_urls):
    """사진을 로컬에 다운로드"""
    downloaded = []
    os.makedirs(GALLERY_DIR, exist_ok=True)

    for i, url in enumerate(photo_urls):
        try:
            filename = f"gallery_{i+1:02d}.jpg"
            filepath = os.path.join(GALLERY_DIR, filename)
            req = urllib.request.Request(url, headers={"User-Agent": HEADERS["User-Agent"]})
            with urllib.request.urlopen(req, timeout=15) as response:
                with open(filepath, "wb") as f:
                    f.write(response.read())
            downloaded.append(f"/images/gallery/{filename}")
            print(f"  다운로드: {filename}")
        except Exception as e:
            print(f"  다운로드 실패 ({url[:50]}...): {e}")
            # CDN URL을 fallback으로 유지
            downloaded.append(url)

    return downloaded


def parse_place_detail(data):
    """API 응답을 표준 형식으로 변환"""
    price_info = []
    menu_info = data.get("menuInfo") or {}
    for menu in menu_info.get("menuList", []):
        price_info.append({
            "name": menu.get("name", ""),
            "price": menu.get("price", ""),
        })

    facilities = []
    facility_info = data.get("facilityInfo") or {}
    facilities = facility_info.get("facilityList", [])

    return {
        "name": data.get("name", ""),
        "address": data.get("roadAddress", "") or data.get("address", ""),
        "telephone": data.get("phone", ""),
        "category": data.get("category", ""),
        "visitor_review_count": data.get("visitorReviewCount", 0) or 0,
        "blog_review_count": data.get("blogReviewCount", 0) or 0,
        "rating": data.get("visitorReviewScore", 0) or 0,
        "business_hours": data.get("businessHours", ""),
        "price_info": price_info,
        "facilities": facilities if isinstance(facilities, list) else [],
        "description": data.get("description", ""),
        "x": data.get("x"),
        "y": data.get("y"),
    }


def main():
    print("=" * 50)
    print("옵티멈스터디카페 데이터 수집 시작")
    print(f"Place ID: {PLACE_ID}")
    print("=" * 50)

    # 1. 매장 정보 수집
    print("\n[1] GraphQL API로 매장 정보 수집 중...")
    detail = fetch_via_graphql()

    if not detail:
        print("[1] GraphQL 실패, REST API fallback...")
        time.sleep(random.uniform(1.0, 2.0))
        detail = fetch_via_rest_api()

    if not detail:
        print("[오류] 매장 정보를 수집하지 못했습니다.")
        # 기본 정보로 fallback
        detail = {
            "name": "옵티멈스터디카페",
            "address": "서울 관악구 신림로15길 31",
            "telephone": "0507-1365-5966",
            "category": "스터디카페",
            "visitor_review_count": 0,
            "blog_review_count": 0,
            "rating": 0,
            "business_hours": "24시간 연중무휴",
            "price_info": [],
            "facilities": [],
            "description": "신림동 최초 단독 건물형 스터디카페. 300평 5개층 220석.",
            "x": "126.9285",
            "y": "37.4687",
        }
        print("[기본 정보로 대체합니다]")

    print(f"  매장명: {detail.get('name')}")
    print(f"  주소: {detail.get('address')}")
    print(f"  요금 항목 수: {len(detail.get('price_info', []))}")
    print(f"  편의시설 수: {len(detail.get('facilities', []))}")

    # 2. 사진 수집
    print("\n[2] 사진 수집 중...")
    time.sleep(random.uniform(1.0, 2.0))
    photo_urls = fetch_photos()

    # 3. 이미지 다운로드
    local_images = []
    if photo_urls:
        print(f"\n[3] {len(photo_urls)}장 이미지 다운로드 중...")
        local_images = download_images(photo_urls)
    else:
        print("\n[3] 수집된 사진이 없습니다.")

    # 4. JSON 저장
    result = {
        **detail,
        "place_id": PLACE_ID,
        "images": local_images,
        "image_urls_original": photo_urls,
        "naver_place_url": f"https://map.naver.com/p/entry/place/{PLACE_ID}",
        "kakao_channel": "https://pf.kakao.com/_vxgxjIn",
        "blog_url": "https://blog.naver.com/optimumstudycafe",
        "instagram": "https://www.instagram.com/opt_studycafe/",
    }

    os.makedirs(DATA_DIR, exist_ok=True)
    output_path = os.path.join(DATA_DIR, "place-data.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"\n[완료] 데이터 저장: {output_path}")
    print(f"  이미지: {len(local_images)}장")
    print("=" * 50)


if __name__ == "__main__":
    main()
