// Supabase 공용 설정(브라우저·서버 공용). next/headers·Service Role 등 서버
// 전용 의존성을 두지 않아 Client Component에서도 안전하게 import할 수 있다.
// 공개 키(NEXT_PUBLIC_*)만 다룬다(CLAUDE.md 규칙 15).

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL 환경변수가 설정되지 않았습니다.");
  }
  return url;
}

export function getSupabasePublishableKey(): string {
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
export const AUTH_COOKIE_OPTIONS = {
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};
