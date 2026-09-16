---
description: Traveler 프로젝트의 Task List(TASKS/00_TASK_LIST.md)를 5개 승인 Screen과 114개 Requirement 기준으로 생성한다.
---

# /gen-tasklist

이 Command는 `traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)의 규칙을 따른다. 이 문서와 Skill 본문이 다르면 Skill을 따른다.

이 Command는 **`TASKS/00_TASK_LIST.md`만** 만든다. 상세 Task 파일(`TASKS/TASK-<ID>.md`)은 `/gen-task-details`가 만든다. **구현 코드·Branch·Commit·Issue를 만들지 않는다.**

## 실행 순서

1. **입력 검증을 먼저 실행한다.**
   ```
   python3 scripts/validate_inputs.py
   ```
   exit code가 0이 아니면 즉시 중단하고 실패한 검사 항목을 사용자에게 보고한다. **이 결과를 무시하고 Task List를 생성하지 않는다.**

2. **다음 문서를 실제로 읽는다**(추측으로 채우지 않는다 — 각 절의 값은 아래 원본에서 그대로 가져온다).
   - `design-reference/SCREEN_ROUTE_CONTRACT.json` — Screen 목록의 정본(SKILL §2). `schema_version`이 `traveler-screen-route-v1`이 아니면 중단한다.
   - `docs/06_SRS_UIUX_REVISED.md` — 114개 Requirement와 Screen 매핑.
   - `docs/PROJECT_SCOPE.md` — IMPLEMENT/EXCLUDED 분류와 사유(SKILL §3).
   - `design-reference/UI_CONTRACT.md` — Screen별 영역 순서·주요 Component·상태·금지 기능.
   - `design-reference/D-001/DESIGN.md` — 최소 콘텐츠 수, Empty State 규칙, Do/Do Not.
   - 현재 `src/app` 파일 트리(`validate_inputs.py` 출력의 "현재 src/app 파일 트리" 절 사용) — 이미 있는 파일과 새로 만들 파일을 구분하는 근거.

3. **Task를 설계한다.** Task 유형은 `page_owner`, `component`, `shared`, `data`, `db`, `api`, `manual_check`, `release_check`, `devops`, `test`다(SKILL §4·§5).
   - **Page Owner**(`PO-<SCR-ID>`): Screen당 정확히 1개(SKILL §2). 새 Component를 직접 만들지 않고 조립만 한다(SKILL §5).
   - **Component**(`CMP-<SCR-ID>-<영역>`): Screen 내 UI 영역 단위. Page Owner와 절대 같은 Task로 묶지 않는다.
   - **Shared**: 2개 이상 Screen이 공유하는 컴포넌트·유틸. Task ID는 `SHARED-<이름>`.
   - **Data**: 여행지·국가 안전정보·대표 소개는 반드시 `type: data`로 만든다(SKILL §6). DB Task로 만들지 않는다.
   - **DB**: Supabase 스키마 Task 4개(`DB-SCHEMA-BASE`, `DB-RLS-BASE`, `DB-ACCESS`, `DB-SEED-BASE`). 테이블은 SKILL §6의 6개로 제한한다.
   - **API**: Route Handler 단위. 항공·호텔 폼에는 서버 API를 만들지 않는다(SKILL §7).
   - **Test**: `UNIT-TRAVEL-DATES`, `UNIT-CONTACT-DETECTION`, `UNIT-MATE-STATE`, `TEST-RLS-BASIC`(고정 Unit/Integration 4개) + `E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`(고정 Chromium Smoke 3개, SKILL §9). 이 7개 외의 test Task를 만들지 않는다.
   - **Manual Check / Release Check / DevOps**: 접근성·반응형·외부 링크 수동 점검, 배포 전 점검, CI Lint·Typecheck 게이트.

4. **의존 관계를 건다.** Page Owner Task는 같은 Screen의 Component Task 중 최소 1개 이상에 의존해야 한다(SKILL §5). `/travel-tools` Page Owner는 항공/숙소/동행 글쓰기 Component 전부에, `/account` Page Owner는 Guest/Member/Admin 관련 Component 전부에 의존한다.

5. **114개 Requirement 전부를 Task 또는 EXCLUDED로 기록한다**(SKILL §3). `docs/PROJECT_SCOPE.md`에서 IMPLEMENT인 Requirement는 최소 1개 Task의 `Requirement Ref`에 들어가야 한다. EXCLUDED인 Requirement는 어떤 Task에도 넣지 않는다 — 대신 Task List 하단 "EXCLUDED Requirement 목록"에 사유·후속 방향과 함께 그대로 남긴다(SKILL §11).

6. **금지 사항을 지킨다**(SKILL §7·§12): 항공·호텔 입력값을 서버·DB·외부 URL로 보내는 Task를 만들지 않는다. EC2·AWS·자동 Merge Task를 만들지 않는다.

7. **`TASKS/00_TASK_LIST.md`를 쓴다.** 형식:
   ```markdown
   # Traveler Task List

   | Seq | Task ID | 제목 | Category | Impl. Status | Requirement Ref | Screen | Route | Page Entry | Depends On | Expected Files | Functional AC | Visual AC | Security/Privacy AC | Verify | Priority |
   |---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
   | 1 | PO-SCR-001 | ... | PAGE_OWNER | IMPLEMENT | FUNC-001,... | SCR-001 | `/` | `src/app/page.tsx` | ... | ... | ... | ... | ... | ... | P0 |

   ## 3. NON_IMPLEMENTATION(EXCLUDED, Task 없음)
   | Requirement | 사유 | 후속 방향 |
   |---|---|---|
   | REQ-FUNC-045 | ... | ... |

   ## 4. Requirement 커버리지 검증
   (114건 전량이 §2 또는 §3 중 정확히 한 곳에 존재함을 서술)
   ```
   Task 개수는 약 45~65개를 참고 범위로 삼되, 개수 자체를 완료 조건으로 쓰지 않는다. 원칙(Page Owner/Component 분리, 정적 데이터 분리, DB 6테이블 제한 등)을 먼저 지키고, 그 결과로 나온 개수를 그대로 받아들인다.

8. **완료 후 사용자에게 보고한다.** Task 총 개수, Page Owner 5개 존재 확인, IMPLEMENT/EXCLUDED 매핑 건수(87/27과 일치해야 함)를 요약한다. 이 시점에는 아직 상세 파일이 없으므로 `/gen-task-details` 실행이 필요함을 안내한다.

## 금지

- Task 상세 파일(`TASKS/TASK-<ID>.md`)을 이 Command에서 만들지 않는다(`/gen-task-details`의 책임).
- `docs/06_SRS_UIUX_REVISED.md`·`docs/PROJECT_SCOPE.md`의 Requirement를 삭제하거나 개수를 바꾸지 않는다.
- `validate_inputs.py`가 실패한 상태에서 Task List를 생성하지 않는다 — **이 실패를 무시하고 다음 단계로 넘어가지 않는다.**
- 구현 코드·Branch·Commit을 만들지 않는다.
