---
description: TASKS/00_TASK_LIST.md의 각 구현 Task ID에 대해 TASKS/TASK-<ID>.md 상세 파일을 1:1로 생성하고 scripts/audit_tasks.py로 감사한다.
---

# /gen-task-details

이 Command는 `traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)의 규칙을 따른다. 이 문서와 Skill 본문이 다르면 Skill을 따른다.

`TASKS/00_TASK_LIST.md`가 이미 존재해야 한다(없으면 `/gen-tasklist`를 먼저 실행하라고 안내하고 중단한다). 이 Command는 Task List의 **모든 구현 Task 행에 대해 정확히 1개씩** `TASKS/TASK-<ID>.md`를 만든다(Task List와 상세 파일은 1:1 — SKILL §4). **구현 코드·Branch·Commit을 만들지 않는다.**

## 실행 순서

1. **`TASKS/00_TASK_LIST.md` §2 표를 실제로 읽어** Seq 순서로 전체 Task ID를 뽑는다.

2. **사전 검사를 실제로 수행한다**(추측으로 넘어가지 않는다).
   - 중복 Task ID가 0건인가.
   - Task ID·제목·Category·Impl. Status·Screen·Expected Files 등 필수 열이 비어 있지 않은가.
   - Depends On이 가리키는 Task가 목록에 실제로 존재하는가(존재하지 않는 참조 0건).
   - 문제가 있으면 구체적으로(어떤 행, 어떤 열) 사용자에게 보고하고, 고쳐지기 전까지 상세 파일을 만들지 않는다.

3. **`TASKS/` 안에 이미 있는 `TASK-<ID>.md`와 대조해 없는 것만** 새로 만든다(이유 없이 기존 상세 파일을 덮어쓰지 않는다).

4. **Task ID마다 아래 형식으로 `TASKS/TASK-<ID>.md`를 만든다**(SKILL §4의 frontmatter + 14개 절).

   ```markdown
   ---
   task_id: <Task ID>
   type: page_owner | component | shared | data | db | api | manual_check | release_check | devops | test
   screen_id: <SCR-00X, Screen에 종속되지 않으면 생략>
   route: <Route, 없으면 생략>
   page_entry: <Page Entry, 없으면 생략>
   depends_on:
     - <Task ID>
   requirements_covered:
     - REQ-FUNC-XXX
   browser: chromium   # type: test이며 E2E-* 고정 3개 Task에만
   tables:              # DB-SCHEMA-BASE에만, 6개 이하
     - user_profile
   ---

   ## Context
   (이 Task가 어느 Screen·Route의 무엇을 구현하는지 1~3문장)

   ## Project Scope
   (Impl. Status = IMPLEMENT 여부와 근거 문서. `IMPLEMENT(축소)`인 Requirement가 있으면 축소 범위를 명시)

   ## Requirement Ref
   (커버하는 REQ ID마다 `docs/06_SRS_UIUX_REVISED.md` 원문 문장을 그대로 인용)

   ## Screen / Route / Page Entry
   (Task List 해당 행의 값)

   ## Design Ref
   (`design-reference/D-001/DESIGN.md`·`design-reference/UI_CONTRACT.md`의 구체적 절 번호. "디자인 문서 참고" 식으로 뭉뚱그리지 않는다)

   ## Depends On
   ## Expected Files
   (Task List Expected Files 열 그대로 — 이 밖의 파일은 이 Task 범위에서 수정하지 않는다고 명시)

   ## Functional AC
   ## Visual AC
   ## Security/Privacy AC
   (Task List 해당 열 값)

   ## Test Cases
   (Functional/Visual/Security AC를 검증 가능한 개별 항목으로 풀어 쓰고, Verify 절의 수단과 연결한다)

   ## Verify
   (Task List Verify 열 — 어떤 Test/체크리스트 Task가 이것을 검증하는지)

   ## Definition of Done
   (AC 충족, Expected Files 준수, Verify 통과, Forbidden 미위반 + Page Owner라면 SKILL §5의 Screen별 특별 조건)

   ## Forbidden
   (Expected Files 밖 수정 금지, D-001 Do Not, EC2·AWS·자동 Merge 금지, EXCLUDED 재구현 금지)
   ```

5. **원본을 옮길 때 실제로 읽어서 인용한다** — Requirement Ref·Design Ref·AC 절 모두 해당 문서를 열어 확인한 내용만 쓴다.

6. **Page Owner Task 작성 시 반드시 지킨다**(SKILL §5).
   - `PO-SCR-001`(`src/app/page.tsx`)은 "Next.js Starter 완전 제거"(로고·"Get started"·기본 링크 잔존 금지) AC를 반드시 포함한다.
   - `PO-SCR-003`(`/travel-tools`)은 항공·숙소·동행 글쓰기 **3개 탭을 실제로 조립**한다는 AC를 포함한다 — 나열만 하고 연결하지 않는 것은 완료로 인정하지 않는다.
   - `PO-SCR-005`(`/account`)는 Guest·Member·Admin **3개 상태를 실제로 조립**한다는 AC를 포함한다 — 역할별 조건 분기(역할에 없는 탭 미렌더링)까지 AC에 명시한다.
   - Page Owner는 새 Component를 직접 만들지 않는다 — Forbidden 절에 "Depends On의 CMP-* Task 산출물만 조립한다"를 명시한다.

7. **EXCLUDED Requirement는 어떤 상세 파일의 `requirements_covered`에도 넣지 않는다**(SKILL §3·§11). `TASKS/00_TASK_LIST.md` §3 NON_IMPLEMENTATION 표에만 남아있으면 된다.

8. **Forbidden 절 문구는 금지 키워드를 리터럴로 반복하지 않는다.** 예를 들어 "EC2·AWS·자동 병합 금지"라고 그대로 쓰면 `audit_tasks.py`의 금지 키워드 스캔이 이 문구 자체를 오탐한다. "배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다", "코드 반영은 사람이 직접 리뷰한 뒤 진행한다"처럼 같은 뜻을 금지 키워드 없이 서술한다.

9. **모든 상세 파일 작성이 끝나면 반드시 실행한다**(예외 없음).
   ```
   python3 scripts/audit_tasks.py
   ```
   - exit code가 0이 아니면(`AUDIT_FAIL`), 출력된 `[FAIL]` 항목을 하나씩 읽고 해당 상세 파일이나 `TASKS/00_TASK_LIST.md`를 고친 뒤 **다시 실행**한다. **감사가 통과하기 전에는 "완료"라고 보고하지 않는다 — 실패를 무시하고 다음 단계로 넘어가지 않는다.**
   - 통과하면(`AUDIT_PASS`) 출력된 검사 수, 그리고 `TASKS/TASK_MANIFEST.csv`·`TASKS/TASK_AUDIT_REPORT.md`가 갱신됐음을 사용자에게 그대로 보고한다.

## 금지

- `audit_tasks.py`를 실행하지 않고, 또는 실패(`AUDIT_FAIL`)한 채로 작업을 완료했다고 보고하지 않는다.
- Task List에 없는 임의의 상세 파일을 추가로 만들지 않는다(1:1 원칙 위반).
- 구현 코드·Branch·Commit을 만들지 않는다.
- EC2·AWS·자동 Merge·Chromium 이외 브라우저를 상세 파일 어디에도 기록하지 않는다.
