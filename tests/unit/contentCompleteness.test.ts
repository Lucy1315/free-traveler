// 콘텐츠 완전성 회귀 검사. REQ-FUNC-004·008·046~053, REQ-NF-026·027.
// RELEASE-CHECK-CONTENT-COMPLETENESS에서 "해외 15개국 중 4개국만 안전정보가 있고,
// 외교부 원문 링크가 옛 주소(404)였다"는 결함이 검사 없이 남아 있던 것을 계기로 추가했다.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { domesticDestinations } from "@/data/destinations.domestic";
import { overseasDestinations } from "@/data/destinations.overseas";
import { countrySafetyList } from "@/data/safety";

const allDestinations = [...domesticDestinations, ...overseasDestinations];
const overseasCountries = Array.from(
  new Set(overseasDestinations.map((destination) => destination.country)),
);
const PLACEHOLDER = /lorem|준비 중|정보 확인 필요|TODO/i;
const ALERT_ORDER = [
  "여행금지",
  "출국권고",
  "여행자제",
  "여행유의",
  "해당없음",
];

describe("여행지 게시 수량(REQ-FUNC-008)", () => {
  it("국내 10곳 이상, 해외 15개국 30개 도시 이상", () => {
    expect(domesticDestinations.length).toBeGreaterThanOrEqual(10);
    expect(overseasCountries.length).toBeGreaterThanOrEqual(15);
    expect(overseasDestinations.length).toBeGreaterThanOrEqual(30);
  });

  it("여행지 id가 겹치지 않는다", () => {
    const ids = allDestinations.map((destination) => destination.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("여행지 상세 완전성(REQ-FUNC-004, REQ-NF-026)", () => {
  it.each(allDestinations.map((destination) => [destination.id, destination]))(
    "%s",
    (_id, destination) => {
      expect(destination.summary.length).toBeGreaterThanOrEqual(300);
      expect(destination.highlights.length).toBeGreaterThanOrEqual(5);
      expect(destination.bestSeason).not.toBe("");
      expect(destination.oneDayItinerary.length).toBeGreaterThan(0);
      expect(destination.threeDayItinerary.map((day) => day.day)).toEqual([
        1, 2, 3,
      ]);
      for (const day of destination.threeDayItinerary) {
        expect(day.steps.length).toBeGreaterThan(0);
      }
      expect(destination.budget).not.toBe("");
      expect(destination.transportation).not.toBe("");
      expect(destination.food.length).toBeGreaterThanOrEqual(3);
      expect(destination.etiquette.length).toBeGreaterThanOrEqual(3);
      expect(destination.source.name).not.toBe("");
      expect(destination.source.url).toMatch(/^https:\/\//);
      expect(destination.source.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      // 이미지: 자체 호스팅 파일이 실제로 있고, alt·출처·저작자 표기가 있다.
      expect(destination.image.url).toMatch(/^\/images\//);
      expect(
        existsSync(join(process.cwd(), "public", destination.image.url)),
        `${destination.image.url} 파일 없음`,
      ).toBe(true);
      expect(destination.image.alt).not.toBe("");
      expect(destination.image.credit).not.toBe("");
      expect(destination.image.sourceUrl).toMatch(/^https:\/\//);
      expect(JSON.stringify(destination)).not.toMatch(PLACEHOLDER);
    },
  );
});

describe("해외 국가 안전정보 커버리지(REQ-FUNC-046, REQ-NF-027)", () => {
  it("해외 여행지의 모든 국가에 안전정보가 있다", () => {
    const covered = new Set(countrySafetyList.map((safety) => safety.country));
    expect(
      overseasCountries.filter((country) => !covered.has(country)),
    ).toEqual([]);
  });

  it("안전정보 국가가 겹치지 않는다", () => {
    const countries = countrySafetyList.map((safety) => safety.country);
    expect(new Set(countries).size).toBe(countries.length);
  });

  it.each(countrySafetyList.map((safety) => [safety.country, safety]))(
    "%s",
    (_country, safety) => {
      // REQ-FUNC-047: 8개 섹션, 빈 섹션 없음.
      expect(safety.categories.map((category) => category.id)).toEqual([
        "security",
        "commonScams",
        "localLaws",
        "traffic",
        "disasterAndClimate",
        "health",
        "cultureAndDress",
        "emergencyContacts",
      ]);
      for (const category of safety.categories) {
        expect(category.items.length, category.id).toBeGreaterThan(0);
      }
      // REQ-FUNC-051·052: 경보는 높은 단계부터, 대표 경보는 첫 항목.
      expect(safety.alerts.length).toBeGreaterThan(0);
      expect(safety.alert).toBe(safety.alerts[0]);
      const order = safety.alerts.map((alert) =>
        ALERT_ORDER.indexOf(alert.level),
      );
      expect(order).toEqual([...order].sort((a, b) => a - b));
      for (const alert of safety.alerts) {
        expect(alert.scopeText).not.toBe("");
        expect(alert.summary).not.toBe("");
      }
      // REQ-FUNC-053: 현지 긴급전화 + 재외공관 + 영사콜센터.
      const labels = safety.emergencyContacts.map((contact) => contact.label);
      expect(labels.some((label) => /현지|통합|경찰/.test(label))).toBe(true);
      expect(labels.some((label) => /대사관|대표부|총영사관/.test(label))).toBe(
        true,
      );
      expect(
        safety.emergencyContacts.some(
          (contact) => contact.phone === "+82-2-3210-0404",
        ),
      ).toBe(true);
      // REQ-FUNC-048·049: 출처·확인일·편집자, 현재 외교부 주소 형식(옛 /dev/ 주소 금지).
      expect(safety.mofaUrl).toMatch(
        /^https:\/\/www\.0404\.go\.kr\/ntnSafetyInfo\/\d+\/detail$/,
      );
      expect(safety.source.url).toBe(safety.mofaUrl);
      expect(safety.source.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(safety.source.editor).not.toBe("");
      expect(JSON.stringify(safety)).not.toMatch(PLACEHOLDER);
    },
  );
});
