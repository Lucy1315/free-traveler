// SCR-001 6번 영역 CTA Banner("여행 준비 시작하기" → SCR-003).
// design-reference/D-001/DESIGN.md §17(SCR-001 6번 영역)·§5(radius-none —
// CTA 배너류 풀폭 밴드)·§2(color-surface-soft — CTA 배너 배경),
// UI_CONTRACT.md 1장(`cta-banner`) 기준.

import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="w-full bg-[#F7F6F4]">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-4 px-4 py-12 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
            마음에 드는 여행지를 찾았나요?
          </h2>
          <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
            항공·숙소 조건을 정리하고 함께 떠날 동행 모집글까지 한 번에 준비해
            보세요.
          </p>
        </div>
        <Link
          href="/travel-tools"
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          여행 준비 시작하기
        </Link>
      </div>
    </section>
  );
}
