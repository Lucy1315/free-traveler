// 동행 참가 요청 목록/생성 Route Handler. REQ-FUNC-034·035.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/client";
import {
  createMateApplication,
  listApplicationsForPost,
} from "@/lib/db/queries";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/mates/[id]/applications — RLS가 신청자 본인·글 작성자·Moderator/
// Admin으로만 결과를 좁혀준다(mate_application_select_related). 그 외
// 이용자는 빈 배열을 받는다.
export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const { data, error } = await listApplicationsForPost(supabase, id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ applications: data });
}

interface CreateApplicationBody {
  message?: string;
}

// POST /api/mates/[id]/applications — 로그인 사용자만 신청할 수 있다
// (RLS: mate_application_insert_self). REQ-FUNC-035 중복(PENDING/ACCEPTED)
// 신청은 0001_schema.sql의 부분 유니크 인덱스가 최종 차단하며, 위반 시
// Postgres 23505 오류를 409로 변환해 돌려준다.
export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const body = (await request
    .json()
    .catch(() => null)) as CreateApplicationBody | null;
  if (
    !body?.message ||
    typeof body.message !== "string" ||
    body.message.trim().length === 0
  ) {
    return NextResponse.json(
      { error: "참가 메시지를 입력해 주세요." },
      { status: 400 },
    );
  }
  if (body.message.length > 500) {
    return NextResponse.json(
      { error: "참가 메시지는 최대 500자까지 입력할 수 있습니다." },
      { status: 400 },
    );
  }

  const { data, error } = await createMateApplication(
    supabase,
    id,
    user.id,
    body.message,
  );

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "이미 이 모집글에 참가 요청을 보냈습니다." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ application: data }, { status: 201 });
}
