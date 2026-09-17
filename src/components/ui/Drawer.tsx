// 공통 Drawer/Modal. design-reference/D-001/DESIGN.md §12(Drawer·Modal) 기준.
// Desktop: 우측에서 슬라이드(폭 약 40%). Mobile: 하단에서 전체 폭 바텀시트.
// 배경 스크림, 닫기는 배경 클릭·Esc·닫기 버튼 3가지 모두 지원. 열릴 때 포커스를
// Drawer 내부로 이동시키고, 닫히면 트리거 요소로 포커스를 되돌린다(포커스 트랩).

"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Drawer({
  open,
  onClose,
  title,
  children,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    lastFocusedElementRef.current =
      document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    const firstFocusable = focusable?.[0] ?? panel;
    firstFocusable?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableEls =
        panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusableEls || focusableEls.length === 0) {
        return;
      }

      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      lastFocusedElementRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default"
        style={{ backgroundColor: "rgba(38, 40, 44, 0.5)" }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "drawer-title" : undefined}
        tabIndex={-1}
        className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-[14px] bg-[#FFFFFF] p-6 shadow-[0_1px_2px_rgba(38,40,44,0.06),0_4px_10px_rgba(38,40,44,0.08)] outline-none md:inset-y-0 md:right-0 md:left-auto md:bottom-auto md:h-full md:max-h-none md:w-[40%] md:rounded-t-none md:rounded-l-[14px]"
      >
        <div className="flex items-center justify-between">
          {title ? (
            <h2
              id="drawer-title"
              className="text-[20px] font-semibold text-[#26282C]"
            >
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#26282C] hover:bg-[#F0EFEC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>
        <div className="mt-4 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
