// Supabase client 팩토리. REQ-NF-014(CSRF 방어·SameSite 쿠키)·REQ-NF-015·017.
// Browser/Server 클라이언트는 공개 키(NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)만
// 쓴다. Service Role(SUPABASE_SECRET_KEY)은 서버 전용이며 브라우저 번들에
// 절대 포함되지 않는다(CLAUDE.md 규칙 15).

import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL 환경변수가 설정되지 않았습니다.");
  }
  return url;
}

function getSupabasePublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 환경변수가 설정되지 않았습니다.",
    );
  }
  return key;
}

// REQ-NF-014: 인증 쿠키는 SameSite=Lax로 발급한다(서드파티 사이트의 교차
// 사이트 요청에는 자동 전송되지 않아 CSRF 노출을 줄이면서도, Strict와 달리
// OAuth 콜백 리디렉션 흐름은 깨뜨리지 않는다). 프로덕션에서만 Secure를 강제한다
// (로컬 http 개발 서버에서도 로그인 흐름을 테스트할 수 있어야 하므로).
const AUTH_COOKIE_OPTIONS = {
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

/** Client Component에서 쓰는 브라우저 Supabase 클라이언트. */
export function createBrowserSupabaseClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookieOptions: AUTH_COOKIE_OPTIONS,
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
