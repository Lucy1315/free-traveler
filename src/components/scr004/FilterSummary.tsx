// SCR-004 필터(국가·지역·여행 기간 겹침·연령대·성별·여행 스타일·모집 상태)와
// 결과 요약 텍스트. design-reference/D-001/DESIGN.md §8(Chip·드롭다운, 항상 AND
// 조건), UI_CONTRACT.md 4장 2번 영역. REQ-FUNC-030.
//
// - 필터 적용은 순수 함수 applyMateFilters로 분리했다. 페이지는 /api/mates 결과에
//   이 함수를 적용해 카드 목록과 결과 건수를 함께 만든다.
// - 연령대·성별은 mate_post에 컬럼이 없어 작성자 프로필(user_profile) 기준으로
//   거른다. 프로필은 로그인 사용자만 조회할 수 있으므로(RLS) 프로필 정보가
//   없으면 두 드롭다운을 비활성화하고 이유를 알린다.
// - 차단한 사용자의 글은 필터 값과 관계없이 항상 결과에서 뺀다(Security AC).

"use client";

import { useId } from "react";
import Chip from "@/components/ui/Chip";
import type {
  AgeRange,
  Gender,
  MatePostRow,
  MatePostStatus,
} from "@/lib/db/queries";
import type { LocationOption } from "@/components/scr003/FlightForm";

export interface MateFilterValue {
  country: string;
  region: string;
  /** 여행 기간 겹침 필터(YYYY-MM-DD). 둘 중 하나만 있으면 그 날짜 하루로 본다. */
  startDate: string;
  endDate: string;
  ageRange: AgeRange | "";
  gender: Gender | "";
  travelStyles: string[];
  status: MatePostStatus | "";
}

export const EMPTY_MATE_FILTER: MateFilterValue = {
  country: "",
  region: "",
  startDate: "",
  endDate: "",
  ageRange: "",
  gender: "",
  travelStyles: [],
  status: "",
};

/** 동행 글쓰기 폼(SCR-003)과 같은 여행 스타일 목록. */
export const MATE_TRAVEL_STYLES = [
  "자연",
  "도심",
  "미식",
  "사진",
  "액티비티",
  "휴양",
  "역사·문화",
  "쇼핑",
] as const;

const AGE_RANGE_LABELS: Record<AgeRange, string> = {
  "10s": "10대",
  "20s": "20대",
  "30s": "30대",
  "40s": "40대",
  "50s": "50대",
  "60plus": "60대 이상",
};

const GENDER_LABELS: Record<Gender, string> = {
  female: "여성",
  male: "남성",
  other: "기타",
};

const STATUS_OPTIONS: { value: MatePostStatus | ""; label: string }[] = [
  { value: "", label: "전체" },
  { value: "RECRUITING", label: "모집중" },
  { value: "CLOSED", label: "마감" },
];

/** 작성자 프로필 중 필터에 필요한 값만. */
export interface MateAuthorProfile {
  age_range: AgeRange;
  gender: Gender | null;
}

type FilterablePost = Pick<
  MatePostRow,
  | "author_id"
  | "country"
  | "region"
  | "start_date"
  | "end_date"
  | "travel_style"
> & { effectiveStatus: MatePostStatus };

export interface ApplyMateFiltersOptions {
  /** 내가 차단한 사용자 id. 이 사용자의 글은 항상 제외한다. */
  blockedUserIds?: ReadonlySet<string> | readonly string[];
  /** author_id → 프로필. 없으면 연령대·성별 필터는 적용하지 않는다. */
  authorProfiles?: ReadonlyMap<string, MateAuthorProfile>;
}

/** REQ-FUNC-030: 모든 필터를 AND로 적용한다(D-001 §8). */
export function applyMateFilters<T extends FilterablePost>(
  posts: readonly T[],
  filter: MateFilterValue,
  options: ApplyMateFiltersOptions = {},
): T[] {
  const blocked = new Set(options.blockedUserIds ?? []);
  const rangeStart = filter.startDate || filter.endDate;
  const rangeEnd = filter.endDate || filter.startDate;

  return posts.filter((post) => {
    if (blocked.has(post.author_id)) return false;
    if (filter.country && post.country !== filter.country) return false;
    if (filter.region && post.region !== filter.region) return false;
    if (filter.status && post.effectiveStatus !== filter.status) return false;
    if (
      filter.travelStyles.length > 0 &&
      !filter.travelStyles.some((style) => post.travel_style.includes(style))
    ) {
      return false;
    }
    if (
      rangeStart &&
      rangeEnd &&
      !(post.start_date <= rangeEnd && post.end_date >= rangeStart)
    ) {
      return false;
    }
    if (options.authorProfiles && (filter.ageRange || filter.gender)) {
      const profile = options.authorProfiles.get(post.author_id);
      if (!profile) return false;
      if (filter.ageRange && profile.age_range !== filter.ageRange) {
        return false;
      }
      if (filter.gender && profile.gender !== filter.gender) return false;
    }
    return true;
  });
}

export function isMateFilterEmpty(filter: MateFilterValue): boolean {
  return (
    !filter.country &&
    !filter.region &&
    !filter.startDate &&
    !filter.endDate &&
    !filter.ageRange &&
    !filter.gender &&
    filter.travelStyles.length === 0 &&
    !filter.status
  );
}

export interface FilterSummaryProps {
  value: MateFilterValue;
  onChange: (next: MateFilterValue) => void;
  /** 필터를 적용한 결과 건수. */
  resultCount: number;
  /** 필터를 적용하기 전 전체 건수(차단 제외 후). */
  totalCount: number;
  locations: LocationOption[];
  travelStyles?: readonly string[];
  /** 작성자 프로필을 불러왔는지(로그인 상태). false면 연령대·성별 비활성. */
  profileFilterAvailable: boolean;
}

export default function FilterSummary({
  value,
  onChange,
  resultCount,
  totalCount,
  locations,
  travelStyles = MATE_TRAVEL_STYLES,
  profileFilterAvailable,
}: FilterSummaryProps) {
  const fieldId = useId();
  const regions =
    locations.find((option) => option.country === value.country)?.regions ?? [];

  function update(patch: Partial<MateFilterValue>) {
    onChange({ ...value, ...patch });
  }

  function toggleStyle(style: string) {
    update({
      travelStyles: value.travelStyles.includes(style)
        ? value.travelStyles.filter((item) => item !== style)
        : [...value.travelStyles, style],
    });
  }

  const selectClass =
    "h-12 w-full rounded-[8px] border border-[#E3E2DF] bg-[#FFFFFF] px-3 text-[16px] text-[#26282C] focus:border-2 focus:border-[#26282C] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#1D4ED8] disabled:bg-[#F7F6F4] disabled:text-[#84878D]";
  const labelClass = "text-[13px] font-medium text-[#26282C]";
  const filtered = !isMateFilterEmpty(value);

  return (
    <section aria-label="동행글 필터" data-testid="mate-filter">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <label htmlFor={`${fieldId}-country`} className={labelClass}>
            국가
          </label>
          <select
            id={`${fieldId}-country`}
            value={value.country}
            onChange={(event) =>
              update({ country: event.target.value, region: "" })
            }
            className={selectClass}
          >
            <option value="">전체 국가</option>
            {locations.map((option) => (
              <option key={option.country} value={option.country}>
                {option.country}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${fieldId}-region`} className={labelClass}>
            지역·도시
          </label>
          <select
            id={`${fieldId}-region`}
            value={value.region}
            onChange={(event) => update({ region: event.target.value })}
            disabled={!value.country}
            className={selectClass}
          >
            <option value="">
              {value.country ? "전체 지역" : "국가를 먼저 선택하세요"}
            </option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${fieldId}-start`} className={labelClass}>
            여행 시작일
          </label>
          <input
            id={`${fieldId}-start`}
            type="date"
            value={value.startDate}
            max={value.endDate || undefined}
            onChange={(event) => update({ startDate: event.target.value })}
            className={selectClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${fieldId}-end`} className={labelClass}>
            여행 종료일
          </label>
          <input
            id={`${fieldId}-end`}
            type="date"
            value={value.endDate}
            min={value.startDate || undefined}
            onChange={(event) => update({ endDate: event.target.value })}
            className={selectClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${fieldId}-age`} className={labelClass}>
            작성자 연령대
          </label>
          <select
            id={`${fieldId}-age`}
            value={value.ageRange}
            onChange={(event) =>
              update({ ageRange: event.target.value as AgeRange | "" })
            }
            disabled={!profileFilterAvailable}
            aria-describedby={
              profileFilterAvailable ? undefined : `${fieldId}-profile-hint`
            }
            className={selectClass}
          >
            <option value="">전체 연령대</option>
            {(Object.keys(AGE_RANGE_LABELS) as AgeRange[]).map((age) => (
              <option key={age} value={age}>
                {AGE_RANGE_LABELS[age]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${fieldId}-gender`} className={labelClass}>
            작성자 성별
          </label>
          <select
            id={`${fieldId}-gender`}
            value={value.gender}
            onChange={(event) =>
              update({ gender: event.target.value as Gender | "" })
            }
            disabled={!profileFilterAvailable}
            aria-describedby={
              profileFilterAvailable ? undefined : `${fieldId}-profile-hint`
            }
            className={selectClass}
          >
            <option value="">전체 성별</option>
            {(Object.keys(GENDER_LABELS) as Gender[]).map((gender) => (
              <option key={gender} value={gender}>
                {GENDER_LABELS[gender]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!profileFilterAvailable && (
        <p
          id={`${fieldId}-profile-hint`}
          className="mt-2 text-[13px] text-[#84878D]"
        >
          로그인하면 작성자 연령대·성별로도 걸러 볼 수 있어요.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-3">
        <div
          role="group"
          aria-label="모집 상태"
          className="flex flex-wrap gap-2"
        >
          {STATUS_OPTIONS.map((option) => (
            <Chip
              key={option.label}
              active={value.status === option.value}
              onClick={() => update({ status: option.value })}
            >
              {option.label}
            </Chip>
          ))}
        </div>
        <div
          role="group"
          aria-label="여행 스타일"
          className="flex flex-wrap gap-2"
        >
          {travelStyles.map((style) => (
            <Chip
              key={style}
              active={value.travelStyles.includes(style)}
              onClick={() => toggleStyle(style)}
            >
              {style}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <p
          role="status"
          data-testid="mate-result-summary"
          className="text-[16px] text-[#4B4E54]"
        >
          {filtered
            ? `조건에 맞는 동행글 ${resultCount}개 (전체 ${totalCount}개)`
            : `동행글 ${totalCount}개`}
        </p>
        {filtered && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_MATE_FILTER)}
            className="min-h-[44px] rounded-[8px] px-3 text-[14px] font-semibold text-[#26282C] underline hover:bg-[#F7F6F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
          >
            필터 초기화
          </button>
        )}
      </div>
    </section>
  );
}
