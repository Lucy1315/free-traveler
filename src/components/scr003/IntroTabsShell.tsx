// SCR-003 Intro(미리보기 카드 3개) + 3탭 Shell(항공/숙소/동행 글쓰기).
// design-reference/D-001/DESIGN.md §10(Tabs — 밑줄형, 정확히 3탭),
// UI_CONTRACT.md 3장 1·2번 영역 기준. REQ-FUNC-011·019·031.
//
// 각 탭 본문(폼)은 prop으로 받아 PO-SCR-003이 조립한다. UI_CONTRACT 3장
// "탭별 상태 분리(한 탭의 오류가 다른 탭에 영향 없음)"에 따라 세 패널을
// 항상 마운트해 두고 hidden으로만 전환한다 — 탭을 옮겨도 입력값이 유지된다.

"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Tabs from "@/components/ui/Tabs";

export type TravelToolsTabId = "flight" | "hotel" | "mate";

const TABS: { id: TravelToolsTabId; label: string }[] = [
  { id: "flight", label: "항공" },
  { id: "hotel", label: "숙소" },
  { id: "mate", label: "동행 글쓰기" },
];

const PREVIEWS: {
  tabId: TravelToolsTabId;
  title: string;
  description: string;
}[] = [
  {
    tabId: "flight",
    title: "항공 조건 정리",
    description:
      "목적지·출발일·귀국일을 정리한 뒤 항공권 비교 사이트로 이동합니다.",
  },
  {
    tabId: "hotel",
    title: "숙소 조건 정리",
    description:
      "숙박 지역·체크인·체크아웃을 정리한 뒤 숙소 비교 사이트로 이동합니다.",
  },
  {
    tabId: "mate",
    title: "동행 모집글 작성",
    description:
      "여행 일정과 선호 조건을 적어 함께 떠날 동행을 모집합니다(로그인 필요).",
  },
];

export interface IntroTabsShellProps {
  flightPanel: ReactNode;
  hotelPanel: ReactNode;
  matePanel: ReactNode;
  initialTab?: TravelToolsTabId;
}

export default function IntroTabsShell({
  flightPanel,
  hotelPanel,
  matePanel,
  initialTab = "flight",
}: IntroTabsShellProps) {
  const [activeTab, setActiveTab] = useState<TravelToolsTabId>(initialTab);

  const panels: Record<TravelToolsTabId, ReactNode> = {
    flight: flightPanel,
    hotel: hotelPanel,
    mate: matePanel,
  };

  function selectFromPreview(tabId: TravelToolsTabId) {
    setActiveTab(tabId);
    document
      .getElementById("travel-tools-tabs")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex flex-col gap-12 md:gap-20">
      <section>
        <h1 className="text-[32px] font-bold leading-[1.35] text-[#26282C]">
          여행 준비
        </h1>
        <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
          항공·숙소 조건을 한곳에서 정리하고, 동행 모집글까지 작성해 보세요.
          입력한 항공·숙소 조건은 이 브라우저에만 머무르며 서버로 전송되지
          않습니다.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {PREVIEWS.map((preview) => (
            <button
              key={preview.tabId}
              type="button"
              onClick={() => selectFromPreview(preview.tabId)}
              className="rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-5 text-left transition-shadow hover:shadow-[0_1px_2px_rgba(38,40,44,0.06),0_4px_10px_rgba(38,40,44,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            >
              <p className="text-[17px] font-semibold text-[#26282C]">
                {preview.title}
              </p>
              <p className="mt-2 text-[14px] leading-[1.55] text-[#4B4E54]">
                {preview.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section id="travel-tools-tabs" className="scroll-mt-20">
        <Tabs
          ariaLabel="여행 준비 도구"
          tabs={TABS}
          activeTabId={activeTab}
          onChange={(id) => setActiveTab(id as TravelToolsTabId)}
        />
        {TABS.map((tab) => (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            className="pt-8"
          >
            {panels[tab.id]}
          </div>
        ))}
      </section>
    </div>
  );
}
