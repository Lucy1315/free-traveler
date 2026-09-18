// 대표 Hero + 수치 카드. SCR-002(`/about`). design-reference/D-001/
// DESIGN.md §15(Hero 규칙, 뷰포트 55~65%), UI_CONTRACT.md 2장 기준.
// REQ-FUNC-057. data-testid="about-hero-stats"는 tests/e2e/public-smoke.spec.ts
// E2E-002가 free_traveler/50+ Trips/30+ Countries 노출을 확인하는 데 쓴다.

import { aboutProfile } from "@/data/about";

export default function HeroStats() {
  const { hero } = aboutProfile;

  return (
    <section className="relative flex min-h-[55vh] max-h-[65vh] flex-col items-center justify-center gap-4 overflow-hidden px-4 py-12 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={hero.image.url}
        alt={hero.image.alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(38, 40, 44, 0.45)" }}
      />

      <div className="relative flex flex-col items-center gap-4">
        {/* data-testid="about-hero-stats": E2E-002는 이 요소 안에
            free_traveler/50+ Trips/30+ Countries가 모두 있는지 확인한다. */}
        <div
          data-testid="about-hero-stats"
          className="flex flex-col items-center gap-4"
        >
          <h1 className="text-[32px] font-bold leading-[1.35] text-[#FFFFFF]">
            {hero.name}
          </h1>
          <p className="max-w-xl text-[16px] leading-[1.6] text-[#FFFFFF]">
            {hero.tagline}
          </p>
          <div className="flex gap-3">
            {hero.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[14px] bg-[#FFFFFF] px-5 py-3"
              >
                <p className="text-[20px] font-semibold text-[#26282C]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[13px] text-[#FFFFFF]">
          <a
            href={hero.image.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center underline"
          >
            {hero.image.credit}
          </a>
        </p>
      </div>
    </section>
  );
}
