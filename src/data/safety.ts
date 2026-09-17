// SCR-001(`/`) 안전정보 Drawer 정적 데이터.
// design-reference/D-001/DESIGN.md §13(Alert 색상+텍스트 라벨 병기)·§17,
// design-reference/UI_CONTRACT.md 1장(SCR-001) 기준.
// REQ-FUNC-046~053, REQ-NF-027·028.
//
// 범위 메모(REQ-FUNC-046/PROJECT_SCOPE.md): "게시된 모든 해외 국가"는 이 서비스가
// 소개하는 해외 여행지의 국가를 뜻한다(전 세계 국가 전수 아님). 이 파일은
// src/data/about.ts의 해외 추천 여행지(다낭=베트남·오사카=일본·방콕=태국·
// 파리=프랑스)와 국가를 맞췄다. 후속 Task DATA-DESTINATIONS-OVERSEAS가 다른
// 해외 국가를 추가하면, 그 국가의 안전정보를 이 배열에 함께 추가해야 한다.

export type SafetyAlertLevel =
  "여행금지" | "출국권고" | "적색경보" | "황색경보" | "남색경보" | "해당없음";

export type SafetyAlertScopeType = "국가전체" | "지역";

export interface SafetyAlert {
  level: SafetyAlertLevel;
  scopeType: SafetyAlertScopeType;
  scopeText: string;
  summary: string;
}

export type SafetyCategoryId =
  | "security"
  | "commonScams"
  | "localLaws"
  | "traffic"
  | "disasterAndClimate"
  | "health"
  | "cultureAndDress"
  | "emergencyContacts";

export interface SafetyCategory {
  id: SafetyCategoryId;
  title: string;
  items: string[];
}

export interface SafetyEmergencyContact {
  label: string;
  phone: string;
}

export interface SafetySource {
  name: string;
  url: string;
  verifiedAt: string; // ISO 8601 날짜(YYYY-MM-DD)
  editor: string;
}

export interface CountrySafety {
  country: string;
  continent: string;
  alert: SafetyAlert;
  categories: SafetyCategory[]; // 정확히 8개(REQ-FUNC-047)
  emergencyContacts: SafetyEmergencyContact[]; // 현지 긴급전화 + 재외공관/영사콜센터(REQ-FUNC-053)
  mofaUrl: string; // 외교부 해외안전여행 원문 링크(REQ-FUNC-049, 새 탭 + noopener noreferrer는 렌더 단에서 처리)
  source: SafetySource;
}

// REQ-FUNC-050: 최종 확인일(verifiedAt) 기준 7일 초과 시 stale로 판단한다.
// REQ-NF-028(축소): 경고 로직만 제공하며, "7일 이내 95%" 수치 목표는 검증하지 않는다.
export function isSafetyStale(
  verifiedAt: string,
  referenceDate: Date = new Date(),
): boolean {
  const verified = new Date(`${verifiedAt}T00:00:00`);
  const diffMs = referenceDate.getTime() - verified.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > 7;
}

export const countrySafetyList: CountrySafety[] = [
  {
    country: "베트남",
    continent: "아시아",
    alert: {
      level: "해당없음",
      scopeType: "국가전체",
      scopeText: "베트남 전역",
      summary:
        "현재 발령된 국가 단위 경보는 없습니다. 우기(5~10월) 홍수·산사태 지역은 이동 전 확인하세요.",
    },
    categories: [
      {
        id: "security",
        title: "치안",
        items: [
          "대도시 관광지 소매치기·오토바이 날치기가 잦으니 가방은 몸 앞쪽으로 멥니다.",
          "야간 단독 이동보다는 여러 명이 함께 이동하는 것이 안전합니다.",
        ],
      },
      {
        id: "commonScams",
        title: "흔한 사기",
        items: [
          "택시는 미터기 사용 여부를 반드시 확인하고, 공식 브랜드(비나선·마이린) 위주로 이용합니다.",
          "환전은 은행·지정 환전소에서만 하고 길거리 환전은 피합니다.",
        ],
      },
      {
        id: "localLaws",
        title: "현지 법규",
        items: [
          "오토바이 탑승 시 헬멧 착용이 의무이며 미착용 시 벌금이 부과됩니다.",
          "마약류 소지·유통은 사형을 포함한 중형 처벌 대상입니다.",
        ],
      },
      {
        id: "traffic",
        title: "교통",
        items: [
          "오토바이 행렬이 많아 무단횡단·급차선 변경 차량에 주의해야 합니다.",
          "국제운전면허증만으로는 오토바이 렌트가 제한될 수 있어 사전에 확인합니다.",
        ],
      },
      {
        id: "disasterAndClimate",
        title: "재난·기후",
        items: [
          "5~10월 우기에는 중부·북부 지역 홍수·산사태 위험이 있습니다.",
          "태풍 시즌(7~11월)에는 해안 지역 일정을 유연하게 조정합니다.",
        ],
      },
      {
        id: "health",
        title: "보건",
        items: [
          "수돗물 대신 생수를 마시고, 노점 음식은 조리 상태를 확인합니다.",
          "뎅기열 예방을 위해 모기 기피제를 준비합니다.",
        ],
      },
      {
        id: "cultureAndDress",
        title: "문화·복장",
        items: [
          "사원 방문 시 어깨와 무릎을 가리는 복장을 갖춥니다.",
          "머리를 만지는 행동은 무례하게 여겨질 수 있어 주의합니다.",
        ],
      },
      {
        id: "emergencyContacts",
        title: "긴급연락처",
        items: [
          "경찰 113 · 구급 115 · 화재 114",
          "주베트남 대한민국 대사관(하노이) +84-24-3771-0404",
        ],
      },
    ],
    emergencyContacts: [
      { label: "현지 경찰", phone: "113" },
      { label: "현지 구급", phone: "115" },
      { label: "현지 화재", phone: "114" },
      { label: "주베트남 대한민국 대사관(하노이)", phone: "+84-24-3771-0404" },
      { label: "영사콜센터(24시간 collect call)", phone: "+82-2-3210-0404" },
    ],
    mofaUrl: "https://www.0404.go.kr/dev/country_view.mofa?idx=13",
    source: {
      name: "외교부 해외안전여행",
      url: "https://www.0404.go.kr/dev/country_view.mofa?idx=13",
      verifiedAt: "2026-09-10",
      editor: "free_traveler",
    },
  },
  {
    country: "일본",
    continent: "아시아",
    alert: {
      level: "해당없음",
      scopeType: "국가전체",
      scopeText: "일본 전역",
      summary:
        "현재 발령된 국가 단위 경보는 없습니다. 태풍·지진 등 자연재해 정보는 기상청 안내를 참고하세요.",
    },
    categories: [
      {
        id: "security",
        title: "치안",
        items: [
          "치안이 전반적으로 양호하나, 번화가 심야 시간대 소매치기에 주의합니다.",
          "지진·해일 발생 시 대피 안내 방송에 따라 행동합니다.",
        ],
      },
      {
        id: "commonScams",
        title: "흔한 사기",
        items: [
          "번화가 호객 업소(보드카라·걸즈바)의 과다 요금 청구 사례가 있어 주의합니다.",
        ],
      },
      {
        id: "localLaws",
        title: "현지 법규",
        items: [
          "보행 중 흡연이 조례로 금지된 구역이 많아 지정 흡연구역만 이용합니다.",
          "대중교통 내 통화는 매너 위반으로 간주됩니다.",
        ],
      },
      {
        id: "traffic",
        title: "교통",
        items: [
          "좌측통행 차량 시스템이라 도로 횡단 시 방향에 주의합니다.",
          "지하철 막차 시간이 자정 전후로 빠른 편이라 미리 확인합니다.",
        ],
      },
      {
        id: "disasterAndClimate",
        title: "재난·기후",
        items: [
          "태풍 시즌(8~10월)에는 항공·철도 지연이 잦으니 일정에 여유를 둡니다.",
          "지진 발생 빈도가 높아 숙소의 비상 대피 경로를 미리 확인합니다.",
        ],
      },
      {
        id: "health",
        title: "보건",
        items: [
          "의료 수준은 높으나 여행자 보험 미가입 시 진료비가 고액일 수 있습니다.",
        ],
      },
      {
        id: "cultureAndDress",
        title: "문화·복장",
        items: [
          "온천 이용 시 문신 노출을 제한하는 시설이 있어 사전에 확인합니다.",
          "신발을 벗고 들어가는 실내 공간이 많아 양말 상태에 신경 씁니다.",
        ],
      },
      {
        id: "emergencyContacts",
        title: "긴급연락처",
        items: [
          "경찰 110 · 구급/화재 119",
          "주오사카 대한민국 총영사관 +81-6-4256-2345",
        ],
      },
    ],
    emergencyContacts: [
      { label: "현지 경찰", phone: "110" },
      { label: "현지 구급/화재", phone: "119" },
      { label: "주오사카 대한민국 총영사관", phone: "+81-6-4256-2345" },
      { label: "영사콜센터(24시간 collect call)", phone: "+82-2-3210-0404" },
    ],
    mofaUrl: "https://www.0404.go.kr/dev/country_view.mofa?idx=2",
    source: {
      name: "외교부 해외안전여행",
      url: "https://www.0404.go.kr/dev/country_view.mofa?idx=2",
      verifiedAt: "2026-09-10",
      editor: "free_traveler",
    },
  },
  {
    country: "태국",
    continent: "아시아",
    alert: {
      level: "황색경보",
      scopeType: "지역",
      scopeText: "얄라·빠따니·나라티왓·송클라 일부 지역(남부 국경 지역)",
      summary:
        "남부 국경 4개 주는 여행자제(황색경보) 지역입니다. 방콕·치앙마이·푸켓 등 주요 관광지는 해당하지 않습니다.",
    },
    categories: [
      {
        id: "security",
        title: "치안",
        items: [
          "방콕 등 주요 도시는 치안이 양호하나 관광지 소매치기에 주의합니다.",
          "남부 국경 지역은 불안정한 정세로 여행자제 대상입니다.",
        ],
      },
      {
        id: "commonScams",
        title: "흔한 사기",
        items: [
          "관광지 인근 '오늘만 영업' 보석상 호객은 대부분 사기이므로 응하지 않습니다.",
          "툭툭 기사와는 탑승 전 요금을 반드시 협상·확인합니다.",
        ],
      },
      {
        id: "localLaws",
        title: "현지 법규",
        items: [
          "왕실 모독죄가 엄격히 적용되니 관련 발언·행동을 삼갑니다.",
          "전자담배 소지·사용이 불법이라 처벌 대상입니다.",
        ],
      },
      {
        id: "traffic",
        title: "교통",
        items: [
          "오토바이 렌트 시 국제운전면허증과 헬멧 착용이 필수입니다.",
          "우기(6~10월)에는 방콕 시내 상습 침수 구간이 있어 이동 경로를 확인합니다.",
        ],
      },
      {
        id: "disasterAndClimate",
        title: "재난·기후",
        items: [
          "남부 해안 지역은 우기철 폭우·해상 사고에 주의합니다.",
          "폭염 특보 시 야외 일정은 오전·오후 늦게로 분산합니다.",
        ],
      },
      {
        id: "health",
        title: "보건",
        items: [
          "길거리 음식 위생 상태가 다양하므로 위생 상태를 확인 후 섭취합니다.",
          "뎅기열·모기 매개 감염병 예방을 위해 기피제를 준비합니다.",
        ],
      },
      {
        id: "cultureAndDress",
        title: "문화·복장",
        items: [
          "사원 방문 시 어깨·무릎을 가리는 복장이 필요합니다.",
          "머리를 쓰다듬거나 발로 물건을 가리키는 행동은 실례로 여겨집니다.",
        ],
      },
      {
        id: "emergencyContacts",
        title: "긴급연락처",
        items: [
          "관광경찰 1155 · 구급/화재 1669",
          "주태국 대한민국 대사관(방콕) +66-2-247-7537",
        ],
      },
    ],
    emergencyContacts: [
      { label: "관광경찰", phone: "1155" },
      { label: "현지 구급/화재", phone: "1669" },
      { label: "주태국 대한민국 대사관(방콕)", phone: "+66-2-247-7537" },
      { label: "영사콜센터(24시간 collect call)", phone: "+82-2-3210-0404" },
    ],
    mofaUrl: "https://www.0404.go.kr/dev/country_view.mofa?idx=14",
    source: {
      name: "외교부 해외안전여행",
      url: "https://www.0404.go.kr/dev/country_view.mofa?idx=14",
      verifiedAt: "2026-09-08",
      editor: "free_traveler",
    },
  },
  {
    country: "프랑스",
    continent: "유럽",
    alert: {
      level: "해당없음",
      scopeType: "국가전체",
      scopeText: "프랑스 전역",
      summary:
        "현재 발령된 국가 단위 경보는 없습니다. 대규모 집회·시위 지역은 사전 뉴스 확인을 권장합니다.",
    },
    categories: [
      {
        id: "security",
        title: "치안",
        items: [
          "관광지·대중교통에서 소매치기·가방 날치기 사례가 잦아 소지품에 주의합니다.",
          "대규모 집회·시위가 예고된 지역은 우회 이동을 권장합니다.",
        ],
      },
      {
        id: "commonScams",
        title: "흔한 사기",
        items: [
          "'서명 청원' 접근 후 소지품을 노리는 수법이 있어 낯선 접근에 주의합니다.",
          "지하철 자동발매기 주변 '도와주겠다'며 접근하는 사람은 경계합니다.",
        ],
      },
      {
        id: "localLaws",
        title: "현지 법규",
        items: [
          "대중교통 무임승차 적발 시 즉시 고액 벌금이 부과됩니다.",
          "공공장소 음주는 일부 구역에서 제한됩니다.",
        ],
      },
      {
        id: "traffic",
        title: "교통",
        items: [
          "지하철 파업이 잦은 편이라 이동 전 운행 현황을 확인합니다.",
          "자전거 전용도로가 많아 보행 중 자전거 통행에 주의합니다.",
        ],
      },
      {
        id: "disasterAndClimate",
        title: "재난·기후",
        items: [
          "여름철 폭염 특보 시 냉방이 없는 숙소가 많아 사전 확인이 필요합니다.",
          "겨울철 알프스 인근은 폭설로 교통이 통제될 수 있습니다.",
        ],
      },
      {
        id: "health",
        title: "보건",
        items: [
          "의료 수준은 높으나 응급실 대기 시간이 길 수 있어 여행자 보험을 권장합니다.",
        ],
      },
      {
        id: "cultureAndDress",
        title: "문화·복장",
        items: [
          "성당·교회 방문 시 노출이 적은 복장을 권장합니다.",
          "레스토랑에서는 팁 문화보다 서비스료 포함 여부를 확인하는 것이 일반적입니다.",
        ],
      },
      {
        id: "emergencyContacts",
        title: "긴급연락처",
        items: [
          "경찰 17 · 구급 15 · 화재 18 · 통합 긴급번호 112",
          "주프랑스 대한민국 대사관(파리) +33-1-4753-6996",
        ],
      },
    ],
    emergencyContacts: [
      { label: "현지 경찰", phone: "17" },
      { label: "현지 구급", phone: "15" },
      { label: "현지 화재", phone: "18" },
      { label: "통합 긴급번호", phone: "112" },
      { label: "주프랑스 대한민국 대사관(파리)", phone: "+33-1-4753-6996" },
      { label: "영사콜센터(24시간 collect call)", phone: "+82-2-3210-0404" },
    ],
    mofaUrl: "https://www.0404.go.kr/dev/country_view.mofa?idx=33",
    source: {
      name: "외교부 해외안전여행",
      url: "https://www.0404.go.kr/dev/country_view.mofa?idx=33",
      verifiedAt: "2026-09-05",
      editor: "free_traveler",
    },
  },
];
