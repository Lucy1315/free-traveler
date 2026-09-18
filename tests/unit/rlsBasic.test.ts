// TEST-RLS-BASIC — 권한별 부정 접근 차단. REQ-FUNC-044, REQ-NF-013.
//
// 1부(항상 실행): 마이그레이션 SQL을 읽어 정책·권한 선언 자체를 검사한다. DB 없이도
//   "anon에게 쓰기를 열었다", "role 열을 사용자가 쓸 수 있다" 같은 회귀를 잡는다.
// 2부(조건부): 실제 Supabase에 부정 접근을 시도해 거부·빈 결과를 확인한다. 접속
//   정보와 테스트 계정 2개가 없으면 명시적으로 건너뛴다. 운영 DB가 아닌 테스트용
//   프로젝트(또는 `supabase start` 로컬)에서만 실행한다.
//     RLS_TEST_SUPABASE_URL / RLS_TEST_PUBLISHABLE_KEY
//     E2E_AUTHOR_EMAIL / E2E_AUTHOR_PASSWORD         (모집글이 1건 이상 있는 일반 회원)
//     E2E_TEST_USER_EMAIL / E2E_TEST_USER_PASSWORD   (다른 일반 회원, Moderator 아님)
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { beforeAll, describe, expect, it } from "vitest";

const MIGRATIONS_DIR = join(process.cwd(), "supabase/migrations");
const sql = readdirSync(MIGRATIONS_DIR)
  .filter((file) => file.endsWith(".sql"))
  .sort()
  .map((file) => readFileSync(join(MIGRATIONS_DIR, file), "utf8"))
  .join("\n")
  // 주석은 검사 대상이 아니다.
  .replace(/--.*$/gm, "");

const TABLES = [
  "user_profile",
  "mate_post",
  "mate_application",
  "user_block",
  "report",
  "external_url_setting",
];
const PUBLIC_READ_TABLES = ["mate_post", "external_url_setting"];

interface Policy {
  name: string;
  table: string;
  command: string;
  roles: string[];
  body: string;
}

const policies: Policy[] = Array.from(
  sql.matchAll(
    /create policy (\w+)\s+on (\w+)\s+for (\w+)\s+to ([\w, ]+?)\s+((?:using|with check)[\s\S]*?);/g,
  ),
  (match) => ({
    name: match[1],
    table: match[2],
    command: match[3],
    roles: match[4].split(",").map((role) => role.trim()),
    body: match[5].replace(/\s+/g, " "),
  }),
);

/** `grant <priv> (<cols>) on <table> to <roles>` 의 열 목록. */
function grantedColumns(privilege: string, table: string): string[] | null {
  const match = sql.match(
    new RegExp(
      `grant ${privilege}\\s*\\(([^)]+)\\)\\s*on ${table}\\s+to authenticated`,
    ),
  );
  return match ? match[1].split(",").map((column) => column.trim()) : null;
}

describe("RLS 정책 선언(정적 검사)", () => {
  it("6개 테이블 모두 RLS가 켜져 있다", () => {
    for (const table of TABLES) {
      expect(sql, table).toMatch(
        new RegExp(`alter table ${table} enable row level security`),
      );
    }
  });

  it("정책을 빠짐없이 읽었다(파서 점검)", () => {
    const declared = sql.match(/create policy /g)?.length ?? 0;
    expect(policies.length).toBe(declared);
    expect(policies.length).toBeGreaterThanOrEqual(20);
  });

  it("비로그인(anon)에게는 쓰기 정책이 하나도 없다", () => {
    const anonWrites = policies.filter(
      (policy) => policy.command !== "select" && policy.roles.includes("anon"),
    );
    expect(anonWrites.map((policy) => policy.name)).toEqual([]);
  });

  it("비로그인이 읽을 수 있는 테이블은 동행글·외부 URL 설정뿐이다", () => {
    const anonReadable = policies
      .filter(
        (policy) =>
          policy.command === "select" && policy.roles.includes("anon"),
      )
      .map((policy) => policy.table)
      .sort();
    expect(anonReadable).toEqual([...PUBLIC_READ_TABLES].sort());
  });

  it("쓰기 정책은 모두 본인(auth.uid()) 또는 Moderator 조건을 건다", () => {
    const unconditional = policies.filter(
      (policy) =>
        policy.command !== "select" &&
        !/auth\.uid\(\)|is_moderator_or_admin/.test(policy.body),
    );
    expect(unconditional.map((policy) => policy.name)).toEqual([]);
  });

  it("신고 열람·처리와 외부 URL 저장은 Moderator/Admin 조건을 건다", () => {
    const byName = Object.fromEntries(
      policies.map((policy) => [policy.name, policy.body]),
    );
    for (const name of [
      "report_update_moderator_only",
      "external_url_setting_insert_moderator",
      "external_url_setting_update_moderator",
    ]) {
      expect(byName[name], name).toContain("is_moderator_or_admin(auth.uid())");
    }
    // 신고는 신고자 본인 또는 Moderator만 본다.
    expect(byName.report_select_own_or_moderator).toContain(
      "reporter_id = auth.uid()",
    );
  });

  it("참가 요청 상태 변경은 PENDING인 요청을 글 작성자만, ACCEPTED/REJECTED로만", () => {
    const policy = policies.find(
      (item) => item.name === "mate_application_update_by_post_author",
    );
    expect(policy?.body).toContain("status = 'PENDING'");
    expect(policy?.body).toContain("mate_post.author_id = auth.uid()");
    expect(policy?.body).toContain("status in ('ACCEPTED', 'REJECTED')");
  });
});

describe("테이블 권한(GRANT) 선언 — 열 단위 제한", () => {
  it("anon에게는 SELECT 외 권한을 주지 않는다", () => {
    const anonGrants = Array.from(
      sql.matchAll(
        /grant ([\w, ]+?)(?:\s*\([^)]*\))?\s+on ([\w,\s]+?)\s+to ([\w, ]+);/g,
      ),
    ).filter((match) =>
      match[3].split(",").some((role) => role.trim() === "anon"),
    );
    for (const grant of anonGrants) {
      expect(grant[1].trim(), grant[0]).toMatch(/^(select|usage|execute)$/);
    }
  });

  it("user_profile: 사용자가 role을 쓰거나 id를 바꿀 수 없다(관리자 자기 승격 차단)", () => {
    expect(sql).toMatch(
      /revoke insert, update on user_profile from anon, authenticated/,
    );
    const insertColumns = grantedColumns("insert", "user_profile");
    const updateColumns = grantedColumns("update", "user_profile");
    expect(insertColumns).not.toBeNull();
    expect(updateColumns).not.toBeNull();
    expect(insertColumns).not.toContain("role");
    expect(updateColumns).not.toContain("role");
    expect(updateColumns).not.toContain("id");
    // 테이블 전체 INSERT/UPDATE를 다시 열지 않았다.
    expect(sql).not.toMatch(
      /grant [\w, ]*\b(insert|update)\b[\w, ]*\s+on\s+[\w,\s]*\buser_profile\b[\w,\s]*to authenticated/,
    );
  });

  it("mate_application: 신청자가 status를 직접 넣을 수 없다(스스로 승인 차단)", () => {
    expect(sql).toMatch(
      /revoke insert, update on mate_application from anon, authenticated/,
    );
    expect(grantedColumns("insert", "mate_application")).toEqual([
      "post_id",
      "applicant_id",
      "message",
    ]);
    expect(grantedColumns("update", "mate_application")).toEqual(["status"]);
  });

  it("report: 신고자는 접수 열만 쓰고 처리 열(status·resolved_*)은 못 쓴다", () => {
    const insertColumns = grantedColumns("insert", "report") ?? [];
    expect(insertColumns).toContain("reason_code");
    for (const column of ["status", "resolved_by", "resolved_at"]) {
      expect(insertColumns).not.toContain(column);
    }
  });
});

// ---------------------------------------------------------------------------
// 2부: 실제 DB 부정 접근(조건부)
// ---------------------------------------------------------------------------

const live = {
  url: process.env.RLS_TEST_SUPABASE_URL,
  key: process.env.RLS_TEST_PUBLISHABLE_KEY,
  authorEmail: process.env.E2E_AUTHOR_EMAIL,
  authorPassword: process.env.E2E_AUTHOR_PASSWORD,
  otherEmail: process.env.E2E_TEST_USER_EMAIL,
  otherPassword: process.env.E2E_TEST_USER_PASSWORD,
};
const hasLiveEnv = Object.values(live).every(Boolean);

describe.skipIf(!hasLiveEnv)("실제 DB 부정 접근(테스트용 Supabase)", () => {
  let anon: SupabaseClient;
  let other: SupabaseClient;
  let otherId: string;
  let authorPostId: string;

  function client() {
    return createClient(live.url as string, live.key as string, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  beforeAll(async () => {
    anon = client();
    other = client();
    const author = client();
    const signedAuthor = await author.auth.signInWithPassword({
      email: live.authorEmail as string,
      password: live.authorPassword as string,
    });
    const signedOther = await other.auth.signInWithPassword({
      email: live.otherEmail as string,
      password: live.otherPassword as string,
    });
    expect(signedAuthor.error).toBeNull();
    expect(signedOther.error).toBeNull();
    otherId = signedOther.data.user?.id as string;
    const { data: posts } = await author
      .from("mate_post")
      .select("id")
      .eq("author_id", signedAuthor.data.user?.id as string)
      .limit(1);
    expect(posts?.length, "작성자 계정에 모집글이 1건 이상 필요").toBe(1);
    authorPostId = posts?.[0].id as string;
  });

  it.each(["user_profile", "mate_application", "user_block", "report"])(
    "비로그인은 %s를 읽지 못한다(거부 또는 빈 결과)",
    async (table) => {
      const { data, error } = await anon.from(table).select("*").limit(5);
      expect(error !== null || (data ?? []).length === 0).toBe(true);
    },
  );

  it("비로그인은 모집글을 쓸 수 없다", async () => {
    const { data, error } = await anon
      .from("mate_post")
      .insert({
        author_id: otherId,
        title: "anon",
        country: "일본",
        start_date: "2099-01-01",
        end_date: "2099-01-02",
        capacity: 1,
        description: "x",
        safety_agreement_consented_at: new Date().toISOString(),
      })
      .select();
    expect(error !== null || (data ?? []).length === 0).toBe(true);
  });

  it("본인이 아니면 남의 모집글을 수정·삭제할 수 없다", async () => {
    const updated = await other
      .from("mate_post")
      .update({ title: "hijacked" })
      .eq("id", authorPostId)
      .select();
    expect(updated.error !== null || (updated.data ?? []).length === 0).toBe(
      true,
    );
    const deleted = await other
      .from("mate_post")
      .delete()
      .eq("id", authorPostId)
      .select();
    expect(deleted.error !== null || (deleted.data ?? []).length === 0).toBe(
      true,
    );
  });

  it("일반 회원은 자신의 role을 admin으로 바꿀 수 없다", async () => {
    await other
      .from("user_profile")
      .update({ role: "admin" })
      .eq("id", otherId);
    const { data } = await other
      .from("user_profile")
      .select("role")
      .eq("id", otherId)
      .maybeSingle();
    expect(data?.role).not.toBe("admin");
  });

  it("신청자는 status를 ACCEPTED로 넣어 스스로 승인할 수 없다", async () => {
    const { data, error } = await other
      .from("mate_application")
      .insert({
        post_id: authorPostId,
        applicant_id: otherId,
        message: "rls",
        status: "ACCEPTED",
      })
      .select();
    expect(error !== null || (data ?? []).length === 0).toBe(true);
  });

  it("Moderator가 아니면 외부 URL 설정을 저장할 수 없다", async () => {
    const { data, error } = await other
      .from("external_url_setting")
      .upsert({ category: "flight", url: "https://evil.example/" })
      .select();
    expect(error !== null || (data ?? []).length === 0).toBe(true);
  });
});
