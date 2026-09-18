// SCR-004 1번 영역: Intro + "새 모집글 작성" CTA. design-reference/D-001/
// DESIGN.md §16(제목 → 1~3문장 설명 → CTA), UI_CONTRACT.md 4장.
// "새 모집글 작성"은 SCR-003(/travel-tools)의 동행 글쓰기 탭으로 보낸다.

import Link from "next/link";

export default function IntroCta() {
  return (
    <section className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-[32px] font-bold leading-[1.35] text-[#26282C]">
          동행 찾기
        </h1>
        <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
          같은 기간, 같은 여행지로 떠나는 여행자의 모집글을 둘러보세요. 마음에
          드는 글에 참가 요청을 보내거나, 직접 일정을 올려 함께할 동행을 모을 수
          있습니다.
        </p>
      </div>
      <Link
        href="/travel-tools"
        className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
      >
        새 모집글 작성
      </Link>
    </section>
  );
}
