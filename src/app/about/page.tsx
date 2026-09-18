// SCR-002 대표 소개 Page Owner. design-reference/D-001/DESIGN.md §17(SCR-002
// 7 Section), UI_CONTRACT.md 2장 기준. REQ-FUNC-057~063.
//
// Depends On의 CMP-SCR002-* 산출물을 조립한다(새 Component 파일 없음).
// 본문 Section은 DATA-ABOUT-PROFILE 정적 데이터로 즉시 렌더링된다.
//
// REQ-FUNC-062(문의·SNS 링크): 관리자가 external_url_setting에 저장한 값
// (contact/instagram/youtube/blog)을 공개 클라이언트로 읽는다. 조회에 실패하거나
// (환경변수 미설정, 0003 마이그레이션 미적용 등) 값이 없으면 빈 목록으로
// 넘기고, PhilosophyChecklist가 영역 자체를 그리지 않는다(빈 값 미노출).

import HeroStats from "@/components/scr002/HeroStats";
import RecommendedGrid from "@/components/scr002/RecommendedGrid";
import CountryChips from "@/components/scr002/CountryChips";
import Timeline from "@/components/scr002/Timeline";
import Gallery from "@/components/scr002/Gallery";
import PhilosophyChecklist, {
  type ContactLink,
} from "@/components/scr002/PhilosophyChecklist";
import { createPublicSupabaseClient } from "@/lib/db/client";
import {
  CONTACT_LINK_CATEGORIES,
  isAllowedExternalUrl,
  listExternalUrlSettings,
  type ExternalUrlCategory,
} from "@/lib/db/queries";
import { buildPageMetadata, buildWebPageJsonLd } from "@/lib/seo";

// 관리자 설정 변경이 5분 안에 반영되도록 정적 페이지를 주기적으로 재생성한다.
export const revalidate = 300;

const TITLE = "대표 소개";
const DESCRIPTION =
  "50회 이상, 30개국 이상을 여행한 free_traveler의 추천 여행지·여행 기록·여행 철학을 소개합니다.";

// REQ-FUNC-070·NF-030: 페이지별 title·description·canonical·OG·구조화 데이터.
export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/about",
});

const jsonLd = buildWebPageJsonLd({
  title: TITLE,
  description: DESCRIPTION,
  path: "/about",
});

const CONTACT_LABELS: Partial<Record<ExternalUrlCategory, string>> = {
  contact: "문의하기",
  instagram: "Instagram",
  youtube: "YouTube",
  blog: "블로그",
};

async function loadContactLinks(): Promise<ContactLink[]> {
  try {
    const { data, error } = await listExternalUrlSettings(
      createPublicSupabaseClient(),
    );
    if (error || !data) {
      return [];
    }
    return CONTACT_LINK_CATEGORIES.flatMap((category) => {
      const row = data.find((item) => item.category === category);
      const label = CONTACT_LABELS[category];
      if (!row || !label || !isAllowedExternalUrl(category, row.url)) {
        return [];
      }
      return [{ label, url: row.url }];
    });
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const contactLinks = await loadContactLinks();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HeroStats />

      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-4 py-12 md:gap-20 md:px-8 md:py-20">
        <RecommendedGrid />
        <CountryChips />
        <Timeline />
        <Gallery />
        <PhilosophyChecklist contactLinks={contactLinks} />
      </div>
    </>
  );
}
