// UNIT-TRAVEL-DATES — 항공·숙소 날짜 검증 경계값. REQ-FUNC-013·021.
import { describe, expect, it } from "vitest";
import {
  toLocalIsoDate,
  validateDateRange,
} from "@/components/scr003/FlightForm";

const TODAY = "2026-09-19";

describe("validateDateRange — 공통", () => {
  it("시작·종료가 비어 있으면 각각 REQUIRED", () => {
    expect(validateDateRange("", "", TODAY, true)).toEqual({
      startError: "START_REQUIRED",
      endError: "END_REQUIRED",
    });
  });

  it("어제 출발은 과거일로 막고, 오늘 출발은 허용한다(경계)", () => {
    expect(
      validateDateRange("2026-09-18", "2026-09-20", TODAY, true).startError,
    ).toBe("START_IN_PAST");
    expect(
      validateDateRange(TODAY, "2026-09-20", TODAY, true).startError,
    ).toBeNull();
  });

  it("종료가 시작보다 하루라도 빠르면 역전으로 막는다", () => {
    expect(
      validateDateRange("2026-10-02", "2026-10-01", TODAY, true).endError,
    ).toBe("END_BEFORE_START");
    expect(
      validateDateRange("2026-10-02", "2026-10-01", TODAY, false).endError,
    ).toBe("END_BEFORE_START");
  });

  it("월·연도가 바뀌는 구간도 문자열 비교로 올바르게 판단한다", () => {
    expect(validateDateRange("2026-12-31", "2027-01-01", TODAY, false)).toEqual(
      { startError: null, endError: null },
    );
    expect(
      validateDateRange("2027-01-01", "2026-12-31", TODAY, false).endError,
    ).toBe("END_BEFORE_START");
  });

  it("시작이 비어 있으면 종료 순서는 판단하지 않는다", () => {
    expect(validateDateRange("", "2026-10-01", TODAY, false)).toEqual({
      startError: "START_REQUIRED",
      endError: null,
    });
  });
});

describe("validateDateRange — 항공(당일 귀국 허용)", () => {
  it("출발일과 귀국일이 같아도 통과한다", () => {
    expect(validateDateRange("2026-10-01", "2026-10-01", TODAY, true)).toEqual({
      startError: null,
      endError: null,
    });
  });
});

describe("validateDateRange — 숙소(체크아웃 > 체크인)", () => {
  it("체크아웃이 체크인과 같으면 막는다(경계)", () => {
    expect(
      validateDateRange("2026-10-01", "2026-10-01", TODAY, false).endError,
    ).toBe("END_NOT_AFTER_START");
  });

  it("체크아웃이 체크인 다음 날이면 통과한다(경계)", () => {
    expect(validateDateRange("2026-10-01", "2026-10-02", TODAY, false)).toEqual(
      { startError: null, endError: null },
    );
  });
});

describe("toLocalIsoDate", () => {
  it("로컬 날짜를 0을 채운 YYYY-MM-DD로 만든다(UTC로 밀리지 않는다)", () => {
    expect(toLocalIsoDate(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
    expect(toLocalIsoDate(new Date(2026, 11, 31, 0, 1))).toBe("2026-12-31");
  });
});
