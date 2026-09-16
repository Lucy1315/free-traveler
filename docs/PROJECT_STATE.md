# Project State — Free Traveler

이 문서는 프로젝트의 **현재 진행 상태 스냅샷**이다. 계획 문서(`docs/06_SRS_UIUX_REVISED.md`, `docs/PROJECT_SCOPE.md`, `design-reference/*`, `TASKS/*`)는 "무엇을 만들기로 했는지"를 담고, 이 문서는 "지금 어디까지 됐는지"만 담는다.

- **갱신 주체:** `/run-wave`(Task·Wave 진행), `/release-check`(CI·Playwright·배포 관련 항목), 또는 사람이 직접. 자동으로 갱신되지 않는 필드는 각 항목에 표시했다.
- **최종 갱신:** 2026-09-16 — 최초 작성. 이 시점까지 구현 코드는 작성되지 않았다(`src/app`는 여전히 `create-next-app` 기본 스캐폴드 상태).

---

| 필드 | 값 |
|---|---|
| **Harness Schema** | `traveler-screen-route-v1`(`CLAUDE.md` Harness Marker, `design-reference/SCREEN_ROUTE_CONTRACT.json`의 `schema_version`과 일치) |
| **Design Version** | `D-001`(`LOCKED`) — `design-reference/DESIGN_MANIFEST.md` |
| **Scope Mode** | `docs/PROJECT_SCOPE.md` 기준 IMPLEMENT 87건 / EXCLUDED 27건(전체 114건) |
| **Current Wave** | `NOT_STARTED` — `TASKS/WAVE_PLAN.md`가 아직 없다(`docs/DECISION_LOG.md` DEC-010 TODO). Wave 분할 계획을 먼저 작성해야 `/run-wave`를 쓸 수 있다. |
| **Current Task** | `NONE` — 진행 중인 Task 없음 |
| **Completed Tasks** | `0 / 66`(`TASKS/TASK_MANIFEST.csv` 기준 구현 Task 총 66개, `DONE` 0개) |
| **Blocked Tasks** | `NONE`(아직 어떤 Task도 시도되지 않아 `BLOCKED` 상태 자체가 없음) — 단, 착수 전 환경 준비가 필요하다: `docs/ARCHITECTURE.md` §11 착수 차단(Supabase 패키지·`.env.local`·`supabase/` 디렉터리·Vitest/Playwright·`.github/workflows/` 전부 미설치) 참조 |
| **Latest CI** | `NOT_RUN` — `.github/workflows/`가 없고(`CI-LINT-TYPECHECK` Task 미착수), 원격 저장소도 아직 연결되지 않았다(`git remote -v` 결과 없음) |
| **Supabase State** | `NOT_CONNECTED` — `supabase/` 디렉터리·`.env*` 파일 모두 없음. `DB-SCHEMA-BASE`·`DB-RLS-BASE`·`DB-ACCESS`·`DB-SEED-BASE` 전부 미착수 |
| **Vercel Preview URL** | `NONE` — 아직 배포되지 않음 |
| **Screen Checkpoints** | 아래 표 참조 |
| **Playwright State** | `NOT_RUN` — `@playwright/test` 미설치, `tests/` 디렉터리 없음. `E2E-PUBLIC-SMOKE`·`E2E-TRAVEL-TOOLS`·`E2E-MATE-AUTH` 전부 미착수 |
| **Deferred Items** | EXCLUDED Requirement 27건 — 전체 목록은 `docs/PROJECT_SCOPE.md` §4·§5·§6, `TASKS/00_TASK_LIST.md` §3 NON_IMPLEMENTATION 참조(이 문서에 다시 옮겨 적지 않는다 — 두 곳에 같은 목록을 두면 어긋날 위험이 있다) |
| **Next Action** | 1) `docs/ARCHITECTURE.md` §11의 착수 차단 항목(Supabase 패키지 설치, `.env.local` 환경변수, `supabase/` 마이그레이션, Vitest/Playwright 설치, GitHub Actions workflow)을 해소한다. 2) `TASKS/WAVE_PLAN.md`를 작성해 66개 Task를 Wave로 나눈다. 3) `/run-wave W01`로 첫 Wave를 시작한다. |

## Screen Checkpoints

| Screen | Route | 상태 |
|---|---|---|
| SCR-001 | `/` | `PENDING` |
| SCR-002 | `/about` | `PENDING` |
| SCR-003 | `/travel-tools` | `PENDING` |
| SCR-004 | `/mates` | `PENDING` |
| SCR-005 | `/account` | `PENDING` |
| **FINAL** | (`/release-check`의 `RELEASE_READY` 판정) | `PENDING` |

각 Screen의 상태는 해당 Page Owner(`PO-SCR-*`) Task가 `DONE`이고 `CLAUDE.md` 규칙 22에 따라 사람이 Vercel Preview에서 확인한 뒤 `DONE`으로 바뀐다. `FINAL`은 `/release-check`가 `RELEASE_READY`를 판정한 시점에 `DONE`으로 바뀐다.
