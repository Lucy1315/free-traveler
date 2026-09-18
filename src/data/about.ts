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
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Mountaineering_Man_Trail_Path_Mountains.jpg/1280px-Mountaineering_Man_Trail_Path_Mountains.jpg",
      alt: "배낭을 메고 산길을 걷는 여행자의 뒷모습",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Mountaineering_Man_Trail_Path_Mountains.jpg",
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
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Jejuolle-route-10%282%29.jpg/960px-Jejuolle-route-10%282%29.jpg",
        alt: "제주 산방산과 유채꽃밭 풍경",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Jejuolle-route-10(2).jpg",
      },
    },
    {
      destinationId: "domestic-busan",
      name: "부산",
      country: "대한민국",
      summary: "해운대와 감천문화마을을 한 번에 즐기는 바다 도시입니다.",
      image: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Colorful_houses_in_Gamcheon_Culture_Village_at_sunset_in_Busan_South_Korea.jpg/960px-Colorful_houses_in_Gamcheon_Culture_Village_at_sunset_in_Busan_South_Korea.jpg",
        alt: "부산 감천문화마을의 알록달록한 집들",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Colorful_houses_in_Gamcheon_Culture_Village_at_sunset_in_Busan_South_Korea.jpg",
      },
    },
    {
      destinationId: "overseas-danang",
      name: "다낭",
      country: "베트남",
      summary: "미케비치와 바나힐을 함께 묶어 3박 4일로 다녀오기 좋습니다.",
      image: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/My_Khe_Beach_Danang_Coastline.jpg/960px-My_Khe_Beach_Danang_Coastline.jpg",
        alt: "다낭 미케비치 해안선",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:My_Khe_Beach_Danang_Coastline.jpg",
      },
    },
    {
      destinationId: "overseas-osaka",
      name: "오사카",
      country: "일본",
      summary: "도톤보리 야경과 간사이 근교 당일치기 코스로 유명합니다.",
      image: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Osaka_Dotonbori_yoru.jpg/960px-Osaka_Dotonbori_yoru.jpg",
        alt: "오사카 도톤보리 야경",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Osaka_Dotonbori_yoru.jpg",
      },
    },
    {
      destinationId: "overseas-bangkok",
      name: "방콕",
      country: "태국",
      summary: "사원 투어와 야시장을 함께 즐기는 동남아 대표 도시입니다.",
      image: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Templo_Wat_Arun%2C_Bangkok%2C_Tailandia%2C_2013-08-22%2C_DD_37.jpg/960px-Templo_Wat_Arun%2C_Bangkok%2C_Tailandia%2C_2013-08-22%2C_DD_37.jpg",
        alt: "방콕 왓아룬 사원 야경",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Templo_Wat_Arun,_Bangkok,_Tailandia,_2013-08-22,_DD_37.jpg",
      },
    },
    {
      destinationId: "overseas-paris",
      name: "파리",
      country: "프랑스",
      summary: "미술관과 골목 카페를 여유롭게 도보로 둘러보기 좋습니다.",
      image: {
        url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Eiffel_Tower_and_Pont_Alexandre_III_at_night.jpg/960px-Eiffel_Tower_and_Pont_Alexandre_III_at_night.jpg",
        alt: "파리 에펠탑과 센 강변 야경",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Eiffel_Tower_and_Pont_Alexandre_III_at_night.jpg",
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
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Le_Gan_Chenpo_%28Himalaya%2C_N%C3%A9pal%29_%288446635289%29.jpg/960px-Le_Gan_Chenpo_%28Himalaya%2C_N%C3%A9pal%29_%288446635289%29.jpg",
      alt: "히말라야 설산과 숲 풍경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Le_Gan_Chenpo_(Himalaya,_N%C3%A9pal)_(8446635289).jpg",
      country: "네팔",
    },
    {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/A_well-known_coffee_terrace_%2846610470381%29.jpg/960px-A_well-known_coffee_terrace_%2846610470381%29.jpg",
      alt: "파리 카페 테라스에 앉은 사람들",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:A_well-known_coffee_terrace_(46610470381).jpg",
      country: "프랑스",
    },
    {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Ta_Prohm_%28I%29.jpg/960px-Ta_Prohm_%28I%29.jpg",
      alt: "나무뿌리에 뒤덮인 타프롬 사원 유적",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Ta_Prohm_(I).jpg",
      country: "캄보디아",
    },
    {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/Koh_Mak_%28island%29%2C_Thailand%2C_Sunset_on_the_beach_with_palms.jpg/960px-Koh_Mak_%28island%29%2C_Thailand%2C_Sunset_on_the_beach_with_palms.jpg",
      alt: "해질녘 야자수가 드리운 태국 코막 섬 해변",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Koh_Mak_(island),_Thailand,_Sunset_on_the_beach_with_palms.jpg",
      country: "태국",
    },
    {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/CH.VS.Zermatt_Sunnegga_Grindjisee_Matterhorn_9034_16x9-R_16K.jpg/960px-CH.VS.Zermatt_Sunnegga_Grindjisee_Matterhorn_9034_16x9-R_16K.jpg",
      alt: "마터호른이 비치는 알프스 호수",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:CH.VS.Zermatt_Sunnegga_Grindjisee_Matterhorn_9034_16x9-R_16K.jpg",
      country: "스위스",
    },
    {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/TW_%E5%8F%B0%E7%81%A3_Taiwan_TPE_%E5%8F%B0%E5%8C%97%E5%B8%82_Taipei_%E5%A3%AB%E6%9E%97%E5%A4%9C%E5%B8%82_Shilin_Night_Market_March_2024_R12S_621.jpg/960px-TW_%E5%8F%B0%E7%81%A3_Taiwan_TPE_%E5%8F%B0%E5%8C%97%E5%B8%82_Taipei_%E5%A3%AB%E6%9E%97%E5%A4%9C%E5%B8%82_Shilin_Night_Market_March_2024_R12S_621.jpg",
      alt: "타이베이 스린 야시장 거리 풍경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:TW_%E5%8F%B0%E7%81%A3_Taiwan_TPE_%E5%8F%B0%E5%8C%97%E5%B8%82_Taipei_%E5%A3%AB%E6%9E%97%E5%A4%9C%E5%B8%82_Shilin_Night_Market_March_2024_R12S_621.jpg",
      country: "대만",
    },
    {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Brooklyn_Bridge%2C_Manhattan_at_night_3.jpg/960px-Brooklyn_Bridge%2C_Manhattan_at_night_3.jpg",
      alt: "브루클린 브리지와 맨해튼 야경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Brooklyn_Bridge,_Manhattan_at_night_3.jpg",
      country: "미국",
    },
    {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Marokko_W%C3%BCste_01.JPG/960px-Marokko_W%C3%BCste_01.JPG",
      alt: "모로코 사하라 사막 모래언덕",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Marokko_W%C3%BCste_01.JPG",
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
