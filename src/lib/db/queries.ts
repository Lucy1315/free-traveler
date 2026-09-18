// Supabase 쿼리 레이어(6개 테이블 CRUD). REQ-NF-014·015·017.
// 권한 판단(RLS)은 DB-RLS-BASE(supabase/migrations/0002_rls.sql)가 서버에서
// 강제한다 — 이 파일은 그 정책을 우회하는 코드를 쓰지 않는다(CLAUDE.md 규칙 14).
// 항공·호텔 원시 입력값(출발지·목적지·날짜 등)을 저장하는 함수는 여기 없다
// (REQ-NF-017) — 항공/숙소 폼은 브라우저 상태로만 다루고 서버로 보내지 않는다
// (src/lib/externalLink.ts, design-reference/UI_CONTRACT.md 3장 금지 기능).

import type { SupabaseClient } from "@supabase/supabase-js";

// REQ-NF-015: 자유 텍스트 입력을 저장하기 전에 HTML 태그를 제거하고 특수문자를
// 이스케이프한다. React가 렌더링 시에도 자동 이스케이프하지만, 저장 단계에서도
// 한 번 더 막아 저장 XSS 위험을 줄인다(방어의 이중화).
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .trim();
}

// =============================================================
// user_profile
// =============================================================

export type AgeRange = "10s" | "20s" | "30s" | "40s" | "50s" | "60plus";
export type Gender = "female" | "male" | "other";
export type UserRole = "member" | "moderator" | "admin";

export interface UserProfileRow {
  id: string;
  nickname: string;
  age_range: AgeRange;
  gender: Gender | null;
  travel_style: string[];
  bio: string | null;
  is_adult: boolean;
  adult_verified_at: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export async function getUserProfile(supabase: SupabaseClient, userId: string) {
  return supabase
    .from("user_profile")
    .select("*")
    .eq("id", userId)
    .maybeSingle<UserProfileRow>();
}

export interface UpdateOwnProfileInput {
  nickname?: string;
  ageRange?: AgeRange;
  gender?: Gender | null;
  travelStyle?: string[];
  bio?: string | null;
}

// 본인 프로필만 수정한다 — RLS가 서버에서도 강제하지만, 함수 시그니처
// 자체가 반드시 userId를 요구해 호출부가 대상 없는 수정을 만들 수 없게 한다.
export async function updateOwnProfile(
  supabase: SupabaseClient,
  userId: string,
  input: UpdateOwnProfileInput,
) {
  return supabase
    .from("user_profile")
    .update({
      ...(input.nickname !== undefined && {
        nickname: sanitizeText(input.nickname),
      }),
      ...(input.ageRange !== undefined && { age_range: input.ageRange }),
      ...(input.gender !== undefined && { gender: input.gender }),
      ...(input.travelStyle !== undefined && {
        travel_style: input.travelStyle,
      }),
      ...(input.bio !== undefined && {
        bio: input.bio === null ? null : sanitizeText(input.bio),
      }),
    })
    .eq("id", userId)
    .select()
    .maybeSingle<UserProfileRow>();
}

// =============================================================
// mate_post
// =============================================================

export type MatePostStatus = "RECRUITING" | "CLOSED";

export interface MatePostRow {
  id: string;
  author_id: string;
  title: string;
  country: string;
  region: string | null;
  start_date: string;
  end_date: string;
  capacity: number;
  preferred_conditions: string | null;
  travel_style: string[];
  description: string;
  safety_agreement_consented_at: string;
  status: MatePostStatus;
  closed_manually_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MatePostFilters {
  country?: string;
  region?: string;
  travelStyle?: string[];
  status?: MatePostStatus;
}

// REQ-FUNC-030: 국가·지역·여행 스타일·모집 상태로 필터한다. 여행 기간 겹침·
// 연령대·성별 필터는 UI 계층(CMP-SCR004-FILTER-SUMMARY)에서 이 결과를 추가로
// 좁힐 때 함께 구현한다(이 함수는 서버 필터 가능한 범위만 맡는다).
export async function listMatePosts(
  supabase: SupabaseClient,
  filters: MatePostFilters = {},
) {
  let query = supabase
    .from("mate_post")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.country) {
    query = query.eq("country", filters.country);
  }
  if (filters.region) {
    query = query.eq("region", filters.region);
  }
  if (filters.travelStyle && filters.travelStyle.length > 0) {
    query = query.overlaps("travel_style", filters.travelStyle);
  }
  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  return query.returns<MatePostRow[]>();
}

export async function getMatePost(supabase: SupabaseClient, postId: string) {
  return supabase
    .from("mate_post")
    .select("*")
    .eq("id", postId)
    .maybeSingle<MatePostRow>();
}

export interface CreateMatePostInput {
  authorId: string;
  title: string;
  country: string;
  region?: string;
  startDate: string;
  endDate: string;
  capacity: number;
  preferredConditions?: string;
  travelStyle: string[];
  description: string;
  /** REQ-FUNC-031: 안전수칙 동의 시각(제출 직전 클라이언트가 기록). */
  safetyAgreementConsentedAt: string;
}

export async function createMatePost(
  supabase: SupabaseClient,
  input: CreateMatePostInput,
) {
  return supabase
    .from("mate_post")
    .insert({
      author_id: input.authorId,
      title: sanitizeText(input.title),
      country: input.country,
      region: input.region ?? null,
      start_date: input.startDate,
      end_date: input.endDate,
      capacity: input.capacity,
      preferred_conditions: input.preferredConditions
        ? sanitizeText(input.preferredConditions)
        : null,
      travel_style: input.travelStyle,
      description: sanitizeText(input.description),
      safety_agreement_consented_at: input.safetyAgreementConsentedAt,
    })
    .select()
    .single<MatePostRow>();
}

export interface UpdateMatePostInput {
  title?: string;
  region?: string | null;
  capacity?: number;
  preferredConditions?: string | null;
  travelStyle?: string[];
  description?: string;
}

export async function updateMatePost(
  supabase: SupabaseClient,
  postId: string,
  input: UpdateMatePostInput,
) {
  return supabase
    .from("mate_post")
    .update({
      ...(input.title !== undefined && { title: sanitizeText(input.title) }),
      ...(input.region !== undefined && { region: input.region }),
      ...(input.capacity !== undefined && { capacity: input.capacity }),
      ...(input.preferredConditions !== undefined && {
        preferred_conditions:
          input.preferredConditions === null
            ? null
            : sanitizeText(input.preferredConditions),
      }),
      ...(input.travelStyle !== undefined && {
        travel_style: input.travelStyle,
      }),
      ...(input.description !== undefined && {
        description: sanitizeText(input.description),
      }),
    })
    .eq("id", postId)
    .select()
    .maybeSingle<MatePostRow>();
}

// REQ-FUNC-038: 작성자가 수동으로 모집을 마감한다.
export async function closeMatePostManually(
  supabase: SupabaseClient,
  postId: string,
) {
  return supabase
    .from("mate_post")
    .update({ status: "CLOSED", closed_manually_at: new Date().toISOString() })
    .eq("id", postId)
    .select()
    .maybeSingle<MatePostRow>();
}

export async function deleteMatePost(supabase: SupabaseClient, postId: string) {
  return supabase.from("mate_post").delete().eq("id", postId);
}

// =============================================================
// mate_application
// =============================================================

export type MateApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface MateApplicationRow {
  id: string;
  post_id: string;
  applicant_id: string;
  message: string;
  status: MateApplicationStatus;
  created_at: string;
  updated_at: string;
}

// REQ-FUNC-034: 최대 500자 참가 메시지. REQ-FUNC-035(동일 사용자·동일 글
// PENDING/ACCEPTED 중복 신청)는 0002_rls.sql의 부분 유니크 인덱스가 DB 단에서
// 최종적으로 막는다 — 이 함수는 그 제약 위반 시 에러를 그대로 반환한다.
export async function createMateApplication(
  supabase: SupabaseClient,
  postId: string,
  applicantId: string,
  message: string,
) {
  return supabase
    .from("mate_application")
    .insert({
      post_id: postId,
      applicant_id: applicantId,
      message: sanitizeText(message).slice(0, 500),
    })
    .select()
    .single<MateApplicationRow>();
}

export async function listApplicationsForPost(
  supabase: SupabaseClient,
  postId: string,
) {
  return supabase
    .from("mate_application")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .returns<MateApplicationRow[]>();
}

export async function listMyApplications(
  supabase: SupabaseClient,
  applicantId: string,
) {
  return supabase
    .from("mate_application")
    .select("*")
    .eq("applicant_id", applicantId)
    .order("created_at", { ascending: false })
    .returns<MateApplicationRow[]>();
}

// REQ-FUNC-036: 글 작성자만 ACCEPTED/REJECTED로 바꿀 수 있다(RLS가 강제).
export async function updateApplicationStatus(
  supabase: SupabaseClient,
  applicationId: string,
  status: Extract<MateApplicationStatus, "ACCEPTED" | "REJECTED">,
) {
  return supabase
    .from("mate_application")
    .update({ status })
    .eq("id", applicationId)
    .select()
    .maybeSingle<MateApplicationRow>();
}

// 신청자 본인이 PENDING 상태의 요청을 취소한다.
export async function cancelMyApplication(
  supabase: SupabaseClient,
  applicationId: string,
) {
  return supabase
    .from("mate_application")
    .delete()
    .eq("id", applicationId)
    .eq("status", "PENDING");
}

// =============================================================
// user_block
// =============================================================

export interface UserBlockRow {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

export async function listMyBlocks(
  supabase: SupabaseClient,
  blockerId: string,
) {
  return supabase
    .from("user_block")
    .select("*")
    .eq("blocker_id", blockerId)
    .order("created_at", { ascending: false })
    .returns<UserBlockRow[]>();
}

export async function blockUser(
  supabase: SupabaseClient,
  blockerId: string,
  blockedId: string,
) {
  return supabase
    .from("user_block")
    .insert({ blocker_id: blockerId, blocked_id: blockedId })
    .select()
    .single<UserBlockRow>();
}

export async function unblockUser(supabase: SupabaseClient, blockId: string) {
  return supabase.from("user_block").delete().eq("id", blockId);
}

// =============================================================
// report
// =============================================================

export type ReportTargetType =
  "mate_post" | "user_profile" | "mate_application";
export type ReportStatus =
  "PENDING" | "WARNED" | "CONTENT_HIDDEN" | "ACCOUNT_RESTRICTED" | "DISMISSED";

export interface ReportRow {
  id: string;
  reporter_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason_code: string;
  description: string | null;
  status: ReportStatus;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface CreateReportInput {
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reasonCode: string;
  description?: string;
}

// REQ-FUNC-039.
export async function createReport(
  supabase: SupabaseClient,
  input: CreateReportInput,
) {
  return supabase
    .from("report")
    .insert({
      reporter_id: input.reporterId,
      target_type: input.targetType,
      target_id: input.targetId,
      reason_code: input.reasonCode,
      description: input.description ? sanitizeText(input.description) : null,
    })
    .select()
    .single<ReportRow>();
}

export async function listMyReports(
  supabase: SupabaseClient,
  reporterId: string,
) {
  return supabase
    .from("report")
    .select("*")
    .eq("reporter_id", reporterId)
    .order("created_at", { ascending: false })
    .returns<ReportRow[]>();
}

// REQ-FUNC-041(축소): Moderator/Admin 전용 상태별 필터 목록. RLS가 호출자
// 권한을 강제하므로, Moderator/Admin이 아니면 빈 배열이 돌아온다.
export async function listReportsForModerator(
  supabase: SupabaseClient,
  status?: ReportStatus,
) {
  let query = supabase
    .from("report")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  return query.returns<ReportRow[]>();
}

// REQ-FUNC-042(축소): 상태 변경만 기록한다(세부 제재 로그 테이블 없음).
export async function updateReportStatus(
  supabase: SupabaseClient,
  reportId: string,
  status: Exclude<ReportStatus, "PENDING">,
  resolvedBy: string,
) {
  return supabase
    .from("report")
    .update({
      status,
      resolved_by: resolvedBy,
      resolved_at: new Date().toISOString(),
    })
    .eq("id", reportId)
    .select()
    .maybeSingle<ReportRow>();
}

// =============================================================
// external_url_setting
// =============================================================

// flight/hotel: 항공·숙소 외부 이동(REQ-FUNC-077). contact/instagram/youtube/
// blog: 대표 소개의 문의·SNS 링크(REQ-FUNC-062, 0003_contact_links.sql).
export const EXTERNAL_URL_CATEGORIES = [
  "flight",
  "hotel",
  "contact",
  "instagram",
  "youtube",
  "blog",
] as const;

export type ExternalUrlCategory = (typeof EXTERNAL_URL_CATEGORIES)[number];

export const CONTACT_LINK_CATEGORIES: ReadonlyArray<ExternalUrlCategory> = [
  "contact",
  "instagram",
  "youtube",
  "blog",
];

// 0003_contact_links.sql의 url CHECK와 같은 규칙: 모든 category는 https,
// 문의(contact)만 mailto도 허용한다.
export function isAllowedExternalUrl(
  category: ExternalUrlCategory,
  url: string,
): boolean {
  if (url.startsWith("https://")) {
    return true;
  }
  return category === "contact" && url.startsWith("mailto:");
}

export interface ExternalUrlSettingRow {
  id: string;
  category: ExternalUrlCategory;
  url: string;
  updated_by: string | null;
  updated_at: string;
}

export async function getExternalUrlSetting(
  supabase: SupabaseClient,
  category: ExternalUrlCategory,
) {
  return supabase
    .from("external_url_setting")
    .select("*")
    .eq("category", category)
    .maybeSingle<ExternalUrlSettingRow>();
}

export async function listExternalUrlSettings(supabase: SupabaseClient) {
  return supabase
    .from("external_url_setting")
    .select("*")
    .order("category", { ascending: true })
    .returns<ExternalUrlSettingRow[]>();
}

// REQ-FUNC-077·062: Admin/Moderator만 쓸 수 있다(RLS가 강제). 허용 프로토콜은
// isAllowedExternalUrl이 정한다(DB CHECK 제약이 최종 방어선, 여기서도 한 번
// 더 검사한다).
export async function upsertExternalUrlSetting(
  supabase: SupabaseClient,
  category: ExternalUrlCategory,
  url: string,
  updatedBy: string,
) {
  if (!isAllowedExternalUrl(category, url)) {
    throw new Error(
      category === "contact"
        ? "문의 링크는 https:// 또는 mailto:로 시작해야 합니다."
        : "외부 URL은 https://로 시작해야 합니다.",
    );
  }

  return supabase
    .from("external_url_setting")
    .upsert(
      {
        category,
        url,
        updated_by: updatedBy,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "category" },
    )
    .select()
    .single<ExternalUrlSettingRow>();
}
