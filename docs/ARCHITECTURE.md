# ARCHITECTURE — Free Traveler

- **Document ID:** ARCH-TRAVEL-001
- **성격:** 이 문서는 **구현 경계 문서**다. "무엇을 어떻게 만들지"의 기술적 울타리를 고정하며, 화면 콘텐츠·AC는 다루지 않는다(해당 내용은 `TASKS/TASK-*.md`를 따른다). 코드·설정 파일을 만들지 않는다.
- **기반 문서:** `package.json`, `docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `design-reference/D-001/DESIGN.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `TASKS/TASK_MANIFEST.csv`
- **원칙:** 이 문서와 실제 코드가 어긋나면 이 문서를 먼저 갱신한 뒤 구현을 맞춘다. 표에 없는 인프라·라이브러리·아키텍처 패턴을 임의로 추가하지 않는다.

---

## 1. 기술 스택

| 영역 | 선택 | 근거 |
|---|---|---|
| 프레임워크 | **Next.js 16(App Router)** | `package.json`의 `next: 16.3.4`. Pages Router는 쓰지 않는다. |
| 언어 | **TypeScript(strict)** | `tsconfig.json`의 `"strict": true`. `REQ-NF-031`(병합 전 `tsc --noEmit` 통과)을 강제한다. |
| UI 런타임 | React 19.2.8 | `package.json` 기준. |
| 스타일 | Tailwind CSS v4 | `@tailwindcss/postcss`, `postcss.config.mjs`. `design-reference/D-001/DESIGN.md`의 토큰(색상·타이포·spacing·radius·shadow)을 Tailwind 설정값으로만 구현하고, 문서에 없는 임의 값을 추가하지 않는다. |
| 백엔드 | **Supabase**(Auth + Postgres) | §7 참조. 별도 커스텀 서버는 두지 않는다. |
| 배포 | **Vercel** | §13 참조. |

현재 저장소는 `create-next-app` 기본 스캐폴드(`src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`) 상태이며, `TASKS/TASK-PO-SCR-001.md`가 이 스타터 마크업의 완전 제거를 요구한다.

---

## 2. 화면 구성(핵심 4 · 보조 1)

`design-reference/SCREEN_ROUTE_CONTRACT.json`(`schema_version: traveler-screen-route-v1`)이 정본이다.

| Screen | 구분 | Route | Page Entry |
|---|---|---|---|
| SCR-001 메인 | **핵심** | `/` | `src/app/page.tsx` |
| SCR-002 대표 소개 | 보조 | `/about` | `src/app/about/page.tsx` |
| SCR-003 통합 여행 준비 | **핵심** | `/travel-tools` | `src/app/travel-tools/page.tsx` |
| SCR-004 동행 조회 | **핵심** | `/mates` | `src/app/mates/page.tsx` |
| SCR-005 계정·관리 | **핵심** | `/account` | `src/app/account/page.tsx` |

5개 Route·5개 Page Entry는 서로 중복되지 않는다(`SCREEN_ROUTE_CONTRACT.json`의 `completion_checks` 확인). 이 5개 외의 실제 화면 Route는 만들지 않는다 — 인증 콜백(`src/app/auth/callback/route.ts`), API Route(`src/app/api/**/route.ts`), `not-found.tsx`, `error.tsx`는 `technical_routes`로 별도 관리되며 디자인 Screen으로 세지 않는다.

각 Page Entry는 `TASKS/TASK-PO-SCR-*.md`(Page Owner Task)가 정의한 범위, 즉 **하위 Component Task 산출물을 Route Page로 조립하는 역할만** 맡는다. Page Owner Task 자체가 새 Component를 직접 만들지 않는다(`TASKS/TASK_MANIFEST.csv`의 `depends_on` 열이 각 `PO-SCR-*`가 의존하는 `CMP-*` Task 목록이다).

---

## 3. Server Component와 Client Component 구분

App Router 기본값은 **Server Component**다. 아래 조건 중 하나라도 해당하면 그 컴포넌트에만 `"use client"`를 선언해 Client Component로 좁힌다. 화면 전체를 Client Component로 만들지 않는다.

| Client Component가 필요한 경우 | 해당 영역 |
|---|---|
| 폼 입력·검증·로컬 상태(항공·숙소·동행 글쓰기, 로그인·프로필) | `CMP-SCR003-FLIGHT-FORM`, `CMP-SCR003-HOTEL-FORM`, `CMP-SCR003-MATE-WRITE-FORM`, `CMP-SCR005-AUTH-GUEST`, `CMP-SCR005-PROFILE` |
| 탭·Drawer·Modal 같은 상호작용 UI 상태 | `CMP-SCR003-INTRO-TABS-SHELL`, `CMP-SCR001-DEST-DETAIL-DRAWER`, `CMP-SCR004-DETAIL-PANEL` |
| `localStorage` 접근(즐겨찾기) | `SHARED-FAVORITES-STORE` |
| Web Share API·클립보드 폴백 | `SHARED-SHARE-UTIL` |
| Toast·알림 상태 | `SHARED-TOAST-NOTIFICATIONS` |
| 외부 링크 오픈(새 탭, allowlist 검사) | `SHARED-EXTERNAL-LINK-GUARD` |

정적 데이터 렌더링(여행지 목록, 안전정보, 대표 소개 — §6)과 SEO 메타데이터 생성(`SHARED-SEO-METADATA`, Next.js Metadata API)은 **Server Component**에서 처리한다. Client Component는 상호작용이 필요한 최소 영역에만 적용하고, 그 상위(Page Entry, 정적 콘텐츠 영역)는 Server Component로 유지한다.

---

## 4. 항공·숙소 입력 폼 — Client 전용 일시 상태

`CMP-SCR003-FLIGHT-FORM`, `CMP-SCR003-HOTEL-FORM`은 다음 원칙을 예외 없이 지킨다(`REQ-FUNC-017`, `REQ-FUNC-025`, `REQ-NF-017`).

- 입력값(목적 국가·지역·출발일/체크인·귀국일/체크아웃)은 **Client Component의 일시 상태(`useState`/`useReducer`)로만** 보관한다. React Server Action, Route Handler, 서버 상태 관리로 전달하지 않는다.
- 이 두 폼을 위한 **서버 API 자체를 만들지 않는다** — `SCREEN_ROUTE_CONTRACT.json`의 `technical_routes` API 설명에도 "항공·호텔 폼은 서버 API를 두지 않는다"고 명시돼 있다.
- 입력값을 서버 DB, 서버 로그, 분석 이벤트로 전송하지 않는다.
- 외부 이동 URL의 쿼리 파라미터에 목적지·날짜 등 입력값을 첨부하지 않는다 — 설정된 항공/숙소 일반 URL을 `noopener,noreferrer`로 새 탭에 열 뿐이다.
- 페이지 이동·새로고침 시 입력값이 사라져도 정상이다(세션 간 영속 저장 대상이 아니다).

---

## 5. 정적 데이터(`src/data`)

여행지·국가 안전정보·대표 소개는 **DB 테이블이 아니라 `src/data`의 정적 TypeScript 데이터**로 관리한다(`DATA-DESTINATIONS-DOMESTIC`, `DATA-DESTINATIONS-OVERSEAS`, `DATA-COUNTRY-SAFETY`, `DATA-ABOUT-PROFILE`, `DATA-POLICY-PAGES`). 편집은 코드 변경(PR 리뷰)으로 처리하며, 콘텐츠 CMS나 편집 UI는 만들지 않는다(§14).

Stale 판정(안전정보 7일 경과 경고, `REQ-FUNC-050`)과 모집글 자동 마감(`REQ-FUNC-037`)은 별도 배치 작업 없이 **렌더링·조회 시점에 현재일과 비교해 계산**한다.

---

## 6. Supabase — Auth와 동행 기능 중심

Supabase는 다음 범위로만 쓴다. 정적 콘텐츠(§5)에는 관여하지 않는다.

- **Auth**: 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정(`REQ-FUNC-066`), 성인 확인 상태(`is_adult`/`adult_verified_at`, 정확한 생년월일 미저장 — `REQ-FUNC-028`).
- **Postgres + RLS**: 동행 모집글·참가 요청·차단·신고·외부 URL 설정(§8, §9).

### Browser·Server Supabase Client 구분

| Client | 위치 | 용도 |
|---|---|---|
| Browser Client | Client Component(`"use client"`) | 로그인 폼 세션 처리, 클라이언트에서 필요한 조회(`anon` 키만 사용) |
| Server Client | Server Component, Route Handler(`src/app/api/**/route.ts`) | RLS가 적용된 쿼리, 관리자 작업(`API-ADMIN-ROUTES`), 서버 측 세션 검증 |

두 Client 모두 `DB-ACCESS` Task(`src/lib/db/client.ts`, `src/lib/db/queries.ts`)가 정의하는 단일 진입점을 통해서만 만든다. Service Role 키는 서버 전용이며 클라이언트 번들에 포함하지 않는다(`REQ-NF-016`).

---

## 7. DB 스키마 — 정확히 6개 테이블

`DB-SCHEMA-BASE` Task(`supabase/migrations/0001_schema.sql`)가 정의하는 테이블은 아래 6개로 고정한다. 이 목록을 넘는 신규 테이블(감사 로그, 미디어 자산, 여행지/안전 콘텐츠 테이블 등)을 추가하지 않는다 — 해당 데이터는 §5의 정적 데이터이거나 `docs/PROJECT_SCOPE.md`의 EXCLUDED 범위다.

| 테이블 | 역할 |
|---|---|
| `user_profile` | 닉네임·연령대·성별(선택)·여행 스타일, `is_adult`/`adult_verified_at` |
| `mate_post` | 동행 모집글 |
| `mate_application` | 참가 요청(PENDING/ACCEPTED/REJECTED) |
| `user_block` | 사용자 간 차단 |
| `report` | 신고(사유 코드·설명·상태) |
| `external_url_setting` | 관리자가 설정하는 항공·숙소 외부 URL(HTTPS만) |

### 간단한 RLS 원칙

`DB-RLS-BASE`(`supabase/migrations/0002_rls.sql`) 기준으로, 비공개 데이터는 다음 네 그룹만 열람한다(`REQ-FUNC-044`, `REQ-NF-013`).

1. 본인이 작성한 글·요청
2. 참가 요청의 대상 글 작성자
3. Moderator/Admin
4. 그 외는 403 또는 빈 결과

정책은 위 4개 그룹 판정 이상으로 세분화하지 않는다(역할·행 단위 소유권 검사 수준에서 "간단하게" 유지).

### ORM 미사용

**Prisma를 비롯한 ORM을 쓰지 않는다.** `DB-ACCESS`는 Supabase JS 클라이언트(`@supabase/supabase-js`, `@supabase/ssr`)의 쿼리 빌더를 직접 호출하는 얇은 계층이며, 별도 스키마 정의 언어·마이그레이션 도구를 추가하지 않는다. 마이그레이션은 순수 SQL 파일(`supabase/migrations/*.sql`)로 관리한다.

---

## 8. 테스트 전략

| 계층 | 도구 | 대상 |
|---|---|---|
| Unit | **Vitest** | `UNIT-TRAVEL-DATES`, `UNIT-CONTACT-DETECTION`, `UNIT-MATE-STATE`(순수 함수: 날짜 검증, 연락처 패턴 탐지, 상태 전이) |
| Integration | **Vitest** | `TEST-RLS-BASIC`(권한별 부정 접근이 403/빈 결과인지 검증) |
| E2E | **Playwright — Chromium만** | `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` |

Playwright는 **Chromium Smoke 3종만** 유지한다. Firefox·WebKit 등 다른 브라우저 엔진 프로젝트는 설정에 추가하지 않는다. `REQ-NF-031`에 따라 `npm run lint` + `tsc --noEmit` + `npm test`(Vitest) 통과가 병합 전 필수이며, Playwright는 `TASKS/TASK-E2E-*.md`가 정의한 수동 실행 확인 절차를 따른다.

---

## 9. CI/CD

- **GitHub Actions**로 `npm run lint`, `tsc --noEmit`, Vitest 실행을 main 병합 전 게이트로 건다(`CI-LINT-TYPECHECK` Task, `REQ-NF-031`).
- **Vercel Preview**로 PR마다 미리보기 배포를 만들고, 병합 전 실제 Preview 주소에서 확인한다 — 로컬 실행 확인만으로 완료 처리하지 않는다.
- 커스텀 CI 러너나 별도 배포 파이프라인을 추가로 구축하지 않는다.

---

## 10. 금지 인프라

- **AWS·EC2를 쓰지 않는다.** 호스팅은 Vercel(애플리케이션)과 Supabase(DB·Auth)로 한정한다(`REQ-NF-034`, 월 인프라 비용 통제 목적과 연계).
- **자동 Merge를 쓰지 않는다.** 모든 병합은 사람이 PR을 검토·승인한 뒤 직접 진행한다. 리뷰 없이 저절로 반영되는 병합 규칙(auto-merge)을 저장소 설정에 켜지 않는다.

---

## 11. 착수 차단(Blocker)

아래는 저장소를 직접 확인해 **실제로 없는** 파일·환경변수만 기록한 것이다(2026-09-16 기준). 이 항목들이 없으면 해당 범위의 구현을 시작할 수 없다.

| 항목 | 현재 상태 | 필요 조치 |
|---|---|---|
| Supabase 클라이언트 패키지 | `package.json`에 `@supabase/supabase-js`, `@supabase/ssr` 없음 | `DB-ACCESS` 착수 전 설치 필요 |
| Supabase 프로젝트 연결 정보 | `.env*` 파일 자체가 없음(`.gitignore`에 `.env*`만 등록) | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`(Browser Client), `SUPABASE_SERVICE_ROLE_KEY`(Server 전용) 3개 환경변수를 Vercel과 로컬 `.env.local`에 설정해야 `CMP-SCR005-AUTH-GUEST` 이후 Task를 실행할 수 있다 |
| `supabase/` 디렉터리 | 없음(`DB-SCHEMA-BASE`가 만들 `supabase/migrations/0001_schema.sql` 포함 전체) | `DB-SCHEMA-BASE` Task에서 최초 생성 |
| 테스트 도구 | `package.json`에 `vitest`, `@playwright/test` 없음, `tests/` 디렉터리 없음(무관한 `test/` 디렉터리만 존재 — 부동산 관련 파일로 이 프로젝트와 무관) | `UNIT-*`/`TEST-RLS-BASIC` 착수 전 Vitest, `E2E-*` 착수 전 Playwright(Chromium만) 설치 필요 |
| GitHub Actions 워크플로 | `.github/workflows/` 없음 | `CI-LINT-TYPECHECK` Task에서 최초 생성 |

위 목록 외에 "언젠가 필요할 수 있는" 항목은 기록하지 않는다.

## 12. 프로젝트 범위 제외

다음은 이 프로젝트의 구현 범위에 **명시적으로 포함하지 않는다**(`docs/PROJECT_SCOPE.md` §4 제외 기능과 일치).

- **CMS**: 여행지·안전정보·대표 소개용 콘텐츠 편집기·워크플로를 두지 않는다. 콘텐츠 변경은 `src/data` 코드 수정(PR)으로만 한다.
- **외부 Email 공급자**: 실제 이메일 발송(알림 메일 등)을 연동하지 않는다. 모든 알림은 Toast 또는 화면 내 상태 표시로 대체한다(`REQ-FUNC-043`). Supabase Auth의 인증 메일 발송은 Auth 기본 기능이므로 예외로 유지된다.
- **Monitoring**: 가용성·에러율·성능 모니터링 도구(APM, 로그 수집 인프라, 알림 시스템)를 도입하지 않는다(`REQ-NF-008/009/032/033` 등 관련 NF는 `docs/PROJECT_SCOPE.md`에서 EXCLUDED로 분류돼 있다).

이 세 영역이 필요해지면 이 문서를 먼저 개정한 뒤 범위에 추가한다.
