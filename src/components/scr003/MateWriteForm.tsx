// SCR-003 동행 글쓰기 탭: 로그인·성인 확인 → 모집글 입력·검증 → 제출.
// design-reference/D-001/DESIGN.md §10(Form)·§14(Unauthorized), UI_CONTRACT.md
// 3장 5번 영역 기준. REQ-FUNC-027·028·029·031·032·054·080.
//
// - 로그인(REQ-FUNC-027)과 성인 확인(REQ-FUNC-028 — user_profile.is_adult만
//   본다, 생년월일은 묻지도 저장하지도 않는다)이 끝난 사용자만 폼을 본다.
// - 제출은 서버 검증을 거치도록 POST /api/mates로 보낸다(CLAUDE.md 규칙 14).
//   안전수칙 동의 시각은 서버가 기록한다(REQ-FUNC-080).
// - 제목·선호 조건·상세 설명에서 연락처 패턴을 찾으면 제출을 막는다
//   (REQ-FUNC-032). 탐지 함수는 UNIT-CONTACT-DETECTION이 재사용한다.
// - 성공 안내는 role="status" 인라인 문구로 보여준다. ToastProvider가 아직
//   layout.tsx에 마운트되지 않아 Toast를 쓰지 않는다.

"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import TextInput from "@/components/ui/TextInput";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import { createBrowserSupabaseClient } from "@/lib/db/client";
import { getUserProfile } from "@/lib/db/queries";
import { mateSafetyConsentLabel, mateSafetyPolicy } from "@/data/policies";
import {
  useLocalToday,
  validateDateRange,
  type DateRangeError,
  type LocationOption,
} from "@/components/scr003/FlightForm";

// ---------------------------------------------------------------------------
// 연락처 패턴 탐지(순수 함수) — REQ-FUNC-032. tests/unit/contactDetection.test.ts
// (UNIT-CONTACT-DETECTION)가 이 함수를 직접 테스트한다. 날짜("2026-09-18")를
// 전화번호로 오탐하지 않도록 번호는 0 또는 +82로 시작하는 형태로 좁힌다.
// ---------------------------------------------------------------------------

export type ContactKind = "phone" | "email" | "messenger";

const CONTACT_PATTERNS: { kind: ContactKind; pattern: RegExp }[] = [
  { kind: "email", pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i },
  {
    kind: "phone",
    pattern:
      /(?:\+82[\s.-]?1\d|\+82[\s.-]?0?[2-6]\d?|0\d{1,2})[\s.-]?\d{3,4}[\s.-]?\d{4}/,
  },
  { kind: "phone", pattern: /(?:^|\D)01[016789]\d{7,8}(?!\d)/ },
  {
    kind: "messenger",
    pattern:
      /(?:카카오톡|카톡|kakao(?:talk)?|라인|\bline\b|텔레그램|telegram|위챗|wechat|인스타(?:그램)?|instagram|디엠|\bdm\b)\s*(?:아이디|id)?\s*[:：]?\s*@?[A-Za-z0-9._-]{3,}/i,
  },
  { kind: "messenger", pattern: /open\.kakao\.com\/\S+/i },
];

/** 텍스트에서 찾은 연락처 종류 목록(중복 없음, 없으면 빈 배열). */
export function detectContactInfo(text: string): ContactKind[] {
  const found = new Set<ContactKind>();
  for (const { kind, pattern } of CONTACT_PATTERNS) {
    if (pattern.test(text)) {
      found.add(kind);
    }
  }
  return Array.from(found);
}

const CONTACT_LABELS: Record<ContactKind, string> = {
  phone: "전화번호",
  email: "이메일",
  messenger: "메신저 ID",
};

// ---------------------------------------------------------------------------

const TRAVEL_STYLES = [
  "자연",
  "도심",
  "미식",
  "사진",
  "액티비티",
  "휴양",
  "역사·문화",
  "쇼핑",
] as const;

const MATE_DATE_MESSAGES: Record<DateRangeError, string> = {
  START_REQUIRED: "시작일을 선택해 주세요.",
  END_REQUIRED: "종료일을 선택해 주세요.",
  START_IN_PAST: "시작일은 오늘 이후 날짜여야 합니다.",
  END_BEFORE_START: "종료일은 시작일보다 빠를 수 없습니다.",
  END_NOT_AFTER_START: "종료일은 시작일 이후여야 합니다.",
};

type AuthState = "checking" | "guest" | "needs_adult" | "ready";

interface MateValues {
  title: string;
  country: string;
  region: string;
  startDate: string;
  endDate: string;
  capacity: string;
  preferredConditions: string;
  travelStyle: string[];
  description: string;
  safetyAgreed: boolean;
}

const EMPTY_VALUES: MateValues = {
  title: "",
  country: "",
  region: "",
  startDate: "",
  endDate: "",
  capacity: "2",
  preferredConditions: "",
  travelStyle: [],
  description: "",
  safetyAgreed: false,
};

export interface MateWriteFormProps {
  locations: LocationOption[];
}

export default function MateWriteForm({ locations }: MateWriteFormProps) {
  const fieldId = useId();
  const [auth, setAuth] = useState<AuthState>("checking");
  const [values, setValues] = useState<MateValues>(EMPTY_VALUES);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [createdPostId, setCreatedPostId] = useState<string | null>(null);

  // REQ-FUNC-027·028: 로그인 세션과 성인 확인 상태를 브라우저에서 확인한다.
  // Supabase 설정이 없는 환경에서는 세션을 만들 수 없으므로 비로그인으로 본다.
  useEffect(() => {
    let cancelled = false;
    async function loadAuth() {
      try {
        const supabase = createBrowserSupabaseClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          if (!cancelled) setAuth("guest");
          return;
        }
        const { data: profile } = await getUserProfile(supabase, user.id);
        if (!cancelled) setAuth(profile?.is_adult ? "ready" : "needs_adult");
      } catch {
        if (!cancelled) setAuth("guest");
      }
    }
    void loadAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  const regions =
    locations.find((option) => option.country === values.country)?.regions ??
    [];
  const today = useLocalToday();
  const dateResult = validateDateRange(
    values.startDate,
    values.endDate,
    today,
    true,
  );
  const capacity = Number(values.capacity);
  const contactFindings = detectContactInfo(
    [values.title, values.preferredConditions, values.description].join("\n"),
  );

  const errors = {
    title: values.title.trim() ? null : "제목을 입력해 주세요.",
    country: values.country ? null : "국가를 선택해 주세요.",
    region: !values.region
      ? "지역·도시를 선택해 주세요."
      : regions.includes(values.region)
        ? null
        : "선택한 국가의 지역·도시를 골라 주세요.",
    startDate: dateResult.startError
      ? MATE_DATE_MESSAGES[dateResult.startError]
      : null,
    endDate: dateResult.endError
      ? MATE_DATE_MESSAGES[dateResult.endError]
      : null,
    capacity:
      Number.isInteger(capacity) && capacity >= 1 && capacity <= 20
        ? null
        : "모집 인원은 1~20명 사이로 입력해 주세요.",
    travelStyle:
      values.travelStyle.length > 0
        ? null
        : "여행 스타일을 하나 이상 선택해 주세요.",
    description: values.description.trim()
      ? null
      : "상세 설명을 입력해 주세요.",
    // REQ-FUNC-032: 연락처 패턴이 있으면 제출을 막는다.
    contact:
      contactFindings.length > 0
        ? `본문에 ${contactFindings.map((kind) => CONTACT_LABELS[kind]).join("·")}로 보이는 내용이 있습니다. 연락처는 참가 승인 후 서비스 밖에서 직접 주고받아 주세요.`
        : null,
    // REQ-FUNC-080: 안전수칙 동의 없이는 제출할 수 없다.
    safetyAgreed: values.safetyAgreed
      ? null
      : "동행 안전수칙에 동의해야 모집글을 등록할 수 있습니다.",
  };
  const isValid = Object.values(errors).every((error) => error === null);

  function update<K extends keyof MateValues>(key: K, value: MateValues[K]) {
    setServerError(null);
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "country") {
        next.region = "";
      }
      return next;
    });
  }

  function toggleStyle(style: string) {
    update(
      "travelStyle",
      values.travelStyle.includes(style)
        ? values.travelStyle.filter((item) => item !== style)
        : [...values.travelStyle, style],
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid || submitting) {
      return;
    }

    setSubmitting(true);
    setServerError(null);
    try {
      const response = await fetch("/api/mates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title.trim(),
          country: values.country,
          region: values.region,
          startDate: values.startDate,
          endDate: values.endDate,
          capacity,
          preferredConditions: values.preferredConditions.trim() || undefined,
          travelStyle: values.travelStyle,
          description: values.description.trim(),
          safetyAgreementConsented: values.safetyAgreed,
        }),
      });

      if (response.status === 401) {
        setAuth("guest");
        return;
      }
      const data = (await response.json().catch(() => null)) as {
        post?: { id: string };
        error?: string;
      } | null;
      if (!response.ok || !data?.post) {
        setServerError(
          data?.error ??
            "모집글을 등록하지 못했습니다. 잠시 후 다시 시도해 주세요.",
        );
        return;
      }
      setCreatedPostId(data.post.id);
    } catch {
      setServerError(
        "네트워크 오류로 모집글을 등록하지 못했습니다. 입력한 내용은 그대로 있으니 다시 시도해 주세요.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function startNewPost() {
    setValues(EMPTY_VALUES);
    setSubmitted(false);
    setCreatedPostId(null);
  }

  const selectClass =
    "h-12 w-full rounded-[8px] border bg-[#FFFFFF] px-3 text-[16px] text-[#26282C] outline-none focus:border-2 focus:border-[#26282C] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1D4ED8]";
  const errorText = "text-[13px] font-medium text-[#C7284B]";
  const show = (message: string | null) => (submitted ? message : null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[24px] font-semibold leading-[1.35] text-[#26282C]">
          동행 모집글 작성
        </h2>
        {/* REQ-FUNC-054: 안전정보는 공식 판단을 대체하지 않는다는 고지. */}
        <p className="mt-2 text-[14px] leading-[1.55] text-[#4B4E54]">
          여행지의 안전정보는 참고용이며 공식 판단을 대체하지 않습니다. 출국
          직전 외교부 해외안전여행에서 원문을 다시 확인하세요.
        </p>
      </div>

      {auth === "checking" && (
        <div
          aria-busy="true"
          className="h-40 animate-pulse rounded-[14px] bg-[#F0EFEC]"
        />
      )}

      {/* D-001 §14 Unauthorized: 문장 + 로그인 이동 버튼(SCR-005 유도). */}
      {auth === "guest" && (
        <div
          data-testid="mate-write-login-notice"
          className="rounded-[14px] border border-[#E3E2DF] bg-[#F7F6F4] p-6"
        >
          <p className="text-[17px] font-semibold text-[#26282C]">
            로그인이 필요합니다
          </p>
          <p className="mt-2 text-[14px] leading-[1.55] text-[#4B4E54]">
            동행 모집글은 이메일 인증을 마친 회원만 작성할 수 있습니다. 로그인
            후 이 탭으로 돌아오면 바로 작성할 수 있습니다.
          </p>
          <Link
            href="/account"
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            로그인하러 가기
          </Link>
        </div>
      )}

      {auth === "needs_adult" && (
        <div className="rounded-[14px] border border-[#E3E2DF] bg-[#F7F6F4] p-6">
          <p className="text-[17px] font-semibold text-[#26282C]">
            성인 확인이 필요합니다
          </p>
          <p className="mt-2 text-[14px] leading-[1.55] text-[#4B4E54]">
            동행 모집글은 만 19세 이상 확인을 마친 회원만 작성할 수 있습니다.
            계정의 프로필에서 성인 확인을 완료해 주세요(생년월일은 저장하지
            않습니다).
          </p>
          <Link
            href="/account"
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F]"
          >
            프로필에서 성인 확인하기
          </Link>
        </div>
      )}

      {auth === "ready" && createdPostId && (
        <div
          role="status"
          className="rounded-[14px] border border-[#E3E2DF] bg-[#FFFFFF] p-6"
        >
          <p className="text-[17px] font-semibold text-[#1F8A4C]">
            ✓ 모집글이 등록되었습니다.
          </p>
          <p className="mt-2 text-[14px] text-[#4B4E54]">
            동행 찾기에서 참가 요청이 들어오면 계정의 내 활동에서 확인할 수
            있습니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/mates?postId=${createdPostId}`}
              className="inline-flex min-h-[44px] items-center justify-center rounded-[8px] bg-[#FF6A4D] px-5 text-[16px] font-semibold text-[#FFFFFF] hover:bg-[#E5502F]"
            >
              등록한 모집글 보기
            </Link>
            <Button variant="secondary" onClick={startNewPost}>
              새 모집글 작성
            </Button>
          </div>
        </div>
      )}

      {auth === "ready" && !createdPostId && (
        <form
          data-testid="mate-write-form"
          noValidate
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <TextInput
              label="제목"
              required
              maxLength={60}
              value={values.title}
              onChange={(event) => update("title", event.target.value)}
              error={show(errors.title) ?? undefined}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`${fieldId}-country`}
              className="text-[13px] font-medium text-[#26282C]"
            >
              국가 *
            </label>
            <select
              id={`${fieldId}-country`}
              value={values.country}
              onChange={(event) => update("country", event.target.value)}
              aria-invalid={show(errors.country) !== null}
              className={`${selectClass} ${show(errors.country) ? "border-2 border-[#C7284B]" : "border-[#E3E2DF]"}`}
            >
              <option value="">국가 선택</option>
              {locations.map((option) => (
                <option key={option.country} value={option.country}>
                  {option.country}
                </option>
              ))}
            </select>
            {show(errors.country) && (
              <p className={errorText}>{errors.country}</p>
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
              aria-invalid={show(errors.region) !== null}
              className={`${selectClass} disabled:bg-[#F7F6F4] ${show(errors.region) ? "border-2 border-[#C7284B]" : "border-[#E3E2DF]"}`}
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
            {show(errors.region) && (
              <p className={errorText}>{errors.region}</p>
            )}
          </div>

          <TextInput
            label="시작일"
            type="date"
            required
            min={today || undefined}
            value={values.startDate}
            onChange={(event) => update("startDate", event.target.value)}
            error={show(errors.startDate) ?? undefined}
          />
          <TextInput
            label="종료일"
            type="date"
            required
            min={values.startDate || today || undefined}
            value={values.endDate}
            onChange={(event) => update("endDate", event.target.value)}
            error={show(errors.endDate) ?? undefined}
          />

          <TextInput
            label="모집 인원(명)"
            type="number"
            required
            min={1}
            max={20}
            value={values.capacity}
            onChange={(event) => update("capacity", event.target.value)}
            error={show(errors.capacity) ?? undefined}
          />
          <TextInput
            label="선호 조건(선택)"
            maxLength={100}
            value={values.preferredConditions}
            onChange={(event) =>
              update("preferredConditions", event.target.value)
            }
            helperText="예: 비슷한 연령대, 아침형 일정 선호"
          />

          <fieldset className="md:col-span-2">
            <legend className="text-[13px] font-medium text-[#26282C]">
              여행 스타일 *
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {TRAVEL_STYLES.map((style) => (
                <Chip
                  key={style}
                  active={values.travelStyle.includes(style)}
                  onClick={() => toggleStyle(style)}
                >
                  {style}
                </Chip>
              ))}
            </div>
            {show(errors.travelStyle) && (
              <p className={`mt-1.5 ${errorText}`}>{errors.travelStyle}</p>
            )}
          </fieldset>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label
              htmlFor={`${fieldId}-description`}
              className="text-[13px] font-medium text-[#26282C]"
            >
              상세 설명 *
            </label>
            <textarea
              id={`${fieldId}-description`}
              rows={6}
              maxLength={2000}
              value={values.description}
              onChange={(event) => update("description", event.target.value)}
              aria-invalid={show(errors.description) !== null}
              className={`w-full rounded-[8px] border bg-[#FFFFFF] px-3 py-3 text-[16px] leading-[1.6] text-[#26282C] outline-none focus:border-2 focus:border-[#26282C] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1D4ED8] ${show(errors.description) ? "border-2 border-[#C7284B]" : "border-[#E3E2DF]"}`}
            />
            <p className="text-[13px] text-[#84878D]">
              전화번호·이메일·메신저 ID는 적지 마세요. 연락처가 보이면 등록이
              막힙니다.
            </p>
            {show(errors.description) && (
              <p className={errorText}>{errors.description}</p>
            )}
          </div>

          {/* REQ-FUNC-032: 연락처 탐지 결과(제목·선호 조건·설명 전체 대상). */}
          {show(errors.contact) && (
            <p role="alert" className={`md:col-span-2 ${errorText}`}>
              {errors.contact}
            </p>
          )}

          {/* REQ-FUNC-080: 안전수칙 확인 + 동의 체크. */}
          <div className="rounded-[14px] border border-[#E3E2DF] bg-[#F7F6F4] p-4 md:col-span-2">
            <details>
              <summary className="cursor-pointer text-[14px] font-semibold text-[#26282C]">
                {mateSafetyPolicy.title} 전문 보기(v{mateSafetyPolicy.version})
              </summary>
              <div className="mt-3 flex flex-col gap-3">
                {mateSafetyPolicy.sections.map((section) => (
                  <div key={section.heading}>
                    <p className="text-[14px] font-semibold text-[#26282C]">
                      {section.heading}
                    </p>
                    <p className="mt-1 text-[14px] leading-[1.55] text-[#4B4E54]">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>
            </details>
            <label className="mt-4 flex min-h-[44px] items-center gap-3 text-[14px] font-medium text-[#26282C]">
              <input
                type="checkbox"
                checked={values.safetyAgreed}
                onChange={(event) =>
                  update("safetyAgreed", event.target.checked)
                }
                className="h-5 w-5 accent-[#FF6A4D]"
              />
              {mateSafetyConsentLabel}
            </label>
            {show(errors.safetyAgreed) && (
              <p className={errorText}>{errors.safetyAgreed}</p>
            )}
          </div>

          {serverError && (
            <p role="alert" className={`md:col-span-2 ${errorText}`}>
              {serverError}
            </p>
          )}

          <div className="md:col-span-2">
            <Button
              type="submit"
              data-testid="mate-write-submit"
              disabled={submitting}
            >
              {submitting ? "등록 중…" : "모집글 등록"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
