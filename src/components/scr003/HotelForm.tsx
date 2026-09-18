// SCR-003 숙소 탭: 조건 입력 → 검증 → 요약 → 외부 이동(새 탭).
// design-reference/D-001/DESIGN.md §10(Form)·§19(쿼리 파라미터 금지),
// UI_CONTRACT.md 3장 기준. REQ-FUNC-019~026, REQ-NF-017.
//
// 입력값 보호(REQ-FUNC-025, REQ-NF-017, CLAUDE.md 규칙 12): 입력값은 이
// 컴포넌트 메모리 상태에만 있다. 서버 요청·URL 쿼리·저장소·로그·분석
// 이벤트로 보내지 않는다. 날짜 검증·오늘 날짜·고지 문구는 FlightForm의
// 공용 export를 재사용한다.

"use client";

import { useEffect, useId, useState } from "react";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import { checkExternalUrl } from "@/lib/externalLink";
import {
  NON_TRANSFER_NOTICE,
  useLocalToday,
  validateDateRange,
  type DateRangeError,
  type LocationOption,
} from "@/components/scr003/FlightForm";

const HOTEL_DATE_MESSAGES: Record<DateRangeError, string> = {
  START_REQUIRED: "체크인 날짜를 선택해 주세요.",
  END_REQUIRED: "체크아웃 날짜를 선택해 주세요.",
  START_IN_PAST: "체크인은 오늘 이후 날짜여야 합니다.",
  END_BEFORE_START: "체크아웃은 체크인보다 빠를 수 없습니다.",
  END_NOT_AFTER_START: "체크아웃은 체크인 다음 날 이후여야 합니다.",
};

export interface HotelFormProps {
  locations: LocationOption[];
  /** 관리자가 설정한 숙소 일반 URL(external_url_setting.hotel). */
  externalUrl: string | null;
  allowlist: string[];
  onRetryExternalUrl?: () => void;
}

interface HotelValues {
  country: string;
  region: string;
  checkIn: string;
  checkOut: string;
}

const EMPTY_VALUES: HotelValues = {
  country: "",
  region: "",
  checkIn: "",
  checkOut: "",
};

export default function HotelForm({
  locations,
  externalUrl,
  allowlist,
  onRetryExternalUrl,
}: HotelFormProps) {
  const fieldId = useId();
  const [values, setValues] = useState<HotelValues>(EMPTY_VALUES);
  const [submitted, setSubmitted] = useState(false);
  const [confirmed, setConfirmed] = useState<HotelValues | null>(null);

  const regions =
    locations.find((option) => option.country === values.country)?.regions ??
    [];

  const today = useLocalToday();
  // REQ-FUNC-021: 체크아웃이 체크인과 같거나 빠르면 차단(allowSameDay=false).
  const dateResult = validateDateRange(
    values.checkIn,
    values.checkOut,
    today,
    false,
  );
  const errors = {
    country: values.country ? null : "숙박 국가를 선택해 주세요.",
    // REQ-FUNC-020: 선택한 국가에 속한 지역만 유효하다.
    region: !values.region
      ? "지역·도시를 선택해 주세요."
      : regions.includes(values.region)
        ? null
        : "선택한 국가의 지역·도시를 골라 주세요.",
    checkIn: dateResult.startError
      ? HOTEL_DATE_MESSAGES[dateResult.startError]
      : null,
    checkOut: dateResult.endError
      ? HOTEL_DATE_MESSAGES[dateResult.endError]
      : null,
  };
  const isValid = Object.values(errors).every((error) => error === null);

  const linkCheck = checkExternalUrl(externalUrl, allowlist);
  const canLeave = confirmed !== null && linkCheck.ok;
  const linkErrorCode = linkCheck.ok ? null : linkCheck.error.code;

  // REQ-FUNC-026: 숙소 URL 오류는 운영 오류 로그로 남긴다(사용자 입력값은
  // 포함하지 않는다 — 오류 코드만 기록).
  useEffect(() => {
    if (linkErrorCode) {
      console.error(
        `[travel-tools] hotel external URL blocked: ${linkErrorCode}`,
      );
    }
  }, [linkErrorCode]);

  function update<K extends keyof HotelValues>(key: K, value: string) {
    setConfirmed(null);
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "country") {
        next.region = "";
      }
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (isValid) {
      setConfirmed(values);
    }
  }

  const selectClass =
    "h-12 w-full rounded-[8px] border bg-[#FFFFFF] px-3 text-[16px] text-[#26282C] focus:border-2 focus:border-[#26282C] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1D4ED8]";

  return (
    <div data-testid="hotel-form" className="flex flex-col gap-6">
      <div>
        <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
          숙소 조건 정리
        </h2>
        {/* REQ-FUNC-023: 폼에 비전달 안내를 고정 노출한다. */}
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
            숙박 국가 *
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
          label="체크인"
          type="date"
          required
          min={today || undefined}
          value={values.checkIn}
          onChange={(event) => update("checkIn", event.target.value)}
          error={submitted ? (errors.checkIn ?? undefined) : undefined}
        />
        <TextInput
          label="체크아웃"
          type="date"
          required
          min={values.checkIn || today || undefined}
          value={values.checkOut}
          onChange={(event) => update("checkOut", event.target.value)}
          error={submitted ? (errors.checkOut ?? undefined) : undefined}
        />

        <div className="md:col-span-2">
          <Button type="submit">조건 확인</Button>
        </div>
      </form>

      {/* REQ-FUNC-022: 유효한 입력 후 요약을 보여준다. */}
      {confirmed && (
        <section
          aria-label="숙소 조건 요약"
          className="rounded-[14px] border border-[#E3E2DF] bg-[#F7F6F4] p-5"
        >
          <h3 className="text-[17px] font-semibold text-[#26282C]">
            정리한 숙소 조건
          </h3>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[14px] text-[#4B4E54]">
            <dt className="font-medium">숙박 지역</dt>
            <dd>
              {confirmed.country} · {confirmed.region}
            </dd>
            <dt className="font-medium">체크인</dt>
            <dd>{confirmed.checkIn}</dd>
            <dt className="font-medium">체크아웃</dt>
            <dd>{confirmed.checkOut}</dd>
          </dl>
          {/* REQ-FUNC-023: 요약에도 비전달 안내를 고정 노출한다. */}
          <p className="mt-3 text-[13px] font-medium text-[#2563A9]">
            ⓘ {NON_TRANSFER_NOTICE}. 외부 사이트에서 위 조건을 직접 입력해
            검색하세요.
          </p>
        </section>
      )}

      {linkCheck.ok ? (
        <div className="flex flex-col items-start gap-2">
          {/* REQ-FUNC-024: 새 탭 + noopener noreferrer. 조건 확인 전 비활성. */}
          <a
            data-testid="hotel-external-link"
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
            숙소 보러 가기
            <span aria-hidden="true">↗</span>
            <span className="sr-only">(새 탭에서 열림)</span>
          </a>
          {!canLeave && (
            <p className="text-[13px] text-[#84878D]">
              조건을 확인하면 외부 숙소 사이트로 이동할 수 있습니다.
            </p>
          )}
        </div>
      ) : (
        // REQ-FUNC-026: URL 오류면 이동을 막고 오류+재시도. 입력값은 유지된다.
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
