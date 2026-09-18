// SCR-001 메인 화면의 인터랙티브 본문(PO-SCR-001 조립 결과).
// design-reference/D-001/DESIGN.md §16(Section 계층)·§17, UI_CONTRACT.md 1장.
// Section 순서는 PO-SCR-001 Functional AC를 따른다(Hero → 국내 → 해외 →
// 테마 Chip → 안전정보 → 최근 동행글) — D-001 §17의 순서(Hero → 테마 Chip
// → 국내/해외 탭)와 다르다(두 문서 사이의 불일치, Task AC를 우선했다).
//
// 카드 클릭 콜백·Drawer 제어 때문에 Client Component다. 라우트 파일
// src/app/page.tsx는 이 컴포넌트를 렌더링하는 Server Component로 두고
// 거기서 metadata(SHARED-SEO-METADATA)를 내보낸다 — Next.js는 Client
// Component의 metadata export를 허용하지 않기 때문에 둘을 나눴다.

"use client";

import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

// 상세 Drawer의 열림 상태는 URL의 destinationId 쿼리로만 관리한다. 그래서
// SCR-002 추천 카드(`/?destinationId=<id>`)로 들어오면 바로 열리고, 메인에서
// 연 상세도 새로고침·공유 후 그대로 복원된다(REQ-FUNC-063·069). 다른 필터
// 쿼리(domesticTheme 등)는 그대로 둔다.
const DESTINATION_PARAM = "destinationId";

function DestinationDrawerFromUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const destinationId = searchParams.get(DESTINATION_PARAM);

  function close() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(DESTINATION_PARAM);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  return (
    <DestinationDetailDrawer
      open={destinationId !== null}
      onClose={close}
      destinationId={destinationId}
    />
  );
}

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();

  // 클릭 시점의 현재 쿼리를 읽는다(useSearchParams를 쓰지 않아 페이지 전체가
  // 클라이언트 렌더링으로 밀려나지 않는다).
  function openDestination(destinationId: string) {
    const params = new URLSearchParams(window.location.search);
    params.set(DESTINATION_PARAM, destinationId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
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

      <Suspense fallback={null}>
        <DestinationDrawerFromUrl />
      </Suspense>
    </>
  );
}
