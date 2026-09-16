---
name: traveler-project-pipeline
description: Traveler PRD/SRS에서 Task를 생성·상세화·감사하고 5개 Screen과 Wave 개발을 지원하는 프로젝트 Skill
---

# Traveler Project Pipeline

이 Skill은 Free Traveler의 **Task 생성·상세화·감사 파이프라인**과 **Wave 단위 개발**을 다룬다. 실제 코드 구현 방법(컴포넌트 작성 등)은 다루지 않는다 — 그건 `CLAUDE.md`와 각 `TASKS/TASK-<ID>.md`의 몫이다.

**우선순위:** 루트 `CLAUDE.md`가 이 프로젝트의 전역 규칙이다. 이 문서의 내용이 `CLAUDE.md`와 겹치면 `CLAUDE.md`를 따르고, 이 문서는 `CLAUDE.md`에 없는 **Task 파이프라인 고유의 세부 규칙**만 추가한다(중복 규칙을 다시 적지 않는다).

---

## 1. 입력 문서 목록

Task 생성·감사는 아래 6개 정본을 근거로 한다. 이 중 하나라도 없거나 스키마가 다르면 `scripts/validate_inputs.py`가 실패해야 하고, Task List를 만들지 않는다.

| 입력 | 역할 |
|---|---|
| `docs/06_SRS_UIUX_REVISED.md` | Requirement 원문(REQ-FUNC-001~080, REQ-NF-001~034) + UI Screen/Route 매핑 |
| `docs/PROJECT_SCOPE.md` | IMPLEMENT/EXCLUDED 판정과 사유(§3 처리 규칙의 정본) |
| `design-reference/D-001/DESIGN.md` | 디자인 토큰, Section 규칙, Empty State 규칙, Do/Do Not |
| `design-reference/UI_CONTRACT.md` | Screen별 영역 순서, Component, 상태, 사용자 행동, 금지 기능 |
| `design-reference/SCREEN_ROUTE_CONTRACT.json` | Screen·Route·Page Entry의 기계 판독 가능한 정본(`schema_version: traveler-screen-route-v1`) |
| 현재 `src/app` 파일 트리 | 이미 있는 파일(수정 대상)과 없는 파일(신규 생성 대상)을 구분하는 근거 |

출력은 `TASKS/00_TASK_LIST.md`(Task List), `TASKS/TASK-<ID>.md`(상세 Task, Task List와 1:1), `TASKS/TASK_MANIFEST.csv`·`TASKS/TASK_AUDIT_REPORT.md`(감사 산출물)다.

---

## 2. 5개 Screen과 Page Entry

`design-reference/SCREEN_ROUTE_CONTRACT.json`이 정본이다. 다른 문서의 Screen 설명이 다르게 보여도 이 JSON을 따른다.

| Screen | 구분 | Route | Page Entry |
|---|---|---|---|
| SCR-001 메인 | 핵심 | `/` | `src/app/page.tsx` |
| SCR-002 대표 소개 | 보조 | `/about` | `src/app/about/page.tsx` |
| SCR-003 통합 여행 준비 | 핵심 | `/travel-tools` | `src/app/travel-tools/page.tsx` |
| SCR-004 동행 조회 | 핵심 | `/mates` | `src/app/mates/page.tsx` |
| SCR-005 계정·관리 | 핵심 | `/account` | `src/app/account/page.tsx` |

정확히 5개이며, 6개도 4개도 안 된다. 인증 콜백·API Route·`not-found.tsx`·`error.tsx`는 `SCREEN_ROUTE_CONTRACT.json`의 `technical_routes`로 별도 관리되고 Screen으로 세지 않는다.

---

## 3. IMPLEMENT·EXCLUDED 상태 처리 규칙

- 모든 114개 Requirement(REQ-FUNC 80 + REQ-NF 34)는 `docs/PROJECT_SCOPE.md` 기준으로 **IMPLEMENT** 또는 **EXCLUDED** 둘 중 하나로 분류된다. 셋 중 하나가 아니라 반드시 둘 중 하나다.
- **IMPLEMENT** Requirement는 최소 1개 이상의 `TASKS/TASK-<ID>.md`의 `requirements_covered`에 등장해야 한다.
- **EXCLUDED** Requirement는 어떤 Task의 `requirements_covered`에도 넣지 않는다(§11 참조). 대신 `TASKS/00_TASK_LIST.md` §3 NON_IMPLEMENTATION 표에 사유·후속 방향과 함께 그대로 남긴다 — 삭제하지 않는다.
- `IMPLEMENT(축소)`·`IMPLEMENT(방식 변경)`처럼 범위가 좁혀진 항목은 IMPLEMENT로 취급하되, 상세 Task의 "Project Scope" 절에 축소 범위를 명시한다.

---

## 4. Task List·상세 Task 형식

**Task List**(`TASKS/00_TASK_LIST.md`): Seq/Task ID/제목/Category/Impl. Status/Requirement Ref/Screen/Route/Page Entry/Depends On/Expected Files/Functional AC/Visual AC/Security·Privacy AC/Verify/Priority 16열 표 + §3 NON_IMPLEMENTATION 표 + §4 커버리지 검증.

**상세 Task**(`TASKS/TASK-<ID>.md`, Task List와 1:1): frontmatter(`task_id`, `type`, `screen_id`, `route`, `page_entry`, `depends_on`, `requirements_covered`, `type: test`인 경우 `browser`, `DB-SCHEMA-BASE`인 경우 `tables`) + 본문 14개 절.

```
## Context
## Project Scope
## Requirement Ref
## Screen / Route / Page Entry
## Design Ref
## Depends On
## Expected Files
## Functional AC
## Visual AC
## Security/Privacy AC
## Test Cases
## Verify
## Definition of Done
## Forbidden
```

Expected Files 절 밖의 파일은 수정하지 않는다(`CLAUDE.md` 규칙 8과 동일 — 여기서 다시 규정하지 않고 참조만 한다).

---

## 5. Page Owner·Component 분리 규칙

- Task 유형은 `page_owner`, `component`, `shared`, `data`, `db`, `api`, `manual_check`, `release_check`, `devops`, `test`다.
- **Page Owner**(`PO-<SCR-ID>`)는 Screen당 정확히 1개이며, **새 Component를 직접 만들지 않는다** — Page Entry에서 이미 만들어진 Component Task 산출물을 실제로 조립하는 범위로만 한정한다.
- **Component**(`CMP-<SCR-ID>-<영역>`)는 Screen 안 한 영역만 구현한다. 화면 전체 조립과 특정 영역 구현을 한 Task로 묶지 않는다.
- Page Owner의 `depends_on`에는 반드시 같은 Screen의 Component Task가 최소 1개 이상 포함돼야 한다(다른 Screen의 Component만 있으면 안 된다).
- `PO-SCR-001`은 Next.js Starter 완전 제거 AC를, `PO-SCR-003`은 항공·숙소·동행 글쓰기 3탭 실제 조립 AC를, `PO-SCR-005`는 Guest·Member·Admin 역할별 상태 실제 조립 AC를 반드시 포함한다.

---

## 6. DB 6개 Table과 정적 Data 경계

- Supabase DB 테이블은 정확히 6개로 제한한다.

  ```
  DB_TABLES = [
    "user_profile",
    "mate_post",
    "mate_application",
    "user_block",
    "report",
    "external_url_setting",
  ]
  ```

- 여행지·국가 안전정보·대표 소개 콘텐츠는 이 6개 테이블에 포함하지 않는다 — `type: data` Task로 만들고 `src/data`의 정적 TypeScript 데이터로 관리한다(`DATA-DESTINATIONS-*`, `DATA-COUNTRY-SAFETY`, `DATA-ABOUT-PROFILE`, `DATA-POLICY-PAGES`).
- 감사 로그, 미디어 자산 등 EXCLUDED 범위(§11)에 대응하는 테이블을 추가로 만들지 않는다.

---

## 7. 외부 입력 비저장 불변조건

항공·숙소 폼(`CMP-SCR003-FLIGHT-FORM`, `CMP-SCR003-HOTEL-FORM`)의 입력값(목적 국가·지역·날짜)에는 다음이 예외 없이 적용된다(`REQ-FUNC-017`, `REQ-FUNC-025`, `REQ-NF-017`).

- Client Component의 일시 상태로만 보관한다.
- 서버 DB, 서버 로그, 분석 이벤트로 전송하지 않는다.
- 이 두 폼을 위한 서버 API를 만들지 않는다.
- 외부 이동 URL의 쿼리 파라미터에 목적지·날짜를 첨부하지 않는다.

Task 생성 시 이 두 Task(또는 관련 REQ를 커버하는 Task)의 Security/Privacy AC·Forbidden 절에 위 문구를 반드시 명시한다.

---

## 8. 기본 Auth·성인·RLS 규칙

- 인증은 Supabase Auth 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정으로 한정한다(`REQ-FUNC-066`).
- 성인 확인은 `is_adult`, `adult_verified_at` 두 필드만 쓴다. **정확한 생년월일을 저장하지 않는다**(`REQ-FUNC-028`).
- RLS는 아래 4그룹 판정만 쓴다(더 세분화하지 않는다 — "간단한" RLS 원칙).
  1. 본인이 작성한 글·요청
  2. 참가 요청의 대상 글 작성자
  3. Moderator/Admin
  4. 그 외는 403 또는 빈 결과
- `DB-SCHEMA-BASE`·`DB-RLS-BASE`·`DB-ACCESS`·`DB-SEED-BASE` 4개 DB Task가 이 규칙을 함께 구현한다 — 하나라도 빠지면 Task 생성이 완료된 것이 아니다.

---

## 9. Playwright Chromium Smoke 범위

- Playwright는 정확히 3개 고정 Task만 만든다: `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`.
- 셋 다 `browser: chromium`만 선언한다. `firefox`/`webkit`/`safari` 등 다른 브라우저 엔진 프로젝트를 추가하지 않는다.
- 이 3개를 넘는 추가 E2E Task, 또는 Chromium 외 브라우저를 언급하는 Task 본문은 감사(§12, `scripts/audit_tasks.py` 검사 15·16b)에서 실패로 처리된다.

---

## 10. Wave 내부 순차 실행

- 사용자의 개발 실행 단위는 **Wave**다(`docs/DECISION_LOG.md` DEC-010). `/run-wave WXX`가 표준 개발 명령이다(`CLAUDE.md` 규칙 6). 이 Skill이 만드는 `TASKS/TASK_MANIFEST.csv`의 `depends_on` 열이 Wave 분할의 근거 데이터다 — 세부 Wave 분할표 자체는 아직 별도 산출물로 없으므로, 사용 시 이 CSV에서 직접 순서를 확인한다.
- Wave 안에서는 **단일 Agent가 Depends On 순서로 Task를 한 번에 하나씩만** 구현한다(`docs/DECISION_LOG.md` DEC-011). 여러 Task를 동시에 병렬 구현하지 않는다.
- 화면 단위 Wave가 끝나면 사람이 Vercel Preview에서 확인한 뒤에만 다음 Wave로 진행한다(`CLAUDE.md` 규칙 22). 이 Skill은 Wave 승인 게이트 자체를 자동화하지 않는다.

---

## 11. EXCLUDED 보호

- EXCLUDED Requirement는 **상세 구현 Task를 만들지 않는다.** 어떤 `TASKS/TASK-<ID>.md`의 `requirements_covered`에도 EXCLUDED ID가 들어가면 안 된다.
- EXCLUDED Requirement를 임의로 구현하지 않는다(`CLAUDE.md` 규칙 19와 동일 원칙 — 여기서는 Task 생성 단계의 적용만 규정한다). 필요하다고 판단되면 Task를 만들기 전에 먼저 사용자에게 확인한다.
- EXCLUDED는 추적표(`docs/06_SRS_UIUX_REVISED.md`, `TASKS/00_TASK_LIST.md` §3)에서 삭제하지 않는다 — "안 만들기로 했다"는 사실 자체가 기록으로 남아야 한다.
- `scripts/audit_tasks.py` 검사 17·18이 이 규칙을 기계적으로 검증한다: 114개 Requirement 전량이 Task 또는 EXCLUDED 표 중 정확히 한 곳에 있어야 하고, EXCLUDED Requirement를 커버한다고 기록된 Task는 0개여야 한다.

---

## 12. AWS·EC2·자동 Merge 금지

- 인프라는 Vercel(애플리케이션)과 Supabase(DB·Auth)로 한정한다. **AWS·EC2를 비롯한 별도 클라우드 가상 서버를 Task로 만들지 않는다.**
- **자동 Merge(Auto Merge) Task를 만들지 않는다.** 병합은 항상 사람이 직접 한다(`CLAUDE.md` 규칙 21).
- Task 상세 파일 본문 어디에도 다음 금지 키워드가 등장하면 안 된다.

  ```
  FORBIDDEN_KEYWORDS = ["EC2", "AWS", "자동 병합", "자동 머지", "Auto Merge", "auto-merge"]
  ```

- `scripts/audit_tasks.py` 검사 16이 전체 Task 본문을 스캔해 이 키워드를 검사한다.

---

## 부록 A. 명령 3개

| Command | 역할 |
|---|---|
| `/gen-tasklist` | 입력 검증(`scripts/validate_inputs.py`) 후 `TASKS/00_TASK_LIST.md` 생성 |
| `/gen-task-details` | Task List의 각 행마다 `TASKS/TASK-<ID>.md` 1개씩 생성 |
| `/audit-tasks` | 재생성 없이 `scripts/audit_tasks.py`만 실행해 정합성 재확인, `TASKS/TASK_MANIFEST.csv`·`TASKS/TASK_AUDIT_REPORT.md` 갱신 |

순서는 항상 `/gen-tasklist` → `/gen-task-details` → `/audit-tasks`다. `/audit-tasks`는 언제든 단독으로 다시 돌릴 수 있다.

## 부록 B. 스크립트 2개

| Script | 실행 시점 | 실패 시 동작 |
|---|---|---|
| `scripts/validate_inputs.py` | `/gen-tasklist` 시작 시 항상 먼저 | exit 0이 아니면 Task List를 만들지 않는다 |
| `scripts/audit_tasks.py` | Task 상세 생성 후, `/audit-tasks`에서 단독 | exit 0이 아니면 "감사 완료"라고 보고하지 않는다. 성공 시 `AUDIT_PASS`와 검사 수를 출력한다 |

두 스크립트 모두 외부 패키지 없이 Python 3 표준 라이브러리만 쓴다.

## 부록 C. 금지(Skill 전체에 적용)

- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI를 요구하는 Task를 만들지 않는다(`design-reference/D-001/DESIGN.md` §19 Do Not).
- `docs/06_SRS_UIUX_REVISED.md`·`docs/PROJECT_SCOPE.md`의 Requirement를 삭제하거나 개수를 바꾸지 않는다.
- 구현되지 않은 것을 완료로 기록하지 않는다 — Task 상세 파일은 계획 문서이며, 실제 코드 작성 여부는 별도로 추적한다.
- `validate_inputs.py` 또는 `audit_tasks.py`가 실패한 상태에서 다음 단계로 진행하지 않는다.
