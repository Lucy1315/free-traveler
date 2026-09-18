// 대표 추천 여행지 카드 6개. SCR-002(`/about`). design-reference/D-001/
// DESIGN.md §9(Destination Card), UI_CONTRACT.md 2장 기준. REQ-FUNC-063.
//
// "비공개 여행지 자동 제외": 여행지 데이터에는 공개 여부 필드가 없고,
// src/data/destinations.*.ts에 들어 있는 항목이 곧 발행된(공개) 여행지다.
// 그래서 aboutProfile.recommendedDestinations 중 발행 데이터에서 찾을 수
// 없는 id는 비공개로 보고 제외한다.
//
// 연결 대상: UI_CONTRACT 2장 "추천 여행지 카드 → SCR-001(해당 여행지 상세
// Drawer)". `/?destinationId=<id>`로 연결한다 — 단, 현재 SCR-001
// (src/app/page.tsx, PO-SCR-001)은 이 쿼리로 Drawer를 자동으로 열지 않아
// 지금은 메인 페이지로만 이동한다. 자동 열기는 PO-SCR-001 쪽 보완이 필요하다.

import Link from "next/link";
import { aboutProfile } from "@/data/about";
import { domesticDestinations } from "@/data/destinations.domestic";
import { overseasDestinations } from "@/data/destinations.overseas";

const PUBLISHED_IDS = new Set([
  ...domesticDestinations.map((d) => d.id),
  ...overseasDestinations.map((d) => d.id),
]);

export default function RecommendedGrid() {
  const recommended = aboutProfile.recommendedDestinations
    .filter((item) => PUBLISHED_IDS.has(item.destinationId))
    .slice(0, 6);

  return (
    <section>
      <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
        추천 여행지
      </h2>
      <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
        free_traveler가 직접 다녀와 추천하는 여행지입니다.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommended.map((item) => (
          <Link
            key={item.destinationId}
            href={`/?destinationId=${item.destinationId}`}
            data-testid="destination-card"
            className="overflow-hidden rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] transition-shadow hover:shadow-[0_1px_2px_rgba(38,40,44,0.06),0_4px_10px_rgba(38,40,44,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image.url}
              alt={item.image.alt}
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="p-3">
              <p className="text-[17px] font-semibold text-[#26282C]">
                {item.name}
              </p>
              <p className="mt-1 text-[14px] text-[#84878D]">{item.country}</p>
              <p className="mt-2 text-[14px] leading-[1.55] text-[#4B4E54]">
                {item.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
