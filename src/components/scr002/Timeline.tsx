// 여행 타임라인(3개 이상, 연도·장소·요약). SCR-002(`/about`).
// design-reference/D-001/DESIGN.md §16(Timeline 본문 유형), UI_CONTRACT.md
// 2장 기준. REQ-FUNC-060.

import { aboutProfile } from "@/data/about";

export default function Timeline() {
  const entries = [...aboutProfile.timeline].sort((a, b) => a.year - b.year);

  return (
    <section>
      <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
        여행 타임라인
      </h2>
      <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
        free_traveler가 걸어온 주요 여행 기록입니다.
      </p>

      <ol className="mt-6 flex flex-col border-l border-[#E3E2DF]">
        {entries.map((entry) => (
          <li
            key={`${entry.year}-${entry.place}`}
            className="relative pb-6 pl-6 last:pb-0"
          >
            <span
              aria-hidden="true"
              className="absolute top-2 -left-1 h-2 w-2 rounded-full bg-[#FF6A4D]"
            />
            <p className="text-[13px] font-medium text-[#84878D]">
              {entry.year}
            </p>
            <p className="mt-1 text-[17px] font-semibold text-[#26282C]">
              {entry.place}
            </p>
            <p className="mt-1 text-[14px] leading-[1.55] text-[#4B4E54]">
              {entry.summary}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
