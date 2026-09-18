// SCR-001(`/`) 국내 여행지 정적 데이터(10곳 이상).
// design-reference/D-001/DESIGN.md §9(Destination Card)·§17(SCR-001 최소 콘텐츠 수),
// design-reference/UI_CONTRACT.md 1장(SCR-001) 기준.
// REQ-FUNC-001·004·007(축소)·008(축소), REQ-NF-026.

export type DestinationScope = "domestic";

export interface DestinationImage {
  url: string;
  alt: string;
  sourceUrl: string; // REQ-FUNC-007(축소): alt·출처 URL만 관리한다.
  credit: string; // 저작자·라이선스 표기(CC BY/BY-SA 조건). 이미지는 public/images에 자체 호스팅한다.
}

export interface DestinationThreeDayPlan {
  day: number;
  theme: string;
  steps: string[];
}

export interface DestinationSource {
  name: string;
  url: string;
  updatedAt: string; // ISO 8601 날짜(YYYY-MM-DD)
}

export interface DomesticDestination {
  id: string;
  scope: DestinationScope;
  name: string;
  region: string;
  theme: string; // Destination Card 메타(국가/테마)에 쓰는 짧은 테마 라벨
  image: DestinationImage;
  summary: string; // REQ-FUNC-004: 300자 이상
  highlights: string[]; // REQ-FUNC-004: 5개 이상
  bestSeason: string;
  oneDayItinerary: string[];
  threeDayItinerary: DestinationThreeDayPlan[]; // 정확히 3일
  budget: string;
  transportation: string;
  food: string[]; // REQ-FUNC-004: 3개 이상
  etiquette: string[]; // REQ-FUNC-004: 3개 이상
  source: DestinationSource;
}

export const domesticDestinations: DomesticDestination[] = [
  {
    id: "domestic-jeju",
    scope: "domestic",
    name: "제주",
    region: "제주특별자치도",
    theme: "자연·해안",
    image: {
      url: "/images/places/jeju.jpg",
      alt: "제주 산방산과 유채꽃밭 풍경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Jejuolle-route-10(2).jpg",
      credit: "사진: Jeju Olle Foundation · CC BY-SA 4.0 (Wikimedia Commons)",
    },
    summary:
      "제주는 화산섬 특유의 오름과 검은 현무암 해안, 사계절 다른 얼굴을 보여주는 자연경관으로 국내에서 가장 인기 있는 여행지 중 하나입니다. 동쪽 성산일출봉부터 서쪽 협재해수욕장까지 해안도로를 따라 드라이브하기 좋고, 섬 안쪽으로는 한라산과 크고 작은 오름들이 트레킹 코스를 이룹니다. 봄에는 유채꽃과 벚꽃이, 여름에는 에메랄드빛 바다가, 가을에는 억새와 감귤이, 겨울에는 한라산 설경이 매력을 더합니다. 올레길을 따라 마을과 해안을 잇는 도보 여행도 활발하며, 제주 전통 음식과 카페 문화가 잘 발달해 1일 코스와 장기 체류 코스 모두를 소화할 수 있는 여행지입니다.",
    highlights: [
      "성산일출봉",
      "한라산 국립공원",
      "협재해수욕장",
      "우도",
      "제주 올레길",
      "카멜리아 힐",
    ],
    bestSeason: "봄(3~5월)·가을(9~11월)",
    oneDayItinerary: [
      "오전: 성산일출봉 일출 감상 및 등반",
      "오전~점심: 섭지코지 산책 후 근처 해산물 식당에서 점심",
      "오후: 협재해수욕장에서 해변 산책",
      "저녁: 제주 시내 흑돼지 거리에서 저녁 식사",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "동부 해안",
        steps: [
          "성산일출봉·섭지코지",
          "광치기해변 산책",
          "표선 해비치 해변 근처 숙박",
        ],
      },
      {
        day: 2,
        theme: "한라산·중산간",
        steps: [
          "한라산 어리목 코스 트레킹",
          "카멜리아 힐 또는 사려니숲길 산책",
          "제주 시내 흑돼지 거리 저녁",
        ],
      },
      {
        day: 3,
        theme: "서부 해안",
        steps: [
          "협재해수욕장·한림공원",
          "애월 해안도로 드라이브 및 카페",
          "제주국제공항 이동",
        ],
      },
    ],
    budget:
      "1인 1박 2일 기준 숙박·식비·렌터카 포함 약 15만~25만 원(항공료 별도).",
    transportation:
      "제주국제공항 도착 후 렌터카 이용이 일반적이며, 시내버스·공항버스 노선도 주요 관광지를 연결합니다.",
    food: ["흑돼지 구이", "고기국수", "갈치조림", "한치물회"],
    etiquette: [
      "사유지·농경지에 무단 진입하지 않습니다.",
      "오름 탐방로는 지정된 길로만 다닙니다.",
      "해수욕장 쓰레기는 직접 수거해 갑니다.",
    ],
    source: {
      name: "비짓제주(제주관광공사)",
      url: "https://www.visitjeju.net",
      updatedAt: "2026-09-01",
    },
  },
  {
    id: "domestic-busan",
    scope: "domestic",
    name: "부산",
    region: "부산광역시",
    theme: "도심·해안",
    image: {
      url: "/images/places/busan.jpg",
      alt: "부산 감천문화마을의 알록달록한 집들",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Colorful_houses_in_Gamcheon_Culture_Village_at_sunset_in_Busan_South_Korea.jpg",
      credit: "사진: Basile Morin · CC BY-SA 4.0 (Wikimedia Commons)",
    },
    summary:
      "부산은 해운대·광안리 해수욕장을 중심으로 한 해양 도시이자, 감천문화마을·보수동 책방골목 같은 원도심 골목 여행이 함께 즐거운 도시입니다. 부산항을 낀 국제시장과 자갈치시장에서는 활기찬 재래시장 분위기를, 해운대·마린시티에서는 고층 빌딩과 해변이 어우러진 현대적인 풍경을 경험할 수 있습니다. KTX로 서울에서 2시간 반 거리라 짧은 일정으로도 방문하기 좋고, 부산국제영화제가 열리는 가을에는 영화의전당 일대가 특히 붐빕니다. 바다·산·도심이 가까이 붙어 있어 하루 안에도 해변 산책과 산복도로 야경, 전통시장 먹거리 투어를 모두 소화할 수 있는 밀도 높은 여행지입니다.",
    highlights: [
      "해운대해수욕장",
      "감천문화마을",
      "광안대교·광안리",
      "자갈치시장",
      "태종대",
      "부산타워(용두산공원)",
    ],
    bestSeason: "늦봄(5월)·가을(9~10월)",
    oneDayItinerary: [
      "오전: 감천문화마을 골목 산책",
      "점심: 자갈치시장에서 해산물 식사",
      "오후: 태종대 산책 및 유람선",
      "저녁: 광안리 해변에서 광안대교 야경 감상",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "원도심",
        steps: ["감천문화마을", "국제시장·부평깡통시장", "용두산공원 야경"],
      },
      {
        day: 2,
        theme: "해운대권",
        steps: ["해운대해수욕장", "동백섬 산책", "마린시티 야경"],
      },
      {
        day: 3,
        theme: "남구·영도",
        steps: ["태종대", "자갈치시장 점심", "광안리 해변 마무리"],
      },
    ],
    budget: "1인 1박 2일 기준 숙박·식비·대중교통 포함 약 12만~20만 원.",
    transportation:
      "KTX·SRT로 부산역 도착 후 부산 도시철도와 시내버스로 대부분의 관광지를 이동할 수 있습니다.",
    food: ["밀면", "돼지국밥", "씨앗호떡", "어묵"],
    etiquette: [
      "전통시장에서는 상인의 안내에 따라 사진 촬영 여부를 확인합니다.",
      "해수욕장 지정 구역 밖 수영은 삼갑니다.",
      "좁은 골목 마을에서는 주민 생활 공간임을 유의해 조용히 이동합니다.",
    ],
    source: {
      name: "부산관광공사",
      url: "https://www.busan.go.kr/tour",
      updatedAt: "2026-09-01",
    },
  },
  {
    id: "domestic-gyeongju",
    scope: "domestic",
    name: "경주",
    region: "경상북도",
    theme: "역사·유적",
    image: {
      url: "/images/places/gyeongju.jpg",
      alt: "경주 동궁과 월지 야경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Water_reflection_of_Donggung_Palace_in_Wolji_Pond_at_blue_hour_in_Gyeongju_South_Korea.jpg",
      credit: "사진: Basile Morin · CC BY-SA 4.0 (Wikimedia Commons)",
    },
    summary:
      "경주는 신라 천년의 수도로, 불국사·석굴암 같은 세계문화유산부터 대릉원 고분군·동궁과 월지 야경까지 도시 전체가 하나의 야외 박물관 같은 여행지입니다. 첨성대와 대릉원 일대는 낮과 밤의 분위기가 확연히 달라 시간을 나눠 방문하기 좋고, 보문관광단지는 호수와 벚꽃길이 어우러져 봄철 명소로 꼽힙니다. 경주월드·황리단길 등 현대적인 즐길거리도 함께 발달해 있어 역사 탐방과 젊은 감성의 카페 거리를 함께 즐길 수 있습니다. 도시 규모가 크지 않아 자전거로 주요 유적지를 순환하며 둘러보기도 좋고, 1박 2일에서 2박 3일 일정으로 역사 교육 여행에 특히 적합합니다.",
    highlights: [
      "불국사",
      "석굴암",
      "대릉원(천마총)",
      "동궁과 월지",
      "첨성대",
      "황리단길",
    ],
    bestSeason: "봄(3~4월 벚꽃)·가을(10~11월 단풍)",
    oneDayItinerary: [
      "오전: 불국사·석굴암 관람",
      "점심: 황리단길 근처 식당",
      "오후: 대릉원·첨성대 산책",
      "저녁: 동궁과 월지 야경 감상",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "불교 유적",
        steps: ["불국사", "석굴암", "보문관광단지 숙박"],
      },
      {
        day: 2,
        theme: "왕경 유적",
        steps: ["대릉원(천마총)", "첨성대·계림", "동궁과 월지 야경"],
      },
      {
        day: 3,
        theme: "황리단길·박물관",
        steps: ["국립경주박물관", "황리단길 카페 거리", "KTX 경주역 이동"],
      },
    ],
    budget: "1인 1박 2일 기준 숙박·식비·입장료 포함 약 13만~20만 원.",
    transportation:
      "KTX 신경주역 또는 경주역 하차 후 시내버스나 자전거 대여로 유적지 대부분을 이동할 수 있습니다.",
    food: ["황남빵", "경주 한정식", "쌈밥", "재첩국"],
    etiquette: [
      "유적지 내 문화재는 손으로 만지지 않습니다.",
      "고분군 잔디밭은 지정된 산책로로만 다닙니다.",
      "사찰 경내에서는 정숙을 유지합니다.",
    ],
    source: {
      name: "경주시 문화관광",
      url: "https://www.gyeongju.go.kr/tour",
      updatedAt: "2026-08-28",
    },
  },
  {
    id: "domestic-jeonju",
    scope: "domestic",
    name: "전주",
    region: "전라북도",
    theme: "한옥·미식",
    image: {
      url: "/images/places/jeonju.jpg",
      alt: "전주 한옥마을 기와 지붕 풍경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Jeonju-_Part_II_-_Jeonju3094.jpg",
      credit: "사진: lumoplank · CC0 (Wikimedia Commons)",
    },
    summary:
      "전주는 700여 채의 한옥이 밀집한 전주한옥마을을 중심으로, 전통과 미식이 함께 발달한 여행지입니다. 경기전·전동성당 등 역사적 건축물과 한옥 카페·공방이 한 골목 안에 공존해 도보로 둘러보기 좋고, 한복을 대여해 입고 거리를 걷는 체험도 인기가 많습니다. 전주는 전주비빔밥의 발상지이자 남부시장 야시장, 객리단길의 젊은 상권까지 갖춰 미식 여행지로도 손꼽힙니다. 도시 규모가 크지 않아 하루 코스로도 핵심 명소를 충분히 돌아볼 수 있고, 근교의 모악산·전주수목원과 묶어 1박 2일 코스를 구성하기에도 알맞습니다. 비 오는 날에는 한옥 처마 아래를 걷는 운치가 있고, 야간에는 경기전 돌담을 따라 조명이 켜져 다른 분위기의 산책도 즐길 수 있습니다.",
    highlights: [
      "전주한옥마을",
      "경기전",
      "전동성당",
      "남부시장 야시장",
      "오목대",
      "객리단길",
    ],
    bestSeason: "봄(4~5월)·가을(10~11월)",
    oneDayItinerary: [
      "오전: 경기전·전동성당 관람",
      "점심: 한옥마을 내 전주비빔밥 식당",
      "오후: 오목대·전주천 산책",
      "저녁: 남부시장 야시장 먹거리 투어",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "한옥마을 핵심",
        steps: ["경기전·전동성당", "한옥마을 골목·공방", "남부시장 야시장"],
      },
      {
        day: 2,
        theme: "객리단길·근교",
        steps: ["객리단길 카페 거리", "전주수목원", "모악산 둘레길"],
      },
      {
        day: 3,
        theme: "미식 마무리",
        steps: ["전주 막걸리 골목", "풍남문·전주향교", "전주역 이동"],
      },
    ],
    budget: "1인 1박 2일 기준 숙박·식비·한복 대여 포함 약 12만~18만 원.",
    transportation:
      "전주역 또는 고속버스터미널 도착 후 한옥마을까지 시내버스나 택시로 이동, 마을 내부는 도보로 충분합니다.",
    food: ["전주비빔밥", "콩나물국밥", "모주", "전주 한정식"],
    etiquette: [
      "한옥 게스트하우스에서는 정숙 시간을 지킵니다.",
      "사찰·성당 등 종교 시설 내부 촬영은 안내를 따릅니다.",
      "좁은 골목에서는 상점 앞 통행을 배려합니다.",
    ],
    source: {
      name: "전주시 문화관광",
      url: "https://www.jeonju.go.kr/tour",
      updatedAt: "2026-08-25",
    },
  },
  {
    id: "domestic-sokcho",
    scope: "domestic",
    name: "속초",
    region: "강원특별자치도",
    theme: "산·바다",
    image: {
      url: "/images/places/sokcho.jpg",
      alt: "설악산 능선을 배경으로 한 속초 시내",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Korea-Seorak_Mountains_behind_Sokcho-01.jpg",
      credit: "사진: Steve46814 · CC BY-SA 3.0 (Wikimedia Commons)",
    },
    summary:
      "속초는 설악산 국립공원과 동해 바다를 동시에 품고 있어, 산과 바다를 하루에 오갈 수 있는 몇 안 되는 여행지입니다. 설악산 케이블카로 오른 권금성에서 바라보는 능선과, 속초해변·영금정에서 즐기는 일출은 계절과 관계없이 인상적입니다. 속초관광수산시장에서는 오징어순대·닭강정 같은 길거리 음식을 즐길 수 있고, 아바이마을에서는 갯배를 타고 이동하는 독특한 경험을 할 수 있습니다. 서울에서 동서고속도로를 이용하면 2시간대에 도착할 수 있어 주말 여행지로도 인기가 높고, 겨울에는 설경, 여름에는 해수욕을 각각 즐길 수 있어 사계절 방문객이 꾸준합니다.",
    highlights: [
      "설악산 국립공원",
      "속초해변",
      "아바이마을·갯배",
      "속초관광수산시장",
      "영랑호",
      "청초호",
    ],
    bestSeason: "여름(7~8월 해수욕)·가을(10월 단풍)",
    oneDayItinerary: [
      "오전: 설악산 케이블카로 권금성 탐방",
      "점심: 속초관광수산시장 먹거리",
      "오후: 아바이마을 갯배 체험",
      "저녁: 속초해변 일몰 산책",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "설악산",
        steps: ["설악산 케이블카·권금성", "신흥사", "속초 시내 숙박"],
      },
      {
        day: 2,
        theme: "해안·시장",
        steps: ["속초관광수산시장", "아바이마을 갯배", "속초해변·영금정 일몰"],
      },
      {
        day: 3,
        theme: "호수·근교",
        steps: ["영랑호 둘레길", "청초호 카페 거리", "서울 방향 이동"],
      },
    ],
    budget: "1인 1박 2일 기준 숙박·식비·케이블카 포함 약 14만~22만 원.",
    transportation:
      "고속버스 또는 승용차로 동서고속도로 이용이 일반적이며, 시내 이동은 시내버스와 택시로 가능합니다.",
    food: ["오징어순대", "닭강정", "물회", "회국수"],
    etiquette: [
      "국립공원 탐방로 외 지역 출입을 하지 않습니다.",
      "어촌 마을에서는 주민 조업 활동을 방해하지 않습니다.",
      "해변 취식 후 쓰레기를 직접 수거합니다.",
    ],
    source: {
      name: "속초시 문화관광",
      url: "https://www.sokcho.go.kr/tour",
      updatedAt: "2026-08-20",
    },
  },
  {
    id: "domestic-yeosu",
    scope: "domestic",
    name: "여수",
    region: "전라남도",
    theme: "해안·야경",
    image: {
      url: "/images/places/yeosu.jpg",
      alt: "여수 돌산대교 야경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Yeosu-si,_South_Korea_(Unsplash).jpg",
      credit: "사진: Ambir Tolang · CC0 (Wikimedia Commons)",
    },
    summary:
      '여수는 "여수 밤바다"라는 노래로도 잘 알려진 도시로, 해상 케이블카와 오동도, 돌산대교 야경이 대표 매력입니다. 낮에는 향일암·오동도 등 해안 산책로를 따라 걷고, 해가 지면 이순신광장과 낭만포차 거리를 중심으로 도시 전체가 야경 명소로 바뀝니다. 여수세계박람회장 일대는 아쿠아플라넷과 스카이타워 등 현대적 시설이 모여 있어 가족 단위 여행에도 적합합니다. 신선한 해산물을 활용한 갓김치·돌산갓김치·서대회무침 등 향토 음식이 발달해 있고, KTX로 서울에서 3시간대에 도착할 수 있어 짧은 일정의 남해안 여행으로 자주 선택됩니다. 봄철 향일암 동백꽃과 여름철 해상 불꽃쇼도 계절별로 다른 볼거리를 더합니다.',
    highlights: [
      "여수해상케이블카",
      "오동도",
      "향일암",
      "돌산대교 야경",
      "낭만포차 거리",
      "아쿠아플라넷 여수",
    ],
    bestSeason: "봄(4월 동백)·여름(7~8월 야경)",
    oneDayItinerary: [
      "오전: 오동도 산책",
      "점심: 낭만포차 거리 인근 식당",
      "오후: 여수해상케이블카 탑승",
      "저녁: 돌산대교·이순신광장 야경",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "구도심·오동도",
        steps: ["오동도", "이순신광장", "낭만포차 거리 야경"],
      },
      {
        day: 2,
        theme: "케이블카·향일암",
        steps: ["여수해상케이블카", "향일암", "돌산대교 야경"],
      },
      {
        day: 3,
        theme: "박람회장·아쿠아리움",
        steps: ["아쿠아플라넷 여수", "스카이타워", "여수역 이동"],
      },
    ],
    budget: "1인 1박 2일 기준 숙박·식비·케이블카 포함 약 13만~20만 원.",
    transportation:
      "KTX 여수엑스포역 도착 후 시내버스로 주요 관광지 이동이 가능하며, 야간에는 택시 이용이 편리합니다.",
    food: ["돌산갓김치", "서대회무침", "갈치조림", "장어탕"],
    etiquette: [
      "향일암 등 사찰에서는 정숙을 유지합니다.",
      "포차 거리에서는 통행로를 막지 않고 이용합니다.",
      "해안 절벽 구간에서는 안전선을 넘지 않습니다.",
    ],
    source: {
      name: "여수시 문화관광",
      url: "https://www.yeosu.go.kr/tour",
      updatedAt: "2026-08-22",
    },
  },
  {
    id: "domestic-gangneung",
    scope: "domestic",
    name: "강릉",
    region: "강원특별자치도",
    theme: "커피·해변",
    image: {
      url: "/images/places/gangneung.jpg",
      alt: "강릉 안목해변과 커피잔 조형물",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Anmok_Beach_20220430_008.jpg",
      credit: "사진: Mobius6 · CC BY-SA 4.0 (Wikimedia Commons)",
    },
    summary:
      "강릉은 안목해변 커피거리로 대표되는 커피 여행지이자, 경포호·오죽헌 등 전통과 자연이 함께 어우러진 도시입니다. 안목해변을 따라 늘어선 카페에서 바다를 보며 커피를 마시는 코스가 특히 유명하고, 경포대·경포호는 사계절 산책 명소로 꾸준히 사랑받습니다. 오죽헌은 신사임당과 율곡 이이의 생가로, 전통 한옥과 정원을 함께 둘러볼 수 있는 역사 명소입니다. KTX 경강선 개통 이후 서울에서 2시간 이내로 접근이 쉬워져 당일 여행으로도 인기가 높고, 최근에는 명주동 골목과 강릉중앙시장 등 로컬 감성의 거리도 함께 주목받고 있습니다. 겨울에는 눈 쌓인 경포호와 대관령 고갯길 풍경이 더해져 사계절 내내 다른 인상을 남기는 여행지입니다.",
    highlights: [
      "안목해변 커피거리",
      "경포호·경포대",
      "오죽헌",
      "강릉중앙시장",
      "정동진",
      "명주동 골목",
    ],
    bestSeason: "여름(7~8월)·가을(9~10월)",
    oneDayItinerary: [
      "오전: 오죽헌 관람",
      "점심: 강릉중앙시장 먹거리",
      "오후: 경포호 산책",
      "저녁: 안목해변 커피거리에서 일몰 감상",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "전통·시장",
        steps: ["오죽헌", "강릉중앙시장", "명주동 골목 카페"],
      },
      {
        day: 2,
        theme: "해변·커피",
        steps: ["경포호·경포대", "안목해변 커피거리", "정동진 일몰"],
      },
      {
        day: 3,
        theme: "근교·마무리",
        steps: ["주문진 수산시장", "영진해변 드라이브", "강릉역 이동"],
      },
    ],
    budget: "1인 1박 2일 기준 숙박·식비·카페 투어 포함 약 13만~19만 원.",
    transportation:
      "KTX 경강선 강릉역 도착 후 시내버스로 주요 명소를 이동할 수 있습니다.",
    food: ["초당순두부", "강릉짬뽕순두부", "닭강정", "곰치국"],
    etiquette: [
      "오죽헌 등 문화재 건물 내부에서는 사진 촬영 여부를 확인합니다.",
      "카페 거리에서는 좌석을 오래 비운 채 자리만 맡아두지 않습니다.",
      "해변 드론 촬영은 사전에 허가 구역을 확인합니다.",
    ],
    source: {
      name: "강릉시 문화관광",
      url: "https://www.gn.go.kr/tour",
      updatedAt: "2026-08-18",
    },
  },
  {
    id: "domestic-tongyeong",
    scope: "domestic",
    name: "통영",
    region: "경상남도",
    theme: "섬·예술",
    image: {
      url: "/images/places/tongyeong.jpg",
      alt: "통영 동피랑 벽화마을 골목",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Korea-Tongyeong-Dongpirang_Village-10.jpg",
      credit: "사진: Junho Jung · CC BY-SA 3.0 (Wikimedia Commons)",
    },
    summary:
      "통영은 한려수도의 중심에 위치한 항구 도시로, 동피랑 벽화마을과 케이블카로 오르는 미륵산, 크고 작은 섬 여행이 어우러진 여행지입니다. 동피랑 골목은 알록달록한 벽화와 바다 전망으로 사진 명소가 되었고, 미륵산 케이블카를 타면 한려해상국립공원 전체를 한눈에 담을 수 있습니다. 통영항에서 배를 타고 나가는 소매물도·한산도 등 섬 여행도 대표 코스로, 하루 코스 또는 1박 코스로 섬을 다녀올 수 있습니다. 윤이상·박경리 등 예술인의 고향으로도 알려져 있어 도시 곳곳에 문화예술 공간이 자리하고, 충무김밥을 비롯한 향토 음식도 여행의 큰 즐거움입니다.",
    highlights: [
      "동피랑 벽화마을",
      "미륵산 케이블카",
      "한산도",
      "소매물도",
      "통영중앙시장",
      "박경리기념관",
    ],
    bestSeason: "봄(4~5월)·가을(9~10월)",
    oneDayItinerary: [
      "오전: 동피랑 벽화마을 산책",
      "점심: 통영중앙시장 충무김밥",
      "오후: 미륵산 케이블카",
      "저녁: 강구안 야경 산책",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "구도심",
        steps: ["동피랑 벽화마을", "통영중앙시장", "강구안 야경"],
      },
      {
        day: 2,
        theme: "미륵산·섬",
        steps: ["미륵산 케이블카", "한산도 이순신 유적", "통영 숙박"],
      },
      {
        day: 3,
        theme: "섬 여행",
        steps: ["소매물도 배편 이동", "등대섬 산책", "통영항 복귀"],
      },
    ],
    budget: "1인 1박 2일 기준 숙박·식비·케이블카·배편 포함 약 15만~23만 원.",
    transportation:
      "고속버스 또는 승용차로 이동하며, 섬 구간은 통영항에서 여객선을 이용합니다.",
    food: ["충무김밥", "다찌 정식", "굴요리", "멍게비빔밥"],
    etiquette: [
      "여객선 승선 시 안전 안내에 따릅니다.",
      "벽화마을은 주민 거주 공간이므로 조용히 이동합니다.",
      "섬 지역 쓰레기는 되가져 나옵니다.",
    ],
    source: {
      name: "통영시 문화관광",
      url: "https://www.tongyeong.go.kr/tour",
      updatedAt: "2026-08-15",
    },
  },
  {
    id: "domestic-damyang",
    scope: "domestic",
    name: "담양",
    region: "전라남도",
    theme: "대나무숲·자연",
    image: {
      url: "/images/places/damyang.jpg",
      alt: "담양 죽녹원 대나무숲",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Bamboo_forest_in_Damyang_South_Korea_2015-05-06(6).jpg",
      credit: "사진: Mar del Este · CC BY-SA 4.0 (Wikimedia Commons)",
    },
    summary:
      "담양은 죽녹원 대나무숲과 메타세쿼이아 가로수길로 대표되는 자연 여행지로, 초록빛 산책로를 따라 걷는 느린 여행에 알맞은 곳입니다. 죽녹원은 여러 갈래의 대나무숲 산책로가 조성돼 있어 계절에 관계없이 시원한 그늘 산책을 즐길 수 있고, 메타세쿼이아길은 영화 촬영지로도 알려져 사진 명소로 꾸준히 사랑받습니다. 소쇄원·명옥헌원림 같은 전통 정원도 함께 있어 조선시대 선비 문화를 엿볼 수 있으며, 담양읍내에는 떡갈비 거리가 형성돼 있어 자연 여행과 미식을 함께 즐길 수 있습니다. 광주광역시와 가까워 반나절~하루 코스로도 방문하기 좋습니다.",
    highlights: [
      "죽녹원",
      "메타세쿼이아길",
      "소쇄원",
      "명옥헌원림",
      "관방제림",
      "담양읍 떡갈비 거리",
    ],
    bestSeason: "봄(신록)·가을(단풍)",
    oneDayItinerary: [
      "오전: 죽녹원 대나무숲 산책",
      "점심: 담양읍 떡갈비 거리",
      "오후: 메타세쿼이아길 산책",
      "늦은 오후: 소쇄원 관람",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "대나무숲",
        steps: ["죽녹원", "관방제림", "담양읍 숙박"],
      },
      {
        day: 2,
        theme: "정원 문화",
        steps: ["소쇄원", "명옥헌원림", "메타세쿼이아길"],
      },
      {
        day: 3,
        theme: "근교 마무리",
        steps: ["담양호 드라이브", "떡갈비 거리 점심", "광주 방향 이동"],
      },
    ],
    budget: "1인 1박 2일 기준 숙박·식비·입장료 포함 약 10만~16만 원.",
    transportation:
      "광주광역시에서 시외버스로 접근이 쉬우며, 읍내 주요 명소는 자전거 대여로 이동할 수 있습니다.",
    food: ["떡갈비", "대통밥", "죽순 요리", "국수거리 국수"],
    etiquette: [
      "대나무숲 산책로 밖으로 벗어나지 않습니다.",
      "전통 정원 내 시설물을 훼손하지 않습니다.",
      "사진 촬영 시 다른 방문객의 동선을 막지 않습니다.",
    ],
    source: {
      name: "담양군 문화관광",
      url: "https://www.damyang.go.kr/tour",
      updatedAt: "2026-08-12",
    },
  },
  {
    id: "domestic-andong",
    scope: "domestic",
    name: "안동",
    region: "경상북도",
    theme: "전통·유교문화",
    image: {
      url: "/images/places/andong.jpg",
      alt: "안동 하회마을 전경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Hahoe_Folk_Village_03.jpg",
      credit: "사진: Bernard Gagnon · CC0 (Wikimedia Commons)",
    },
    summary:
      "안동은 유네스코 세계문화유산인 하회마을을 중심으로, 조선시대 유교 문화와 전통 가옥이 잘 보존된 여행지입니다. 하회마을에서는 실제 주민이 거주하는 전통 가옥 사이를 걸으며 하회별신굿탈놀이 등 전통 공연도 관람할 수 있고, 병산서원·도산서원은 서원 건축과 자연이 어우러진 조용한 산책 코스로 인기가 높습니다. 안동댐과 월영교는 야간 조명이 켜지면 산책하기 좋은 명소로 바뀌며, 안동찜닭·헛제사밥 등 전통 음식 문화도 함께 발달해 있습니다. 서울에서 KTX와 시내버스를 이용해 반나절이면 도착할 수 있어 전통문화 체험을 목적으로 한 당일·1박 여행에 적합합니다.",
    highlights: [
      "하회마을",
      "병산서원",
      "도산서원",
      "월영교",
      "안동댐",
      "안동 헛제사밥 거리",
    ],
    bestSeason: "봄(4~5월)·가을(9~10월)",
    oneDayItinerary: [
      "오전: 하회마을 전통 가옥 탐방",
      "점심: 안동찜닭 거리",
      "오후: 병산서원 산책",
      "저녁: 월영교 야경",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "하회마을",
        steps: [
          "하회마을",
          "하회별신굿탈놀이 공연 관람(정기 일정 확인)",
          "안동 시내 숙박",
        ],
      },
      {
        day: 2,
        theme: "서원 문화",
        steps: ["병산서원", "도산서원", "월영교 야경"],
      },
      {
        day: 3,
        theme: "근교 마무리",
        steps: ["안동댐", "헛제사밥 점심", "안동역 이동"],
      },
    ],
    budget: "1인 1박 2일 기준 숙박·식비·입장료 포함 약 11만~17만 원.",
    transportation:
      "KTX 안동역 도착 후 시내버스로 하회마을·서원 지역을 이동할 수 있으며, 노선이 뜸해 렌터카도 고려할 만합니다.",
    food: ["안동찜닭", "헛제사밥", "안동식혜", "간고등어"],
    etiquette: [
      "하회마을은 주민 실거주 공간이므로 담장 안을 함부로 들여다보지 않습니다.",
      "서원 내부에서는 정숙을 유지합니다.",
      "전통 공연 관람 시 정해진 관람 예절을 지킵니다.",
    ],
    source: {
      name: "안동시 문화관광",
      url: "https://www.andong.go.kr/tour",
      updatedAt: "2026-08-10",
    },
  },
];
