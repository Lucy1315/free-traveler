import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { getSiteUrl } from "@/lib/seo";
import "./globals.css";

// design-reference/D-001/DESIGN.md §3: 폰트는 Inter 하나만 쓴다(Proprietary
// Font 파일 금지). globals.css의 기존 --font-geist-sans 변수명은 이 Task
// Expected Files 밖이라 그대로 유지하고, Inter 폰트를 그 변수에 연결한다.
const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// 사이트 공통 기본값. 페이지별 title·canonical·OG는 각 page.tsx가
// buildPageMetadata로 덮어쓴다. canonical은 여기서 두지 않는다 — 자체
// metadata가 없는 페이지가 잘못된 canonical을 물려받지 않게 하기 위해서다.
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Free Traveler",
  description:
    "여행지·국가 안전정보 검색, 항공·숙소 조건 정리, 동행 찾기를 한 곳에서 준비하는 여행 준비 허브입니다.",
  openGraph: {
    siteName: "Free Traveler",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
