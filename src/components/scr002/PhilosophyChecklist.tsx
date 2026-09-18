// 여행 철학 좌우 분할 + 3단계 체크리스트 + 문의·SNS 링크. SCR-002(`/about`).
// design-reference/D-001/DESIGN.md §16(좌우 분할)·§18(완성형 문장),
// UI_CONTRACT.md 2장 기준. REQ-FUNC-058·062.
//
// REQ-FUNC-062: 문의·SNS 링크는 external_url_setting(contact/instagram/
// youtube/blog, 0003_contact_links.sql)에 저장되고, src/app/about/page.tsx가
// 읽어서 prop으로 넘긴다. 이 컴포넌트는 허용 프로토콜(https, mailto)만
// 렌더링하고 빈 목록이면 영역 자체를 그리지 않는다(빈 값 미노출).

import Link from "next/link";
import { aboutProfile } from "@/data/about";

export interface ContactLink {
  label: string;
  url: string;
}

export interface PhilosophyChecklistProps {
  contactLinks?: ContactLink[];
}

export default function PhilosophyChecklist({
  contactLinks = [],
}: PhilosophyChecklistProps) {
  const { philosophy, checklist } = aboutProfile;
  const visibleLinks = contactLinks.filter(
    (link) =>
      link.label.trim() &&
      (link.url.startsWith("https://") || link.url.startsWith("mailto:")),
  );

  return (
    <div className="flex flex-col gap-12 md:gap-20">
      <section>
        <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
          여행 철학
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
          <blockquote className="border-l-2 border-[#FF6A4D] pl-5 text-[20px] font-semibold leading-[1.4] text-[#26282C]">
            {philosophy.quote}
          </blockquote>
          <div>
            <h3 className="text-[17px] font-semibold text-[#26282C]">
              콘텐츠 편집 원칙
            </h3>
            <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[16px] leading-[1.6] text-[#4B4E54]">
              {philosophy.principles.map((principle) => (
                <li key={principle}>{principle}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
          여행 준비 체크리스트
        </h2>
        <p className="mt-2 max-w-2xl text-[16px] leading-[1.6] text-[#4B4E54]">
          세 단계만 따라가면 여행 준비를 시작할 수 있습니다.
        </p>
        <ol className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {checklist.steps.map((step) => (
            <li
              key={step.step}
              className="rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-5"
            >
              <p className="text-[13px] font-medium text-[#84878D]">
                {step.step}단계
              </p>
              <p className="mt-1 text-[17px] font-semibold text-[#26282C]">
                {step.title}
              </p>
              <p className="mt-2 text-[14px] leading-[1.55] text-[#4B4E54]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
        <Link
          href={checklist.ctaHref}
          className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          {checklist.ctaLabel}
        </Link>
      </section>

      {visibleLinks.length > 0 && (
        <section>
          <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
            문의·SNS
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {visibleLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  {...(link.url.startsWith("https://")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex min-h-[44px] items-center rounded-[8px] border border-[#C7C5C0] px-4 text-[14px] font-semibold text-[#26282C] hover:bg-[#F7F6F4]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
