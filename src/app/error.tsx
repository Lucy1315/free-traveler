// 500·런타임 오류 화면. design-reference/D-001/DESIGN.md §14(Error 상태 규칙) 기준.
// 공통 Header/Footer는 src/app/layout.tsx가 감싸므로 이 파일은 본문만 담당한다.
// REQ-FUNC-078: 재시도·홈 이동 복구 행동을 제공한다. Next.js App Router 규약상
// error.tsx는 반드시 Client Component여야 한다.

"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-[1280px] flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center md:px-8">
      <h1 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
        일시적인 오류가 발생했습니다
      </h1>
      <p className="max-w-md text-[16px] leading-[1.6] text-[#4B4E54]">
        요청을 처리하는 중 문제가 생겼습니다. 다시 시도하거나 메인 페이지로
        이동해 주세요.
      </p>
      <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
        <Button variant="primary" onClick={reset}>
          다시 시도
        </Button>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-[8px] border border-[#C7C5C0] bg-[#FFFFFF] px-5 text-[16px] font-semibold leading-[1.25] text-[#26282C] hover:bg-[#F7F6F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          메인으로 이동
        </Link>
      </div>
    </div>
  );
}
