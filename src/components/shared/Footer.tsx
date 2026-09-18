// 전역 Footer(5개 Screen 공통). design-reference/D-001/DESIGN.md §7 기준.
// 이미지 요소가 없어 next/image 대상이 없다. REQ-FUNC-064·065.

import Link from "next/link";

interface FooterLink {
  href: string;
  label: string;
}

const EXPLORE_LINKS: FooterLink[] = [
  { href: "/", label: "메인" },
  { href: "/about", label: "대표 소개" },
  { href: "/mates", label: "동행 찾기" },
];

const PREP_LINKS: FooterLink[] = [
  { href: "/travel-tools", label: "여행 준비" },
  { href: "/account", label: "로그인" },
];

// 정책 문서(src/data/policies.ts)는 아직 전용 Route가 없다 — design-reference/
// SCREEN_ROUTE_CONTRACT.json은 5개 고정 Screen만 인정하며 정책 페이지는 그 안에
// 없다(DATA-POLICY-PAGES는 SCR-003 동행 글쓰기 폼의 동의 문구로만 쓰인다). 그래서
// 안전수칙 동의가 실제로 쓰이는 SCR-003(/travel-tools)으로 임시 연결한다. 정책
// 전용 페이지 Task가 생기면 이 링크를 그 Route로 교체해야 한다.
const POLICY_LINKS: FooterLink[] = [
  { href: "/travel-tools", label: "이용약관" },
  { href: "/travel-tools", label: "개인정보 처리방침" },
  { href: "/travel-tools", label: "동행 안전수칙" },
  { href: "/travel-tools", label: "콘텐츠 면책 안내" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div>
      <h2 className="text-[13px] font-medium uppercase tracking-wide text-[#84878D]">
        {title}
      </h2>
      <ul className="mt-2 flex flex-col">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="inline-flex min-h-[44px] items-center text-[14px] text-[#4B4E54] hover:text-[#26282C]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-[#E3E2DF] bg-[#FFFFFF]">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-12 md:grid-cols-3 md:px-8">
        <FooterColumn title="탐색" links={EXPLORE_LINKS} />
        <FooterColumn title="여행 준비" links={PREP_LINKS} />
        <FooterColumn title="정책" links={POLICY_LINKS} />
      </div>
      <div className="border-t border-[#E3E2DF] px-4 py-6 md:px-8">
        <p className="text-[13px] leading-[1.4] text-[#84878D]">
          © {new Date().getFullYear()} Free Traveler. 여행경보·비자·보건 정보는
          외교부 등 공식 출처를 직접 확인하세요.
        </p>
      </div>
    </footer>
  );
}
