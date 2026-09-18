// 국가별 주의사항 미리보기 카드. SCR-001(`/`). design-reference/D-001/
// DESIGN.md §13(Alert 배지 — color-warning+텍스트 라벨), UI_CONTRACT.md
// 1장 기준. REQ-FUNC-046·050·051, REQ-NF-028(축소: 경고 로직만).
//
// 범위 참고: AC는 "카드 최소 6개"를 요구하지만, 이 Task가 의존하는
// DATA-COUNTRY-SAFETY(src/data/safety.ts)는 현재 4개국만 담고 있다(해당
// Task 완료 시점에 함께 남긴 플래그: 소개된 해외 여행지 국가 수만큼 채워야
// 완전해진다). 이 Task는 safety.ts 데이터를 늘리는 범위가 아니므로,
// 있는 데이터만큼(4개) 렌더링한다 — 카드를 임의로 채우지 않는다.

"use client";

import Badge from "@/components/ui/Badge";
import { countrySafetyList, isSafetyStale } from "@/data/safety";

export interface SafetyPreviewCardsProps {
  onSelectCountry: (country: string) => void;
}

export default function SafetyPreviewCards({
  onSelectCountry,
}: SafetyPreviewCardsProps) {
  return (
    <section>
      <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
        국가별 주의사항
      </h2>
      <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
        여행 전 목적지 국가의 안전정보를 미리 확인하세요.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {countrySafetyList.map((safety) => {
          const hasAlert = safety.alert.level !== "해당없음";
          const stale = isSafetyStale(safety.source.verifiedAt);

          return (
            <button
              key={safety.country}
              type="button"
              onClick={() => onSelectCountry(safety.country)}
              className="rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-4 text-left transition-shadow hover:shadow-[0_1px_2px_rgba(38,40,44,0.06),0_4px_10px_rgba(38,40,44,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            >
              {/* REQ-FUNC-051: 중대 경보는 카드 상단에 텍스트로 표시한다. */}
              {hasAlert && (
                <p className="text-[13px] font-semibold text-[#B8720B]">
                  {safety.alert.level} · {safety.alert.scopeType}
                </p>
              )}
              <p className="mt-1 text-[17px] font-semibold text-[#26282C]">
                {safety.country}
              </p>
              <p className="mt-1 line-clamp-2 text-[14px] text-[#4B4E54]">
                {safety.alert.summary}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {!hasAlert && <Badge variant="neutral">경보 없음</Badge>}
                {stale && <Badge variant="warning">재확인 필요</Badge>}
              </div>
              <p className="mt-2 text-[13px] text-[#84878D]">
                {safety.source.verifiedAt} 확인
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
