---
description: 배포 전 마지막 게이트 — Task·Wave 완료, Page Owner 5개, CI, Playwright Smoke, DB 6테이블·RLS, Preview Checkpoint, EXCLUDED 목록을 검사해 RELEASE_READY 또는 RELEASE_BLOCKED를 판정한다.
---

# /release-check

이 Command는 `traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)과 루트 `CLAUDE.md`의 규칙을 따른다. 이 문서와 두 문서가 다르면 `CLAUDE.md` → Skill → 이 문서 순으로 우선한다.

`/prepare-task`가 **Task 하나**의 착수 가능 여부를 판정하는 Command라면, 이 Command는 **프로젝트 전체**의 배포 가능 여부를 판정하는 마지막 게이트다. **이 Command는 코드·Task 문서·설정 파일을 수정하지 않는다** — 검증 명령(`npm run lint`·`tsc --noEmit`·`npm test`·Playwright·`scripts/audit_tasks.py`)은 실행하지만, 그 결과로 어떤 파일도 고치지 않는다.

## 실행 순서

아래 7개 항목을 **전부** 실제로 확인한다. 하나가 실패했다고 나머지를 건너뛰지 않는다 — 배포 전 한 번에 전체 그림을 보여준다.

### 1. Task·Wave 상태

- `TASKS/WAVE_STATE.json`을 읽는다. 모든 Wave의 모든 Task가 `DONE`인지 확인한다.
- `PENDING`/`READY`/`IN_PROGRESS`/`FAILED`/`BLOCKED` 상태로 남은 Task가 하나라도 있으면 실패로 기록하고 목록을 그대로 보여준다.
- `TASKS/WAVE_STATE.json` 자체가 없으면 "Wave 진행 기록이 없어 완료 여부를 확인할 수 없음"으로 실패 처리한다(추측으로 통과시키지 않는다).

### 2. 5개 Page Owner DONE

- `PO-SCR-001`~`PO-SCR-005`가 `TASKS/WAVE_STATE.json`에서 전부 `DONE`인지 확인한다.
- 기록만 믿지 않고 **실제 파일도 대조**한다: `design-reference/SCREEN_ROUTE_CONTRACT.json`의 5개 `page_entry` 파일이 전부 존재하는지, `src/app/page.tsx`에 `create-next-app` 기본 마크업("Get started", 기본 Next.js 로고 등)이 더 이상 없는지 확인한다.
- 기록은 `DONE`인데 실제 파일이 없거나 Starter 마크업이 남아 있으면 실패로 기록한다(문서와 실제 상태의 불일치를 그대로 보고한다).

### 3. CI PASS

- `.github/workflows/`가 있고 `gh` CLI를 쓸 수 있으면, 현재 브랜치의 최신 워크플로 실행 결과를 확인한다.
  ```
  gh run list --branch "$(git branch --show-current)" --limit 1
  ```
- `gh`를 쓸 수 없거나 워크플로 기록이 없으면, `CI-LINT-TYPECHECK` Task가 정의한 명령을 **지금 직접 실행**해 그 결과로 대체한다(어느 방법을 썼는지 보고서에 명시한다).
  ```
  npm run lint
  tsc --noEmit
  npm test
  ```
- 셋 중 하나라도 실패하면 CI PASS 항목은 실패다.

### 4. Playwright Smoke PASS

- `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH` 3개가 `TASKS/WAVE_STATE.json`에서 `DONE`인지 확인한다.
- 이어서 3개를 **Chromium으로 실제 재실행**해 지금 이 순간에도 통과하는지 확인한다(배포 직전 재확인 목적 — Task를 구현할 때 통과했다는 과거 기록만으로 충분하지 않다).
- 3개를 넘는 다른 브라우저(firefox/webkit/safari) 실행 기록이 있으면 그 자체를 위반으로 기록한다(`CLAUDE.md` 규칙 18, SKILL §9).

### 5. Supabase 6개 Table·기본 RLS 확인 기록

- `supabase/migrations/0001_schema.sql`을 읽어 정의된 테이블이 `user_profile`, `mate_post`, `mate_application`, `user_block`, `report`, `external_url_setting` **정확히 6개**인지 확인한다(SKILL §6).
- `supabase/migrations/0002_rls.sql`이 존재하고, `TEST-RLS-BASIC`이 `TASKS/WAVE_STATE.json`에서 `DONE`인지 확인한다 — 이것이 "기본 RLS 확인 기록"이다.
- **이 Command는 실제 Supabase 프로젝트에 접속해 RLS를 재검증하지 않는다**(자격 증명이 필요한 원격 검사는 범위 밖). 위 세 가지(테이블 정의 파일, RLS 정책 파일, RLS 테스트 완료 기록)를 근거로만 판정하며, 이 한계를 보고서에 명시한다.

### 6. Vercel Preview Checkpoint

- `TASKS/WAVE_PLAN.md`에서 `Preview Checkpoint: true`로 표시된 모든 Wave를 찾는다.
- 그 Wave들이 `TASKS/WAVE_STATE.json`에서 전부 완료(`DONE`) 상태인지 확인한다.
- **파일 증거만으로는 "사람이 실제로 Vercel Preview를 봤는지" 확인할 수 없다.** 이 항목은 자동으로 PASS 처리하지 않는다 — 보고서에서 사용자에게 직접 확인을 요청한다: "Preview Checkpoint가 걸린 모든 Wave를 실제 Vercel Preview 주소에서 확인했습니까?" 사용자가 명시적으로 확인했다고 답하기 전까지 이 항목은 `미확인`으로 남고, `미확인`은 판정에서 실패와 동일하게 취급한다.

### 7. EXCLUDED 목록

- `python3 scripts/audit_tasks.py`를 실행한다(검사 17·18이 정확히 이 목적이다 — 114개 Requirement 전량이 Task 또는 EXCLUDED에 있고, EXCLUDED가 구현됐다고 기록된 Task가 없는지).
- `docs/PROJECT_SCOPE.md`에서 현재 EXCLUDED로 분류된 Requirement 전체 목록(27건 안팎)을 그대로 뽑아 보고서에 첨부한다 — 무엇을 "안 만들기로 했는지" 배포 승인자가 마지막에 다시 확인할 수 있게 한다.
- `audit_tasks.py`가 `AUDIT_FAIL`이면 이 항목은 실패다.

## 판정

- **`RELEASE_READY`**: 위 7개 항목이 전부 PASS(6번은 사용자가 명시적으로 확인 답변을 줬을 때만 PASS로 인정).
- **`RELEASE_BLOCKED`**: 7개 항목 중 하나라도 FAIL 또는 미확인.

## 출력 형식

```
VERDICT: RELEASE_READY | RELEASE_BLOCKED
확인 시각: <실행 시각>

[1] Task·Wave 상태: PASS | FAIL — <미완료 Task 목록>
[2] Page Owner 5개: PASS | FAIL — <불일치 상세>
[3] CI PASS: PASS | FAIL — <방법: gh run list | 로컬 재실행>, <결과>
[4] Playwright Smoke: PASS | FAIL — <재실행 결과>
[5] Supabase 6 Table·RLS 기록: PASS | FAIL — <상세, "실제 접속 재검증 아님" 명시>
[6] Vercel Preview Checkpoint: PASS | 미확인 — <해당 Wave 목록>
[7] EXCLUDED 목록: PASS | FAIL — <audit_tasks.py 결과 + EXCLUDED Requirement 목록>
```

`RELEASE_BLOCKED`면 실패한 항목마다 무엇을 고치거나 확인해야 다음 판정이 통과할지 한두 문장씩 안내한다.

## 금지

- 이 Command는 코드·Task 문서·설정 파일을 수정하지 않는다(검증 명령 실행은 허용되지만 그 결과로 파일을 고치지 않는다).
- 6번(Vercel Preview Checkpoint)을 파일 증거만으로 자동 PASS 처리하지 않는다 — 사람의 명시적 확인 없이 통과시키지 않는다.
- 7개 항목 중 일부를 생략하고 `RELEASE_READY`를 보고하지 않는다.
- 이 Command에서 Git Branch·PR·Merge·배포(Vercel 트리거 등)를 실행하지 않는다 — 판정만 한다.
