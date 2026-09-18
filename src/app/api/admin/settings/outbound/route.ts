// 항공·숙소 외부 URL 설정 Route Handler. SCR-005 Admin 탭(UI_CONTRACT 5장) 지원.
// REQ-FUNC-077: Admin이 항공·호텔 외부 URL을 허용목록 내 HTTPS 주소로 설정한다.
//
// Security/Privacy AC "Moderator/Admin RLS 재검증": 0002_rls.sql이 쓰기를
// 최종 차단하지만, 이 Route Handler도 시작 시 역할을 명시적으로 재확인한다
// (CLAUDE.md 규칙 14).

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/client";
import {
  getUserProfile,
  listExternalUrlSettings,
  upsertExternalUrlSetting,
  type ExternalUrlCategory,
} from "@/lib/db/queries";

const CATEGORIES: ReadonlyArray<ExternalUrlCategory> = ["flight", "hotel"];

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

// GET /api/admin/settings/outbound — 현재 설정된 항공·숙소 URL 목록.
export async function GET() {
  const auth = await requireModeratorOrAdmin();
  if ("error" in auth) {
    return auth.error;
  }

  const { data, error } = await listExternalUrlSettings(auth.supabase);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ settings: data });
}

// PUT /api/admin/settings/outbound — { category: "flight"|"hotel", url: "https://..." }
export async function PUT(request: NextRequest) {
  const auth = await requireModeratorOrAdmin();
  if ("error" in auth) {
    return auth.error;
  }

  const body = (await request.json().catch(() => null)) as {
    category?: string;
    url?: string;
  } | null;

  if (
    !body?.category ||
    !CATEGORIES.includes(body.category as ExternalUrlCategory)
  ) {
    return NextResponse.json(
      { error: `category는 ${CATEGORIES.join(", ")} 중 하나여야 합니다.` },
      { status: 400 },
    );
  }

  if (
    !body.url ||
    typeof body.url !== "string" ||
    !body.url.startsWith("https://")
  ) {
    return NextResponse.json(
      { error: "url은 https://로 시작하는 주소여야 합니다." },
      { status: 400 },
    );
  }

  try {
    const { data, error } = await upsertExternalUrlSetting(
      auth.supabase,
      body.category as ExternalUrlCategory,
      body.url,
      auth.userId,
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ setting: data });
  } catch (validationError) {
    const message =
      validationError instanceof Error
        ? validationError.message
        : "요청을 처리할 수 없습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
