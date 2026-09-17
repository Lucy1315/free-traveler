// 404 오류 화면. design-reference/D-001/DESIGN.md §14(Error 상태 규칙) 기준.
// 공통 Header/Footer는 src/app/layout.tsx가 감싸므로 이 파일은 본문만 담당한다.
// REQ-FUNC-078: 홈 이동 복구 행동을 제공한다.

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[1280px] flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center md:px-8">
      <h1 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="max-w-md text-[16px] leading-[1.6] text-[#4B4E54]">
        요청하신 주소가 삭제되었거나 잘못 입력되었을 수 있습니다. 메인
        페이지에서 다시 찾아보세요.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold leading-[1.25] text-[#FFFFFF] hover:bg-[#E5502F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
      >
        메인으로 이동
      </Link>
    </div>
  );
}
