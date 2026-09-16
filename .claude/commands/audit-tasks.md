---
description: TASKS/00_TASK_LIST.md와 TASKS/TASK-*.md의 정합성을 scripts/audit_tasks.py(18개 규칙)로 재검사한다(재생성 없이 단독 실행).
---

# /audit-tasks

이 Command는 `traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)의 규칙을 따른다. 이 문서와 Skill 본문이 다르면 Skill을 따른다.

Task List나 상세 파일을 새로 만들지 않고, 현재 `TASKS/` 상태를 다시 검사만 한다. Task 상세 파일을 손으로 고친 뒤 재검증하거나, Wave 착수 전·PR 리뷰 전 최종 확인할 때 쓴다. **구현 코드를 만들지 않는다.**

## 실행 순서

1. **아래 명령을 실제로 실행한다**(이전 실행 결과를 재사용하거나 추측으로 대체하지 않는다).
   ```
   python3 scripts/audit_tasks.py
   ```
   이 스크립트는 `TASKS/00_TASK_LIST.md`, `TASKS/TASK-*.md`, `docs/PROJECT_SCOPE.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`을 직접 읽어 18개 규칙(+ Screen별 세부 검사)을 검사하고, `TASKS/TASK_MANIFEST.csv`·`TASKS/TASK_AUDIT_REPORT.md`를 다시 쓴다.

2. **출력을 그대로 사용자에게 보고한다** — 총 검사 수, PASS/FAIL 개수, 실패 항목별 상세(`[FAIL]` 줄).

3. **`FAIL`이 있으면(`AUDIT_FAIL`, exit code 1):**
   - **이 실패를 무시하고 "통과"나 "완료"로 보고하지 않는다.**
   - 어떤 규칙이 왜 실패했는지 관련 Task ID·Requirement ID와 함께 짚어준다. 예:
     - 1:1 대응 불일치 → 누락된 Task ID / 고아 상세 파일
     - Dependency Cycle → 순환 경로
     - Page Owner 조건(SCR-001 Starter 제거·SCR-003 3탭·SCR-005 역할별 조립) 실패 → 어떤 Page Owner의 어떤 AC가 빠졌는지
     - DB Table 초과 → 초과분 테이블 이름
     - Requirement 커버리지 → 미매핑 REQ ID 또는 EXCLUDED와 충돌하는 REQ ID
   - 고칠지 여부와 방법(직접 편집 또는 `/gen-task-details` 재실행)을 사용자에게 확인한다.
   - **이 Command 자체는 `TASKS/00_TASK_LIST.md`나 `TASKS/TASK-*.md`를 수정하지 않는다**(검사 전용). 수정은 사용자 확인 후 별도로 진행한다.

4. **전부 `PASS`면(`AUDIT_PASS`, exit code 0):** 출력된 검사 수와 함께 "감사 통과"를 보고하고, `TASKS/TASK_MANIFEST.csv`·`TASKS/TASK_AUDIT_REPORT.md`가 갱신됐음을 함께 안내한다.

## 금지

- 스크립트를 실행하지 않고 "정상"이라고 보고하지 않는다.
- 실패(`AUDIT_FAIL`)한 결과를 통과로 보고하거나, 실패를 이유 없이 넘어가지 않는다.
- `TASKS/00_TASK_LIST.md` 또는 `TASKS/TASK-*.md`를 이 Command에서 직접 수정하지 않는다.
- 구현 코드를 만들지 않는다.
