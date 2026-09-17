// 공통 Tabs(밑줄형). design-reference/D-001/DESIGN.md §10(Tabs) 기준.
// 활성 탭: color-coral-500 밑줄 2px + color-ink 텍스트. 비활성: color-muted.
// role="tablist"/"tab"/"tabpanel" ARIA 패턴 + 좌우 화살표 키보드 이동(REQ-FUNC-079).

"use client";

import { useRef } from "react";

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTabId: string;
  onChange: (id: string) => void;
  /** 스크린리더용 tablist 라벨(예: "여행 준비 탭"). */
  ariaLabel: string;
}

export default function Tabs({
  tabs,
  activeTabId,
  onChange,
  ariaLabel,
}: TabsProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function focusAndActivate(index: number) {
    const target = tabs[(index + tabs.length) % tabs.length];
    onChange(target.id);
    tabRefs.current[(index + tabs.length) % tabs.length]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusAndActivate(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusAndActivate(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusAndActivate(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusAndActivate(tabs.length - 1);
    }
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex items-center gap-6 overflow-x-auto border-b border-[#E3E2DF]"
    >
      {tabs.map((tab, index) => {
        const active = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`min-h-[44px] whitespace-nowrap border-b-2 px-1 text-[17px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
              active
                ? "border-[#FF6A4D] text-[#26282C]"
                : "border-transparent text-[#84878D] hover:text-[#26282C]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
