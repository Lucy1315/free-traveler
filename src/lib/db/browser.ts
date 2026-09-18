// Client Component 전용 Supabase 클라이언트. 서버 전용 모듈(client.ts —
// next/headers·Service Role)을 import하지 않아 클라이언트 번들에 서버 코드가
// 섞이지 않는다(CLAUDE.md 규칙 15). REQ-NF-014.

import { createBrowserClient } from "@supabase/ssr";
import {
  AUTH_COOKIE_OPTIONS,
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/lib/db/config";

/** Client Component에서 쓰는 브라우저 Supabase 클라이언트. */
export function createBrowserSupabaseClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookieOptions: AUTH_COOKIE_OPTIONS,
  });
}
