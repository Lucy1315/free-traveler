// SCR-005(`/account`) 메타데이터 전용 Layout. page.tsx가 세션을 구독하는 Client
// Component라 metadata를 export할 수 없어 같은 세그먼트의 Server Layout에서
// 지정한다(REQ-FUNC-080). 개인 화면이라 검색 색인에서 뺀다.

import type { ReactNode } from "react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = {
  ...buildPageMetadata({
    title: "계정",
    description:
      "로그인·회원가입, 프로필과 동행 활동, 차단·즐겨찾기를 관리합니다.",
    path: "/account",
  }),
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  return children;
}
