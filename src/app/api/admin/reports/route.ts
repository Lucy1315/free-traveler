// 관리자 신고 처리 Route Handler. SCR-005 Admin 탭(UI_CONTRACT 5장) 지원.
// REQ-FUNC-041(축소: 상태별 필터 목록만)·042(축소: 신고 상태 변경만).
//
// Security/Privacy AC "Moderator/Admin RLS 재검증": 0002_rls.sql의 RLS
// 정책이 최종 방어선이지만, 이 Route Handler도 요청 시작 시 역할을 한 번 더
// 명시적으로 확인한다(CLAUDE.md 규칙 14 — 서버 검증 없이 데이터를 반환하지
// 않는다). RLS만 믿고 조용히 통과시키지 않는다.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/client";
import {
  getUserProfile,
  listReportsForModerator,
  updateReportStatus,
  type ReportStatus,
} from "@/lib/db/queries";

const UPDATABLE_STATUSES: ReadonlyArray<Exclude<ReportStatus, "PENDING">> = [
  "WARNED",
  "CONTENT_HIDDEN",
  "ACCOUNT_RESTRICTED",
  "DISMISSED",
];

const FILTERABLE_STATUSES: ReadonlyArray<ReportStatus> = [
  "PENDING",
  "WARNED",
  "CONTENT_HIDDEN",
  "ACCOUNT_RESTRICTED",
  "DISMISSED",
];

async function requireModeratorOrAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 },
      ),
    };
  }

  const { data: profile } = await getUserProfile(supabase, user.id);
  if (!profile || (profile.role !== "moderator" && profile.role !== "admin")) {
    return {
      error: NextResponse.json(
        { error: "Moderator 또는 Admin 권한이 필요합니다." },
        { status: 403 },
      ),
    };
  }

  return { supabase, userId: user.id };
}

// GET /api/admin/reports?status=PENDING — REQ-FUNC-041(축소): 상태별 필터 목록.
export async function GET(request: NextRequest) {
  const auth = await requireModeratorOrAdmin();
  if ("error" in auth) {
    return auth.error;
  }

  const statusParam = request.nextUrl.searchParams.get("status");
  let status: ReportStatus | undefined;
  if (statusParam) {
    if (!FILTERABLE_STATUSES.includes(statusParam as ReportStatus)) {
      return NextResponse.json(
        { error: "status 값이 올바르지 않습니다." },
        { status: 400 },
      );
    }
    status = statusParam as ReportStatus;
  }

  const { data, error } = await listReportsForModerator(auth.supabase, status);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reports: data });
}

// PATCH /api/admin/reports — REQ-FUNC-042(축소): 신고 상태 변경만.
export async function PATCH(request: NextRequest) {
  const auth = await requireModeratorOrAdmin();
  if ("error" in auth) {
    return auth.error;
  }

  const body = (await request.json().catch(() => null)) as {
    reportId?: string;
    status?: string;
  } | null;

  if (!body?.reportId || typeof body.reportId !== "string") {
    return NextResponse.json(
      { error: "reportId가 필요합니다." },
      { status: 400 },
    );
  }

  if (
    !body.status ||
    !UPDATABLE_STATUSES.includes(
      body.status as (typeof UPDATABLE_STATUSES)[number],
    )
  ) {
    return NextResponse.json(
      {
        error: `status는 ${UPDATABLE_STATUSES.join(", ")} 중 하나여야 합니다.`,
      },
      { status: 400 },
    );
  }

  const { data, error } = await updateReportStatus(
    auth.supabase,
    body.reportId,
    body.status as (typeof UPDATABLE_STATUSES)[number],
    auth.userId,
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    // RLS가 조건을 만족하지 않는 행을 조용히 빈 결과로 돌려준 경우(TC-3).
    return NextResponse.json(
      { error: "신고를 찾을 수 없거나 권한이 없습니다." },
      { status: 404 },
    );
  }

  return NextResponse.json({ report: data });
}
