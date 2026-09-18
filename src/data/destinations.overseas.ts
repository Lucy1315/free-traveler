// SCR-001(`/`) 해외 여행지 정적 데이터(15개국 30개 도시 이상).
// design-reference/D-001/DESIGN.md §9(Destination Card)·§17(SCR-001 최소 콘텐츠 수),
// design-reference/UI_CONTRACT.md 1장(SCR-001) 기준.
// REQ-FUNC-001·004·007(축소)·008(축소), REQ-NF-026.
// 필드 구성은 src/data/destinations.domestic.ts와 동일하며 `countryCode`만 추가한다.

export type DestinationScope = "overseas";

export interface DestinationImage {
  url: string;
  alt: string;
  sourceUrl: string; // REQ-FUNC-007(축소): alt·출처 URL만 관리한다.
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

export interface OverseasDestination {
  id: string;
  scope: DestinationScope;
  name: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2
  theme: string;
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

export const overseasDestinations: OverseasDestination[] = [
  {
    id: "overseas-tokyo",
    scope: "overseas",
    name: "도쿄",
    country: "일본",
    countryCode: "JP",
    theme: "도심·쇼핑",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Tokyo_Shibuya_Scramble_Crossing_2018-10-09.jpg/960px-Tokyo_Shibuya_Scramble_Crossing_2018-10-09.jpg",
      alt: "도쿄 시부야 교차로 야경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Tokyo_Shibuya_Scramble_Crossing_2018-10-09.jpg",
    },
    summary:
      "도쿄는 전통 사찰과 초고층 빌딩이 공존하는 일본의 수도로, 신주쿠·시부야의 화려한 번화가부터 아사쿠사의 전통 거리까지 다양한 얼굴을 가진 도시입니다. 지하철망이 촘촘히 연결돼 있어 도보와 대중교통만으로도 구역별 특색을 효율적으로 옮겨 다닐 수 있고, 미술관·서점·라멘 골목 같은 소규모 콘텐츠가 밀도 높게 모여 있습니다. 하라주쿠의 트렌디한 패션 거리와 긴자의 고급 쇼핑가가 대조를 이루며, 근교의 디즈니리조트나 온천 마을로 당일치기 확장도 쉽습니다. 사계절 각기 다른 축제와 벚꽃·단풍 명소가 있어 언제 방문해도 계절감 있는 여행이 가능합니다.",
    highlights: [
      "시부야 스크램블 교차로",
      "센소지(아사쿠사)",
      "신주쿠 교엔",
      "도쿄 스카이트리",
      "하라주쿠 다케시타거리",
    ],
    bestSeason: "봄(3~4월 벚꽃)·가을(10~11월 단풍)",
    oneDayItinerary: [
      "오전: 센소지·아사쿠사 거리 산책",
      "점심: 아사쿠사 인근 텐동 맛집",
      "오후: 시부야·하라주쿠 쇼핑",
      "저녁: 신주쿠 오모이데요코초 이자카야",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "전통 지구",
        steps: ["센소지·아사쿠사", "우에노공원", "신주쿠 야경"],
      },
      {
        day: 2,
        theme: "쇼핑·현대문화",
        steps: ["시부야 스크램블 교차로", "하라주쿠·오모테산도", "긴자 쇼핑"],
      },
      {
        day: 3,
        theme: "근교 확장",
        steps: ["도쿄 스카이트리", "오다이바 산책", "나리타공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·교통 포함 약 90만~140만 원(항공료 별도).",
    transportation:
      "나리타·하네다공항에서 특급열차로 시내 진입 후, JR·도쿄메트로 통합 교통카드(Suica 등)로 대부분 이동합니다.",
    food: ["라멘", "스시", "몬자야키", "돈카츠"],
    etiquette: [
      "지하철·기차 안 통화는 자제합니다.",
      "에스컬레이터는 한 줄로 서서 한쪽을 비워 둡니다.",
      "음식점에서 팁을 두지 않는 문화이므로 별도로 놓지 않습니다.",
    ],
    source: {
      name: "일본정부관광국(JNTO)",
      url: "https://www.jnto.go.jp/kr",
      updatedAt: "2026-09-01",
    },
  },
  {
    id: "overseas-osaka",
    scope: "overseas",
    name: "오사카",
    country: "일본",
    countryCode: "JP",
    theme: "미식·야경",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Osaka_Dotonbori_yoru.jpg/960px-Osaka_Dotonbori_yoru.jpg",
      alt: "오사카 도톤보리 야경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Osaka_Dotonbori_yoru.jpg",
    },
    summary:
      "오사카는 도톤보리의 화려한 간판 거리와 저렴하고 풍부한 길거리 음식으로 유명한 간사이 지방의 중심 도시입니다. 오사카성을 중심으로 한 역사 산책과 신사이바시의 쇼핑 거리, 유니버설 스튜디오 재팬 같은 테마파크까지 여행 스타일에 따라 다양한 코스를 짤 수 있습니다. 교토·나라와 열차로 30~40분 거리라 간사이 지역을 묶어 도는 근교 여행의 거점으로도 자주 활용됩니다. 저녁이 되면 도톤보리강을 따라 조명이 켜져 사진 명소가 되며, 다코야키·오코노미야키 등 오사카식 길거리 음식을 맛보는 것이 여행의 핵심 즐거움으로 꼽힙니다. 친근하고 유쾌한 간사이 사투리 억양의 현지인 응대도 오사카 여행의 또 다른 매력입니다.",
    highlights: [
      "도톤보리",
      "오사카성",
      "신사이바시 쇼핑거리",
      "유니버설 스튜디오 재팬",
      "우메다 스카이빌딩",
    ],
    bestSeason: "봄(3~4월 벚꽃)·가을(10~11월 단풍)",
    oneDayItinerary: [
      "오전: 오사카성 관람",
      "점심: 신사이바시 근처 오코노미야키",
      "오후: 도톤보리·신사이바시 쇼핑",
      "저녁: 우메다 스카이빌딩 야경",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "구도심",
        steps: ["오사카성", "신사이바시", "도톤보리 야경"],
      },
      {
        day: 2,
        theme: "테마파크",
        steps: ["유니버설 스튜디오 재팬 종일 이용", "인근 숙소 휴식"],
      },
      {
        day: 3,
        theme: "근교 확장",
        steps: [
          "교토 당일치기(기요미즈데라)",
          "오사카 복귀",
          "간사이공항 이동",
        ],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·교통 포함 약 85만~130만 원(항공료 별도).",
    transportation:
      "간사이국제공항에서 난카이·JR 특급으로 시내 진입, 시내는 오사카 지하철·순환선으로 이동합니다.",
    food: ["다코야키", "오코노미야키", "쿠시카츠", "라멘"],
    etiquette: [
      "에스컬레이터에서는 오른쪽에 서는 간사이 지역 관습을 따릅니다.",
      "길거리 음식은 이동하며 먹지 않고 판매대 근처에서 먹습니다.",
      "대중교통에서 큰 소리로 대화하지 않습니다.",
    ],
    source: {
      name: "일본정부관광국(JNTO)",
      url: "https://www.jnto.go.jp/kr",
      updatedAt: "2026-09-01",
    },
  },
  {
    id: "overseas-kyoto",
    scope: "overseas",
    name: "교토",
    country: "일본",
    countryCode: "JP",
    theme: "전통·사찰",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a2/Double_torii_path_at_Fushimi_Inari_Taisha_Shrine%2C_Kyoto%2C_Japan.jpg/960px-Double_torii_path_at_Fushimi_Inari_Taisha_Shrine%2C_Kyoto%2C_Japan.jpg",
      alt: "교토 후시미이나리 신사 토리이 길",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Double_torii_path_at_Fushimi_Inari_Taisha_Shrine,_Kyoto,_Japan.jpg",
    },
    summary:
      "교토는 일본의 옛 수도로, 후시미이나리·기요미즈데라·금각사 등 세계적으로 유명한 사찰과 신사가 도시 전역에 흩어져 있는 전통문화 여행지입니다. 기온 지구에서는 전통 가옥이 늘어선 골목을 걸으며 게이샤 문화를 엿볼 수 있고, 아라시야마 대나무숲은 사계절 다른 초록빛으로 여행자를 맞이합니다. 도시 규모가 크지 않아 버스와 도보만으로도 주요 명소를 하루에 여럿 돌아볼 수 있으며, 벚꽃과 단풍 시즌에는 사찰 정원이 특히 붐벼 이른 아침 방문이 권장됩니다. 교토식 가이세키 요리와 말차 디저트 등 미식 여행으로도 손색없는 도시입니다. 전통 기모노를 대여해 골목을 거니는 체험도 여행객들 사이에서 꾸준히 인기가 있습니다.",
    highlights: [
      "후시미이나리 신사",
      "기요미즈데라",
      "금각사",
      "아라시야마 대나무숲",
      "기온 거리",
    ],
    bestSeason: "봄(3~4월 벚꽃)·가을(11월 단풍)",
    oneDayItinerary: [
      "오전: 후시미이나리 신사 등산로 산책",
      "점심: 기온 인근 소바 맛집",
      "오후: 기요미즈데라·기온 거리",
      "저녁: 폰토초 골목 저녁 식사",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "동부 사찰",
        steps: ["후시미이나리 신사", "기요미즈데라", "기온 거리"],
      },
      {
        day: 2,
        theme: "서부·아라시야마",
        steps: ["아라시야마 대나무숲", "금각사", "니조성"],
      },
      {
        day: 3,
        theme: "근교 확장",
        steps: ["나라 당일치기(도다이지)", "교토 복귀", "신오사카역 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·교통 포함 약 88만~135만 원(항공료 별도).",
    transportation:
      "신오사카·간사이공항에서 JR로 접근하며, 시내는 시내버스와 지하철을 함께 이용합니다.",
    food: ["가이세키 요리", "니신소바", "말차 디저트", "유도후"],
    etiquette: [
      "사찰·신사 경내에서는 정숙을 유지합니다.",
      "기온 지구에서는 게이샤에게 무단으로 접근하거나 사진을 강요하지 않습니다.",
      "신사 참배 예절(손 씻기·절 순서)을 안내판에 따라 지킵니다.",
    ],
    source: {
      name: "일본정부관광국(JNTO)",
      url: "https://www.jnto.go.jp/kr",
      updatedAt: "2026-09-01",
    },
  },
  {
    id: "overseas-danang",
    scope: "overseas",
    name: "다낭",
    country: "베트남",
    countryCode: "VN",
    theme: "해변·휴양",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e5/My_Khe_Beach_Danang_Coastline.jpg/960px-My_Khe_Beach_Danang_Coastline.jpg",
      alt: "다낭 미케비치 해안선",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:My_Khe_Beach_Danang_Coastline.jpg",
    },
    summary:
      "다낭은 미케비치를 따라 리조트가 늘어선 베트남 중부의 대표 휴양 도시로, 근교의 호이안·바나힐과 묶어 3박 4일 코스로 자주 방문됩니다. 한강을 가로지르는 용다리는 주말 밤 불쇼로 유명하고, 오행산은 도심에서 가까운 트레킹·동굴 사찰 명소입니다. 바나힐은 케이블카로 산 정상까지 올라가는 테마파크로, 골든브릿지의 거대한 손 조형물이 대표 포토스팟입니다. 도보로 30분 거리에 있는 호이안 구시가지는 노란 벽과 등불 골목으로 유네스코 세계문화유산에 등재돼 있어, 다낭 여행에서 함께 방문하는 경우가 많습니다. 한국에서 직항으로 4~5시간이면 도착해 짧은 일정의 휴양 여행지로도 꾸준히 사랑받습니다.",
    highlights: [
      "미케비치",
      "바나힐·골든브릿지",
      "용다리",
      "오행산",
      "호이안 구시가지(근교)",
    ],
    bestSeason: "2~8월(건기, 우기 9~1월 제외)",
    oneDayItinerary: [
      "오전: 미케비치 산책",
      "점심: 해변 인근 씨푸드 식당",
      "오후: 오행산 트레킹",
      "저녁: 용다리 불쇼 관람(주말)",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "다낭 시내",
        steps: ["미케비치", "오행산", "용다리 야경"],
      },
      {
        day: 2,
        theme: "바나힐",
        steps: ["바나힐 케이블카", "골든브릿지", "프랑스마을 산책"],
      },
      {
        day: 3,
        theme: "호이안 근교",
        steps: ["호이안 구시가지", "투본강 등불 보트", "다낭 복귀"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·투어 포함 약 45만~75만 원(항공료 별도).",
    transportation:
      "다낭국제공항에서 택시·그랩으로 시내 진입이 일반적이며, 호이안까지는 택시나 셔틀버스를 이용합니다.",
    food: ["분짜", "미꽝", "반쎄오", "짜조"],
    etiquette: [
      "사원·오행산 동굴 사찰에서는 노출이 적은 복장을 갖춥니다.",
      "그랩·택시 이용 시 미터기 또는 앱 요금을 확인합니다.",
      "해변 노점에서 가격 흥정은 정중하게 합니다.",
    ],
    source: {
      name: "베트남 국가관광청",
      url: "https://vietnam.travel",
      updatedAt: "2026-08-28",
    },
  },
  {
    id: "overseas-hanoi",
    scope: "overseas",
    name: "하노이",
    country: "베트남",
    countryCode: "VN",
    theme: "구시가지·역사",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b7/Street_seller_of_fingered_citrons_in_Old_Town_of_Hanoi%2C_20240204_1335_5772.jpg/960px-Street_seller_of_fingered_citrons_in_Old_Town_of_Hanoi%2C_20240204_1335_5772.jpg",
      alt: "하노이 구시가지 거리의 노점상",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Street_seller_of_fingered_citrons_in_Old_Town_of_Hanoi,_20240204_1335_5772.jpg",
    },
    summary:
      "하노이는 프랑스 식민지 시대의 건축물과 좁은 구시가지 골목이 어우러진 베트남의 수도로, 호안끼엠 호수를 중심으로 도보 여행이 발달해 있습니다. 36거리로 불리는 구시가지는 업종별로 상점이 모여 있어 걷는 것만으로도 생활 문화를 엿볼 수 있고, 호치민 묘·문묘 등 역사 유적도 도심 안에 밀집해 있습니다. 저녁이 되면 구시가지 맥주 거리에 관광객과 현지인이 뒤섞여 활기를 띠며, 근교의 하롱베이·닌빈으로 당일 또는 1박 투어를 떠나는 거점 도시로도 널리 이용됩니다. 쌀국수·분짜 등 베트남 북부 음식의 본고장으로 미식 여행지로도 손꼽힙니다.",
    highlights: [
      "호안끼엠 호수",
      "하노이 구시가지(36거리)",
      "호치민 묘·문묘",
      "탕롱 수상인형극",
      "하롱베이(근교 투어)",
    ],
    bestSeason: "10~12월(선선한 건기)",
    oneDayItinerary: [
      "오전: 호안끼엠 호수·옥산사원",
      "점심: 구시가지 분짜 맛집",
      "오후: 문묘·호치민 묘",
      "저녁: 맥주 거리 저녁 식사",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "구시가지",
        steps: ["호안끼엠 호수", "36거리 산책", "탕롱 수상인형극"],
      },
      {
        day: 2,
        theme: "역사 유적",
        steps: ["호치민 묘", "문묘", "베트남 민족학박물관"],
      },
      {
        day: 3,
        theme: "하롱베이 근교",
        steps: ["하롱베이 당일 크루즈", "동굴 탐방", "하노이 복귀"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·투어 포함 약 42만~70만 원(항공료 별도).",
    transportation:
      "노이바이국제공항에서 택시·공항버스로 시내 진입, 구시가지 내부는 도보와 그랩바이크를 이용합니다.",
    food: ["분짜", "쌀국수(퍼)", "반미", "짜까라봉"],
    etiquette: [
      "호치민 묘 방문 시 반바지·민소매 등 노출 복장을 피합니다.",
      "구시가지 도로 횡단 시 속도를 유지하며 천천히 건넙니다.",
      "사원에서는 신발을 벗고 정숙을 유지합니다.",
    ],
    source: {
      name: "베트남 국가관광청",
      url: "https://vietnam.travel",
      updatedAt: "2026-08-28",
    },
  },
  {
    id: "overseas-bangkok",
    scope: "overseas",
    name: "방콕",
    country: "태국",
    countryCode: "TH",
    theme: "사원·야시장",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Templo_Wat_Arun%2C_Bangkok%2C_Tailandia%2C_2013-08-22%2C_DD_37.jpg/960px-Templo_Wat_Arun%2C_Bangkok%2C_Tailandia%2C_2013-08-22%2C_DD_37.jpg",
      alt: "방콕 왓아룬 사원 야경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Templo_Wat_Arun,_Bangkok,_Tailandia,_2013-08-22,_DD_37.jpg",
    },
    summary:
      "방콕은 왓아룬·왕궁 같은 화려한 사원 건축과 짜뚜짝 시장·야시장 같은 활기찬 상업 문화가 공존하는 동남아시아 대표 관문 도시입니다. 차오프라야 강을 따라 보트로 이동하며 사원을 둘러보는 코스가 인기가 많고, 카오산로드는 배낭여행자들의 오랜 집결지로 저녁이면 거리 전체가 축제 같은 분위기가 됩니다. 시내 곳곳에 마사지숍과 루프탑 바가 발달해 있어 짧은 일정으로도 다양한 체험을 압축해서 즐길 수 있고, BTS·MRT 등 대중교통이 잘 갖춰져 있어 이동도 편리합니다. 태국 남부·북부 여행의 경유지로도 자주 활용되는 도시입니다. 물가가 저렴한 편이라 마사지·미식 체험을 여유롭게 즐길 수 있는 것도 큰 장점입니다.",
    highlights: [
      "왓아룬(새벽사원)",
      "왕궁·왓프라깨우",
      "짜뚜짝 주말시장",
      "카오산로드",
      "차오프라야 강 보트투어",
    ],
    bestSeason: "11~2월(선선한 건기)",
    oneDayItinerary: [
      "오전: 왕궁·왓프라깨우 관람",
      "점심: 차오프라야 강변 식당",
      "오후: 왓아룬·보트 투어",
      "저녁: 카오산로드 야시장",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "사원 지구",
        steps: ["왕궁·왓프라깨우", "왓포(와불사)", "왓아룬"],
      },
      {
        day: 2,
        theme: "쇼핑·시장",
        steps: ["짜뚜짝 주말시장", "시암 쇼핑거리", "루프탑 바 야경"],
      },
      {
        day: 3,
        theme: "근교 확장",
        steps: ["담넌사두억 수상시장", "방콕 복귀", "수완나품 공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·투어 포함 약 40만~65만 원(항공료 별도).",
    transportation:
      "수완나품·돈므앙 공항에서 공항철도·택시로 시내 진입, 시내는 BTS·MRT·보트를 함께 이용합니다.",
    food: ["팟타이", "똠얌꿍", "망고 스티키라이스", "카오팟"],
    etiquette: [
      "왕실·불교 관련 발언은 삼갑니다.",
      "사원 방문 시 어깨·무릎을 가리는 복장을 갖춥니다.",
      "머리를 만지거나 발로 사람·물건을 가리키지 않습니다.",
    ],
    source: {
      name: "태국관광청(TAT)",
      url: "https://www.tourismthailand.org",
      updatedAt: "2026-09-02",
    },
  },
  {
    id: "overseas-chiangmai",
    scope: "overseas",
    name: "치앙마이",
    country: "태국",
    countryCode: "TH",
    theme: "산악·전통",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Wat_Phra_That_Doi_Suthep_%28I%29.jpg/960px-Wat_Phra_That_Doi_Suthep_%28I%29.jpg",
      alt: "치앙마이 도이수텝 사원 황금 불탑",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Wat_Phra_That_Doi_Suthep_(I).jpg",
    },
    summary:
      "치앙마이는 태국 북부 산악 지대에 위치한 옛 란나 왕국의 수도로, 도심을 둘러싼 성곽과 수백 개의 사원이 느긋한 분위기를 만드는 여행지입니다. 도이수텝 사원에서는 도시 전경을 한눈에 내려다볼 수 있고, 님만해민 지역은 카페와 편집숍이 모인 트렌디한 골목으로 젊은 여행자들에게 인기가 많습니다. 매년 11월 열리는 러이끄라통 축제(등불 축제) 기간에는 도시 전체가 종이등으로 물들어 특별한 분위기를 자아냅니다. 코끼리 보호구역 방문, 쿠킹 클래스 등 체험형 프로그램이 발달해 있어 자연·문화 체험을 함께 원하는 여행자에게 적합합니다. 방콕보다 물가가 저렴하고 여유로운 분위기라 장기 체류형 여행지로도 인기가 높습니다.",
    highlights: [
      "도이수텝 사원",
      "치앙마이 올드시티",
      "님만해민",
      "선데이 마켓",
      "코끼리 보호구역 투어",
    ],
    bestSeason: "11~2월(선선한 건기)",
    oneDayItinerary: [
      "오전: 도이수텝 사원",
      "점심: 올드시티 인근 카오소이 맛집",
      "오후: 올드시티 사원 투어",
      "저녁: 선데이 마켓(일요일 한정)",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "올드시티",
        steps: ["왓프라싱", "왓체디루앙", "님만해민 카페 거리"],
      },
      {
        day: 2,
        theme: "자연·체험",
        steps: ["도이수텝 사원", "코끼리 보호구역 투어", "쿠킹 클래스"],
      },
      {
        day: 3,
        theme: "근교 확장",
        steps: ["도이인타논 국립공원", "치앙마이 복귀", "공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·투어 포함 약 38만~62만 원(항공료 별도).",
    transportation:
      "치앙마이국제공항에서 시내까지 택시로 20분 내외, 시내는 썽태우(합승 택시)와 도보로 이동합니다.",
    food: ["카오소이", "쏨땀", "사이우아", "카놈찐"],
    etiquette: [
      "코끼리 보호구역 방문 시 가이드 안내를 따라 동물에게 무리한 접촉을 하지 않습니다.",
      "사원에서는 신발을 벗고 정숙을 유지합니다.",
      "축제 기간 등불을 날릴 때 지정 구역과 화재 안전수칙을 지킵니다.",
    ],
    source: {
      name: "태국관광청(TAT)",
      url: "https://www.tourismthailand.org",
      updatedAt: "2026-09-02",
    },
  },
  {
    id: "overseas-taipei",
    scope: "overseas",
    name: "타이베이",
    country: "대만",
    countryCode: "TW",
    theme: "야시장·온천",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Taipei_Night_Skyline_from_Hongludi_20240113.jpg/960px-Taipei_Night_Skyline_from_Hongludi_20240113.jpg",
      alt: "타이베이 101 빌딩과 도심 야경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Taipei_Night_Skyline_from_Hongludi_20240113.jpg",
    },
    summary:
      "타이베이는 타이베이101을 중심으로 한 현대적인 스카이라인과 스린·라오허제 등 대형 야시장이 공존하는 대만의 수도입니다. 지하철(MRT)이 도시 전역을 촘촘히 연결해 초행자도 이동이 쉽고, 근교의 지우펀·베이터우 온천까지 반나절 코스로 다녀올 수 있습니다. 고궁박물관에서는 중국 역대 왕조의 유물을, 융캉제 골목에서는 망고빙수 등 대만 디저트를 함께 즐길 수 있어 문화와 미식을 고루 갖춘 여행지로 꼽힙니다. 습한 아열대 기후 특성상 실내 온천·스파 문화가 발달해 있어 사계절 방문에도 즐길 거리가 꾸준합니다. 한국에서 직항으로 2시간 반 정도면 도착해 짧은 주말 여행지로도 꾸준히 사랑받습니다.",
    highlights: [
      "타이베이101",
      "스린 야시장",
      "고궁박물관",
      "지우펀(근교)",
      "융캉제 골목",
    ],
    bestSeason: "10~12월(선선한 가을)",
    oneDayItinerary: [
      "오전: 고궁박물관 관람",
      "점심: 융캉제 소룡포 맛집",
      "오후: 타이베이101 전망대",
      "저녁: 스린 야시장",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "시내",
        steps: ["고궁박물관", "융캉제 골목", "타이베이101"],
      },
      {
        day: 2,
        theme: "근교",
        steps: ["지우펀 골목", "스펀 천등 날리기", "스린 야시장"],
      },
      {
        day: 3,
        theme: "온천·마무리",
        steps: ["베이터우 온천", "단수이 노을 산책", "타오위안공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·교통 포함 약 55만~85만 원(항공료 별도).",
    transportation:
      "타오위안국제공항에서 MRT 공항철도로 시내 진입, 시내는 MRT 悠遊카드로 대부분 이동합니다.",
    food: ["소룡포", "우육면", "망고빙수", "루러우판"],
    etiquette: [
      "MRT 내 음식물 섭취·음료는 금지되어 있습니다.",
      "야시장에서는 줄을 서서 순서를 지킵니다.",
      "온천 시설 이용 시 공용 탈의·샤워 예절을 지킵니다.",
    ],
    source: {
      name: "대만관광청",
      url: "https://www.taiwan.net.tw",
      updatedAt: "2026-08-30",
    },
  },
  {
    id: "overseas-kaohsiung",
    scope: "overseas",
    name: "가오슝",
    country: "대만",
    countryCode: "TW",
    theme: "항구·예술",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/2021_Kaohsiung_harbor_Light_show.jpg/960px-2021_Kaohsiung_harbor_Light_show.jpg",
      alt: "가오슝 항구 야경과 조명 쇼",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:2021_Kaohsiung_harbor_Light_show.jpg",
    },
    summary:
      "가오슝은 대만 남부의 항구 도시로, 타이베이보다 느긋한 분위기와 넓은 도로, 바다를 낀 산책로가 매력적인 여행지입니다. 롄츠탄 호수의 용호탑, 포광산 불광사의 거대한 불상 등 대형 랜드마크가 도시 곳곳에 자리하고, 옛 항만 창고를 개조한 보얼예술특구는 젊은 예술가들의 전시 공간으로 활용됩니다. 시즈완 해변과 치진섬은 자전거로 둘러보기 좋은 해안 코스를 제공하며, 대중교통은 MRT와 경전철(LRT)이 함께 운영돼 이동이 편리합니다. 타이베이에 비해 상대적으로 여행자가 적어 여유로운 도시 여행을 원하는 사람에게 적합합니다. 남국적인 기후라 겨울에도 따뜻한 날씨의 여행을 즐길 수 있습니다.",
    highlights: [
      "롄츠탄(용호탑)",
      "포광산 불광사",
      "보얼예술특구",
      "치진섬",
      "류허 야시장",
    ],
    bestSeason: "11~3월(선선한 건기)",
    oneDayItinerary: [
      "오전: 롄츠탄 용호탑 산책",
      "점심: 시내 우육면 맛집",
      "오후: 보얼예술특구",
      "저녁: 류허 야시장",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "호수·사원",
        steps: ["롄츠탄", "포광산 불광사", "류허 야시장"],
      },
      {
        day: 2,
        theme: "항구·예술",
        steps: ["보얼예술특구", "가오슝항 유람선", "시즈완 해변 노을"],
      },
      {
        day: 3,
        theme: "섬·마무리",
        steps: ["치진섬 자전거 투어", "치진 해산물 거리", "가오슝공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·교통 포함 약 48만~75만 원(항공료 별도).",
    transportation:
      "가오슝국제공항에서 MRT로 시내 진입, 시내는 MRT·경전철·자전거 공유 서비스를 이용합니다.",
    food: ["우육면", "해산물 요리", "가오슝식 딴자이면", "펑리수"],
    etiquette: [
      "사찰 경내에서는 정숙을 유지합니다.",
      "자전거 도로에서는 보행자와 통행 우선순위를 지킵니다.",
      "야시장에서는 가격표가 없는 경우 미리 가격을 확인합니다.",
    ],
    source: {
      name: "대만관광청",
      url: "https://www.taiwan.net.tw",
      updatedAt: "2026-08-30",
    },
  },
  {
    id: "overseas-cebu",
    scope: "overseas",
    name: "세부",
    country: "필리핀",
    countryCode: "PH",
    theme: "해양·리조트",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cc/Sugar_Beach_Bantayan.jpg/960px-Sugar_Beach_Bantayan.jpg",
      alt: "세부 반타얀 섬의 하얀 모래 해변",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Sugar_Beach_Bantayan.jpg",
    },
    summary:
      "세부는 필리핀 중부 최대 관광 거점으로, 막탄섬의 리조트 지구와 세부 시티의 역사 유적이 함께 있는 해양 휴양지입니다. 고래상어 스노클링으로 유명한 오슬롭, 옥청빛 폭포가 이어지는 카와산 폭포 등 자연 액티비티가 풍부하고, 막탄섬의 화이트샌드 리조트에서는 스노클링·다이빙 등 해양 스포츠를 즐길 수 있습니다. 세부 시티에는 마젤란 십자가·산토니뇨 성당 등 스페인 식민지 시대 유적이 남아 있어 휴양과 역사 탐방을 함께 계획할 수 있습니다. 인근 보홀섬으로 페리를 타고 이동해 초콜릿힐·안경원숭이를 보는 1박 코스도 인기입니다. 한국에서 직항으로 4시간대에 도착할 수 있어 가족 단위 휴양 여행으로도 자주 선택됩니다.",
    highlights: [
      "막탄섬 리조트 지구",
      "오슬롭 고래상어 스노클링",
      "카와산 폭포",
      "산토니뇨 성당",
      "보홀섬(근교)",
    ],
    bestSeason: "12~5월(건기)",
    oneDayItinerary: [
      "오전: 산토니뇨 성당·마젤란 십자가",
      "점심: 세부 시티 레촌 맛집",
      "오후: 막탄섬 리조트 해변",
      "저녁: 리조트 내 씨푸드 디너",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "세부 시티",
        steps: ["산토니뇨 성당", "마젤란 십자가", "막탄섬 이동·숙박"],
      },
      {
        day: 2,
        theme: "액티비티",
        steps: ["오슬롭 고래상어 투어", "카와산 폭포 캐니어닝", "막탄 복귀"],
      },
      {
        day: 3,
        theme: "해양 스포츠",
        steps: ["막탄섬 스노클링·다이빙", "선셋 크루즈", "세부공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·투어 포함 약 55만~90만 원(항공료 별도).",
    transportation:
      "막탄세부국제공항에서 택시·그랩으로 리조트 이동, 시내는 지프니·그랩을 이용합니다.",
    food: ["레촌(통돼지구이)", "시니강", "할로할로", "당곳"],
    etiquette: [
      "고래상어 투어에서는 가이드 지침을 따라 무리한 접촉을 피합니다.",
      "성당 방문 시 노출이 적은 복장을 갖춥니다.",
      "택시·그랩 이용 시 사전에 요금 또는 미터기 사용을 확인합니다.",
    ],
    source: {
      name: "필리핀 관광부",
      url: "https://www.tourism.gov.ph",
      updatedAt: "2026-08-26",
    },
  },
  {
    id: "overseas-manila",
    scope: "overseas",
    name: "마닐라",
    country: "필리핀",
    countryCode: "PH",
    theme: "역사·도심",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Manila%2C_Fort_Santiago%2C_Walled_city_of_Intramuros%2C_Philippines.jpg/960px-Manila%2C_Fort_Santiago%2C_Walled_city_of_Intramuros%2C_Philippines.jpg",
      alt: "마닐라 인트라무로스 산티아고 요새 성문",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Manila,_Fort_Santiago,_Walled_city_of_Intramuros,_Philippines.jpg",
    },
    summary:
      "마닐라는 필리핀의 수도로, 스페인 식민지 시대의 성곽 도시 인트라무로스와 현대적인 마카티·보니파시오 글로벌시티가 대조를 이루는 대도시입니다. 인트라무로스에서는 산티아고 요새·마닐라 대성당 등 400년 역사 건축물을 도보로 둘러볼 수 있고, 리잘공원에서는 필리핀 독립운동의 상징을 마주할 수 있습니다. 마카티·BGC 지역은 대형 쇼핑몰과 루프탑 바가 발달해 있어 현대적인 도시 여행도 함께 즐길 수 있습니다. 근교의 타가이타이에서는 따알 화산을 조망하며 선선한 고원 기후를 경험할 수 있어, 도심 여행과 자연 여행을 함께 계획하기 좋습니다.",
    highlights: [
      "인트라무로스",
      "리잘공원",
      "보니파시오 글로벌시티",
      "마카티 쇼핑몰",
      "타가이타이 따알 화산(근교)",
    ],
    bestSeason: "12~2월(선선한 건기)",
    oneDayItinerary: [
      "오전: 인트라무로스 도보 투어",
      "점심: 인트라무로스 인근 전통 식당",
      "오후: 리잘공원 산책",
      "저녁: BGC 루프탑 바",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "구도심",
        steps: ["인트라무로스", "마닐라 대성당", "리잘공원"],
      },
      {
        day: 2,
        theme: "현대 도심",
        steps: ["마카티 쇼핑몰", "보니파시오 글로벌시티", "루프탑 바 야경"],
      },
      {
        day: 3,
        theme: "근교 확장",
        steps: [
          "타가이타이 따알 화산 전망",
          "피플스파크 산책",
          "마닐라공항 이동",
        ],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·교통 포함 약 50만~80만 원(항공료 별도).",
    transportation:
      "니노이아키노국제공항에서 택시·그랩으로 시내 진입, 시내는 그랩과 LRT/MRT를 함께 이용합니다.",
    food: ["아도보", "시니강", "레촌", "할로할로"],
    etiquette: [
      "성당·요새 방문 시 노출이 적은 복장을 갖춥니다.",
      "야간 이동 시 가급적 그랩 등 배차 서비스를 이용합니다.",
      "거리 흥정 시 정중한 태도를 유지합니다.",
    ],
    source: {
      name: "필리핀 관광부",
      url: "https://www.tourism.gov.ph",
      updatedAt: "2026-08-26",
    },
  },
  {
    id: "overseas-kualalumpur",
    scope: "overseas",
    name: "쿠알라룸푸르",
    country: "말레이시아",
    countryCode: "MY",
    theme: "도심·다문화",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Petronas_twin_towers_at_night.jpg/960px-Petronas_twin_towers_at_night.jpg",
      alt: "쿠알라룸푸르 페트로나스 트윈타워 야경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Petronas_twin_towers_at_night.jpg",
    },
    summary:
      "쿠알라룸푸르는 페트로나스 트윈타워로 대표되는 현대적 스카이라인과 말레이·중국·인도 문화가 뒤섞인 다문화 거리가 공존하는 말레이시아의 수도입니다. 부킷빈탕 일대는 쇼핑몰과 야시장이 밀집해 있고, 차이나타운·리틀인디아는 각기 다른 색채의 골목 풍경을 보여줍니다. 근교의 바투 동굴은 거대한 황금 신상과 272개 계단으로 유명한 힌두교 성지이며, 반나절 코스로 다녀오기 좋습니다. 열대 기후로 연중 온화한 편이라 계절에 크게 구애받지 않고 방문할 수 있는 여행지입니다. 다양한 민족의 음식 문화가 뒤섞여 있어 한 도시에서 여러 나라의 미식을 함께 즐길 수 있습니다.",
    highlights: [
      "페트로나스 트윈타워",
      "바투 동굴",
      "부킷빈탕",
      "차이나타운(페탈링 스트리트)",
      "KL타워",
    ],
    bestSeason: "5~7월(비교적 건조한 시기)",
    oneDayItinerary: [
      "오전: 바투 동굴",
      "점심: 부킷빈탕 인근 식당",
      "오후: 페트로나스 트윈타워 전망대",
      "저녁: 차이나타운 야시장",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "도심",
        steps: ["페트로나스 트윈타워", "부킷빈탕", "KL타워 야경"],
      },
      {
        day: 2,
        theme: "다문화 거리",
        steps: ["바투 동굴", "차이나타운", "리틀인디아"],
      },
      {
        day: 3,
        theme: "근교 확장",
        steps: ["겐팅하이랜드", "쿠알라룸푸르 복귀", "KLIA 공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·교통 포함 약 45만~72만 원(항공료 별도).",
    transportation:
      "쿠알라룸푸르국제공항(KLIA)에서 공항철도(KLIA Ekspres)로 시내 진입, 시내는 LRT·모노레일로 이동합니다.",
    food: ["나시레막", "바쿠테", "로티차나이", "락사"],
    etiquette: [
      "바투 동굴 등 힌두교 사원에서는 신발을 벗고 정숙을 유지합니다.",
      "라마단 기간에는 공공장소 음식 섭취에 주의합니다.",
      "모스크 방문 시 노출이 적은 복장을 갖춥니다.",
    ],
    source: {
      name: "말레이시아 관광청",
      url: "https://www.tourism.gov.my",
      updatedAt: "2026-08-24",
    },
  },
  {
    id: "overseas-penang",
    scope: "overseas",
    name: "페낭",
    country: "말레이시아",
    countryCode: "MY",
    theme: "골목·미식",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Penang_Malaysia_Street-art-10.jpg/960px-Penang_Malaysia_Street-art-10.jpg",
      alt: "페낭 조지타운 자전거 탄 아이들 벽화",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Penang_Malaysia_Street-art-10.jpg",
    },
    summary:
      "페낭은 유네스코 세계문화유산으로 지정된 조지타운을 중심으로, 식민지 시대 건축물과 스트리트 아트, 다양한 길거리 음식이 어우러진 말레이시아의 미식 여행지입니다. 조지타운 골목 곳곳에는 벽화와 철제 캐리커처가 숨어 있어 도보로 찾아다니는 재미가 있고, 페낭힐에서는 케이블카를 타고 올라 조지타운 전경을 내려다볼 수 있습니다. 존커 스트리트 인근 호커센터에서는 페낭식 락사·차퀘이티아우 등 대표 음식을 한자리에서 맛볼 수 있어, 하루 코스로도 미식 투어가 가능합니다. 상대적으로 관광객이 붐비지 않아 여유로운 골목 산책을 원하는 여행자에게 적합합니다.",
    highlights: [
      "조지타운 스트리트 아트",
      "페낭힐",
      "콘윌리스 요새",
      "클랜 제티",
      "호커센터 미식거리",
    ],
    bestSeason: "12~3월(선선한 건기)",
    oneDayItinerary: [
      "오전: 조지타운 벽화 골목 산책",
      "점심: 호커센터 페낭 락사",
      "오후: 콘윌리스 요새·클랜 제티",
      "저녁: 페낭힐 케이블카 야경",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "조지타운",
        steps: ["스트리트 아트 투어", "콘윌리스 요새", "호커센터 저녁"],
      },
      {
        day: 2,
        theme: "언덕·사원",
        steps: ["페낭힐", "켁록시 사원", "클랜 제티"],
      },
      {
        day: 3,
        theme: "해변·마무리",
        steps: ["바투페링기 해변", "야시장 쇼핑", "페낭공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·교통 포함 약 40만~65만 원(항공료 별도).",
    transportation:
      "페낭국제공항에서 택시·그랩으로 시내 진입, 조지타운 내부는 도보와 자전거 대여가 편리합니다.",
    food: ["페낭 락사", "차퀘이티아우", "호키엔미", "쭈쭈"],
    etiquette: [
      "사찰에서는 신발을 벗고 정숙을 유지합니다.",
      "벽화 앞에서 사진 촬영 시 다른 방문객의 동선을 배려합니다.",
      "호커센터에서는 좌석을 먼저 맡고 주문하는 현지 방식을 따릅니다.",
    ],
    source: {
      name: "말레이시아 관광청",
      url: "https://www.tourism.gov.my",
      updatedAt: "2026-08-24",
    },
  },
  {
    id: "overseas-bali",
    scope: "overseas",
    name: "발리(덴파사르)",
    country: "인도네시아",
    countryCode: "ID",
    theme: "해변·힐링",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8a/Rice_terraces%2C_Bali.jpg/960px-Rice_terraces%2C_Bali.jpg",
      alt: "발리 우붓 뜨갈랄랑 계단식 논 풍경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Rice_terraces,_Bali.jpg",
    },
    summary:
      "발리는 우붓의 계단식 논, 꾸따·스미냑의 서핑 해변, 힌두 사원이 어우러진 인도네시아의 대표 휴양섬입니다. 우붓은 요가·명상 리트릿과 예술 마을로 유명해 힐링 여행을 원하는 사람들에게, 꾸따·스미냑은 서핑과 비치클럽으로 젊은 여행자들에게 각각 인기가 많습니다. 타나롯 사원의 해상 일몰, 울루와뚜 사원의 절벽 전망은 발리를 대표하는 사진 명소로 꼽힙니다. 섬 전역에 걸쳐 빌라형 숙소가 발달해 있어 커플·가족 여행 모두에 적합하고, 계단식 논과 화산을 함께 조망하는 반나절 투어도 인기 코스입니다. 허니문 여행지로도 오랫동안 사랑받아 사적인 풀빌라 숙소 선택지가 매우 다양합니다.",
    highlights: [
      "우붓 계단식 논(테갈랄랑)",
      "타나롯 사원",
      "울루와뚜 사원",
      "꾸따·스미냑 해변",
      "우붓 몽키포레스트",
    ],
    bestSeason: "4~10월(건기)",
    oneDayItinerary: [
      "오전: 테갈랄랑 계단식 논",
      "점심: 우붓 시내 로컬 와룽",
      "오후: 우붓 몽키포레스트·시장",
      "저녁: 타나롯 사원 일몰",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "우붓",
        steps: ["테갈랄랑 계단식 논", "우붓 왕궁", "몽키포레스트"],
      },
      {
        day: 2,
        theme: "사원·절벽",
        steps: ["타나롯 사원", "울루와뚜 사원", "켓츠악 댄스 공연"],
      },
      {
        day: 3,
        theme: "해변",
        steps: ["꾸따·스미냑 해변", "비치클럽 휴식", "응우라라이공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·투어 포함 약 45만~80만 원(항공료 별도).",
    transportation:
      "응우라라이국제공항에서 택시·그랩으로 이동, 섬 내부는 기사 동반 차량 대절이 일반적입니다.",
    food: ["나시고렝", "사테", "바비굴링", "미고렝"],
    etiquette: [
      "사원 방문 시 사롱(전통 천)을 둘러 예의를 갖춥니다.",
      "사원 경내에서 생리 중인 여성 출입 제한 안내를 존중합니다.",
      "계단식 논은 농경지이므로 지정된 길로만 다닙니다.",
    ],
    source: {
      name: "인도네시아 관광부",
      url: "https://www.indonesia.travel",
      updatedAt: "2026-08-20",
    },
  },
  {
    id: "overseas-jakarta",
    scope: "overseas",
    name: "자카르타",
    country: "인도네시아",
    countryCode: "ID",
    theme: "대도시·쇼핑",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Monumen_Nasional%2C_Jakarta%2C_Indonesia.jpg/960px-Monumen_Nasional%2C_Jakarta%2C_Indonesia.jpg",
      alt: "자카르타 모나스 기념탑과 도심 풍경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Monumen_Nasional,_Jakarta,_Indonesia.jpg",
    },
    summary:
      "자카르타는 인도네시아의 수도이자 동남아시아 최대 규모 도시 중 하나로, 모나스(독립기념탑)를 중심으로 한 현대적 행정 구역과 코타투아(구시가지)의 식민지 시대 건축이 함께 있는 대도시입니다. 대형 쇼핑몰과 미식 거리가 발달해 있어 도시형 여행을 즐기는 사람들에게 적합하고, 코타투아 지역에서는 자카르타 역사박물관과 네덜란드풍 건축을 도보로 둘러볼 수 있습니다. 교통 체증이 심한 편이라 지하철(MRT)·경전철(LRT) 등 신설 대중교통을 활용하는 것이 효율적입니다. 발리·족자카르타 등 다른 지역 여행의 관문 도시로도 자주 활용됩니다. 다국적 기업과 현지 스타트업이 밀집한 비즈니스 여행 수요도 꾸준한 도시입니다.",
    highlights: [
      "모나스(독립기념탑)",
      "코타투아(구시가지)",
      "이스티클랄 모스크",
      "그랜드 인도네시아 쇼핑몰",
      "안쫄 드림랜드",
    ],
    bestSeason: "6~9월(비교적 건조한 시기)",
    oneDayItinerary: [
      "오전: 모나스 전망대",
      "점심: 코타투아 인근 로컬 식당",
      "오후: 코타투아 역사박물관 산책",
      "저녁: 그랜드 인도네시아 쇼핑몰",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "도심",
        steps: ["모나스", "이스티클랄 모스크", "쇼핑몰 저녁"],
      },
      {
        day: 2,
        theme: "구시가지",
        steps: ["코타투아 역사박물관", "파타힐라 광장", "선다클라파 항구"],
      },
      {
        day: 3,
        theme: "근교·마무리",
        steps: ["안쫄 드림랜드", "자카르타 시내 복귀", "수카르노하타공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·교통 포함 약 42만~70만 원(항공료 별도).",
    transportation:
      "수카르노하타국제공항에서 공항철도로 시내 진입, 시내는 MRT·LRT·그랩을 함께 이용합니다.",
    food: ["나시고렝", "사테", "가도가도", "소토 아얌"],
    etiquette: [
      "모스크 방문 시 노출이 적은 복장과 스카프를 준비합니다.",
      "라마단 기간 공공장소 음식 섭취에 주의합니다.",
      "교통 체증이 심하니 일정에 이동 여유 시간을 넉넉히 둡니다.",
    ],
    source: {
      name: "인도네시아 관광부",
      url: "https://www.indonesia.travel",
      updatedAt: "2026-08-20",
    },
  },
  {
    id: "overseas-singapore",
    scope: "overseas",
    name: "싱가포르",
    country: "싱가포르",
    countryCode: "SG",
    theme: "도시국가·정원",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bc/Gardens_by_the_Bay%2C_Marina_Bay%2C_Singapur%2C_2023-08-19%2C_DD_29-31_HDR.jpg/960px-Gardens_by_the_Bay%2C_Marina_Bay%2C_Singapur%2C_2023-08-19%2C_DD_29-31_HDR.jpg",
      alt: "싱가포르 마리나베이샌즈와 가든스바이더베이 야경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Gardens_by_the_Bay,_Marina_Bay,_Singapur,_2023-08-19,_DD_29-31_HDR.jpg",
    },
    summary:
      "싱가포르는 도시 전체가 하나의 관광지처럼 정비된 도시국가로, 마리나베이샌즈·가든스바이더베이의 미래적인 스카이라인과 차이나타운·리틀인디아·아랍 스트리트의 다문화 골목이 촘촘히 공존합니다. 대중교통(MRT)이 정확하고 깨끗해 초행자도 이동이 매우 쉽고, 공항(창이국제공항)조차 정원과 워터폭이 있는 관광명소로 꼽힙니다. 센토사섬에는 유니버설 스튜디오 싱가포르 등 테마파크가 모여 있어 가족 여행에도 적합하며, 클락키·리버사이드는 저녁 시간 강변 야경 산책 코스로 인기가 많습니다. 국토가 작아 2~3일이면 핵심 명소를 효율적으로 돌아볼 수 있습니다.",
    highlights: [
      "마리나베이샌즈",
      "가든스바이더베이",
      "센토사섬",
      "차이나타운·리틀인디아",
      "클락키",
    ],
    bestSeason: "연중(열대성 기후, 2~4월 비교적 건조)",
    oneDayItinerary: [
      "오전: 가든스바이더베이 산책",
      "점심: 클락키 인근 호커센터",
      "오후: 마리나베이샌즈 전망대",
      "저녁: 클락키 강변 야경",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "마리나베이",
        steps: ["가든스바이더베이", "마리나베이샌즈", "라이트쇼 관람"],
      },
      {
        day: 2,
        theme: "다문화 거리",
        steps: ["차이나타운", "리틀인디아", "아랍 스트리트"],
      },
      {
        day: 3,
        theme: "센토사섬",
        steps: ["유니버설 스튜디오 싱가포르", "센토사 해변", "창이공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·교통 포함 약 70만~110만 원(항공료 별도).",
    transportation:
      "창이국제공항에서 MRT로 시내 진입, 시내 전역은 MRT·버스로 편리하게 이동합니다.",
    food: ["칠리크랩", "하이난치킨라이스", "락사", "바쿠테"],
    etiquette: [
      "대중교통 내 음식물 섭취는 금지되어 있습니다.",
      "껌 반입·판매가 엄격히 제한됩니다.",
      "무단횡단·쓰레기 투기에 높은 벌금이 부과되니 규정을 준수합니다.",
    ],
    source: {
      name: "싱가포르 관광청(STB)",
      url: "https://www.visitsingapore.com",
      updatedAt: "2026-08-18",
    },
  },
  {
    id: "overseas-siemreap",
    scope: "overseas",
    name: "씨엠립",
    country: "캄보디아",
    countryCode: "KH",
    theme: "유적·사원",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Angkor_Wat_Sunrise_%28209237385%29.jpeg/960px-Angkor_Wat_Sunrise_%28209237385%29.jpeg",
      alt: "앙코르와트 일출 풍경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Angkor_Wat_Sunrise_(209237385).jpeg",
    },
    summary:
      "씨엠립은 세계문화유산 앙코르와트를 비롯한 크메르 제국의 사원 유적군이 모여 있는 캄보디아의 대표 여행지입니다. 앙코르와트의 일출, 따프롬 사원의 나무뿌리가 뒤덮은 폐허, 바이욘 사원의 거대한 얼굴 조각 등 각기 다른 매력의 사원을 하루 이틀에 걸쳐 순환하며 둘러보는 것이 대표 코스입니다. 시내 펍스트리트에서는 저녁마다 현지인과 여행자가 뒤섞여 활기찬 분위기를 즐길 수 있고, 톤레삽 호수 수상마을 투어를 통해 캄보디아 서민들의 생활상을 엿볼 수도 있습니다. 유적 관람이 야외에서 오래 이루어지므로 더위 대비가 특히 중요한 여행지입니다.",
    highlights: [
      "앙코르와트",
      "바이욘 사원(앙코르톰)",
      "따프롬 사원",
      "펍스트리트",
      "톤레삽 호수 수상마을",
    ],
    bestSeason: "11~2월(선선한 건기)",
    oneDayItinerary: [
      "새벽: 앙코르와트 일출 관람",
      "오전: 바이욘 사원(앙코르톰)",
      "오후: 따프롬 사원",
      "저녁: 펍스트리트 야시장",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "앙코르 유적 1",
        steps: ["앙코르와트 일출", "앙코르톰·바이욘 사원", "펍스트리트"],
      },
      {
        day: 2,
        theme: "앙코르 유적 2",
        steps: ["따프롬 사원", "반테아이스레이", "올드마켓"],
      },
      {
        day: 3,
        theme: "톤레삽 호수",
        steps: [
          "톤레삽 수상마을 투어",
          "씨엠립 시내 마사지",
          "씨엠립공항 이동",
        ],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·입장권 포함 약 40만~65만 원(항공료 별도).",
    transportation:
      "씨엠립국제공항에서 툭툭·택시로 시내 진입, 유적지 구간 이동은 툭툭 기사를 종일 대절하는 방식이 일반적입니다.",
    food: ["아목(생선 카레)", "커리 누들", "로크락", "캄보디아식 바비큐"],
    etiquette: [
      "사원 방문 시 어깨·무릎을 가리는 복장을 갖춥니다.",
      "유적 훼손 행위(낙서·부착물 부착)를 하지 않습니다.",
      "구걸하는 아동에게 직접 현금을 주기보다 현지 단체를 통한 기부를 권장합니다.",
    ],
    source: {
      name: "캄보디아 관광부",
      url: "https://www.tourismcambodia.org",
      updatedAt: "2026-08-15",
    },
  },
  {
    id: "overseas-phnompenh",
    scope: "overseas",
    name: "프놈펜",
    country: "캄보디아",
    countryCode: "KH",
    theme: "역사·강변",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Royal_Palace%2C_Phnom_Penh_Cambodia_1.jpg/960px-Royal_Palace%2C_Phnom_Penh_Cambodia_1.jpg",
      alt: "프놈펜 왕궁 즉위식장 전경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Royal_Palace,_Phnom_Penh_Cambodia_1.jpg",
    },
    summary:
      "프놈펜은 톤레삽강과 메콩강이 만나는 지점에 자리한 캄보디아의 수도로, 화려한 왕궁·실버파고다와 근현대사의 아픔이 담긴 킬링필드·뚜올슬렝 박물관이 공존하는 도시입니다. 강변 산책로(시소와트 부두)는 저녁마다 현지인들의 산책·운동 코스로 붐비며, 중앙시장(프사트마이)은 아르데코 양식의 독특한 건축으로도 유명합니다. 역사적 아픔을 다루는 유적지가 많아 다른 동남아 도시보다 진지한 분위기의 여행이 될 수 있으며, 방문 시 이러한 배경에 대한 이해와 예의가 필요합니다. 씨엠립으로 이동하는 관문 도시로도 자주 활용됩니다. 최근에는 강변을 따라 카페·루프탑 바가 새롭게 들어서며 활기를 더하고 있습니다.",
    highlights: [
      "왕궁·실버파고다",
      "국립박물관",
      "뚜올슬렝 박물관",
      "킬링필드(청아익)",
      "중앙시장(프사트마이)",
    ],
    bestSeason: "11~2월(선선한 건기)",
    oneDayItinerary: [
      "오전: 왕궁·실버파고다",
      "점심: 중앙시장 인근 식당",
      "오후: 국립박물관",
      "저녁: 시소와트 부두 강변 산책",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "왕궁·박물관",
        steps: ["왕궁·실버파고다", "국립박물관", "강변 산책"],
      },
      {
        day: 2,
        theme: "근현대사",
        steps: ["뚜올슬렝 박물관", "킬링필드(청아익)", "중앙시장"],
      },
      {
        day: 3,
        theme: "마무리",
        steps: ["왓프놈 사원", "러시안 마켓", "프놈펜공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·입장권 포함 약 38만~60만 원(항공료 별도).",
    transportation:
      "프놈펜국제공항에서 툭툭·택시로 시내 진입, 시내 이동은 툭툭과 그랩을 함께 이용합니다.",
    food: ["아목", "쿠이띠유", "바이사이치룩", "캄보디아식 볶음국수"],
    etiquette: [
      "킬링필드·뚜올슬렝 박물관에서는 정숙하고 진지한 태도를 유지합니다.",
      "왕궁·사원 방문 시 노출이 적은 복장을 갖춥니다.",
      "박물관 내 촬영 제한 구역 안내를 따릅니다.",
    ],
    source: {
      name: "캄보디아 관광부",
      url: "https://www.tourismcambodia.org",
      updatedAt: "2026-08-15",
    },
  },
  {
    id: "overseas-paris",
    scope: "overseas",
    name: "파리",
    country: "프랑스",
    countryCode: "FR",
    theme: "예술·낭만",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Eiffel_Tower_and_Pont_Alexandre_III_at_night.jpg/960px-Eiffel_Tower_and_Pont_Alexandre_III_at_night.jpg",
      alt: "파리 에펠탑과 센 강변 야경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Eiffel_Tower_and_Pont_Alexandre_III_at_night.jpg",
    },
    summary:
      "파리는 에펠탑·루브르박물관·노트르담대성당 등 세계적인 랜드마크가 도보권에 밀집한 프랑스의 수도로, 미술관과 골목 카페를 오가는 느긋한 도보 여행이 특히 잘 어울리는 도시입니다. 센 강변을 따라 걷다 보면 다리마다 다른 풍경을 만날 수 있고, 몽마르트 언덕에서는 사크레쾨르 대성당과 함께 파리 시내 전경을 감상할 수 있습니다. 지하철(메트로)이 촘촘히 연결돼 있어 도시 전역을 효율적으로 이동할 수 있으며, 베르사유궁전 등 근교 명소도 당일치기로 다녀오기 좋습니다. 미술관 입장 대기가 긴 편이라 온라인 사전 예약이 권장됩니다. 사계절 내내 패션·미식 트렌드를 이끄는 도시로도 꾸준히 주목받습니다.",
    highlights: [
      "에펠탑",
      "루브르박물관",
      "노트르담대성당",
      "몽마르트 언덕",
      "베르사유궁전(근교)",
    ],
    bestSeason: "4~6월·9~10월(봄·가을)",
    oneDayItinerary: [
      "오전: 루브르박물관 관람",
      "점심: 마레 지구 카페",
      "오후: 노트르담대성당·센 강변 산책",
      "저녁: 에펠탑 야경",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "시테섬·루브르",
        steps: ["루브르박물관", "노트르담대성당", "센 강변 산책"],
      },
      {
        day: 2,
        theme: "에펠탑·몽마르트",
        steps: ["에펠탑", "샹젤리제·개선문", "몽마르트 언덕"],
      },
      {
        day: 3,
        theme: "근교 확장",
        steps: ["베르사유궁전", "파리 복귀", "샤를드골공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·교통 포함 약 100만~160만 원(항공료 별도).",
    transportation:
      "샤를드골공항에서 RER B선으로 시내 진입, 시내는 메트로로 대부분 이동합니다.",
    food: ["크루아상", "에스카르고", "크레페", "치즈·와인 플레이트"],
    etiquette: [
      "레스토랑에서는 자리에 앉아 직원을 기다리는 것이 일반적입니다.",
      "인사말(봉주르)로 대화를 시작하는 것이 예의로 여겨집니다.",
      "박물관 내 플래시 촬영은 대부분 금지되어 있습니다.",
    ],
    source: {
      name: "프랑스 관광청(Atout France)",
      url: "https://kr.france.fr",
      updatedAt: "2026-08-10",
    },
  },
  {
    id: "overseas-nice",
    scope: "overseas",
    name: "니스",
    country: "프랑스",
    countryCode: "FR",
    theme: "해안·휴양",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Promenade_des_Anglais_%28Nice%29%2C_France.jpg/960px-Promenade_des_Anglais_%28Nice%29%2C_France.jpg",
      alt: "니스 프롬나드 데 장글레 해안 산책로",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Promenade_des_Anglais_(Nice),_France.jpg",
    },
    summary:
      "니스는 프랑스 남부 코트다쥐르 해안에 위치한 휴양 도시로, 프롬나드 데 장글레 해안 산책로와 구시가지의 파스텔톤 건물이 어우러진 풍경으로 유명합니다. 구시가지(비외니스)의 좁은 골목에는 시장과 카페가 밀집해 있어 도보로 미식 투어를 하기 좋고, 콜린 뒤 샤토 언덕에서는 니스 해안 전경을 한눈에 담을 수 있습니다. 인근 소도시 에즈·모나코까지 기차로 20~40분이면 이동할 수 있어, 지중해 연안 도시들을 함께 묶는 여행 거점으로도 자주 활용됩니다. 여름철에는 해수욕을, 봄·가을에는 온화한 날씨의 산책 여행을 즐기기 좋습니다. 파리보다 여유로운 속도로 지중해 분위기를 느끼고 싶은 여행자에게 특히 알맞습니다.",
    highlights: [
      "프롬나드 데 장글레",
      "비외니스(구시가지)",
      "콜린 뒤 샤토 언덕",
      "니스 현대미술관(MAMAC)",
      "에즈 마을(근교)",
    ],
    bestSeason: "5~6월·9월(온화한 시기)",
    oneDayItinerary: [
      "오전: 비외니스 구시가지·시장",
      "점심: 구시가지 프로방스 식당",
      "오후: 콜린 뒤 샤토 언덕",
      "저녁: 프롬나드 데 장글레 해안 산책",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "구시가지",
        steps: ["비외니스 시장", "콜린 뒤 샤토", "해안 산책로"],
      },
      {
        day: 2,
        theme: "예술·해변",
        steps: ["니스 현대미술관", "해수욕·해변 휴식", "샤갈미술관"],
      },
      {
        day: 3,
        theme: "근교 확장",
        steps: ["에즈 마을", "모나코 몬테카를로", "니스공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·교통 포함 약 95만~150만 원(항공료 별도).",
    transportation:
      "니스코트다쥐르공항에서 트램으로 시내 진입, 근교는 기차(TER)로 이동합니다.",
    food: ["살라드 니수아즈", "소카(병아리콩 크레페)", "라따뚜이", "부야베스"],
    etiquette: [
      "해변에서는 지정 구역과 일광욕 관습을 존중합니다.",
      "레스토랑 예약 시간에 늦지 않도록 유의합니다.",
      "좁은 골목 상점에서는 통행로를 막지 않습니다.",
    ],
    source: {
      name: "프랑스 관광청(Atout France)",
      url: "https://kr.france.fr",
      updatedAt: "2026-08-10",
    },
  },
  {
    id: "overseas-rome",
    scope: "overseas",
    name: "로마",
    country: "이탈리아",
    countryCode: "IT",
    theme: "고대유적·역사",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d8/Colosseum_in_Rome-April_2007-1-_copie_2B.jpg/960px-Colosseum_in_Rome-April_2007-1-_copie_2B.jpg",
      alt: "로마 콜로세움 전경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Colosseum_in_Rome-April_2007-1-_copie_2B.jpg",
    },
    summary:
      "로마는 콜로세움·포로 로마노 등 고대 로마 제국의 유적이 도심 한복판에 그대로 남아 있는 도시로, 걷는 곳마다 2000년 역사와 마주하게 됩니다. 바티칸시국의 성베드로대성당·시스티나성당은 별도의 국가이지만 로마 여행에서 함께 방문하는 필수 코스이며, 트레비분수·스페인광장 등 소품 같은 명소들이 도보권에 이어져 있습니다. 좁은 골목 트라스테베레 지구는 저녁마다 현지인들이 모이는 활기찬 레스토랑 거리로 변하고, 젤라토와 에스프레소 문화가 발달해 있어 걷다가 쉬어가는 여행이 자연스럽게 이루어집니다. 유적 대부분이 야외에 있어 여름철 더위 대비가 필요합니다.",
    highlights: [
      "콜로세움",
      "바티칸(성베드로대성당)",
      "트레비분수",
      "판테온",
      "트라스테베레 지구",
    ],
    bestSeason: "4~6월·9~10월(봄·가을)",
    oneDayItinerary: [
      "오전: 콜로세움·포로 로마노",
      "점심: 트라스테베레 인근 트라토리아",
      "오후: 판테온·트레비분수",
      "저녁: 스페인광장 야경",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "고대 로마",
        steps: ["콜로세움", "포로 로마노", "카피톨리노 언덕"],
      },
      {
        day: 2,
        theme: "바티칸",
        steps: [
          "성베드로대성당",
          "바티칸박물관·시스티나성당",
          "트라스테베레 저녁",
        ],
      },
      {
        day: 3,
        theme: "도심 산책",
        steps: ["판테온", "트레비분수", "레오나르도다빈치공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·입장료 포함 약 100만~155만 원(항공료 별도).",
    transportation:
      "레오나르도다빈치공항에서 레오나르도 익스프레스 열차로 시내 진입, 시내는 지하철·트램으로 이동합니다.",
    food: ["카르보나라", "마르게리타 피자", "젤라토", "살팀보카"],
    etiquette: [
      "성당·바티칸 방문 시 어깨·무릎을 가리는 복장을 갖춥니다.",
      "분수·유적에 동전을 던지거나 낙서하지 않습니다(트레비분수의 동전 던지기는 지정된 방식만 허용).",
      "레스토랑에서는 좌석료(코페르토)가 별도로 부과될 수 있음을 확인합니다.",
    ],
    source: {
      name: "이탈리아 관광청(ENIT)",
      url: "https://www.italia.it",
      updatedAt: "2026-08-05",
    },
  },
  {
    id: "overseas-florence",
    scope: "overseas",
    name: "피렌체",
    country: "이탈리아",
    countryCode: "IT",
    theme: "르네상스·예술",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Firenze_Panorama_del_Centro_con_il_Duomo_e_Palazzo_Vecchio.jpg/960px-Firenze_Panorama_del_Centro_con_il_Duomo_e_Palazzo_Vecchio.jpg",
      alt: "피렌체 두오모 대성당과 시내 전경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Firenze_Panorama_del_Centro_con_il_Duomo_e_Palazzo_Vecchio.jpg",
    },
    summary:
      "피렌체는 르네상스 미술의 중심지로, 두오모 대성당의 거대한 붉은 돔과 우피치미술관의 방대한 회화 컬렉션이 도시를 대표합니다. 미켈란젤로광장에서 바라보는 피렌체 전경은 해질 무렵 특히 아름다워 여행자들이 꾸준히 찾는 명소이며, 베키오다리는 다리 위에 상점이 늘어선 독특한 구조로 유명합니다. 도시가 크지 않아 대부분의 명소를 도보로 이동할 수 있고, 근교의 피사·시에나까지 기차로 1시간 내외면 다녀올 수 있어 토스카나 지역 여행의 거점으로도 활용됩니다. 가죽공예·와인 등 토스카나 특산품 쇼핑도 여행의 즐거움 중 하나입니다. 예술사에 관심 있는 여행자라면 며칠을 머물러도 부족하지 않을 만큼 볼거리가 밀도 있게 모여 있습니다.",
    highlights: [
      "두오모 대성당",
      "우피치미술관",
      "베키오다리",
      "미켈란젤로광장",
      "피사의 사탑(근교)",
    ],
    bestSeason: "4~6월·9~10월(봄·가을)",
    oneDayItinerary: [
      "오전: 두오모 대성당",
      "점심: 중앙시장 먹거리",
      "오후: 우피치미술관",
      "저녁: 미켈란젤로광장 일몰",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "두오모·시내",
        steps: ["두오모 대성당", "중앙시장", "베키오다리"],
      },
      {
        day: 2,
        theme: "예술",
        steps: ["우피치미술관", "아카데미아미술관(다비드상)", "미켈란젤로광장"],
      },
      {
        day: 3,
        theme: "근교 확장",
        steps: ["피사의 사탑", "피렌체 복귀", "피렌체공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·입장료 포함 약 90만~140만 원(항공료 별도).",
    transportation:
      "피렌체 페레톨라공항 또는 기차로 진입, 시내는 대부분 도보로 이동 가능합니다.",
    food: ["비스테카 알라 피오렌티나", "리보리타", "젤라토", "토스카나 와인"],
    etiquette: [
      "성당 방문 시 노출이 적은 복장을 갖춥니다.",
      "미술관 예약 시간을 지키고 사전 예약을 권장합니다.",
      "좁은 골목에서는 자전거·스쿠터 통행에 주의합니다.",
    ],
    source: {
      name: "이탈리아 관광청(ENIT)",
      url: "https://www.italia.it",
      updatedAt: "2026-08-05",
    },
  },
  {
    id: "overseas-barcelona",
    scope: "overseas",
    name: "바르셀로나",
    country: "스페인",
    countryCode: "ES",
    theme: "건축·해변",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/Sagrada_Fam%C3%ADlia_2010.JPG/960px-Sagrada_Fam%C3%ADlia_2010.JPG",
      alt: "바르셀로나 사그라다파밀리아 성당 외관",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Sagrada_Fam%C3%ADlia_2010.JPG",
    },
    summary:
      "바르셀로나는 가우디의 사그라다파밀리아·구엘공원 등 독창적인 건축물과 지중해 해변이 함께 있는 스페인 카탈루냐 지방의 중심 도시입니다. 고딕지구의 좁은 골목은 중세 건물이 그대로 남아 있어 도보 여행에 알맞고, 람블라스 거리는 낮과 밤 모두 활기찬 산책 코스로 사랑받습니다. 바르셀로네타 해변에서는 도심에서 가깝게 지중해 해수욕을 즐길 수 있어, 건축·예술 여행과 해변 휴양을 함께 계획할 수 있는 흔치 않은 도시입니다. 타파스 바 문화가 발달해 있어 여러 곳을 옮겨 다니며 소량씩 맛보는 식사 방식이 일반적입니다. 축구 경기 일정과 맞물리면 캄프누 스타디움 투어도 인기 있는 코스가 됩니다.",
    highlights: [
      "사그라다파밀리아",
      "구엘공원",
      "고딕지구",
      "람블라스 거리",
      "바르셀로네타 해변",
    ],
    bestSeason: "5~6월·9월(온화한 시기)",
    oneDayItinerary: [
      "오전: 사그라다파밀리아",
      "점심: 고딕지구 타파스 바",
      "오후: 구엘공원",
      "저녁: 람블라스 거리·바르셀로네타 해변",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "가우디 건축",
        steps: ["사그라다파밀리아", "구엘공원", "카사바트요"],
      },
      {
        day: 2,
        theme: "구시가지",
        steps: ["고딕지구", "람블라스 거리", "보케리아 시장"],
      },
      {
        day: 3,
        theme: "해변",
        steps: ["바르셀로네타 해변", "포트벨 항구", "바르셀로나공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·입장료 포함 약 92만~145만 원(항공료 별도).",
    transportation:
      "바르셀로나엘프라트공항에서 공항철도(R2 Nord)로 시내 진입, 시내는 지하철(메트로)로 이동합니다.",
    food: ["타파스", "빠에야", "하몽", "판콘토마테"],
    etiquette: [
      "소매치기가 잦은 지역이라 대중교통·관광지에서 소지품에 주의합니다.",
      "성당 방문 시 노출이 적은 복장을 갖춥니다.",
      "타파스 바에서는 자리마다 팁 문화가 다르므로 영수증을 확인합니다.",
    ],
    source: {
      name: "스페인 관광청(Turespaña)",
      url: "https://www.spain.info",
      updatedAt: "2026-08-02",
    },
  },
  {
    id: "overseas-madrid",
    scope: "overseas",
    name: "마드리드",
    country: "스페인",
    countryCode: "ES",
    theme: "미술관·왕궁",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/Palacio_Real_de_Madrid_-_13.jpg/960px-Palacio_Real_de_Madrid_-_13.jpg",
      alt: "마드리드 왕궁 전경",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Palacio_Real_de_Madrid_-_13.jpg",
    },
    summary:
      "마드리드는 스페인의 수도로, 프라도미술관·레이나소피아미술관 등 세계적인 미술관과 마드리드왕궁 같은 웅장한 건축물이 도심에 모여 있는 문화 여행지입니다. 솔광장을 중심으로 그란비아·마요르광장까지 도보로 이어져 있어 쇼핑과 산책을 함께 즐길 수 있고, 레티로공원에서는 도심 속 여유로운 휴식을 취할 수 있습니다. 스페인 특유의 늦은 저녁 식사 문화와 타파스 바가 발달해 있어 밤늦게까지 활기찬 거리 분위기를 경험할 수 있습니다. 톨레도·세고비아 등 근교 소도시로 당일치기 여행을 떠나기도 좋은 거점 도시입니다. 바르셀로나와 함께 스페인 여행의 양대 축으로 꼽히는 대도시입니다.",
    highlights: [
      "프라도미술관",
      "마드리드왕궁",
      "레티로공원",
      "마요르광장",
      "톨레도(근교)",
    ],
    bestSeason: "4~6월·9~10월(봄·가을)",
    oneDayItinerary: [
      "오전: 프라도미술관",
      "점심: 마요르광장 인근 식당",
      "오후: 마드리드왕궁",
      "저녁: 그란비아·솔광장 야경",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "미술관",
        steps: ["프라도미술관", "레티로공원", "레이나소피아미술관"],
      },
      {
        day: 2,
        theme: "왕궁·구시가지",
        steps: ["마드리드왕궁", "마요르광장", "그란비아"],
      },
      {
        day: 3,
        theme: "근교 확장",
        steps: ["톨레도 당일치기", "마드리드 복귀", "바라하스공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·입장료 포함 약 88만~135만 원(항공료 별도).",
    transportation:
      "아돌포수아레스마드리드바라하스공항에서 지하철로 시내 진입, 시내는 지하철(메트로)로 이동합니다.",
    food: ["타파스", "코시도 마드릴레뇨", "츄러스", "하몽"],
    etiquette: [
      "미술관 내 플래시 촬영은 대부분 금지되어 있습니다.",
      "저녁 식사 시간이 늦은 편(21시 이후)이므로 예약 시간을 확인합니다.",
      "관광지에서 서명 요청·기부 강요형 접근을 경계합니다.",
    ],
    source: {
      name: "스페인 관광청(Turespaña)",
      url: "https://www.spain.info",
      updatedAt: "2026-08-02",
    },
  },
  {
    id: "overseas-newyork",
    scope: "overseas",
    name: "뉴욕",
    country: "미국",
    countryCode: "US",
    theme: "대도시·문화",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/Lower_Manhattan_from_Governors_Island_with_a_fishing_boat_%2846294p%29.jpg/960px-Lower_Manhattan_from_Governors_Island_with_a_fishing_boat_%2846294p%29.jpg",
      alt: "뉴욕 로어 맨해튼 스카이라인",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Lower_Manhattan_from_Governors_Island_with_a_fishing_boat_(46294p).jpg",
    },
    summary:
      "뉴욕은 타임스스퀘어·센트럴파크·자유의여신상 등 세계적으로 유명한 랜드마크가 맨해튼 섬 안에 밀집한 미국 최대 도시입니다. 브로드웨이 뮤지컬, 메트로폴리탄미술관 같은 대형 공연·전시 콘텐츠가 풍부해 문화 예술 여행에 특히 적합하고, 지하철이 24시간 운행돼 야간 이동도 비교적 자유롭습니다. 소호·첼시마켓 등 구역별로 뚜렷한 개성이 있어 하루씩 구역을 나눠 도는 코스가 일반적이며, 브루클린 다리를 건너 바라보는 맨해튼 스카이라인도 대표 사진 명소입니다. 물가가 높은 편이라 예산 계획을 넉넉히 세우는 것이 좋습니다. 전 세계 다양한 문화가 뒤섞인 거리 풍경 자체가 하나의 볼거리로 꼽힙니다.",
    highlights: [
      "타임스스퀘어",
      "센트럴파크",
      "자유의여신상",
      "메트로폴리탄미술관",
      "브루클린 다리",
    ],
    bestSeason: "4~6월·9~11월(봄·가을)",
    oneDayItinerary: [
      "오전: 자유의여신상·엘리스섬 투어",
      "점심: 첼시마켓",
      "오후: 센트럴파크 산책",
      "저녁: 타임스스퀘어·브로드웨이 뮤지컬",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "다운타운",
        steps: ["자유의여신상", "월스트리트", "브루클린 다리"],
      },
      {
        day: 2,
        theme: "미드타운",
        steps: ["타임스스퀘어", "메트로폴리탄미술관", "센트럴파크"],
      },
      {
        day: 3,
        theme: "쇼핑·마무리",
        steps: ["소호 쇼핑", "첼시마켓", "JFK공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·교통 포함 약 150만~230만 원(항공료 별도).",
    transportation:
      "JFK·뉴어크공항에서 지하철·에어트레인으로 시내 진입, 시내는 지하철(서브웨이)로 대부분 이동합니다.",
    food: ["뉴욕 피자", "베이글", "파스트라미 샌드위치", "치즈케이크"],
    etiquette: [
      "레스토랑·택시 이용 시 팁(15~20%)이 일반적입니다.",
      "지하철 러시아워에는 큰 짐을 최소화합니다.",
      "공연장에서는 시작 전 휴대폰을 무음으로 전환합니다.",
    ],
    source: {
      name: "뉴욕관광청(NYC Tourism + Conventions)",
      url: "https://www.nyctourism.com",
      updatedAt: "2026-07-28",
    },
  },
  {
    id: "overseas-losangeles",
    scope: "overseas",
    name: "로스앤젤레스",
    country: "미국",
    countryCode: "US",
    theme: "해변·엔터테인먼트",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Santa_Monica_Pier_from_Santa_Monica_State_Beach_03.jpg/960px-Santa_Monica_Pier_from_Santa_Monica_State_Beach_03.jpg",
      alt: "로스앤젤레스 산타모니카 해변과 부두",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Santa_Monica_Pier_from_Santa_Monica_State_Beach_03.jpg",
    },
    summary:
      "로스앤젤레스는 할리우드·비벌리힐스 같은 엔터테인먼트 산업의 중심지와 산타모니카·베니스비치 등 서핑 문화가 발달한 해변이 공존하는 미국 서부의 대도시입니다. 도시가 넓게 퍼져 있어 렌터카 이용이 사실상 필수이며, 구역마다 분위기가 크게 달라 하루 단위로 지역을 나눠 여행하는 것이 효율적입니다. 유니버설스튜디오 할리우드·디즈니랜드 등 테마파크가 모여 있어 가족 여행에도 적합하고, 그리피스천문대에서 바라보는 할리우드 사인과 도심 야경도 대표 명소로 꼽힙니다. 연중 온화한 기후라 계절에 크게 구애받지 않고 방문할 수 있습니다. 서핑·요가 등 웰니스 라이프스타일을 체험하기에도 좋은 도시로 꼽힙니다.",
    highlights: [
      "할리우드 사인·그리피스천문대",
      "산타모니카 해변·부두",
      "유니버설스튜디오 할리우드",
      "베니스비치",
      "게티센터",
    ],
    bestSeason: "3~5월·9~11월(온화한 시기)",
    oneDayItinerary: [
      "오전: 그리피스천문대·할리우드 사인 전망",
      "점심: 할리우드 대로 식당",
      "오후: 베벌리힐스 쇼핑",
      "저녁: 산타모니카 부두 일몰",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "할리우드",
        steps: ["그리피스천문대", "할리우드 워크오브페임", "베벌리힐스"],
      },
      {
        day: 2,
        theme: "테마파크",
        steps: ["유니버설스튜디오 할리우드 종일 이용"],
      },
      {
        day: 3,
        theme: "해변",
        steps: ["산타모니카 해변·부두", "베니스비치", "LAX공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·렌터카 포함 약 145만~220만 원(항공료 별도).",
    transportation:
      "로스앤젤레스국제공항(LAX)에서 렌터카 이용이 일반적이며, 대중교통은 노선이 제한적입니다.",
    food: ["인앤아웃 버거", "타코", "팜스프링스 브런치", "코리아타운 바비큐"],
    etiquette: [
      "레스토랑·발렛 이용 시 팁(15~20%)이 일반적입니다.",
      "렌터카 운전 시 스쿨버스 정차 규정을 준수합니다.",
      "해변 주차 규정(허가 구역·시간제)을 사전에 확인합니다.",
    ],
    source: {
      name: "로스앤젤레스 관광청(LA Tourism)",
      url: "https://www.discoverlosangeles.com",
      updatedAt: "2026-07-28",
    },
  },
  {
    id: "overseas-sydney",
    scope: "overseas",
    name: "시드니",
    country: "호주",
    countryCode: "AU",
    theme: "항구·해변",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Sydney_Opera_House_and_Harbour_Bridge%2C_southeast_view_20230224_1.jpg/960px-Sydney_Opera_House_and_Harbour_Bridge%2C_southeast_view_20230224_1.jpg",
      alt: "시드니 오페라하우스와 하버브리지",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Sydney_Opera_House_and_Harbour_Bridge,_southeast_view_20230224_1.jpg",
    },
    summary:
      "시드니는 오페라하우스와 하버브리지가 만드는 상징적인 항구 풍경과 본다이비치 등 도심에서 가까운 서핑 해변이 함께 있는 호주 최대 도시입니다. 서큘러키를 기점으로 페리를 타고 항구를 오가며 도시를 감상하는 코스가 대표적이며, 록스 지역은 식민지 시대 건축이 남아 있는 구시가지로 주말마다 마켓이 열립니다. 본다이비치에서 쿠지비치까지 이어지는 해안 산책로(코스탈 워크)는 절벽과 바다 전망을 함께 즐길 수 있어 인기가 많습니다. 남반구에 위치해 계절이 한국과 반대이므로 여행 시기의 기후를 미리 확인하는 것이 중요합니다. 도심과 자연이 가까이 붙어 있어 짧은 일정으로도 다양한 풍경을 경험할 수 있습니다.",
    highlights: [
      "시드니 오페라하우스",
      "하버브리지",
      "본다이비치",
      "록스 지구",
      "달링하버",
    ],
    bestSeason: "9~11월·3~5월(남반구 봄·가을)",
    oneDayItinerary: [
      "오전: 오페라하우스·서큘러키",
      "점심: 록스 지구 마켓",
      "오후: 하버브리지 전망대",
      "저녁: 달링하버 야경",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "하버 지구",
        steps: ["오페라하우스", "하버브리지", "록스 지구"],
      },
      {
        day: 2,
        theme: "해변",
        steps: ["본다이비치", "코스탈 워크", "쿠지비치"],
      },
      {
        day: 3,
        theme: "도심·마무리",
        steps: ["달링하버", "시드니타워 전망대", "시드니공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·교통 포함 약 135만~200만 원(항공료 별도).",
    transportation:
      "시드니국제공항에서 열차로 시내 진입, 시내는 열차·페리·버스를 함께 이용합니다.",
    food: ["미트파이", "플랫화이트 커피", "피시앤칩스", "팀탐"],
    etiquette: [
      "해변에서는 적기(빨강·노랑 깃발) 안내 구역 안에서만 수영합니다.",
      "강한 자외선에 대비해 자외선 차단제를 준비합니다.",
      "대중교통에서는 승하차 시 카드를 태그하는 것을 잊지 않습니다.",
    ],
    source: {
      name: "호주관광청(Tourism Australia)",
      url: "https://www.australia.com",
      updatedAt: "2026-07-20",
    },
  },
  {
    id: "overseas-melbourne",
    scope: "overseas",
    name: "멜버른",
    country: "호주",
    countryCode: "AU",
    theme: "카페·골목",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/AUS_Melbourne%2C_Central_Business_District%2C_Degraves_Street_001.jpg/960px-AUS_Melbourne%2C_Central_Business_District%2C_Degraves_Street_001.jpg",
      alt: "멜버른 디그레이브스 거리 골목 카페",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:AUS_Melbourne,_Central_Business_District,_Degraves_Street_001.jpg",
    },
    summary:
      "멜버른은 호주 최고의 커피 도시로 꼽히는 곳으로, 도심 곳곳의 레인웨이(골목)에 자리한 카페와 스트리트 아트가 도시의 개성을 만듭니다. 페더레이션 스퀘어를 중심으로 트램이 도심 전역을 무료로 순환해 관광객도 쉽게 이동할 수 있고, 퀸빅토리아마켓에서는 신선한 식재료와 다양한 길거리 음식을 함께 즐길 수 있습니다. 그레이트오션로드로 이어지는 해안 드라이브 코스가 근교에 있어, 렌터카를 이용한 1박 2일 확장 여행도 인기가 많습니다. 스포츠·예술 축제가 연중 끊이지 않아 방문 시기에 따라 다른 이벤트를 경험할 수 있는 도시입니다. 시드니보다 차분하고 예술적인 분위기를 선호하는 여행자에게 잘 맞습니다.",
    highlights: [
      "페더레이션 스퀘어",
      "호시어 레인(스트리트 아트)",
      "퀸빅토리아마켓",
      "야라강 산책로",
      "그레이트오션로드(근교)",
    ],
    bestSeason: "3~5월·9~11월(남반구 가을·봄)",
    oneDayItinerary: [
      "오전: 퀸빅토리아마켓",
      "점심: 레인웨이 카페 브런치",
      "오후: 호시어 레인 스트리트 아트",
      "저녁: 야라강변 산책",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "도심 골목",
        steps: ["페더레이션 스퀘어", "호시어 레인", "레인웨이 카페 투어"],
      },
      {
        day: 2,
        theme: "시장·강변",
        steps: ["퀸빅토리아마켓", "야라강 크루즈", "사우스뱅크"],
      },
      {
        day: 3,
        theme: "근교 확장",
        steps: ["그레이트오션로드 데이투어", "멜버른 복귀", "멜버른공항 이동"],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·투어 포함 약 130만~195만 원(항공료 별도).",
    transportation:
      "멜버른공항에서 스카이버스로 시내 진입, 도심은 무료 순환 트램(시티서클)을 활용합니다.",
    food: ["플랫화이트 커피", "미트파이", "파르마", "브런치 아보카도토스트"],
    etiquette: [
      "트램 탑승 시 카드를 태그하는 것을 잊지 않습니다.",
      "스트리트 아트는 지정 구역에서만 촬영·감상하며 훼손하지 않습니다.",
      "카페에서는 좌석 안내를 기다리는 것이 일반적입니다.",
    ],
    source: {
      name: "호주관광청(Tourism Australia)",
      url: "https://www.australia.com",
      updatedAt: "2026-07-20",
    },
  },
  {
    id: "overseas-prague",
    scope: "overseas",
    name: "프라하",
    country: "체코",
    countryCode: "CZ",
    theme: "고성·구시가지",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Prague%2C_Old_Town_Square%2C_COVID.jpg/960px-Prague%2C_Old_Town_Square%2C_COVID.jpg",
      alt: "프라하 구시가지 광장과 틴 성당 첨탑",
      sourceUrl:
        "https://commons.wikimedia.org/wiki/File:Prague,_Old_Town_Square,_COVID.jpg",
    },
    summary:
      '프라하는 "동유럽의 파리"로 불리는 체코의 수도로, 프라하성·카를교·구시가지 광장이 도보로 이어지는 동화 같은 풍경으로 유명합니다. 카를교 위에서는 블타바강과 프라하성을 함께 조망할 수 있어 하루 중 여러 시간대에 걸쳐 방문할 가치가 있고, 구시가지 천문시계탑에서는 정시마다 인형극이 펼쳐집니다. 유럽 내에서도 물가가 비교적 저렴한 편이라 맥주·전통 음식을 부담 없이 즐길 수 있으며, 좁은 골목마다 소규모 갤러리와 기념품점이 자리해 느긋한 도보 여행에 알맞습니다. 근교 소도시 체스키크룸로프와 묶어 2~3일 코스로 여행하는 경우가 많습니다.',
    highlights: [
      "프라하성",
      "카를교",
      "구시가지 광장·천문시계탑",
      "유대인지구",
      "존델 언덕 전망대",
    ],
    bestSeason: "5~6월·9월(온화한 시기)",
    oneDayItinerary: [
      "오전: 프라하성·성비투스대성당",
      "점심: 소지구(말라스트라나) 식당",
      "오후: 카를교·구시가지 광장",
      "저녁: 천문시계탑 인형극·야경",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "프라하성",
        steps: ["프라하성·성비투스대성당", "황금소로", "카를교 야경"],
      },
      {
        day: 2,
        theme: "구시가지",
        steps: ["구시가지 광장·천문시계탑", "유대인지구", "존델 언덕 전망대"],
      },
      {
        day: 3,
        theme: "근교 확장",
        steps: [
          "체스키크룸로프 당일 투어",
          "프라하 복귀",
          "바츨라프하벨공항 이동",
        ],
      },
    ],
    budget:
      "1인 3박 4일 기준 숙박·식비·교통 포함 약 75만~120만 원(항공료 별도).",
    transportation:
      "바츨라프하벨공항에서 공항버스·트램으로 시내 진입, 시내는 트램·지하철로 이동합니다.",
    food: ["꿀레노(족발 요리)", "굴라시", "트르들로", "체코 맥주"],
    etiquette: [
      "성당·프라하성 경내에서는 정숙을 유지합니다.",
      "레스토랑에서는 자릿세가 별도 청구될 수 있음을 확인합니다.",
      "좁은 골목에서는 트램·자전거 통행에 주의합니다.",
    ],
    source: {
      name: "체코관광청(CzechTourism)",
      url: "https://www.czechtourism.com",
      updatedAt: "2026-07-15",
    },
  },
  {
    id: "overseas-cesky-krumlov",
    scope: "overseas",
    name: "체스키크룸로프",
    country: "체코",
    countryCode: "CZ",
    theme: "소도시·고성",
    image: {
      url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Cesky_Krumlov_25.JPG/960px-Cesky_Krumlov_25.JPG",
      alt: "체스키크룸로프 성과 구시가지 전경",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Cesky_Krumlov_25.JPG",
    },
    summary:
      "체스키크룸로프는 블타바강이 S자로 휘감아 도는 지형 위에 세워진 중세 소도시로, 마을 전체가 유네스코 세계문화유산으로 지정될 만큼 원형이 잘 보존돼 있습니다. 체스키크룸로프성의 망토다리와 첨탑에서는 붉은 지붕이 이어지는 구시가지 전경을 한눈에 담을 수 있고, 좁은 골목 사이사이 공방과 카페가 자리해 반나절 도보 여행으로도 충분히 매력을 느낄 수 있습니다. 여름철에는 강에서 래프팅·카누를 즐기는 여행자가 많고, 마을 규모가 작아 프라하에서 당일치기로도 방문할 수 있지만 야경을 보려면 1박을 권장합니다. 관광객이 몰리는 성수기에는 이른 아침 방문이 한적합니다.",
    highlights: [
      "체스키크룸로프성",
      "망토다리",
      "구시가지 광장",
      "블타바강 래프팅",
      "성 비투스 교회",
    ],
    bestSeason: "5~9월(따뜻한 시기, 강 액티비티 가능)",
    oneDayItinerary: [
      "오전: 체스키크룸로프성·망토다리",
      "점심: 구시가지 광장 인근 식당",
      "오후: 블타바강 래프팅 또는 골목 산책",
      "저녁: 성 전망대에서 야경 감상",
    ],
    threeDayItinerary: [
      {
        day: 1,
        theme: "성·구시가지",
        steps: ["체스키크룸로프성", "망토다리", "구시가지 광장"],
      },
      {
        day: 2,
        theme: "강 액티비티",
        steps: ["블타바강 래프팅·카누", "성 비투스 교회", "골목 공방 투어"],
      },
      {
        day: 3,
        theme: "마무리",
        steps: ["전망대 야경 재방문", "프라하 이동", "바츨라프하벨공항 이동"],
      },
    ],
    budget:
      "1인 1박 2일 기준 숙박·식비·투어 포함 약 20만~35만 원(프라하 왕복 교통 별도).",
    transportation:
      "프라하에서 버스로 약 3시간 소요되며, 마을 내부는 도보로 충분히 이동할 수 있습니다.",
    food: ["꿀레노", "체코식 굴라시", "트르들로", "지역 양조 맥주"],
    etiquette: [
      "성당·교회에서는 정숙을 유지합니다.",
      "좁은 골목 주거지에서는 소음을 자제합니다.",
      "래프팅·카누 이용 시 안전 장비 착용 안내를 따릅니다.",
    ],
    source: {
      name: "체코관광청(CzechTourism)",
      url: "https://www.czechtourism.com",
      updatedAt: "2026-07-15",
    },
  },
];
