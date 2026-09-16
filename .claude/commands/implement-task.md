---
description: prepare-task가 READY_TO_IMPLEMENT로 판정한 Task 하나를 Expected Files 안에서 구현하고, 관련 테스트를 실행한 뒤 변경 파일·검증·제약을 보고한다.
---

# /implement-task

이 Command는 `traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)과 루트 `CLAUDE.md`의 규칙을 따른다. 이 문서와 두 문서가 다르면 `CLAUDE.md` → Skill → 이 문서 순으로 우선한다.

이 파이프라인에서 **실제로 코드를 작성하는 유일한 Command**다(`/gen-tasklist`·`/gen-task-details`·`/audit-tasks`·`/prepare-task`는 코드를 만들지 않는다).

## 입력

| 입력 | 설명 |
|---|---|
| `TASK_ID` | 구현할 Task ID(예: `CMP-SCR001-HERO`). |
| (선택) `--commit` | 사용자가 명시적으로 붙였을 때만 Task 단위 커밋까지 수행한다(§커밋 정책 참조). |

## 0. 게이트 — READY_TO_IMPLEMENT 확인

**규칙 1: `/prepare-task`가 `READY_TO_IMPLEMENT`로 판정한 Task만 구현한다.**

- 직전에 같은 `TASK_ID`로 `/prepare-task`를 실행해 `READY_TO_IMPLEMENT`를 받은 기록이 이번 대화에 있으면 그 결과를 쓴다.
- 없으면 이 Command가 `/prepare-task <WAVE_ID> <TASK_ID>`를 먼저 실행한다(`WAVE_ID`를 모르면 사용자에게 묻는다).
- 결과가 `READY_TO_IMPLEMENT`가 아니면(`BLOCKED_*`) **여기서 중단**하고 그 상태와 사유를 그대로 보고한다. 게이트를 우회해 구현으로 넘어가지 않는다.

## 실행 순서

1. **Task 읽기** — `TASKS/TASK-<TASK_ID>.md` 전체(Context, Requirement Ref, Design Ref, Depends On, Expected Files, Functional/Visual/Security AC, Test Cases, Verify, Definition of Done, Forbidden)를 읽는다.

2. **입력 확인** — `package.json`과 설치된 Next.js 버전 문서(`node_modules/next/dist/docs/`)를 확인한다(`CLAUDE.md` 규칙 1). Design Ref가 가리키는 `design-reference/D-001/DESIGN.md`·`design-reference/UI_CONTRACT.md` 절을 실제로 읽는다.

3. **구현 — 규칙 2·3·4를 지킨다.**
   - **Expected Files 안에서만** 파일을 만들거나 고친다. 그 밖의 파일은 건드리지 않는다(`CLAUDE.md` 규칙 8).
   - Functional AC·Visual AC·Security/Privacy AC를 전부 반영한다. AC에 없는 기능을 임의로 추가하지 않는다.
   - **Page Owner Task**(`type: page_owner`)라면 새 Component를 만들지 않는다 — `depends_on`에 있는 Component Task들이 이미 만든 산출물을 **실제 Page Entry**(`src/app/.../page.tsx`)에서 import해 조립하는 것으로 범위를 한정한다(`CLAUDE.md` 규칙 9).
   - 항공·숙소 입력 폼을 다루는 Task라면 입력값을 Client 상태로만 유지하고 서버·URL·로그로 보내지 않는다(`CLAUDE.md` 규칙 12).
   - Supabase를 다루는 Task라면 RLS를 우회하는 Client 코드를 쓰지 않고, Service Role Key를 Client에 노출하지 않는다(`CLAUDE.md` 규칙 14·15).

4. **관련 Unit Test 실행 — 규칙 5.**
   - 이 Task가 직접 만드는 로직을 검증하는 Vitest가 있으면(`UNIT-TRAVEL-DATES`, `UNIT-CONTACT-DETECTION`, `UNIT-MATE-STATE`, `TEST-RLS-BASIC`, 또는 이 Task 자신이 그 Unit/Integration Test Task라면) 실행한다.
     ```
     npm test
     ```
   - 관련 Unit Test가 없는 Task(예: 정적 데이터, 문서화 전용 `manual_check`/`release_check`)는 "해당 없음"으로 보고한다 — 실행하지 않은 것을 실행했다고 보고하지 않는다.
   - 실패하면 원인을 고치고 다시 실행한다. 실패한 채로 다음 단계로 넘어가지 않는다.

5. **Playwright Smoke — 규칙 6, 조건부로만 실행한다.**
   - 이번 Task가 **Page Owner Task**(`type: page_owner`)이거나, 이번 Task 자체가 **E2E Task**(`E2E-PUBLIC-SMOKE`/`E2E-TRAVEL-TOOLS`/`E2E-MATE-AUTH`)일 때만 관련 Playwright Chromium Smoke를 실행한다.
   - 그 외 Task 유형(Component, Shared, Data, DB, API, Manual Check, Release Check, DevOps)은 Playwright를 실행하지 않는다 — 관련 E2E가 Verify 절에 적혀 있어도, 이 Task 단계에서는 건너뛰고 "해당 없음(Page Owner/E2E 완료 시 함께 검증)"으로 보고한다.
   - 실행 대상 Chromium Smoke 3종 외의 브라우저 프로젝트를 추가하지 않는다.

6. **Diff 확인** — `git status`·`git diff`로 변경된 파일이 Expected Files와 정확히 일치하는지 확인한다. 범위 밖 파일이 걸려 있으면 되돌리거나 사용자에게 알린다.

7. **완료 보고 — 규칙 8.** 아래 세 가지를 항상 보고한다.
   - **변경 파일 목록**(신규/수정 구분).
   - **검증 결과**(lint·타입체크·Unit Test·Playwright 각각 실행 여부와 통과/실패. 실행하지 않았으면 "실행하지 않음"이라고 명시하지, 생략하지 않는다).
   - **남은 제약사항**(Definition of Done 중 충족하지 못한 항목, 확인하지 못한 부분, 후속 Task에 넘길 사항).

## 금지 — 규칙 7

- **AWS·EC2**를 쓰는 코드·설정(배포 스크립트, SDK 호출 등)을 추가하지 않는다. 인프라는 Vercel·Supabase만 쓴다.
- **Prisma를 비롯한 ORM**을 추가하지 않는다. DB 접근은 `DB-ACCESS` Task가 정의한 Supabase 클라이언트 계층만 쓴다.
- **자동 Merge** 관련 기능(예: GitHub Actions의 auto-merge 설정, 병합 자동화 스크립트)을 추가하지 않는다.
- `docs/PROJECT_SCOPE.md`에서 EXCLUDED로 분류된 기능을 임의로 함께 구현하지 않는다.
- Expected Files 밖의 파일을 수정하지 않는다.

## 커밋 정책

- **기본값: Commit·Push·PR을 자동으로 수행하지 않는다.** 구현과 검증까지만 하고, `git add`/`git commit`/`git push`/PR 생성은 하지 않는다.
- 사용자가 **명시적으로 커밋을 요청**하면(예: `--commit` 옵션, 또는 대화에서 "커밋해줘"), **이 Task 하나 분량만** 커밋할 수 있다.
  - `git status`로 Expected Files 목록과 실제 변경 파일이 일치하는지 다시 확인한 뒤, 그 파일만 `git add`한다(`git add -A`로 범위 밖 파일까지 쓸어 담지 않는다).
  - 커밋 메시지는 harness의 커밋 메시지 규칙(변경 이유 중심, HEREDOC 사용 등)을 따르고, `TASK_ID`와 한 일을 요약한다.
  - **Push와 PR 생성은 사용자가 별도로 요청하기 전까지 하지 않는다**(`CLAUDE.md` 규칙 21 — 자동 PR·자동 Merge 금지). 여러 Task를 모아 한 번에 커밋해 달라는 요청이 없으면, 커밋은 항상 Task 단위로 쪼갠다.
