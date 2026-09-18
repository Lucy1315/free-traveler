// SCR-003 항공 탭: 조건 입력 → 검증 → 요약 → 외부 이동(새 탭).
// design-reference/D-001/DESIGN.md §10(Form)·§19(쿼리 파라미터 금지),
// UI_CONTRACT.md 3장 기준. REQ-FUNC-011~018, REQ-NF-017.
//
// 입력값 보호(REQ-FUNC-017, REQ-NF-017, CLAUDE.md 규칙 12): 입력값은 이
// 컴포넌트의 메모리 상태에만 있다. 서버 요청·URL 쿼리·localStorage·콘솔
// 로그·분석 이벤트 어디로도 보내지 않는다. 외부 이동 URL은 관리자가 설정한
// 일반 URL을 그대로 쓰고 입력값을 붙이지 않는다(checkExternalUrl이 목적지·
// 날짜 쿼리 파라미터가 붙은 URL을 차단한다).

"use client";

import { useId, useState, useSyncExternalStore } from "react";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { checkExternalUrl } from "@/lib/externalLink";

export const NON_TRANSFER_NOTICE = "입력값은 외부 사이트로 전달되지 않습니다";

export interface LocationOption {
  country: string;
  regions: string[];
}

// ---------------------------------------------------------------------------
// 날짜 검증(순수 함수) — HotelForm과 UNIT-TRAVEL-DATES(tests/unit/
// travelDates.test.ts)가 함께 쓴다. 날짜는 모두 로컬 기준 "YYYY-MM-DD"
// 문자열로 비교한다(UTC 변환 시 한국 시간 새벽에 하루가 어긋나는 문제 방지).
// ---------------------------------------------------------------------------

export function toLocalIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export type DateRangeError =
  | "START_REQUIRED"
  | "END_REQUIRED"
  | "START_IN_PAST"
  | "END_BEFORE_START"
  | "END_NOT_AFTER_START";

export interface DateRangeResult {
  startError: DateRangeError | null;
  endError: DateRangeError | null;
}

/**
 * start는 오늘 이후(오늘 포함)여야 한다. allowSameDay가 true면 end === start를
 * 허용하고(항공: 당일 귀국), false면 end가 start보다 뒤여야 한다(숙소: 체크아웃
 * > 체크인).
 */
export function validateDateRange(
  start: string,
  end: string,
  today: string,
  allowSameDay: boolean,
): DateRangeResult {
  let startError: DateRangeError | null = null;
  let endError: DateRangeError | null = null;

  if (!start) {
    startError = "START_REQUIRED";
  } else if (start < today) {
    startError = "START_IN_PAST";
  }

  if (!end) {
    endError = "END_REQUIRED";
  } else if (start) {
    if (end < start) {
      endError = "END_BEFORE_START";
    } else if (!allowSameDay && end === start) {
      endError = "END_NOT_AFTER_START";
    }
  }

  return { startError, endError };
}

// /travel-tools는 빌드 시 정적 생성되므로, "오늘"을 렌더 중에 계산하면 빌드
// 날짜가 HTML에 굳고(서버는 UTC) 하이드레이션 불일치가 난다. 오늘 날짜는
// 브라우저에서만 읽는다(서버 스냅샷은 빈 문자열 → min 속성 생략).
function subscribeNothing() {
  return () => {};
}

export function useLocalToday(): string {
  return useSyncExternalStore(
    subscribeNothing,
    () => toLocalIsoDate(new Date()),
    () => "",
  );
}

const FLIGHT_DATE_MESSAGES: Record<DateRangeError, string> = {
  START_REQUIRED: "출발일을 선택해 주세요.",
  END_REQUIRED: "귀국일을 선택해 주세요.",
  START_IN_PAST: "출발일은 오늘 이후 날짜여야 합니다.",
  END_BEFORE_START: "귀국일은 출발일보다 빠를 수 없습니다.",
  END_NOT_AFTER_START: "귀국일은 출발일 이후여야 합니다.",
};

// ---------------------------------------------------------------------------

export interface FlightFormProps {
  locations: LocationOption[];
  /** 관리자가 설정한 항공 일반 URL(external_url_setting.flight). */
  externalUrl: string | null;
  allowlist: string[];
  onRetryExternalUrl?: () => void;
}

interface FlightValues {
  country: string;
  region: string;
  departure: string;
  returnDate: string;
}

const EMPTY_VALUES: FlightValues = {
  country: "",
  region: "",
  departure: "",
  returnDate: "",
};

export default function FlightForm({
  locations,
  externalUrl,
  allowlist,
  onRetryExternalUrl,
}: FlightFormProps) {
  const fieldId = useId();
  const [values, setValues] = useState<FlightValues>(EMPTY_VALUES);
  const [submitted, setSubmitted] = useState(false);
  const [confirmed, setConfirmed] = useState<FlightValues | null>(null);

  const regions =
    locations.find((option) => option.country === values.country)?.regions ??
    [];

  const today = useLocalToday();
  const dateResult = validateDateRange(
    values.departure,
    values.returnDate,
    today,
    true,
  );
  const errors = {
    country: values.country ? null : "목적 국가를 선택해 주세요.",
    // REQ-FUNC-012: 선택한 국가에 속한 지역만 유효하다.
    region: !values.region
      ? "지역·도시를 선택해 주세요."
      : regions.includes(values.region)
        ? null
        : "선택한 국가의 지역·도시를 골라 주세요.",
    departure: dateResult.startError
      ? FLIGHT_DATE_MESSAGES[dateResult.startError]
      : null,
    returnDate: dateResult.endError
      ? FLIGHT_DATE_MESSAGES[dateResult.endError]
      : null,
  };
  const isValid = Object.values(errors).every((error) => error === null);

  function update<K extends keyof FlightValues>(key: K, value: string) {
    setConfirmed(null);
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      // 국가가 바뀌면 그 국가에 속하지 않는 지역 선택을 비운다.
      if (key === "country") {
        next.region = "";
      }
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    // REQ-FUNC-013: 과거 출발일·역전 날짜면 요약 단계로 진행하지 않는다.
    if (isValid) {
      setConfirmed(values);
    }
  }

  const linkCheck = checkExternalUrl(externalUrl, allowlist);
  const canLeave = confirmed !== null && linkCheck.ok;
  const selectClass =
    "h-12 w-full rounded-[8px] border bg-[#FFFFFF] px-3 text-[16px] text-[#26282C] outline-none focus:border-2 focus:border-[#26282C] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1D4ED8]";

  return (
    <div data-testid="flight-form" className="flex flex-col gap-6">
      <div>
        <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
          항공 조건 정리
        </h2>
        {/* REQ-FUNC-015: 폼에 비전달 고지를 고정 노출한다. */}
        <p className="mt-2 text-[14px] font-medium text-[#2563A9]">
          ⓘ {NON_TRANSFER_NOTICE}. 이 브라우저에서만 정리됩니다.
        </p>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${fieldId}-country`}
            className="text-[13px] font-medium text-[#26282C]"
          >
            목적 국가 *
          </label>
          <select
            id={`${fieldId}-country`}
            value={values.country}
            onChange={(event) => update("country", event.target.value)}
            aria-invalid={submitted && errors.country !== null}
            aria-describedby={
              submitted && errors.country
                ? `${fieldId}-country-error`
                : undefined
            }
            className={`${selectClass} ${submitted && errors.country ? "border-2 border-[#C7284B]" : "border-[#E3E2DF]"}`}
          >
            <option value="">국가 선택</option>
            {locations.map((option) => (
              <option key={option.country} value={option.country}>
                {option.country}
              </option>
            ))}
          </select>
          {submitted && errors.country && (
            <p
              id={`${fieldId}-country-error`}
              className="text-[13px] font-medium text-[#C7284B]"
            >
              {errors.country}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`${fieldId}-region`}
            className="text-[13px] font-medium text-[#26282C]"
          >
            지역·도시 *
          </label>
          <select
            id={`${fieldId}-region`}
            value={values.region}
            onChange={(event) => update("region", event.target.value)}
            disabled={!values.country}
            aria-invalid={submitted && errors.region !== null}
            aria-describedby={
              submitted && errors.region ? `${fieldId}-region-error` : undefined
            }
            className={`${selectClass} disabled:bg-[#F7F6F4] ${submitted && errors.region ? "border-2 border-[#C7284B]" : "border-[#E3E2DF]"}`}
          >
            <option value="">
              {values.country ? "지역·도시 선택" : "국가를 먼저 선택하세요"}
            </option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {submitted && errors.region && (
            <p
              id={`${fieldId}-region-error`}
              className="text-[13px] font-medium text-[#C7284B]"
            >
              {errors.region}
            </p>
          )}
        </div>

        <TextInput
          label="출발일"
          type="date"
          required
          min={today || undefined}
          value={values.departure}
          onChange={(event) => update("departure", event.target.value)}
          error={submitted ? (errors.departure ?? undefined) : undefined}
        />
        <TextInput
          label="귀국일"
          type="date"
          required
          min={values.departure || today || undefined}
          value={values.returnDate}
          onChange={(event) => update("returnDate", event.target.value)}
          error={submitted ? (errors.returnDate ?? undefined) : undefined}
        />

        <div className="md:col-span-2">
          <Button type="submit">조건 확인</Button>
        </div>
      </form>

      {/* REQ-FUNC-014: 유효한 입력 후 요약 단계를 보여준다. */}
      {confirmed && (
        <section
          aria-label="항공 조건 요약"
          className="rounded-[14px] border border-[#E3E2DF] bg-[#F7F6F4] p-5"
        >
          <h3 className="text-[17px] font-semibold text-[#26282C]">
            정리한 항공 조건
          </h3>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[14px] text-[#4B4E54]">
            <dt className="font-medium">목적지</dt>
            <dd>
              {confirmed.country} · {confirmed.region}
            </dd>
            <dt className="font-medium">출발일</dt>
            <dd>{confirmed.departure}</dd>
            <dt className="font-medium">귀국일</dt>
            <dd>{confirmed.returnDate}</dd>
          </dl>
          {/* REQ-FUNC-015: 요약에도 비전달 고지를 고정 노출한다. */}
          <p className="mt-3 text-[13px] font-medium text-[#2563A9]">
            ⓘ {NON_TRANSFER_NOTICE}. 외부 사이트에서 위 조건을 직접 입력해
            검색하세요.
          </p>
        </section>
      )}

      {linkCheck.ok ? (
        <div className="flex flex-col items-start gap-2">
          {/* REQ-FUNC-016: 새 탭 + noopener noreferrer. 조건 확인 전에는
              비활성(UI_CONTRACT 3장 — 검증 전 외부이동 버튼 비활성화). */}
          <a
            data-testid="flight-external-link"
            href={linkCheck.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!canLeave}
            tabIndex={canLeave ? 0 : -1}
            onClick={(event) => {
              if (!canLeave) {
                event.preventDefault();
              }
            }}
            className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[8px] px-5 text-[16px] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${canLeave ? "bg-[#FF6A4D] text-[#FFFFFF] hover:bg-[#E5502F]" : "pointer-events-none bg-[#FFE3D8] text-[#FFFFFF]"}`}
          >
            항공권 보러 가기
            <span aria-hidden="true">↗</span>
            <span className="sr-only">(새 탭에서 열림)</span>
          </a>
          {!canLeave && (
            <p className="text-[13px] text-[#84878D]">
              조건을 확인하면 외부 항공권 사이트로 이동할 수 있습니다.
            </p>
          )}
        </div>
      ) : (
        // REQ-FUNC-018: URL 미설정·허용목록 밖이면 이동을 막고 오류+재시도.
        <div
          role="alert"
          className="rounded-[14px] border-2 border-[#C7284B] bg-[#FFFFFF] p-4"
        >
          <p className="text-[14px] font-medium text-[#C7284B]">
            오류: {linkCheck.error.message}
          </p>
          {onRetryExternalUrl && (
            <div className="mt-3">
              <Button variant="secondary" onClick={onRetryExternalUrl}>
                다시 시도
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
