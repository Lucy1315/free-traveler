// 참가 요청 승인/거절/취소 Route Handler. REQ-FUNC-036.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/client";
import { cancelMyApplication, updateApplicationStatus } from "@/lib/db/queries";

interface RouteContext {
  params: Promise<{ id: string }>;
}

interface UpdateApplicationBody {
  status?: "ACCEPTED" | "REJECTED";
}

// PATCH /api/applications/[id] — 모집글 작성자만 ACCEPTED/REJECTED로 바꿀 수
// 있다(RLS: mate_application_update_by_post_author, PENDING 상태만 대상).
export async function PATCH(request: NextRequest, context: RouteContext) {
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
    .catch(() => null)) as UpdateApplicationBody | null;
  if (
    !body?.status ||
    (body.status !== "ACCEPTED" && body.status !== "REJECTED")
  ) {
    return NextResponse.json(
      { error: "status는 ACCEPTED 또는 REJECTED여야 합니다." },
      { status: 400 },
    );
  }

  const { data, error } = await updateApplicationStatus(
    supabase,
    id,
    body.status,
  );
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json(
      { error: "참가 요청을 찾을 수 없거나 권한이 없습니다." },
      { status: 404 },
    );
  }

  return NextResponse.json({ application: data });
}

// DELETE /api/applications/[id] — 신청자 본인이 PENDING 상태일 때만 취소할
// 수 있다(RLS: mate_application_delete_self_pending).
export async function DELETE(_request: NextRequest, context: RouteContext) {
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

  const { error } = await cancelMyApplication(supabase, id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
