---
description: 지정한 Wave·Task에 대해 실제 구현을 시작해도 되는지 8개 항목을 점검하고 READY_TO_IMPLEMENT 또는 BLOCKED_* 상태를 보고한다(코드 수정 없음).
---

# /prepare-task

이 Command는 `traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)의 규칙을 따른다. 이 문서와 Skill 본문이 다르면 Skill을 따른다.

`/run-wave`(또는 사람)가 특정 Task 구현에 들어가기 **직전** 실행하는 사전 점검(pre-flight check) Command다. 8개 항목을 실제로 확인해 다섯 가지 상태 중 하나를 보고한다. **이 Command는 어떤 파일도 수정하지 않는다** — 코드·Task 문서·Git 상태 중 무엇도 고치지 않고, 오직 읽고 판정만 한다.

## 입력

| 입력 | 설명 |
|---|---|
| `WAVE_ID` | 점검 대상 Wave 식별자(예: `W01`). |
| `TASK_ID` | 점검 대상 Task ID(예: `PO-SCR-001`). |
| 선택된 상세 Task 파일 | `TASKS/TASK-<TASK_ID>.md`. 명시적으로 다른 경로가 주어지지 않으면 이 경로를 쓴다. |

세 입력 중 하나라도 주어지지 않으면 즉시 `BLOCKED_INPUT`으로 중단하고 무엇이 빠졌는지 보고한다.

## 실행 순서

아래 8개 항목을 **전부** 실제로 확인한다(하나가 실패했다고 나머지를 건너뛰지 않는다 — 사용자가 한 번에 전체 그림을 보게 한다). 각 항목의 결과를 모은 뒤, 맨 아래 "판정 우선순위"에 따라 최종 상태 하나를 출력한다.

### 1. Working Tree 상태
```
git status --porcelain
```
출력이 비어 있지 않으면 dirty 상태다. 어떤 파일이 걸려 있는지 그대로 보고한다. 이전에 커밋되지 않은 변경(다른 작업, 되돌리다 만 수정 등)이 있는 채로 새 Task를 시작하면 diff 확인(§10 완료 순서)이 무의미해지므로, dirty 상태는 그 자체로 차단 사유다.

### 2. Task가 현재 Wave에 포함되는지
- Wave→Task 매핑은 `TASKS/WAVE_PLAN.md`를 정본으로 한다(형식: Wave ID별로 포함 Task ID를 나열한 표 또는 목록).
- `TASKS/WAVE_PLAN.md`가 없으면 **이 항목은 확인 불가로 기록**하고(추측으로 "포함된다"고 판정하지 않는다), 원인을 "Wave 분할 산출물이 아직 없음(`docs/DECISION_LOG.md` DEC-010 TODO)"이라고 명시한다.
- 파일이 있으면 `WAVE_ID` 아래에 `TASK_ID`가 실제로 나열돼 있는지 확인한다. 없으면 실패로 기록한다.

### 3. Depends On 완료 여부
- `TASKS/TASK-<TASK_ID>.md`의 frontmatter `depends_on` 목록을 읽는다.
- 각 의존 Task의 `TASKS/TASK-<DEP_ID>.md` "Expected Files" 절에 나열된 파일이 **실제로 저장소에 존재하는지** 확인한다(코드 내용을 평가하지 않는다 — 존재 여부만 본다).
- `manual_check`/`release_check` 등 코드 산출물이 없는 의존 Task는 파일 존재로 판정할 수 없으므로 "확인 불가(수동 확인 필요)"로 별도 표시하고 실패로 세지 않는다.
- 코드 산출물이 있는데 Expected Files가 하나라도 없는 의존 Task는 미완료로 기록한다.

### 4. Expected Files
- `TASKS/TASK-<TASK_ID>.md`의 "Expected Files" 절을 읽어 각 경로가 **현재 존재하는지** 확인하고, "신규"/"기존 수정" 표기와 실제 상태가 맞는지 대조한다.
- 표기와 실제가 다르면(예: "신규"라는데 이미 파일이 있다, "기존 수정"이라는데 파일이 없다) 불일치로 기록한다 — Task 문서 자체가 최신 상태를 반영하지 못했을 수 있다는 신호다.
- 이 항목은 기본적으로 정보 제공용이지만, 불일치가 발견되면 §"판정 우선순위"에서 `BLOCKED_INPUT` 사유로 취급한다.

### 5. SRS·Scope·Design·Screen Ref
- `TASKS/TASK-<TASK_ID>.md`의 `requirements_covered` 각 REQ ID가 `docs/06_SRS_UIUX_REVISED.md`에 실제로 존재하는지 확인한다.
- 같은 REQ ID들이 `docs/PROJECT_SCOPE.md`에서 IMPLEMENT로 분류돼 있는지 확인한다(EXCLUDED면 §8로 넘어간다).
- "Design Ref" 절이 가리키는 절 번호가 `design-reference/D-001/DESIGN.md`·`design-reference/UI_CONTRACT.md`에 실제로 존재하는지 확인한다.
- `screen_id`가 있다면 `design-reference/SCREEN_ROUTE_CONTRACT.json`의 Screen 목록에 있는지, Route·Page Entry가 일치하는지 확인한다.
- 어느 하나라도 참조가 깨져 있으면(존재하지 않는 REQ ID, 존재하지 않는 절 번호, Screen 불일치) 실패로 기록한다.

### 6. 필요한 환경변수 이름
- Task의 `depends_on`·`requirements_covered`·본문에 Supabase 연동이 필요한 근거(예: `DB-ACCESS`, `DB-SCHEMA-BASE` 의존, 인증·RLS 관련 REQ)가 있는지 판단한다.
- 해당하면 필요한 환경변수 **이름만** 나열한다: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`(Browser Client), 서버 전용 Task라면 `SUPABASE_SERVICE_ROLE_KEY`. **값은 절대 읽거나 출력하지 않는다** — `.env.local`에 해당 키 이름이 존재하는지만 확인한다(`grep -o '^[A-Z_]*='  .env.local` 형태로 키 이름만 추출).
- Supabase와 무관한 Task는 "필요 환경변수 없음"으로 기록한다.
- Supabase가 필요한데 `.env.local` 자체가 없거나 필요한 키 이름이 빠져 있으면 실패로 기록한다.

### 7. Secret 하드코딩 위험
- 이번 Task의 Expected Files 중 **이미 존재하는 파일**만 대상으로, 흔한 시크릿 패턴을 스캔한다(예: `sk-`, `eyJ`로 시작하는 JWT, `AKIA`로 시작하는 AWS 키, 40자 이상 연속된 base64/hex 문자열이 따옴표 안에 리터럴로 들어간 경우).
- 신규 파일(아직 없는 파일)은 스캔 대상이 아니다 — 스캔이 아니라 **주의 문구**를 리포트에 포함한다: "Service Role Key·API 키는 리터럴로 쓰지 않고 `process.env.*`로만 참조한다"(`CLAUDE.md` 규칙 15).
- 이미 존재하는 파일에서 패턴이 발견되면 실패로 기록하고 파일·라인을 그대로 보고한다(값 자체는 마스킹해서 보고한다 — 전체 시크릿 문자열을 리포트에 그대로 옮기지 않는다).

### 8. EXCLUDED 범위 침범 여부
- `docs/PROJECT_SCOPE.md`에서 EXCLUDED로 분류된 REQ ID 집합을 만든다.
- `TASKS/TASK-<TASK_ID>.md`의 `requirements_covered`에 EXCLUDED ID가 하나라도 있으면 실패로 기록한다.
- Functional AC·Context·Forbidden 절의 서술이 EXCLUDED 기능(예: 콘텐츠 CMS, 감사 로그, 자동 알림, 외부 Email 발송 등 `docs/ARCHITECTURE.md` §12 제외 목록)을 암묵적으로 요구하는지도 읽어서 판단한다. 명백히 걸리면 실패로 기록한다.

## 판정 우선순위

8개 항목의 결과를 모은 뒤, 아래 순서로 **가장 우선순위가 높은 것 하나**를 최종 상태로 출력한다(여러 항목이 동시에 실패해도 상태 값은 하나만 낸다 — 단, 실패 상세는 모두 함께 보고한다).

1. **`BLOCKED_DIRTY_TREE`** — 항목 1(Working Tree)이 dirty.
2. **`BLOCKED_INPUT`** — 입력 자체가 없거나(WAVE_ID/TASK_ID/Task 파일 누락), 항목 2(Wave 포함 여부 확인 불가/실패)·4(Expected Files 불일치)·5(SRS·Scope·Design·Screen Ref 깨짐)·6(환경변수 누락)·7(Secret 하드코딩 위험 발견) 중 하나라도 실패.
3. **`BLOCKED_SCOPE`** — 항목 8(EXCLUDED 범위 침범)이 실패.
4. **`BLOCKED_DEPENDENCY`** — 항목 3(Depends On 미완료)이 실패.
5. **`READY_TO_IMPLEMENT`** — 위 네 가지 모두 해당 없음.

## 출력 형식

```
STATUS: READY_TO_IMPLEMENT | BLOCKED_INPUT | BLOCKED_DEPENDENCY | BLOCKED_DIRTY_TREE | BLOCKED_SCOPE
WAVE_ID: <입력값>
TASK_ID: <입력값>
TASK_FILE: TASKS/TASK-<TASK_ID>.md

[1] Working Tree: PASS | FAIL — <상세>
[2] Wave 포함 여부: PASS | FAIL | 확인 불가 — <상세>
[3] Depends On 완료: PASS | FAIL — <미완료 Task ID 목록>
[4] Expected Files: PASS | FAIL — <불일치 목록>
[5] SRS·Scope·Design·Screen Ref: PASS | FAIL — <깨진 참조 목록>
[6] 필요 환경변수: PASS | FAIL | 해당 없음 — <누락 키 이름>
[7] Secret 하드코딩 위험: PASS | FAIL — <파일:라인(마스킹)>
[8] EXCLUDED 범위 침범: PASS | FAIL — <해당 REQ ID>
```

`READY_TO_IMPLEMENT`가 아니면, 무엇을 어떻게 고쳐야 다음 판정이 통과할지 한두 문장으로 안내한다(예: "git status를 정리한 뒤 다시 실행하세요", "TASKS/WAVE_PLAN.md에 W01/PO-SCR-001을 등록한 뒤 다시 실행하세요").

## 금지

- 이 Command는 코드·Task 문서·Git 상태 중 어느 것도 수정하지 않는다(수정은 후속 구현 단계의 책임이다).
- 항목 7에서 발견한 시크릿 값 전체를 리포트에 그대로 노출하지 않는다(마스킹해서 보고한다).
- 8개 항목 중 일부를 건너뛰고 `READY_TO_IMPLEMENT`를 보고하지 않는다 — 확인하지 못한 항목은 "확인 불가"로 명시하고 `BLOCKED_INPUT`으로 처리한다(추측으로 통과시키지 않는다).
