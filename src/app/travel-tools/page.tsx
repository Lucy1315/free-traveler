// SCR-003 통합 여행 준비 Page Owner(`/travel-tools`).
// design-reference/D-001/DESIGN.md §10·§16·§17(SCR-003), UI_CONTRACT.md 3장.
// REQ-FUNC-011~032·054·080, REQ-NF-017.
//
// Depends On의 CMP-SCR003-* 산출물을 조립한다(새 Component 파일 없음):
// Intro(미리보기 3) → 3탭(항공·숙소·동행 글쓰기, 각 탭에 입력→검증→요약·
// 비전달 고지·외부 이동, 또는 로그인 안내/동행 폼) → 찾기 Tip 3 → 안전 CTA.
// 동행 글쓰기는 UI_CONTRACT 3장 상태 규칙과 E2E-005·006에 맞춰 세 번째 탭
// 안에 둔다. 탭 패널은 IntroTabsShell이 항상 마운트해 탭별 상태가 분리된다.
//
// 항공·숙소 입력값은 각 폼의 클라이언트 메모리에만 있다 — 이 페이지는
// 서버에서 외부 URL 설정과 여행지 목록만 읽는다(CLAUDE.md 규칙 12).

import IntroTabsShell from "@/components/scr003/IntroTabsShell";
import FlightForm, {
  type LocationOption,
} from "@/components/scr003/FlightForm";
import HotelForm from "@/components/scr003/HotelForm";
import MateWriteForm from "@/components/scr003/MateWriteForm";
import { FindTips, SafetyCtaBanner } from "@/components/scr003/TipsSafetyCta";
import { domesticDestinations } from "@/data/destinations.domestic";
import { overseasDestinations } from "@/data/destinations.overseas";
import { createPublicSupabaseClient } from "@/lib/db/client";
import { listExternalUrlSettings } from "@/lib/db/queries";
import { buildPageMetadata, buildWebPageJsonLd } from "@/lib/seo";

// 관리자 외부 URL 설정 변경이 5분 안에 반영되도록 주기적으로 재생성한다.
export const revalidate = 300;

const TITLE = "여행 준비";
const DESCRIPTION =
  "항공·숙소 조건을 정리해 비교 사이트로 이동하고, 동행 모집글을 작성하세요. 입력한 항공·숙소 조건은 서버로 전송되지 않습니다.";

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/travel-tools",
});

const jsonLd = buildWebPageJsonLd({
  title: TITLE,
  description: DESCRIPTION,
  path: "/travel-tools",
});

// REQ-FUNC-018·026의 허용목록. 관리자가 이 밖의 도메인을 설정하면 폼이 이동을
// 막고 오류를 보인다.
const EXTERNAL_ALLOWLIST = [
  "skyscanner.co.kr",
  "skyscanner.net",
  "kayak.co.kr",
  "google.com",
  "trip.com",
  "agoda.com",
  "booking.com",
  "hotels.com",
];

// 관리자 설정이 아직 없을 때(0001~0003 마이그레이션 미적용·미설정) 쓰는 일반
// URL. 목적지·날짜 쿼리 없이 사이트 첫 화면만 연다(D-001 §19).
const DEFAULT_FLIGHT_URL = "https://www.skyscanner.co.kr/";
const DEFAULT_HOTEL_URL = "https://www.agoda.com/ko-kr/";

// REQ-FUNC-012·020: 폼이 "선택 국가에 속한 지역·도시"만 고르게 하는 목록.
// 발행된 여행지 데이터에서 만든다(국내는 대한민국 아래 여행지 이름).
function buildLocations(): LocationOption[] {
  const overseasByCountry = new Map<string, string[]>();
  for (const destination of overseasDestinations) {
    const regions = overseasByCountry.get(destination.country) ?? [];
    regions.push(destination.name);
    overseasByCountry.set(destination.country, regions);
  }
  return [
    {
      country: "대한민국",
      regions: domesticDestinations.map((destination) => destination.name),
    },
    ...Array.from(overseasByCountry, ([country, regions]) => ({
      country,
      regions,
    })),
  ];
}

async function loadExternalUrls(): Promise<{
  flight: string;
  hotel: string;
}> {
  try {
    const { data, error } = await listExternalUrlSettings(
      createPublicSupabaseClient(),
    );
    if (error || !data) {
      return { flight: DEFAULT_FLIGHT_URL, hotel: DEFAULT_HOTEL_URL };
    }
    return {
      flight:
        data.find((row) => row.category === "flight")?.url ??
        DEFAULT_FLIGHT_URL,
      hotel:
        data.find((row) => row.category === "hotel")?.url ?? DEFAULT_HOTEL_URL,
    };
  } catch {
    return { flight: DEFAULT_FLIGHT_URL, hotel: DEFAULT_HOTEL_URL };
  }
}

export default async function TravelToolsPage() {
  const locations = buildLocations();
  const urls = await loadExternalUrls();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-4 py-12 md:gap-20 md:px-8 md:py-20">
        <IntroTabsShell
          flightPanel={
            <FlightForm
              locations={locations}
              externalUrl={urls.flight}
              allowlist={EXTERNAL_ALLOWLIST}
            />
          }
          hotelPanel={
            <HotelForm
              locations={locations}
              externalUrl={urls.hotel}
              allowlist={EXTERNAL_ALLOWLIST}
            />
          }
          matePanel={<MateWriteForm locations={locations} />}
        />
        <FindTips />
      </div>
      <SafetyCtaBanner />
    </>
  );
}
