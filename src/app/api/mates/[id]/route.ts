// 동행 모집글 상세/수정/삭제 Route Handler. REQ-FUNC-033·037·038.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/client";
import {
  closeMatePostManually,
  deleteMatePost,
  getMatePost,
  updateMatePost,
  type MatePostRow,
} from "@/lib/db/queries";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function withEffectiveStatus(row: MatePostRow) {
  const isPastEndDate =
    new Date(row.end_date) < new Date(new Date().toDateString());
  return {
    ...row,
    effectiveStatus:
      row.status === "CLOSED" || isPastEndDate ? "CLOSED" : "RECRUITING",
  };
}

// GET /api/mates/[id] — 로그인 없이도 조회 가능(RLS: mate_post_select_public).
export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createServerSupabaseClient();

  const { data, error } = await getMatePost(supabase, id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json(
      { error: "모집글을 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  return NextResponse.json({ post: withEffectiveStatus(data) });
}

interface UpdateMatePostBody {
  close?: boolean;
  title?: string;
  region?: string | null;
  capacity?: number;
  preferredConditions?: string | null;
  travelStyle?: string[];
  description?: string;
}

// PATCH /api/mates/[id] — 작성자 본인만 가능(RLS: mate_post_update_self).
// body.close === true면 REQ-FUNC-038 수동 마감으로 처리하고, 그 외 필드는
// 일반 수정으로 처리한다(두 동작을 같은 요청에 섞지 않는다).
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
    .catch(() => null)) as UpdateMatePostBody | null;
  if (!body) {
    return NextResponse.json(
      { error: "요청 본문이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const { data, error } = body.close
    ? await closeMatePostManually(supabase, id)
    : await updateMatePost(supabase, id, {
        title: body.title,
        region: body.region,
        capacity: body.capacity,
        preferredConditions: body.preferredConditions,
        travelStyle: body.travelStyle,
        description: body.description,
      });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json(
      { error: "모집글을 찾을 수 없거나 권한이 없습니다." },
      { status: 404 },
    );
  }

  return NextResponse.json({ post: withEffectiveStatus(data) });
}

// DELETE /api/mates/[id] — 작성자 본인만 가능(RLS: mate_post_delete_self).
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

  const { error } = await deleteMatePost(supabase, id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
