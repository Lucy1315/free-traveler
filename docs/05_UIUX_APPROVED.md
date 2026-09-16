# UI/UX Approved — Free Traveler

- **Document ID:** UIUX-APPROVED-TRAVEL-001
- **승인 상태:** APPROVED
- **근거:** `docs/STITCH_VALIDATION_REPORT.md`(최종 판정 `STITCH_VALIDATION_PASS`), `design-reference/DESIGN_MANIFEST.md`(Active Design Version D-001, Status LOCKED), `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`

---

## 1. 승인 범위

Google Stitch에서 생성·검증한 5개 Screen(SCR-001~005, Mobile 변형: SCR-001·003)을 Free Traveler의 확정 UI/UX로 승인한다. `docs/02_SRS_BASELINE.md`가 정의한 16개 공개 Route는 신규 Route를 추가하지 않고, 아래 5개 Screen의 탭·Drawer·상세 패널로 통합한다.

## 2. 승인된 5개 Screen

| Screen ID | Route | Page Entry | 구분 | Stitch Screen ID(Desktop) | Stitch Screen ID(Mobile) |
|---|---|---|---|---|---|
| SCR-001 | `/` | `src/app/page.tsx` | 핵심 | `5d31f236698d4cc8a1c33873732d75cb` | `78ca18768f2d4d3c9c25ea68265012d3` |
| SCR-002 | `/about` | `src/app/about/page.tsx` | 보조 | `e910f311e79d4b8f84633cb1a540181e` | 없음 |
| SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | 핵심 | `ee1a4a3309b940fb92514c2ca2b87d79` | `4beaeadd323b4350a0e8c47b6336ef71` |
| SCR-004 | `/mates` | `src/app/mates/page.tsx` | 핵심 | `a29c79d328814603ac11416e5e561a84` | 없음 |
| SCR-005 | `/account` | `src/app/account/page.tsx` | 핵심 | `08a13de0949a46b2af3f6e4e9b4c959d` | 없음 |

세부 영역 순서·Component·상태·금지 기능은 `design-reference/UI_CONTRACT.md`를 단일 기준으로 한다.

## 3. Route 통합 매핑(SRS Baseline 16개 Route → 승인 5개 Screen)

| SRS Baseline Route | 승인 후 위치 | 통합 방식 |
|---|---|---|
| `/` | SCR-001 `/` | 그대로 유지(통합 지점) |
| `/destinations` | SCR-001 Section 3 | 국내/해외 탭 + 필터로 통합, 별도 Route 없음 |
| `/destinations/domestic` | SCR-001 Section 3 | "국내" 탭으로 통합, 별도 Route 없음 |
| `/destinations/overseas` | SCR-001 Section 3 | "해외" 탭으로 통합, 별도 Route 없음 |
| `/destinations/[slug]` | SCR-001 Section 4 | 여행지 상세 Drawer/Modal로 통합, 별도 Route 없음(클라이언트 상태) |
| `/flights` | SCR-003 Section 2~3 | "항공" 탭으로 통합 |
| `/hotels` | SCR-003 Section 2~3 | "숙소" 탭으로 통합 |
| `/mates` | SCR-004 `/mates` | 그대로 유지 |
| `/mates/[id]` | SCR-004 Section 4 | Desktop 상세 분할 패널 / Mobile 상세 Drawer로 통합, 별도 Route 없음 |
| `/mates/new` | SCR-003 Section 2·5 | "동행 글쓰기" 탭으로 통합 |
| `/safety` | SCR-001 Section 4 | 안전정보 Drawer(여행지 상세 내 "안전정보" 탭)로 통합, 별도 Route 없음 |
| `/safety/[countryCode]` | SCR-001 Section 4 | 위와 동일, 국가별 콘텐츠는 정적 데이터로 분기 |
| `/about` | SCR-002 `/about` | 그대로 유지 |
| `/auth/*` | SCR-005 Guest 탭 | 로그인·가입·비밀번호 재설정 Card로 통합 |
| `/my/*` | SCR-005 Member 탭 | 내 글·참가 요청·차단 목록·즐겨찾기 4개 탭으로 통합 |
| `/admin/*` | SCR-005 Admin 탭 | 신고 상태 변경·외부 URL 설정 2개 탭으로 통합(PROJECT_SCOPE EXCLUDED 범위는 통합하지 않음 — 4장 참조) |

## 4. UI Route Contract

기계 판독 원본은 `design-reference/SCREEN_ROUTE_CONTRACT.json`(`schema_version: traveler-screen-route-v1`, `framework: nextjs-app-router`)이며, 본 절은 그 요약이다.

### 4.1 Screen 계약
- `screens` 배열은 SCR-001~005 정확히 5개다. 2절 표와 완전히 일치한다.
- 모든 Screen은 `page_owner_task_required=true`, `preview_required=true`.
- SCR-001은 `starter_template_forbidden=true`(Next.js 기본 스타터 화면 그대로 두지 않는다).

### 4.2 Technical Routes(Screen 수에 미포함)
| Path | 종류 | 용도 |
|---|---|---|
| `src/app/auth/callback/route.ts` | auth_callback | Supabase Auth 콜백 처리 |
| `src/app/api/**/route.ts` | api_route | REQ-FUNC API 목록 대응 Route Handler(항공·호텔 폼은 서버 API 없음) |
| `src/app/not-found.tsx` | not_found | 404 처리 |
| `src/app/error.tsx` | error_boundary | 500·런타임 오류 처리 |

### 4.3 Required Navigation
Header 5개 내비게이션 링크로 SCR-001~005가 전부 상호 연결되며, 그 외 컨텍스트 기반 이동(예: SCR-001 상세 Drawer → SCR-003, SCR-004 "새 모집글 작성" → SCR-003, SCR-003/004 비로그인 액션 → SCR-005, SCR-005 즐겨찾기/내 글 → SCR-001/004)은 `SCREEN_ROUTE_CONTRACT.json`의 `required_navigation` 배열을 단일 기준으로 한다.

## 5. Release Acceptance Criteria

아래 조건을 모두 충족해야 릴리스 가능하다. 현재 시점 기준 충족 여부는 함께 표기한다(허위 완료 기록 금지).

| # | 기준 | 현재 상태 |
|---|---|---|
| 1 | `docs/UIUX_TRACEABILITY.md`에서 Implementation Status가 `PLANNED`인 모든 Requirement가 `Status=DONE`(구현 완료 + 대응 Test 통과)이어야 한다 | 미충족 — 전 항목 `NOT_STARTED`(구현 미착수, `src/app`은 스캐폴드 상태) |
| 2 | `Implementation Status=EXCLUDED` Requirement에 대응하는 기능(콘텐츠 CMS, 미디어 업로드, 범용 감사 로그, 실시간 항공권/호텔 가격, 통계 Dashboard 등)이 빌드에 존재하지 않아야 한다 | 코드 미작성 상태이므로 위반 없음(확인 대상 없음) |
| 3 | 5개 Screen 모두 `design-reference/D-001/DESIGN.md` 토큰(Color/Typography/Spacing/Radius/Shadow)만 사용해야 한다 | 코드 미작성 — 구현 시 검증 필요 |
| 4 | Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI가 어떤 화면에도 없어야 한다 | Stitch 승인본 기준 확인됨(`STITCH_VALIDATION_PASS` 8·9번 항목) — 실제 구현 코드에서 재검증 필요 |
| 5 | `Lorem ipsum`·"준비 중"·"정보 확인 필요"·빈 카드가 없어야 하며, 모든 Empty 상태가 완성형 문장 + 다음 행동 CTA를 갖춰야 한다 | Stitch 승인본 기준 확인됨 — 실제 구현 코드에서 재검증 필요 |
| 6 | Playwright 핵심 Smoke Test(REQ-NF-025 범위)가 통과해야 한다 | 미작성 |
| 7 | Route 중복·Page Entry 중복이 없어야 한다(`design-reference/UI_CONTRACT.md` 6장) | 충족 — PASS 확인됨 |
| 8 | 중복 Stitch Screen이 프로젝트에 남아있지 않아야 한다 | 충족 — 최종 정리 후 7개 화면(5 Desktop + 2 Mobile)만 존재 확인됨 |

**현재 릴리스 판정: NOT_READY** — 1·3·4(재검증)·5(재검증)·6번 기준이 아직 충족되지 않았다. UI/UX 설계 자체는 승인되었으나(1~4장), 실제 코드 구현과 테스트는 이번 문서의 범위 밖이며 착수되지 않았다.
