// 사용자 차단/해제 Route Handler. REQ-FUNC-040.
//
// 범위 참고: REQ-FUNC-039(신고)는 이 Task의 Expected Files(5개 경로) 어디에도
// 전용 Route가 없다 — Task 문서 자체에 신고 전용 Route Handler 경로가
// 빠져 있는 것으로 보인다. 신고 생성은 RLS(report_insert_self)만으로 안전하게
// 막을 수 있어, 당장은 UI 계층이 src/lib/db/queries.ts의 createReport()를
// Server Action이나 브라우저 Supabase 클라이언트로 직접 호출하면 된다.
// 별도 Route Handler가 필요하다고 판단되면 새 Task로 추가해야 한다.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/client";
import { blockUser, listMyBlocks, unblockUser } from "@/lib/db/queries";

// GET /api/blocks — 본인의 차단 목록만 볼 수 있다(RLS: user_block_select_self).
export async function GET() {
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

  const { data, error } = await listMyBlocks(supabase, user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ blocks: data });
}

interface CreateBlockBody {
  blockedId?: string;
}

// POST /api/blocks — 본인이 다른 사용자를 차단한다(RLS: user_block_insert_self,
// user_block_not_self 제약이 자기 자신 차단을 막는다).
export async function POST(request: NextRequest) {
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
    .catch(() => null)) as CreateBlockBody | null;
  if (!body?.blockedId || typeof body.blockedId !== "string") {
    return NextResponse.json(
      { error: "blockedId가 필요합니다." },
      { status: 400 },
    );
  }
  if (body.blockedId === user.id) {
    return NextResponse.json(
      { error: "자기 자신은 차단할 수 없습니다." },
      { status: 400 },
    );
  }

  const { data, error } = await blockUser(supabase, user.id, body.blockedId);
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "이미 차단한 사용자입니다." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ block: data }, { status: 201 });
}

// DELETE /api/blocks?blockId=... — 차단 해제(RLS: user_block_delete_self).
export async function DELETE(request: NextRequest) {
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

  const blockId = request.nextUrl.searchParams.get("blockId");
  if (!blockId) {
    return NextResponse.json(
      { error: "blockId가 필요합니다." },
      { status: 400 },
    );
  }

  const { error } = await unblockUser(supabase, blockId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
