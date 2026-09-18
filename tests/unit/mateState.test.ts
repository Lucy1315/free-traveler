// UNIT-MATE-STATE — 동행 상태 전이. REQ-FUNC-035·036·037.
// - 참가 요청: PENDING → ACCEPTED/REJECTED(그 외 값·비로그인·비작성자 거부)
// - 모집글: RECRUITING → CLOSED(수동 마감 또는 여행 종료일 다음 날부터, 조회 시 계산)
// - 중복 요청: DB 유니크 위반(23505)을 409로 돌려준다
// Supabase는 호출하지 않는다 — DB 계층(@/lib/db/*)을 대역으로 바꿔 Route Handler와
// 순수 함수의 판단만 검증한다. 실제 RLS·유니크 인덱스는 TEST-RLS-BASIC이 맡는다.
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db/client", () => ({
  createServerSupabaseClient: vi.fn(),
}));
vi.mock("@/lib/db/queries", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/db/queries")>()),
  createMateApplication: vi.fn(),
  listMatePosts: vi.fn(),
  updateApplicationStatus: vi.fn(),
}));

import { GET as listMates } from "@/app/api/mates/route";
import { POST as applyToPost } from "@/app/api/mates/[id]/applications/route";
import { PATCH as decideApplication } from "@/app/api/applications/[id]/route";
import { getEffectiveMateStatus } from "@/components/scr004/MateCardGrid";
import { createServerSupabaseClient } from "@/lib/db/client";
import {
  createMateApplication,
  listMatePosts,
  updateApplicationStatus,
} from "@/lib/db/queries";

function signInAs(userId: string | null) {
  vi.mocked(createServerSupabaseClient).mockResolvedValue({
    auth: {
      getUser: async () => ({
        data: { user: userId ? { id: userId } : null },
      }),
    },
  } as never);
}

function jsonRequest(url: string, method: string, body?: unknown) {
  return new NextRequest(`http://localhost${url}`, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

const params = (id: string) => ({ params: Promise.resolve({ id }) });

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe("모집글 RECRUITING → CLOSED (REQ-FUNC-037, 조회 시 종료일 계산)", () => {
  const today = "2026-09-19";

  it("종료일 당일까지는 모집중, 다음 날부터 마감이다(경계)", () => {
    expect(
      getEffectiveMateStatus({ status: "RECRUITING", end_date: today }, today),
    ).toBe("RECRUITING");
    expect(
      getEffectiveMateStatus(
        { status: "RECRUITING", end_date: "2026-09-18" },
        today,
      ),
    ).toBe("CLOSED");
  });

  it("작성자가 수동 마감하면 종료일 전이라도 마감이다", () => {
    expect(
      getEffectiveMateStatus(
        { status: "CLOSED", end_date: "2026-12-31" },
        today,
      ),
    ).toBe("CLOSED");
  });

  it("GET /api/mates 응답의 effectiveStatus도 같은 기준으로 계산한다", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 19, 10, 0, 0));
    signInAs(null);
    const base = { start_date: "2026-09-01", status: "RECRUITING" };
    vi.mocked(listMatePosts).mockResolvedValue({
      data: [
        { ...base, id: "ends-today", end_date: "2026-09-19" },
        { ...base, id: "ended-yesterday", end_date: "2026-09-18" },
        {
          ...base,
          id: "closed-manually",
          end_date: "2026-12-31",
          status: "CLOSED",
        },
      ],
      error: null,
    } as never);

    const response = await listMates(jsonRequest("/api/mates", "GET"));
    const { posts } = (await response.json()) as {
      posts: { id: string; effectiveStatus: string }[];
    };
    expect(
      Object.fromEntries(posts.map((post) => [post.id, post.effectiveStatus])),
    ).toEqual({
      "ends-today": "RECRUITING",
      "ended-yesterday": "CLOSED",
      "closed-manually": "CLOSED",
    });
  });
});

describe("참가 요청 PENDING → ACCEPTED/REJECTED (REQ-FUNC-036)", () => {
  beforeEach(() => signInAs("author-1"));

  it.each(["ACCEPTED", "REJECTED"] as const)(
    "작성자가 %s로 바꾸면 200과 바뀐 요청을 돌려준다",
    async (status) => {
      vi.mocked(updateApplicationStatus).mockResolvedValue({
        data: { id: "app-1", status },
        error: null,
      } as never);
      const response = await decideApplication(
        jsonRequest("/api/applications/app-1", "PATCH", { status }),
        params("app-1"),
      );
      expect(response.status).toBe(200);
      expect(updateApplicationStatus).toHaveBeenCalledWith(
        expect.anything(),
        "app-1",
        status,
      );
    },
  );

  it.each(["PENDING", "CANCELLED", "", undefined])(
    "허용되지 않은 상태값(%s)은 400이고 DB를 건드리지 않는다",
    async (status) => {
      const response = await decideApplication(
        jsonRequest("/api/applications/app-1", "PATCH", { status }),
        params("app-1"),
      );
      expect(response.status).toBe(400);
      expect(updateApplicationStatus).not.toHaveBeenCalled();
    },
  );

  it("비로그인은 401이다", async () => {
    signInAs(null);
    const response = await decideApplication(
      jsonRequest("/api/applications/app-1", "PATCH", { status: "ACCEPTED" }),
      params("app-1"),
    );
    expect(response.status).toBe(401);
    expect(updateApplicationStatus).not.toHaveBeenCalled();
  });

  it("RLS가 막아 바뀐 행이 없으면(비작성자·이미 처리됨) 404다", async () => {
    vi.mocked(updateApplicationStatus).mockResolvedValue({
      data: null,
      error: null,
    } as never);
    const response = await decideApplication(
      jsonRequest("/api/applications/app-1", "PATCH", { status: "ACCEPTED" }),
      params("app-1"),
    );
    expect(response.status).toBe(404);
  });
});

describe("참가 요청 제출과 중복 차단 (REQ-FUNC-034·035)", () => {
  beforeEach(() => signInAs("applicant-1"));

  it("정상 제출은 201이고 본인 id로 저장한다", async () => {
    vi.mocked(createMateApplication).mockResolvedValue({
      data: { id: "app-1", status: "PENDING" },
      error: null,
    } as never);
    const response = await applyToPost(
      jsonRequest("/api/mates/post-1/applications", "POST", {
        message: "함께하고 싶어요",
      }),
      params("post-1"),
    );
    expect(response.status).toBe(201);
    expect(createMateApplication).toHaveBeenCalledWith(
      expect.anything(),
      "post-1",
      "applicant-1",
      "함께하고 싶어요",
    );
  });

  it("같은 글에 PENDING·ACCEPTED 요청이 이미 있으면(23505) 409다", async () => {
    vi.mocked(createMateApplication).mockResolvedValue({
      data: null,
      error: { code: "23505", message: "duplicate key" },
    } as never);
    const response = await applyToPost(
      jsonRequest("/api/mates/post-1/applications", "POST", {
        message: "한 번 더 보냅니다",
      }),
      params("post-1"),
    );
    expect(response.status).toBe(409);
  });

  it("500자는 통과하고 501자는 400이다(경계)", async () => {
    vi.mocked(createMateApplication).mockResolvedValue({
      data: { id: "app-2", status: "PENDING" },
      error: null,
    } as never);
    const ok = await applyToPost(
      jsonRequest("/api/mates/post-1/applications", "POST", {
        message: "가".repeat(500),
      }),
      params("post-1"),
    );
    expect(ok.status).toBe(201);

    vi.mocked(createMateApplication).mockClear();
    const tooLong = await applyToPost(
      jsonRequest("/api/mates/post-1/applications", "POST", {
        message: "가".repeat(501),
      }),
      params("post-1"),
    );
    expect(tooLong.status).toBe(400);
    expect(createMateApplication).not.toHaveBeenCalled();
  });

  it("빈 메시지는 400, 비로그인은 401이다", async () => {
    const empty = await applyToPost(
      jsonRequest("/api/mates/post-1/applications", "POST", { message: "   " }),
      params("post-1"),
    );
    expect(empty.status).toBe(400);

    signInAs(null);
    const guest = await applyToPost(
      jsonRequest("/api/mates/post-1/applications", "POST", { message: "hi" }),
      params("post-1"),
    );
    expect(guest.status).toBe(401);
  });
});
