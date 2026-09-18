// 서버 전용 Supabase client 팩토리. REQ-NF-014(CSRF 방어·SameSite 쿠키)·
// REQ-NF-015·017. next/headers와 Service Role(SUPABASE_SECRET_KEY)을 쓰므로
// Client Component에서 import하지 않는다 — 브라우저 클라이언트는
// `@/lib/db/browser`를 쓴다(CLAUDE.md 규칙 15).

import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import {
  AUTH_COOKIE_OPTIONS,
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/lib/db/config";

/**
 * 로그인 세션 없이 공개 데이터(RLS가 anon에게 SELECT를 연 테이블)만 읽는
 * 서버용 클라이언트. 쿠키를 읽지 않아 이를 쓰는 페이지가 요청마다 동적
 * 렌더링으로 바뀌지 않는다(정적 생성 + revalidate 가능).
 */
export function createPublicSupabaseClient() {
  return createSupabaseClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Server Component·Route Handler에서 쓰는 Supabase 클라이언트. 요청마다
 * 새로 만들어야 한다(클라이언트를 재사용하지 않는다 — @supabase/ssr 권장 사항).
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookieOptions: AUTH_COOKIE_OPTIONS,
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component에서는 쿠키를 쓸 수 없다(Next.js 제약) — 세션
          // 갱신은 이후 Route Handler 호출 시 반영되므로 조용히 무시한다.
        }
      },
    },
  });
}

/**
 * Service Role(SUPABASE_SECRET_KEY) 클라이언트. RLS를 완전히 우회하므로
 * Route Handler 등 서버 전용 코드에서만 부르고, Client Component나 브라우저로
 * 내려가는 코드 경로에서는 절대 쓰지 않는다(CLAUDE.md 규칙 14·15).
 */
export function createServiceRoleSupabaseClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "createServiceRoleSupabaseClient는 서버 전용입니다. 브라우저에서 호출할 수 없습니다.",
    );
  }

  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("SUPABASE_SECRET_KEY 환경변수가 설정되지 않았습니다.");
  }

  return createSupabaseClient(getSupabaseUrl(), secretKey, {
    auth: { persistSession: false },
  });
}
