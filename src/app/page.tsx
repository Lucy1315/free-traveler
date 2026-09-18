// SCR-001 메인 Page Entry(`/`). 인터랙티브 본문은 HomePage(Client
// Component)가 맡고, 이 Server Component는 페이지 metadata와 구조화
// 데이터만 담당한다(REQ-FUNC-070, REQ-NF-030, SHARED-SEO-METADATA).

import HomePage from "@/components/scr001/HomePage";
import { buildPageMetadata, buildWebPageJsonLd } from "@/lib/seo";

const TITLE = "여행지·안전정보·동행 찾기";
const DESCRIPTION =
  "국내외 여행지와 국가별 안전정보를 함께 검색하고, 항공·숙소 조건을 정리한 뒤 동행을 찾아보세요.";

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/",
});

const jsonLd = buildWebPageJsonLd({
  title: TITLE,
  description: DESCRIPTION,
  path: "/",
});

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <HomePage />
    </>
  );
}
