// SCR-001 메인 Page Owner. design-reference/D-001/DESIGN.md §16(Section
// 계층)·§17(SCR-001 Section 순서), UI_CONTRACT.md 1장 기준.
// Section 순서는 이 Task 문서의 Functional AC를 그대로 따른다(Hero → 국내
// → 해외 → 테마 Chip → 안전정보 → 최근 동행글) — D-001 §17이 적어 둔
// 순서(Hero → 테마 Chip → 국내/해외 탭)와 다르다는 점을 알아 두어야 한다
// (두 문서 사이의 불일치, Task AC를 우선했다).
//
// 이 파일은 Depends On의 CMP-* 산출물을 조립만 한다(새 Component 파일을
// 만들지 않는다). Drawer를 여러 Section이 함께 열어야 해서 이 페이지 자체가
// Client Component(useState)여야 한다 — 그 결과 `export const metadata`를
// 이 파일에 둘 수 없다(Next.js는 Client Component의 metadata export를
// 허용하지 않는다). SHARED-SEO-METADATA 연동은 아직 못 했다 — layout.tsx나
// 별도 Server Component 래퍼가 필요한데 layout.tsx는 이 Task Expected Files
// 밖이고, 별도 래퍼 파일은 Forbidden 절(새 Component 파일 금지)에 걸린다.
// 이 부분은 사람이 별도로 결정해야 한다.

"use client";

import { Suspense, useState } from "react";
import Hero from "@/components/scr001/Hero";
import DomesticDestinationGrid from "@/components/scr001/DomesticDestinationGrid";
import OverseasDestinationGrid from "@/components/scr001/OverseasDestinationGrid";
import ThemeChips from "@/components/scr001/ThemeChips";
import SafetyPreviewCards from "@/components/scr001/SafetyPreviewCards";
import RecentMateCards from "@/components/scr001/RecentMateCards";
import DestinationDetailDrawer from "@/components/scr001/DestinationDetailDrawer";
import { overseasDestinations } from "@/data/destinations.overseas";

function GridFallback() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className="h-56 animate-pulse rounded-[14px] bg-[#F0EFEC]"
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [selectedDestinationId, setSelectedDestinationId] = useState<
    string | null
  >(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  function openDestination(destinationId: string) {
    setSelectedDestinationId(destinationId);
    setDrawerOpen(true);
  }

  // SafetyPreviewCards는 국가명만 넘긴다(REQ-FUNC-046 관련 Task 참고) — 여기서
  // 매칭되는 해외 여행지 id로 변환해 같은 Drawer를 연다.
  function handleSelectCountry(country: string) {
    const matchingDestination = overseasDestinations.find(
      (destination) => destination.country === country,
    );
    if (matchingDestination) {
      openDestination(matchingDestination.id);
    }
  }

  return (
    <>
      {/* useSearchParams를 쓰는 Client Component는 Suspense로 감싸야 한다
          (Next.js App Router 요구사항). */}
      <Suspense fallback={<div className="min-h-[55vh]" />}>
        <Hero onSearchSelectDestination={openDestination} />
      </Suspense>

      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4 py-12 md:gap-20 md:px-8 md:py-20">
        <div id="domestic-destinations">
          <Suspense fallback={<GridFallback />}>
            <DomesticDestinationGrid onSelectDestination={openDestination} />
          </Suspense>
        </div>

        <div id="overseas-destinations">
          <Suspense fallback={<GridFallback />}>
            <OverseasDestinationGrid onSelectDestination={openDestination} />
          </Suspense>
        </div>

        <Suspense fallback={null}>
          <ThemeChips />
        </Suspense>

        <SafetyPreviewCards onSelectCountry={handleSelectCountry} />

        <RecentMateCards />
      </div>

      <DestinationDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        destinationId={selectedDestinationId}
      />
    </>
  );
}
