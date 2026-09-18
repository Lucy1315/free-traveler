// 메인 Hero + 통합 검색. SCR-001(`/`). design-reference/D-001/DESIGN.md
// §15(Hero 규칙, 뷰포트 55~65%)·§8(search-bar-pill), §17(Hero 축소형 —
// 헤드라인+통합 검색창+국내/해외 진입 버튼), UI_CONTRACT.md 1장 기준.
// REQ-FUNC-003·067. docs/PROJECT_SCOPE.md 근거: "클라이언트 부분 일치
// 검색", "결과 유형 라벨 표시" — 실제 검색 결과 드롭다운을 이 컴포넌트
// 안에서 구현한다(별도 검색 결과 화면이 SCREEN_ROUTE_CONTRACT에 없으므로).
//
// Page Owner 연동 참고: 국내/해외 진입 버튼은 `#domestic-destinations`·
// `#overseas-destinations` 앵커로 스크롤한다 — PO-SCR-001이 각 그리드
// Section을 조립할 때 해당 id를 부여해야 한다(이 Task Expected Files 밖).

"use client";

import { useMemo, useState } from "react";
import { domesticDestinations } from "@/data/destinations.domestic";
import { overseasDestinations } from "@/data/destinations.overseas";
import { countrySafetyList } from "@/data/safety";

interface SearchResult {
  type: "destination" | "safety";
  destinationId: string;
  label: string;
  sublabel: string;
}

function buildSearchIndex(): SearchResult[] {
  const destinationResults: SearchResult[] = [
    ...domesticDestinations.map((d) => ({
      type: "destination" as const,
      destinationId: d.id,
      label: d.name,
      sublabel: `${d.region} · ${d.theme}`,
      matchText: `${d.name} ${d.region} ${d.theme}`,
    })),
    ...overseasDestinations.map((d) => ({
      type: "destination" as const,
      destinationId: d.id,
      label: d.name,
      sublabel: `${d.country} · ${d.theme}`,
      matchText: `${d.name} ${d.country} ${d.theme}`,
    })),
  ];

  const safetyResults: SearchResult[] = countrySafetyList
    .map((safety) => {
      const matchingDestination = overseasDestinations.find(
        (d) => d.country === safety.country,
      );
      if (!matchingDestination) {
        return null;
      }
      return {
        type: "safety" as const,
        destinationId: matchingDestination.id,
        label: `${safety.country} 안전정보`,
        sublabel: safety.alert.summary,
        matchText: `${safety.country} 안전정보 ${safety.categories.map((c) => c.title).join(" ")}`,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return [...destinationResults, ...safetyResults];
}

export interface HeroProps {
  onSearchSelectDestination: (destinationId: string) => void;
}

export default function Hero({ onSearchSelectDestination }: HeroProps) {
  const [query, setQuery] = useState("");
  const searchIndex = useMemo(() => buildSearchIndex(), []);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }
    return searchIndex
      .filter((item) =>
        `${item.label} ${item.sublabel}`
          .toLowerCase()
          .includes(trimmed.toLowerCase()),
      )
      .slice(0, 8);
  }, [query, searchIndex]);

  function handleSelectResult(result: SearchResult) {
    onSearchSelectDestination(result.destinationId);
    setQuery("");
  }

  return (
    <section className="flex min-h-[55vh] max-h-[65vh] flex-col items-center justify-center gap-6 bg-[#F7F6F4] px-4 py-12 text-center">
      <h1 className="max-w-2xl text-[32px] font-bold leading-[1.35] text-[#26282C]">
        여행 준비, 한 곳에서 가볍게 시작하세요
      </h1>
      <p className="max-w-xl text-[16px] leading-[1.6] text-[#4B4E54]">
        여행지와 국가 안전정보를 함께 검색하고, 항공·숙소 조건을 정리한 뒤
        동행을 찾아보세요.
      </p>

      <div className="relative w-full max-w-xl">
        <label htmlFor="hero-search" className="sr-only">
          여행지·국가·테마·안전정보 검색
        </label>
        <input
          id="hero-search"
          type="search"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="hero-search-results"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="여행지, 국가, 테마, 안전정보로 검색"
          className="h-14 w-full rounded-full border border-[#E3E2DF] bg-[#FFFFFF] px-6 text-[16px] text-[#26282C] focus:border-2 focus:border-[#26282C] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1D4ED8]"
        />

        {results.length > 0 && (
          <ul
            id="hero-search-results"
            role="listbox"
            className="absolute inset-x-0 top-full z-10 mt-2 max-h-80 overflow-y-auto rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-2 text-left shadow-[0_1px_2px_rgba(38,40,44,0.06),0_4px_10px_rgba(38,40,44,0.08)]"
          >
            {results.map((result) => (
              <li
                key={`${result.type}-${result.destinationId}-${result.label}`}
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => handleSelectResult(result)}
                  className="flex w-full flex-col rounded-[8px] px-3 py-2 text-left hover:bg-[#F7F6F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                >
                  <span className="flex items-center gap-2">
                    <span className="rounded-full bg-[#F0EFEC] px-2 py-0.5 text-[13px] font-medium text-[#26282C]">
                      {result.type === "destination" ? "여행지" : "안전정보"}
                    </span>
                    <span className="text-[16px] font-semibold text-[#26282C]">
                      {result.label}
                    </span>
                  </span>
                  <span className="mt-1 truncate text-[14px] text-[#84878D]">
                    {result.sublabel}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query.trim() && results.length === 0 && (
          <p className="absolute inset-x-0 top-full mt-2 rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-3 text-[14px] text-[#84878D] shadow-[0_1px_2px_rgba(38,40,44,0.06),0_4px_10px_rgba(38,40,44,0.08)]">
            검색어와 일치하는 여행지·안전정보가 없습니다. 다른 키워드로 다시
            검색해 보세요.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href="#domestic-destinations"
          className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F]"
        >
          국내 여행지 보기
        </a>
        <a
          href="#overseas-destinations"
          className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-[8px] border border-[#C7C5C0] bg-[#FFFFFF] px-5 text-[16px] font-semibold text-[#26282C] hover:bg-[#F7F6F4]"
        >
          해외 여행지 보기
        </a>
      </div>
    </section>
  );
}
