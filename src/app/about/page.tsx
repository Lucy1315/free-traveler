// SCR-002 대표 소개 Page Owner. design-reference/D-001/DESIGN.md §17(SCR-002
// 7 Section), UI_CONTRACT.md 2장 기준. REQ-FUNC-057~063.
//
// Depends On의 CMP-SCR002-* 산출물을 조립만 한다(새 Component 파일 없음).
// 모든 Section이 DATA-ABOUT-PROFILE 정적 데이터로 즉시 렌더링되므로
// Loading·Empty 상태가 없다.
//
// REQ-FUNC-062(문의·SNS 링크): 저장할 데이터 소스가 아직 없어(
// external_url_setting의 category가 flight/hotel만 허용) contactLinks를
// 넘기지 않는다 — PhilosophyChecklist는 빈 목록이면 영역을 그리지 않는다.

import HeroStats from "@/components/scr002/HeroStats";
import RecommendedGrid from "@/components/scr002/RecommendedGrid";
import CountryChips from "@/components/scr002/CountryChips";
import Timeline from "@/components/scr002/Timeline";
import Gallery from "@/components/scr002/Gallery";
import PhilosophyChecklist from "@/components/scr002/PhilosophyChecklist";

export default function AboutPage() {
  return (
    <>
      <HeroStats />

      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-4 py-12 md:gap-20 md:px-8 md:py-20">
        <RecommendedGrid />
        <CountryChips />
        <Timeline />
        <Gallery />
        <PhilosophyChecklist />
      </div>
    </>
  );
}
