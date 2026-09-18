// SCR-001 7번 영역 3단계 안내(정확히 3단계).
// design-reference/D-001/DESIGN.md §17(SCR-001 7번 영역), UI_CONTRACT.md
// 1장("여행지 탐색 → 조건 정리·동행 찾기 → 연결", `three-step-guide`) 기준.

import Link from "next/link";

const STEPS = [
  {
    step: 1,
    title: "여행지 탐색",
    description:
      "국내·해외 여행지와 국가별 안전정보를 살펴보고 가고 싶은 곳을 고릅니다.",
    linkLabel: "여행지 둘러보기",
    href: "/#domestic-destinations",
  },
  {
    step: 2,
    title: "조건 정리·동행 찾기",
    description:
      "여행 도구에서 항공·숙소 조건을 정리하고, 필요하면 동행 모집글을 작성합니다.",
    linkLabel: "여행 도구 열기",
    href: "/travel-tools",
  },
  {
    step: 3,
    title: "연결",
    description:
      "정리한 조건으로 외부 사이트에서 예약을 알아보고, 동행 찾기에서 함께 떠날 사람과 연결됩니다.",
    linkLabel: "동행 찾기",
    href: "/mates",
  },
] as const;

export default function ThreeStepGuide() {
  return (
    <section>
      <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
        이렇게 준비하세요
      </h2>
      <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
        세 단계면 여행 준비가 끝납니다.
      </p>
      <ol className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {STEPS.map((item) => (
          <li
            key={item.step}
            className="flex flex-col rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-5"
          >
            <p className="text-[13px] font-medium text-[#84878D]">
              {item.step}단계
            </p>
            <p className="mt-1 text-[17px] font-semibold text-[#26282C]">
              {item.title}
            </p>
            <p className="mt-2 flex-1 text-[14px] leading-[1.55] text-[#4B4E54]">
              {item.description}
            </p>
            <Link
              href={item.href}
              className="mt-4 inline-flex min-h-[44px] items-center text-[14px] font-semibold text-[#26282C] underline"
            >
              {item.linkLabel}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
