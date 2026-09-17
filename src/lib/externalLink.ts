// 외부 링크 오픈 유틸(HTTPS+allowlist 검사, noopener/noreferrer, 목적지·날짜 쿼리 금지).
// design-reference/D-001/DESIGN.md §19(Do Not — 목적지/날짜 쿼리 파라미터 금지) 기준.
// REQ-FUNC-016·018·024·026·049.
//
// 항공/숙소 외부 URL은 관리자가 설정한 값(추후 DB-ACCESS·API-ADMIN-ROUTES가 제공,
// external_url_setting 테이블)을 호출부에서 allowlist로 넘겨 검사한다. 이 파일은
// Supabase에 접근하지 않는다.

export type ExternalLinkErrorCode =
  | "MISSING_URL"
  | "INVALID_URL"
  | "NOT_HTTPS"
  | "NOT_ALLOWLISTED"
  | "FORBIDDEN_QUERY_PARAM";

export interface ExternalLinkError {
  code: ExternalLinkErrorCode;
  // 사용자에게 그대로 보여줄 수 있는 한국어 오류 메시지(재시도 안내 포함).
  message: string;
}

export type ExternalLinkCheckResult =
  { ok: true; url: string } | { ok: false; error: ExternalLinkError };

// REQ-FUNC-018/026, D-001 §19: 목적지·날짜 등 여행 조건을 외부 URL 쿼리 파라미터로
// 붙이지 않는다. 아래 이름이 쿼리에 있으면 차단한다.
const FORBIDDEN_QUERY_PARAM_NAMES = [
  "destination",
  "dest",
  "origin",
  "from",
  "to",
  "city",
  "country",
  "checkin",
  "checkout",
  "date",
  "departure",
  "return",
  "q",
  "query",
];

const ERROR_MESSAGES: Record<ExternalLinkErrorCode, string> = {
  MISSING_URL:
    "외부 이동 주소가 설정되지 않았습니다. 잠시 후 다시 시도해 주세요.",
  INVALID_URL:
    "외부 이동 주소 형식이 올바르지 않습니다. 잠시 후 다시 시도해 주세요.",
  NOT_HTTPS:
    "안전하지 않은 주소(HTTPS 아님)라 이동할 수 없습니다. 잠시 후 다시 시도해 주세요.",
  NOT_ALLOWLISTED:
    "허용되지 않은 외부 사이트 주소입니다. 잠시 후 다시 시도해 주세요.",
  FORBIDDEN_QUERY_PARAM:
    "목적지·날짜 정보가 포함된 주소는 사용할 수 없습니다. 관리자에게 문의해 주세요.",
};

function makeError(code: ExternalLinkErrorCode): ExternalLinkCheckResult {
  return { ok: false, error: { code, message: ERROR_MESSAGES[code] } };
}

function isHostAllowed(hostname: string, allowlist: string[]): boolean {
  return allowlist.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
  );
}

// REQ-FUNC-018/026: HTTPS·allowlist·금지 쿼리 파라미터를 검사한다.
// 검사만 하고 실제 창은 열지 않는다(openExternalLink가 검사 후 오픈까지 담당).
export function checkExternalUrl(
  url: string | null | undefined,
  allowlist: string[],
): ExternalLinkCheckResult {
  if (!url) {
    return makeError("MISSING_URL");
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return makeError("INVALID_URL");
  }

  if (parsed.protocol !== "https:") {
    return makeError("NOT_HTTPS");
  }

  if (!isHostAllowed(parsed.hostname, allowlist)) {
    return makeError("NOT_ALLOWLISTED");
  }

  const hasForbiddenParam = FORBIDDEN_QUERY_PARAM_NAMES.some((name) =>
    parsed.searchParams.has(name),
  );
  if (hasForbiddenParam) {
    return makeError("FORBIDDEN_QUERY_PARAM");
  }

  return { ok: true, url: parsed.toString() };
}

// REQ-FUNC-016/024/049: 검사를 통과한 URL만 새 탭(noopener,noreferrer)으로 연다.
// 실패 시 창을 열지 않고 결과를 그대로 반환한다(호출부가 오류·재시도 UI를 표시한다).
export function openExternalLink(
  url: string | null | undefined,
  allowlist: string[],
): ExternalLinkCheckResult {
  const result = checkExternalUrl(url, allowlist);

  if (!result.ok) {
    // REQ-FUNC-026: 운영 오류 로그(콘솔) — 서버 전송·개인정보 포함 없음.
    console.error(
      `[externalLink] blocked url open: code=${result.error.code} url=${url ?? "(none)"}`,
    );
    return result;
  }

  if (typeof window !== "undefined") {
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  return result;
}
