// 여행지 상세+안전정보 Drawer. SCR-001(`/`). design-reference/D-001/DESIGN.md
// §12(Drawer·Modal), design-reference/UI_CONTRACT.md 1장(SCR-001) 기준.
// REQ-FUNC-006·009·046~049·052~054.

"use client";

import { useState } from "react";
import Drawer from "@/components/ui/Drawer";
import Tabs from "@/components/ui/Tabs";
import Badge from "@/components/ui/Badge";
import { domesticDestinations } from "@/data/destinations.domestic";
import type { DomesticDestination } from "@/data/destinations.domestic";
import { overseasDestinations } from "@/data/destinations.overseas";
import type { OverseasDestination } from "@/data/destinations.overseas";
import { countrySafetyList, isSafetyStale } from "@/data/safety";
import { openExternalLink } from "@/lib/externalLink";

type AnyDestination = DomesticDestination | OverseasDestination;

const ALL_DESTINATIONS: AnyDestination[] = [
  ...domesticDestinations,
  ...overseasDestinations,
];

// 외교부 해외안전여행은 관리자가 설정하는 항공/숙소 URL과 달리 고정된
// 공식 도메인이라, allowlist를 여기서 직접 지정한다(REQ-FUNC-049).
const MOFA_ALLOWLIST = ["0404.go.kr"];

function getDestinationCountry(destination: AnyDestination): string {
  return destination.scope === "domestic" ? "대한민국" : destination.country;
}

function getDestinationLocationLabel(destination: AnyDestination): string {
  return destination.scope === "domestic"
    ? destination.region
    : destination.country;
}

function findRelatedDestinations(
  current: AnyDestination,
  limit = 6,
): AnyDestination[] {
  const currentCountry = getDestinationCountry(current);
  const sameCountry = ALL_DESTINATIONS.filter(
    (d) => d.id !== current.id && getDestinationCountry(d) === currentCountry,
  );
  const sameTheme = ALL_DESTINATIONS.filter(
    (d) =>
      d.id !== current.id &&
      d.theme === current.theme &&
      getDestinationCountry(d) !== currentCountry,
  );
  return [...sameCountry, ...sameTheme].slice(0, limit);
}

export interface DestinationDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  destinationId: string | null;
}

export default function DestinationDetailDrawer({
  open,
  onClose,
  destinationId,
}: DestinationDetailDrawerProps) {
  // destinationId가 바뀌면(다른 카드 클릭 등) key로 아래 내용을 통째로
  // 다시 마운트해 activeId/activeTab을 새로 초기화한다 — effect로
  // setState를 동기 호출하는 대신, React가 권장하는 key 리셋 패턴을 쓴다.
  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerBody key={destinationId ?? "none"} destinationId={destinationId} />
    </Drawer>
  );
}

function DrawerBody({ destinationId }: { destinationId: string | null }) {
  const [activeId, setActiveId] = useState<string | null>(destinationId);
  const [activeTab, setActiveTab] = useState<"detail" | "safety">("detail");

  const destination = ALL_DESTINATIONS.find((d) => d.id === activeId);

  if (!destination) {
    return (
      <p className="text-[14px] text-[#84878D]">여행지를 찾을 수 없습니다.</p>
    );
  }

  const safety =
    destination.scope === "overseas"
      ? countrySafetyList.find((s) => s.country === destination.country)
      : undefined;

  const relatedDestinations = findRelatedDestinations(destination);

  return (
    <>
      <h2 className="text-[20px] font-semibold text-[#26282C]">
        {destination.name}
      </h2>
      <Tabs
        ariaLabel={`${destination.name} 상세 탭`}
        tabs={[
          { id: "detail", label: "상세정보" },
          { id: "safety", label: "안전정보" },
        ]}
        activeTabId={activeTab}
        onChange={(id) => setActiveTab(id as "detail" | "safety")}
      />

      <div
        id="tabpanel-detail"
        role="tabpanel"
        aria-labelledby="tab-detail"
        hidden={activeTab !== "detail"}
        className="mt-4 flex flex-col gap-6"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={destination.image.url}
          alt={destination.image.alt}
          className="h-48 w-full rounded-[14px] object-cover"
        />
        <p className="text-[13px] text-[#84878D]">
          출처:{" "}
          <a
            href={destination.image.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {destination.image.sourceUrl}
          </a>
        </p>

        <div>
          <p className="text-[13px] font-medium text-[#84878D]">
            {getDestinationLocationLabel(destination)} · {destination.theme}
          </p>
          <p className="mt-2 text-[16px] leading-[1.6] text-[#4B4E54]">
            {destination.summary}
          </p>
        </div>

        <Section title="명소">
          <ul className="flex flex-wrap gap-2">
            {destination.highlights.map((item) => (
              <li
                key={item}
                className="rounded-full bg-[#F0EFEC] px-3 py-1 text-[14px] text-[#26282C]"
              >
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="추천 시기">
          <p className="text-[14px] text-[#4B4E54]">{destination.bestSeason}</p>
        </Section>

        <Section title="1일 코스">
          <ol className="flex flex-col gap-1 text-[14px] text-[#4B4E54]">
            {destination.oneDayItinerary.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </Section>

        <Section title="3일 코스">
          <div className="flex flex-col gap-3">
            {destination.threeDayItinerary.map((day) => (
              <div key={day.day}>
                <p className="text-[14px] font-semibold text-[#26282C]">
                  Day {day.day} · {day.theme}
                </p>
                <ul className="mt-1 list-disc pl-5 text-[14px] text-[#4B4E54]">
                  {day.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section title="예산·교통">
          <p className="text-[14px] text-[#4B4E54]">{destination.budget}</p>
          <p className="mt-1 text-[14px] text-[#4B4E54]">
            {destination.transportation}
          </p>
        </Section>

        <Section title="음식">
          <p className="text-[14px] text-[#4B4E54]">
            {destination.food.join(" · ")}
          </p>
        </Section>

        <Section title="에티켓">
          <ul className="list-disc pl-5 text-[14px] text-[#4B4E54]">
            {destination.etiquette.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </Section>

        <p className="text-[13px] text-[#84878D]">
          출처: {destination.source.name} · {destination.source.updatedAt} 수정
        </p>

        {relatedDestinations.length > 0 && (
          <Section title="관련 여행지">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {relatedDestinations.map((related) => (
                <button
                  key={related.id}
                  type="button"
                  onClick={() => {
                    setActiveId(related.id);
                    setActiveTab("detail");
                  }}
                  className="rounded-[14px] border border-[#E3E2DF] p-2 text-left hover:bg-[#F7F6F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={related.image.url}
                    alt={related.image.alt}
                    className="h-16 w-full rounded-[8px] object-cover"
                  />
                  <p className="mt-1 truncate text-[13px] font-medium text-[#26282C]">
                    {related.name}
                  </p>
                </button>
              ))}
            </div>
          </Section>
        )}
      </div>

      <div
        id="tabpanel-safety"
        role="tabpanel"
        aria-labelledby="tab-safety"
        hidden={activeTab !== "safety"}
        className="mt-4 flex flex-col gap-6"
      >
        {/* REQ-FUNC-054: 공식 판단 대체 아님 고지(고정 표시). */}
        <p className="rounded-[14px] bg-[#F7F6F4] p-3 text-[13px] leading-[1.4] text-[#4B4E54]">
          이 안전정보는 공식 판단을 대체하지 않습니다. 출국 직전 외교부
          해외안전여행 등 공식 출처에서 원문을 다시 확인하세요.
        </p>

        {safety ? (
          <>
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    safety.alert.level === "해당없음" ? "neutral" : "warning"
                  }
                >
                  {safety.alert.level} · {safety.alert.scopeType}
                </Badge>
                {isSafetyStale(safety.source.verifiedAt) && (
                  <Badge variant="warning">재확인 필요</Badge>
                )}
              </div>
              <p className="mt-2 text-[14px] text-[#4B4E54]">
                {safety.alert.scopeText}
              </p>
              <p className="mt-1 text-[14px] text-[#4B4E54]">
                {safety.alert.summary}
              </p>
            </div>

            {safety.categories.map((category) => (
              <Section key={category.id} title={category.title}>
                <ul className="list-disc pl-5 text-[14px] text-[#4B4E54]">
                  {category.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </Section>
            ))}

            <Section title="긴급연락처">
              <ul className="flex flex-col gap-1 text-[14px] text-[#4B4E54]">
                {safety.emergencyContacts.map((contact) => (
                  <li key={contact.label}>
                    {contact.label}: {contact.phone}
                  </li>
                ))}
              </ul>
            </Section>

            <p className="text-[13px] text-[#84878D]">
              출처: {safety.source.name} · {safety.source.verifiedAt} 확인 ·{" "}
              {safety.source.editor}
            </p>

            <button
              type="button"
              onClick={() => openExternalLink(safety.mofaUrl, MOFA_ALLOWLIST)}
              className="inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            >
              외교부 해외안전여행 원문 보기(새 탭)
            </button>
          </>
        ) : destination.scope === "domestic" ? (
          <p className="text-[14px] leading-[1.6] text-[#4B4E54]">
            국내 여행지는 별도 안전정보를 제공하지 않습니다. 국내 재난·안전
            정보는 정부24 등 공식 채널에서 확인하세요.
          </p>
        ) : (
          <p className="text-[14px] leading-[1.6] text-[#4B4E54]">
            이 국가의 안전정보는 아직 게시되지 않았습니다. 아래 버튼으로 외교부
            해외안전여행에서 최신 정보를 직접 확인하세요.
            <button
              type="button"
              onClick={() =>
                openExternalLink("https://www.0404.go.kr", MOFA_ALLOWLIST)
              }
              className="mt-3 block min-h-[44px] rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F]"
            >
              외교부 해외안전여행 바로가기(새 탭)
            </button>
          </p>
        )}
      </div>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[17px] font-semibold text-[#26282C]">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}
