// SCR-005 Member 탭 "프로필". design-reference/UI_CONTRACT.md 5장, D-001 §10.
// REQ-FUNC-028(만 19세 이상 확인 — 정확한 생년월일은 저장하지 않고 is_adult·
// adult_verified_at만 기록), REQ-FUNC-029(닉네임·연령대·선택형 성별·여행
// 스타일·자기소개).
//
// 가입 직후에는 user_profile 행이 없으므로 같은 폼으로 처음 만든다(RLS
// insert_self — id = 본인). role 열은 DB 권한상 사용자가 쓸 수 없다(0004_grants).

"use client";

import { useEffect, useId, useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import TextInput from "@/components/ui/TextInput";
import { createBrowserSupabaseClient } from "@/lib/db/browser";
import {
  sanitizeText,
  type AgeRange,
  type Gender,
  type UserProfileRow,
} from "@/lib/db/queries";
import { MATE_TRAVEL_STYLES } from "@/components/scr004/FilterSummary";

const AGE_RANGES: { value: AgeRange; label: string }[] = [
  { value: "10s", label: "10대" },
  { value: "20s", label: "20대" },
  { value: "30s", label: "30대" },
  { value: "40s", label: "40대" },
  { value: "50s", label: "50대" },
  { value: "60plus", label: "60대 이상" },
];

const GENDERS: { value: Gender | ""; label: string }[] = [
  { value: "", label: "선택 안 함" },
  { value: "female", label: "여성" },
  { value: "male", label: "남성" },
  { value: "other", label: "기타" },
];

const NICKNAME_MAX = 20;
const BIO_MAX = 300;

interface FormValues {
  nickname: string;
  ageRange: AgeRange | "";
  gender: Gender | "";
  travelStyle: string[];
  bio: string;
  adultConfirmed: boolean;
}

function toFormValues(profile: UserProfileRow | null): FormValues {
  return {
    nickname: profile?.nickname ?? "",
    ageRange: profile?.age_range ?? "",
    gender: profile?.gender ?? "",
    travelStyle: profile?.travel_style ?? [],
    bio: profile?.bio ?? "",
    adultConfirmed: profile?.is_adult ?? false,
  };
}

export interface ProfileTabProps {
  userId: string;
  email?: string | null;
  /** 저장 후 최신 프로필을 부모에 알린다(성인 확인 상태 반영 등). */
  onSaved?: (profile: UserProfileRow) => void;
}

function ProfileForm({
  userId,
  email,
  profile,
  onSaved,
}: ProfileTabProps & { profile: UserProfileRow | null }) {
  const fieldId = useId();
  const [values, setValues] = useState<FormValues>(() => toFormValues(profile));
  const [current, setCurrent] = useState(profile);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const errors = {
    nickname: !values.nickname.trim()
      ? "닉네임을 입력해 주세요."
      : values.nickname.trim().length > NICKNAME_MAX
        ? `닉네임은 ${NICKNAME_MAX}자 이하로 입력해 주세요.`
        : null,
    ageRange: values.ageRange ? null : "연령대를 선택해 주세요.",
    bio:
      values.bio.length > BIO_MAX
        ? `자기소개는 ${BIO_MAX}자 이하로 입력해 주세요.`
        : null,
  };

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setSaved(false);
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    setError(null);
    if (Object.values(errors).some(Boolean) || saving) return;

    setSaving(true);
    try {
      const supabase = createBrowserSupabaseClient();
      // REQ-FUNC-028: 생년월일 없이 확인 여부와 처음 확인한 시각만 기록한다.
      const adultVerifiedAt = values.adultConfirmed
        ? (current?.adult_verified_at ?? new Date().toISOString())
        : null;
      const payload = {
        nickname: sanitizeText(values.nickname.trim()),
        age_range: values.ageRange,
        gender: values.gender || null,
        travel_style: values.travelStyle,
        bio: values.bio.trim() ? sanitizeText(values.bio.trim()) : null,
        is_adult: values.adultConfirmed,
        adult_verified_at: adultVerifiedAt,
      };
      const query = current
        ? supabase.from("user_profile").update(payload).eq("id", userId)
        : supabase.from("user_profile").insert({ id: userId, ...payload });
      const { data, error: saveError } = await query
        .select()
        .maybeSingle<UserProfileRow>();
      if (saveError || !data) {
        setError("프로필을 저장하지 못했습니다. 다시 시도해 주세요.");
        return;
      }
      setCurrent(data);
      setSaved(true);
      onSaved?.(data);
    } catch {
      setError("네트워크 오류로 저장하지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  }

  const selectClass =
    "h-12 w-full rounded-[8px] border bg-[#FFFFFF] px-3 text-[16px] text-[#26282C] focus:border-2 focus:border-[#26282C] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1D4ED8]";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        {current?.is_adult ? (
          <Badge variant="success">만 19세 이상 확인됨</Badge>
        ) : (
          <Badge variant="warning">만 19세 이상 확인 필요</Badge>
        )}
        {email && <span className="text-[14px] text-[#84878D]">{email}</span>}
      </div>

      {!current && (
        <p className="rounded-[14px] bg-[#F7F6F4] p-4 text-[14px] leading-[1.55] text-[#4B4E54]">
          처음 오셨네요. 닉네임과 연령대를 정하고 만 19세 이상 확인을 하면 동행
          모집글 작성과 참가 요청을 할 수 있습니다.
        </p>
      )}

      <form
        noValidate
        onSubmit={handleSubmit}
        data-testid="profile-form"
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <TextInput
          label="닉네임"
          required
          maxLength={NICKNAME_MAX}
          value={values.nickname}
          onChange={(event) => update("nickname", event.target.value)}
          error={submitted ? (errors.nickname ?? undefined) : undefined}
          helperText="다른 회원에게 보이는 이름입니다. 연락처는 넣지 마세요."
        />

        <div className="flex flex-col gap-2">
          <label
            htmlFor={`${fieldId}-age`}
            className="text-[13px] font-medium text-[#26282C]"
          >
            연령대 *
          </label>
          <select
            id={`${fieldId}-age`}
            value={values.ageRange}
            onChange={(event) =>
              update("ageRange", event.target.value as AgeRange | "")
            }
            aria-invalid={submitted && errors.ageRange !== null}
            className={`${selectClass} ${submitted && errors.ageRange ? "border-2 border-[#C7284B]" : "border-[#E3E2DF]"}`}
          >
            <option value="">연령대 선택</option>
            {AGE_RANGES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {submitted && errors.ageRange && (
            <p className="text-[13px] font-medium text-[#C7284B]">
              {errors.ageRange}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor={`${fieldId}-gender`}
            className="text-[13px] font-medium text-[#26282C]"
          >
            성별(선택)
          </label>
          <select
            id={`${fieldId}-gender`}
            value={values.gender}
            onChange={(event) =>
              update("gender", event.target.value as Gender | "")
            }
            className={`${selectClass} border-[#E3E2DF]`}
          >
            {GENDERS.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <span className="text-[13px] font-medium text-[#26282C]">
            여행 스타일
          </span>
          <div
            role="group"
            aria-label="여행 스타일"
            className="flex flex-wrap gap-2"
          >
            {MATE_TRAVEL_STYLES.map((style) => (
              <Chip
                key={style}
                active={values.travelStyle.includes(style)}
                onClick={() =>
                  update(
                    "travelStyle",
                    values.travelStyle.includes(style)
                      ? values.travelStyle.filter((item) => item !== style)
                      : [...values.travelStyle, style],
                  )
                }
              >
                {style}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label
            htmlFor={`${fieldId}-bio`}
            className="text-[13px] font-medium text-[#26282C]"
          >
            자기소개(선택)
          </label>
          <textarea
            id={`${fieldId}-bio`}
            rows={4}
            maxLength={BIO_MAX}
            value={values.bio}
            onChange={(event) => update("bio", event.target.value)}
            className="w-full rounded-[8px] border border-[#E3E2DF] bg-[#FFFFFF] px-3 py-3 text-[16px] leading-[1.6] text-[#26282C] focus:border-2 focus:border-[#26282C] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1D4ED8]"
          />
          <p className="text-right text-[13px] text-[#84878D]">
            {values.bio.length}/{BIO_MAX}
          </p>
        </div>

        <label className="flex min-h-[44px] items-start gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={values.adultConfirmed}
            onChange={(event) => update("adultConfirmed", event.target.checked)}
            className="mt-1 h-5 w-5"
          />
          <span className="text-[14px] leading-[1.55] text-[#26282C]">
            만 19세 이상입니다.
            <span className="block text-[13px] text-[#84878D]">
              생년월일은 저장하지 않고 확인 여부와 확인 시각만 기록합니다. 동행
              기능은 만 19세 이상만 이용할 수 있습니다.
            </span>
          </span>
        </label>

        {error && (
          <p
            role="alert"
            className="text-[14px] font-medium text-[#C7284B] md:col-span-2"
          >
            오류: {error}
          </p>
        )}
        {saved && (
          <p
            role="status"
            className="text-[14px] font-medium text-[#1F8A4C] md:col-span-2"
          >
            ✓ 프로필을 저장했습니다.
          </p>
        )}
        <div className="md:col-span-2">
          <Button type="submit" disabled={saving}>
            {saving ? "저장 중…" : current ? "프로필 저장" : "프로필 만들기"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function ProfileTab({
  userId,
  email,
  onSaved,
}: ProfileTabProps) {
  const [state, setState] = useState<
    | { kind: "loading" }
    | { kind: "error" }
    | { kind: "ready"; profile: UserProfileRow | null }
  >({ kind: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    createBrowserSupabaseClient()
      .from("user_profile")
      .select("*")
      .eq("id", userId)
      .maybeSingle<UserProfileRow>()
      .then(({ data, error }) => {
        if (cancelled) return;
        setState(error ? { kind: "error" } : { kind: "ready", profile: data });
      });
    return () => {
      cancelled = true;
    };
  }, [userId, reloadKey]);

  return (
    <section aria-labelledby="profile-title" className="flex flex-col gap-4">
      <div>
        <h2
          id="profile-title"
          className="text-[24px] font-semibold leading-[1.35] text-[#26282C]"
        >
          프로필
        </h2>
        <p className="mt-2 text-[16px] leading-[1.6] text-[#4B4E54]">
          동행 모집글과 참가 요청에 표시되는 정보입니다. 이메일·전화번호는 다른
          회원에게 공개되지 않습니다.
        </p>
      </div>
      {state.kind === "loading" ? (
        <div
          aria-busy="true"
          aria-label="불러오는 중"
          className="h-64 animate-pulse rounded-[14px] bg-[#F0EFEC]"
        />
      ) : state.kind === "error" ? (
        <div
          role="alert"
          className="rounded-[14px] border-2 border-[#C7284B] p-5"
        >
          <p className="text-[16px] font-medium text-[#C7284B]">
            오류: 프로필을 불러오지 못했습니다.
          </p>
          <div className="mt-3">
            <Button
              variant="secondary"
              onClick={() => {
                setState({ kind: "loading" });
                setReloadKey((key) => key + 1);
              }}
            >
              다시 시도
            </Button>
          </div>
        </div>
      ) : (
        <ProfileForm
          userId={userId}
          email={email}
          profile={state.profile}
          onSaved={onSaved}
        />
      )}
    </section>
  );
}
