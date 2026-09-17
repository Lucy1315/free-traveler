// SCR-002(`/about`) 대표 소개 정적 데이터.
// design-reference/D-001/DESIGN.md §17 SCR-002, design-reference/UI_CONTRACT.md 2장 기준.
// REQ-FUNC-057~061·063. 이 파일은 정적 데이터만 다루며, 실제 화면 조립은 PO-SCR-002가 한다.

export interface AboutHeroStat {
  label: string;
  value: string;
}

export interface AboutHero {
  name: string;
  tagline: string;
  image: AboutImage;
  stats: AboutHeroStat[];
}

export interface AboutImage {
  url: string;
  alt: string;
  sourceUrl: string;
}

export interface AboutRecommendedDestination {
  destinationId: string;
  name: string;
  country: string;
  summary: string;
  image: AboutImage;
}

export interface AboutVisitedCountry {
  name: string;
  continent:
    "아시아" | "유럽" | "북아메리카" | "남아메리카" | "아프리카" | "오세아니아";
}

export interface AboutTimelineEntry {
  year: number;
  place: string;
  summary: string;
}

export interface AboutGalleryPhoto extends AboutImage {
  country: string;
}

export interface AboutPhilosophy {
  quote: string;
  principles: string[];
}

export interface AboutChecklistStep {
  step: number;
  title: string;
  description: string;
}

export interface AboutProfile {
  hero: AboutHero;
  recommendedDestinations: AboutRecommendedDestination[];
  visitedCountries: AboutVisitedCountry[];
  timeline: AboutTimelineEntry[];
  gallery: AboutGalleryPhoto[];
  philosophy: AboutPhilosophy;
  checklist: {
    steps: AboutChecklistStep[];
    ctaLabel: string;
    ctaHref: string;
  };
}

// REQ-FUNC-057: 대표명 free_traveler, 50+ Trips, 30+ Countries.
// REQ-FUNC-058: 소개문·여행 철학·콘텐츠 편집 원칙.
// REQ-FUNC-061(축소): 이미지는 alt·출처 URL만 관리한다(작가·라이선스 승인 절차 제외).
export const aboutProfile: AboutProfile = {
  hero: {
    name: "free_traveler",
    tagline:
      "가볍게 떠나 오래 기억할 여행을 기록하고, 그 경험을 다음 여행자와 나눕니다.",
    image: {
      url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
      alt: "배낭을 메고 산길을 걷는 free_traveler의 뒷모습",
      sourceUrl:
        "https://unsplash.com/photos/person-walking-on-pathway-between-green-trees-during-daytime-Fs4mgpn1MEo",
    },
    stats: [
      { label: "Trips", value: "50+ Trips" },
      { label: "Countries", value: "30+ Countries" },
    ],
  },

  // REQ-FUNC-063: 대표 추천 여행지 6개(공개 여행지 상세로 연결). destinationId는
  // DATA-DESTINATIONS-DOMESTIC/OVERSEAS(W01 후속 Task)의 여행지 id와 맞춘다.
  recommendedDestinations: [
    {
      destinationId: "domestic-jeju",
      name: "제주",
      country: "대한민국",
      summary: "오름과 해안도로를 따라 걷기 좋은 사계절 여행지입니다.",
      image: {
        url: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
        alt: "제주 해안도로와 유채꽃밭 풍경",
        sourceUrl:
          "https://unsplash.com/photos/yellow-flower-field-near-body-of-water-during-daytime-3TLl_97HNJo",
      },
    },
    {
      destinationId: "domestic-busan",
      name: "부산",
      country: "대한민국",
      summary: "해운대와 감천문화마을을 한 번에 즐기는 바다 도시입니다.",
      image: {
        url: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80",
        alt: "부산 감천문화마을 전경",
        sourceUrl:
          "https://unsplash.com/photos/aerial-view-of-city-buildings-during-daytime-aXFojNVMYNo",
      },
    },
    {
      destinationId: "overseas-danang",
      name: "다낭",
      country: "베트남",
      summary: "미케비치와 바나힐을 함께 묶어 3박 4일로 다녀오기 좋습니다.",
      image: {
        url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
        alt: "다낭 미케비치 야자수와 해변",
        sourceUrl:
          "https://unsplash.com/photos/palm-trees-near-beach-during-daytime-2FaEFyQlZE0",
      },
    },
    {
      destinationId: "overseas-osaka",
      name: "오사카",
      country: "일본",
      summary: "도톤보리 야경과 간사이 근교 당일치기 코스로 유명합니다.",
      image: {
        url: "https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=800&q=80",
        alt: "오사카 도톤보리 야경",
        sourceUrl:
          "https://unsplash.com/photos/city-buildings-during-night-time-K1jXNekVAQg",
      },
    },
    {
      destinationId: "overseas-bangkok",
      name: "방콕",
      country: "태국",
      summary: "사원 투어와 야시장을 함께 즐기는 동남아 대표 도시입니다.",
      image: {
        url: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80",
        alt: "방콕 왓아룬 사원 전경",
        sourceUrl:
          "https://unsplash.com/photos/temple-under-blue-sky-hSlIzsHOKfQ",
      },
    },
    {
      destinationId: "overseas-paris",
      name: "파리",
      country: "프랑스",
      summary: "미술관과 골목 카페를 여유롭게 도보로 둘러보기 좋습니다.",
      image: {
        url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
        alt: "파리 에펠탑과 센 강변 풍경",
        sourceUrl:
          "https://unsplash.com/photos/eiffel-tower-paris-france-2PIH2eqxYAg",
      },
    },
  ],

  // REQ-FUNC-059: 방문 국가 30개 이상, 대륙별 그룹.
  visitedCountries: [
    { name: "대한민국", continent: "아시아" },
    { name: "일본", continent: "아시아" },
    { name: "베트남", continent: "아시아" },
    { name: "태국", continent: "아시아" },
    { name: "싱가포르", continent: "아시아" },
    { name: "말레이시아", continent: "아시아" },
    { name: "필리핀", continent: "아시아" },
    { name: "대만", continent: "아시아" },
    { name: "인도네시아", continent: "아시아" },
    { name: "캄보디아", continent: "아시아" },
    { name: "인도", continent: "아시아" },
    { name: "네팔", continent: "아시아" },
    { name: "프랑스", continent: "유럽" },
    { name: "이탈리아", continent: "유럽" },
    { name: "스페인", continent: "유럽" },
    { name: "포르투갈", continent: "유럽" },
    { name: "독일", continent: "유럽" },
    { name: "네덜란드", continent: "유럽" },
    { name: "체코", continent: "유럽" },
    { name: "오스트리아", continent: "유럽" },
    { name: "스위스", continent: "유럽" },
    { name: "그리스", continent: "유럽" },
    { name: "아이슬란드", continent: "유럽" },
    { name: "미국", continent: "북아메리카" },
    { name: "캐나다", continent: "북아메리카" },
    { name: "멕시코", continent: "북아메리카" },
    { name: "페루", continent: "남아메리카" },
    { name: "아르헨티나", continent: "남아메리카" },
    { name: "브라질", continent: "남아메리카" },
    { name: "모로코", continent: "아프리카" },
    { name: "남아프리카공화국", continent: "아프리카" },
    { name: "이집트", continent: "아프리카" },
    { name: "호주", continent: "오세아니아" },
    { name: "뉴질랜드", continent: "오세아니아" },
  ],

  // REQ-FUNC-060: 대표 여행 타임라인 3개 이상(연도·장소·요약).
  timeline: [
    {
      year: 2019,
      place: "제주, 대한민국",
      summary: "첫 단독 배낭여행으로 오름을 오르며 여행 기록을 시작했습니다.",
    },
    {
      year: 2021,
      place: "다낭, 베트남",
      summary: "동남아 저비용 항공 노선을 활용한 3박 4일 여행을 다녀왔습니다.",
    },
    {
      year: 2023,
      place: "파리, 프랑스",
      summary:
        "유럽 도보 여행 3주 코스를 기록하며 free_traveler를 구상했습니다.",
    },
    {
      year: 2025,
      place: "오사카, 일본",
      summary:
        "간사이 근교 당일치기 코스를 정리해 커뮤니티에 처음 공유했습니다.",
    },
  ],

  // 사진 Gallery 8장(캡션·촬영 국가 병기).
  gallery: [
    {
      url: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=800&q=80",
      alt: "산 정상에서 내려다본 마을 풍경",
      sourceUrl:
        "https://unsplash.com/photos/aerial-photography-of-mountain-covered-by-snow-B_-BgTawlB0",
      country: "네팔",
    },
    {
      url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80",
      alt: "골목길 카페 테라스에서 바라본 거리",
      sourceUrl:
        "https://unsplash.com/photos/people-sitting-on-chair-near-table-vTNc5342uOo",
      country: "프랑스",
    },
    {
      url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
      alt: "고대 사원 유적 앞에 선 여행자",
      sourceUrl:
        "https://unsplash.com/photos/temple-during-daytime-fbFAiruUmyc",
      country: "캄보디아",
    },
    {
      url: "https://images.unsplash.com/photo-1533760881669-80db4d7b4c15?auto=format&fit=crop&w=800&q=80",
      alt: "해질녘 해변을 걷는 사람들",
      sourceUrl:
        "https://unsplash.com/photos/silhouette-of-people-walking-on-beach-during-sunset-Yn0l7uwBrpw",
      country: "태국",
    },
    {
      url: "https://images.unsplash.com/photo-1490642914619-7955a3fd483c?auto=format&fit=crop&w=800&q=80",
      alt: "설산을 배경으로 한 호수",
      sourceUrl:
        "https://unsplash.com/photos/lake-near-mountain-under-blue-sky-during-daytime-9dzWZQWZMdE",
      country: "스위스",
    },
    {
      url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
      alt: "야시장 거리 노점 풍경",
      sourceUrl:
        "https://unsplash.com/photos/people-walking-on-street-during-night-time-vI_KTxvMSGc",
      country: "대만",
    },
    {
      url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80",
      alt: "도시 야경과 강변 다리",
      sourceUrl:
        "https://unsplash.com/photos/city-skyline-during-night-time-lb1uMHiOFAs",
      country: "미국",
    },
    {
      url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
      alt: "사막 지평선 위로 떠오르는 태양",
      sourceUrl:
        "https://unsplash.com/photos/silhouette-of-mountain-under-orange-sky-fIq0tLuLPXk",
      country: "모로코",
    },
  ],

  // REQ-FUNC-058: 여행 철학(인용구 + 편집 원칙).
  philosophy: {
    quote: "짐은 가볍게, 기록은 정직하게 — 다녀온 곳만 이야기합니다.",
    principles: [
      "직접 다녀온 여행지만 소개하며, 협찬 콘텐츠는 별도로 표기합니다.",
      "가격·예약 정보 대신 준비 과정과 동선 팁 위주로 기록합니다.",
      "안전정보는 항상 최신 출처를 확인한 뒤에만 정리합니다.",
    ],
  },

  // D-001 §17 SCR-002 7번 영역: 여행 준비 체크리스트, 정확히 3단계 + CTA.
  checklist: {
    steps: [
      {
        step: 1,
        title: "여행지 살펴보기",
        description: "국내·해외 추천 여행지와 안전정보를 먼저 확인합니다.",
      },
      {
        step: 2,
        title: "항공·숙소 조건 정리하기",
        description:
          "여행 도구에서 조건을 정리하고 외부 사이트에서 비교합니다.",
      },
      {
        step: 3,
        title: "동행 찾기",
        description:
          "동행 모집글을 등록하거나 마음에 드는 글에 참가를 신청합니다.",
      },
    ],
    ctaLabel: "지금 여행지 둘러보기",
    ctaHref: "/",
  },
};
