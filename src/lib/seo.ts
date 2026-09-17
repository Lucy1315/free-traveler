// 페이지별 SEO metadata 헬퍼(title/description/canonical/Open Graph/구조화 데이터).
// REQ-FUNC-070, REQ-NF-030. 시각 규격이 없는 비가시 메타 데이터이며,
// design-reference/SCREEN_ROUTE_CONTRACT.json의 route를 canonical URL 기준으로 쓴다.

import type { Metadata } from "next";

const SITE_NAME = "Free Traveler";
// TODO: Vercel 배포 도메인이 확정되면 NEXT_PUBLIC_SITE_URL 환경변수로 덮어쓴다.
// 값이 없으면 이 기본값을 쓴다(빌드 실패를 막기 위함이며 실제 배포 URL은 아니다).
const DEFAULT_SITE_URL = "https://free-traveler.vercel.app";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return configured && configured.length > 0 ? configured : DEFAULT_SITE_URL;
}

function toAbsoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}

export interface PageMetadataInput {
  /** 페이지 고유 제목. 사이트명 접미사는 이 함수가 붙인다. */
  title: string;
  description: string;
  /** SCREEN_ROUTE_CONTRACT.json의 route(예: "/", "/about"). */
  path: string;
  ogImageUrl?: string;
}

// REQ-FUNC-070: title/description/canonical/Open Graph를 페이지 컴포넌트의
// `export const metadata`에 바로 쓸 수 있는 형태로 만든다.
export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const canonicalUrl = toAbsoluteUrl(input.path);
  const fullTitle = `${input.title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description: input.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description: input.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
      ...(input.ogImageUrl ? { images: [{ url: input.ogImageUrl }] } : {}),
    },
  };
}

export interface WebPageJsonLdInput {
  title: string;
  description: string;
  path: string;
}

// REQ-FUNC-070: 구조화 데이터(JSON-LD). 페이지 컴포넌트가
// <script type="application/ld+json">{JSON.stringify(buildWebPageJsonLd(...))}</script>
// 형태로 삽입해 쓴다. 예약·가격·별점 등 이 서비스에 없는 스키마 타입은 만들지 않는다.
export function buildWebPageJsonLd(
  input: WebPageJsonLdInput,
): Record<string, unknown> {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.title,
    description: input.description,
    url: toAbsoluteUrl(input.path),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl,
    },
  };
}
