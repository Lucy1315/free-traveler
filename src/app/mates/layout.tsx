// SCR-004(`/mates`) 메타데이터 전용 Layout. page.tsx가 필터·선택·차단 상태를
// 관리하는 Client Component라 metadata를 export할 수 없어, 같은 세그먼트의
// Server Layout에서 제목·설명·canonical·JSON-LD를 지정한다(REQ-FUNC-080).

import type { ReactNode } from "react";
import { buildPageMetadata, buildWebPageJsonLd } from "@/lib/seo";

const TITLE = "동행 찾기";
const DESCRIPTION =
  "같은 기간, 같은 여행지로 떠나는 여행자의 동행 모집글을 찾고 참가 요청을 보내세요. 연락처는 공개되지 않습니다.";

export const metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/mates",
});

const jsonLd = buildWebPageJsonLd({
  title: TITLE,
  description: DESCRIPTION,
  path: "/mates",
});

export default function MatesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}
