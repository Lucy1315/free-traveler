// 동행 모집글 목록/작성 Route Handler. SCR-004 사용자 행동(UI_CONTRACT 4장) 지원.
// REQ-FUNC-030(필터)·033(연락처 미노출)·037(조회 시 종료일 계산).
//
// 범위 참고: REQ-FUNC-030이 요구하는 필터 중 국가·지역·여행 스타일·모집
// 상태·기간 겹침은 이 파일이 지원한다. 연령대·성별 필터는 mate_post 테이블에
// 그 값을 담을 컬럼이 없어(0001_schema.sql, DB-SCHEMA-BASE Task 소관 —
// 이 Task Expected Files 밖이라 스키마를 되돌아가 고치지 않았다) 지원하지
// 못한다. 구조화된 연령대·성별 선호 컬럼이 필요하면 별도 스키마 변경 Task로
// 추가해야 한다.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/db/client";
import {
  createMatePost,
  listMatePosts,
  type MatePostRow,
} from "@/lib/db/queries";

// REQ-FUNC-037(방식 변경: 조회 시 종료일 계산). DB status는 작성자의 수동
// 마감만 반영하므로, 응답에는 종료일 경과 여부를 반영한 effectiveStatus를
// 함께 계산해 내려준다(DB 값 자체는 바꾸지 않는다).
function withEffectiveStatus(row: MatePostRow) {
  const isPastEndDate =
    new Date(row.end_date) < new Date(new Date().toDateString());
  return {
    ...row,
    effectiveStatus:
      row.status === "CLOSED" || isPastEndDate ? "CLOSED" : "RECRUITING",
  };
}

function datesOverlap(
  postStart: string,
  postEnd: string,
  rangeStart: string,
  rangeEnd: string,
): boolean {
  return postStart <= rangeEnd && postEnd >= rangeStart;
}

// GET /api/mates?country=&region=&travelStyle=a,b&status=&startDate=&endDate=
// 로그인 없이도 조회 가능하다(RLS: mate_post_select_public).
export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const params = request.nextUrl.searchParams;

  const travelStyleParam = params.get("travelStyle");
  const { data, error } = await listMatePosts(supabase, {
    country: params.get("country") ?? undefined,
    region: params.get("region") ?? undefined,
    travelStyle: travelStyleParam
      ? travelStyleParam.split(",").filter(Boolean)
      : undefined,
    status:
      (params.get("status") as "RECRUITING" | "CLOSED" | null) ?? undefined,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const startDate = params.get("startDate");
  const endDate = params.get("endDate");
  const filtered =
    startDate && endDate
      ? (data ?? []).filter((row) =>
          datesOverlap(row.start_date, row.end_date, startDate, endDate),
        )
      : (data ?? []);

  return NextResponse.json({ posts: filtered.map(withEffectiveStatus) });
}

interface CreateMatePostBody {
  title?: string;
  country?: string;
  region?: string;
  startDate?: string;
  endDate?: string;
  capacity?: number;
  preferredConditions?: string;
  travelStyle?: string[];
  description?: string;
  /** REQ-FUNC-031: 안전수칙 동의 체크박스가 켜져 있었는지. */
  safetyAgreementConsented?: boolean;
}

const REQUIRED_FIELDS: Array<keyof CreateMatePostBody> = [
  "title",
  "country",
  "startDate",
  "endDate",
  "capacity",
  "travelStyle",
  "description",
];

// POST /api/mates — 로그인 사용자만 작성할 수 있다(RLS: mate_post_insert_self).
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
    .catch(() => null)) as CreateMatePostBody | null;
  if (!body) {
    return NextResponse.json(
      { error: "요청 본문이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const missingField = REQUIRED_FIELDS.find(
    (field) => body[field] === undefined,
  );
  if (missingField) {
    return NextResponse.json(
      { error: `${missingField}은(는) 필수 항목입니다.` },
      { status: 400 },
    );
  }

  if (!body.safetyAgreementConsented) {
    return NextResponse.json(
      { error: "동행 안전수칙에 동의해야 모집글을 작성할 수 있습니다." },
      { status: 400 },
    );
  }

  const { data, error } = await createMatePost(supabase, {
    authorId: user.id,
    title: body.title as string,
    country: body.country as string,
    region: body.region,
    startDate: body.startDate as string,
    endDate: body.endDate as string,
    capacity: body.capacity as number,
    preferredConditions: body.preferredConditions,
    travelStyle: body.travelStyle as string[],
    description: body.description as string,
    safetyAgreementConsentedAt: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { post: withEffectiveStatus(data) },
    { status: 201 },
  );
}
