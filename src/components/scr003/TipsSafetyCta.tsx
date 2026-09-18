// SCR-003 4번 영역(찾기 Tip 카드 정확히 3개) + 6번 영역(안전 안내 CTA
// Banner "동행 찾기로 이동"). design-reference/D-001/DESIGN.md §16·§5(CTA
// 배너 radius-none 풀폭 밴드)·§2(color-surface-soft), UI_CONTRACT.md 3장 기준.
// REQ-FUNC-054: 안전정보가 공식 판단을 대체하지 않으며 출국 직전 원문
// 재확인이 필요하다는 고지를 배너에 고정 표시한다.
//
// 두 영역 사이에 동행 글쓰기 영역이 오므로 각각 export하고, PO-SCR-003이
// 순서대로 배치한다(배너는 화면 폭 전체로 둔다).

import Link from "next/link";

const TIPS = [
  {
    title: "여러 사이트에서 비교하기",
    description:
      "같은 조건이라도 사이트마다 일정과 조건이 다를 수 있습니다. 정리한 조건으로 두 곳 이상을 비교해 보세요.",
  },
  {
    title: "변경·환불 규정 먼저 확인하기",
    description:
      "항공권과 숙소 모두 변경·취소 조건이 다릅니다. 결제 전에 규정과 수수료를 꼭 확인하세요.",
  },
  {
    title: "숙소 위치와 이동 동선 살피기",
    description:
      "공항·역과의 거리, 밤늦은 귀가 동선을 지도로 확인하면 현지에서의 이동이 훨씬 수월합니다.",
  },
] as const;

export function FindTips() {
  return (
    <section>
      <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
        찾기 전에 알아 두면 좋은 팁
      </h2>
      <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
        외부 사이트로 이동하기 전에 한 번 더 확인해 보세요.
      </p>
      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {TIPS.map((tip, index) => (
          <li
            key={tip.title}
            className="rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-5"
          >
            <p className="text-[13px] font-medium text-[#84878D]">
              Tip {index + 1}
            </p>
            <p className="mt-1 text-[17px] font-semibold text-[#26282C]">
              {tip.title}
            </p>
            <p className="mt-2 text-[14px] leading-[1.55] text-[#4B4E54]">
              {tip.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SafetyCtaBanner() {
  return (
    <section className="w-full bg-[#F7F6F4]">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-4 px-4 py-12 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
            함께 떠날 동행을 찾아보세요
          </h2>
          <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
            동행을 만나기 전에 안전수칙을 확인하고, 처음 만남은 공개된 장소에서
            가지세요.
          </p>
          {/* REQ-FUNC-054 */}
          <p className="mt-2 max-w-2xl text-[14px] leading-[1.55] text-[#4B4E54]">
            여행지 안전정보는 공식 판단을 대체하지 않습니다. 출국 직전 외교부
            해외안전여행에서 원문을 다시 확인하세요.
          </p>
        </div>
        <Link
          href="/mates"
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          동행 찾기로 이동
        </Link>
      </div>
    </section>
  );
}

export default function TipsSafetyCta() {
  return (
    <>
      <FindTips />
      <SafetyCtaBanner />
    </>
  );
}
