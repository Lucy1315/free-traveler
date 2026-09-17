"use client";

// 전역 Header(5개 Screen 공통). design-reference/D-001/DESIGN.md §7 기준.
// 워드마크는 텍스트만 쓴다(로고 이미지·심볼 없음) — next/image 대상이 없다.
// REQ-FUNC-064·065.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "메인" },
  { href: "/about", label: "대표 소개" },
  { href: "/travel-tools", label: "여행 준비" },
  { href: "/mates", label: "동행 찾기" },
  { href: "/account", label: "계정" },
];

function isActiveNav(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E3E2DF] bg-[#FFFFFF]">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 md:h-[72px] md:px-8">
        <Link
          href="/"
          className="text-[17px] font-semibold text-[#26282C]"
          onClick={() => setMenuOpen(false)}
        >
          Free Traveler
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="주요 내비게이션"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActiveNav(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`border-b-2 pb-1 text-[16px] font-semibold transition-colors ${
                  active
                    ? "border-[#FF6A4D] text-[#26282C]"
                    : "border-transparent text-[#4B4E54] hover:text-[#26282C]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/account"
            aria-label="즐겨찾기"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#26282C] hover:bg-[#F0EFEC]"
          >
            <HeartIcon />
          </Link>
          <Link
            href="/account"
            aria-label="계정 또는 로그인"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#26282C] hover:bg-[#F0EFEC]"
          >
            <UserIcon />
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#26282C] md:hidden"
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-[#E3E2DF] bg-[#FFFFFF] px-4 py-2 md:hidden"
          aria-label="모바일 내비게이션"
        >
          <ul className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              const active = isActiveNav(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block border-b border-[#E3E2DF] py-3 text-[16px] font-semibold last:border-b-0 ${
                      active ? "text-[#26282C]" : "text-[#4B4E54]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}

function HeartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M12 20s-7-4.35-9.5-8.5C.8 8.2 2.4 5 5.6 5c1.8 0 3.2 1 4.4 2.6C11.2 6 12.6 5 14.4 5c3.2 0 4.8 3.2 3.1 6.5C19 15.65 12 20 12 20z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.5-3.6 4.5-5.5 7.5-5.5s6 1.9 7.5 5.5" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  ) : (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
