---
description: Wave 단위로 Task를 순차 실행한다 — prepare-task로 검사하고 implement-task로 구현하며, 검증 PASS마다 상태를 갱신한다. Branch·PR·Merge는 자동화하지 않는다.
---

# /run-wave

이 Command는 `traveler-project-pipeline` Skill(`.claude/skills/traveler-project-pipeline/SKILL.md`)과 루트 `CLAUDE.md`의 규칙을 따른다. 이 문서와 두 문서가 다르면 `CLAUDE.md` → Skill → 이 문서 순으로 우선한다.

이 Command는 **새 검사·구현 로직을 만들지 않는다** — Task 하나하나는 항상 `/prepare-task`와 `/implement-task`를 그대로 호출해 처리하고, 이 Command는 그 둘을 Wave 단위로 순서대로 오케스트레이션할 뿐이다(`docs/DECISION_LOG.md` DEC-010·DEC-011 — Wave 단위 실행, Wave 안에서는 Single Agent가 순차 수행).

## 지원하는 형태

| 명령 | 동작 |
|---|---|
| `/run-wave WXX` | 지정한 Wave(예: `W03`)의 Task를 순차로 검사·구현한다. |
| `/run-wave status` | 모든 Wave의 진행 상태를 읽기만 하고 보고한다(부작용 없음). |
| `/run-wave resume` | 중단된 지점(직전 `current_wave`)부터 이어서 진행한다. |
| `/run-wave dry-run WXX` | 지정한 Wave에서 다음에 무엇을 할지 미리 보여줄 뿐, 구현·상태 갱신은 하지 않는다. |

## 이 Command가 읽고 쓰는 파일

| 이름 | 경로 | 성격 |
|---|---|---|
| **WAVE_PLAN** | `TASKS/WAVE_PLAN.md` | 정적 계획 — 사람이 확정한 "어떤 Wave에 어떤 Task가 어떤 순서로 속하는지" + Preview Checkpoint 여부. 이 Command는 **이 파일을 수정하지 않는다.** |
| **WAVE_STATE** | `TASKS/WAVE_STATE.json` | 동적 상태 — 각 Task의 진행 상태(`PENDING`/`READY`/`IN_PROGRESS`/`DONE`/`FAILED`/`BLOCKED`)와 `current_wave`. 이 Command가 Task 하나를 처리할 때마다 갱신하는 유일한 파일이다. |

`TASKS/WAVE_PLAN.md`가 없으면 어떤 하위 명령도 실행하지 않는다 — "Wave 분할 계획이 아직 없다(`docs/DECISION_LOG.md` DEC-010 TODO). 먼저 `TASKS/WAVE_PLAN.md`를 작성해야 한다"고 보고하고 멈춘다. 추측으로 Wave를 나누지 않는다.

`TASKS/WAVE_STATE.json`이 없고 `WAVE_PLAN`은 있으면, `WAVE_PLAN`의 모든 Task를 `PENDING` 상태로 최초 생성한다(이 파일은 순수 진행 상태 기록이라 이 Command가 직접 만들고 갱신해도 된다 — Task 문서나 코드가 아니다).

### WAVE_PLAN.md 최소 형식

```markdown
# Wave Plan

## W01 — <이 Wave의 목표 한 줄>
- Preview Checkpoint: true
1. SHARED-LAYOUT-HEADER-FOOTER
2. SHARED-UI-KIT-PRIMITIVES
3. ...

## W02 — <...>
- Preview Checkpoint: false
1. ...
```

### WAVE_STATE.json 최소 형식

```json
{
  "current_wave": "W01",
  "updated_at": "2026-09-16T00:00:00+09:00",
  "tasks": {
    "SHARED-LAYOUT-HEADER-FOOTER": { "wave": "W01", "status": "DONE", "updated_at": "..." },
    "SHARED-UI-KIT-PRIMITIVES": { "wave": "W01", "status": "PENDING" }
  }
}
```

---

## `/run-wave WXX`

1. **`TASKS/WAVE_PLAN.md`와 `TASKS/WAVE_STATE.json`을 읽는다.** `WXX`가 `WAVE_PLAN`에 없으면 즉시 중단하고 존재하는 Wave 목록을 보여준다.

2. **현재 Wave의 READY Task를 Depends On 순서로 하나 선택한다.**
   - `WAVE_PLAN`에 적힌 순서대로 훑으면서, `WAVE_STATE`에서 아직 `DONE`이 아닌 첫 Task를 찾는다.
   - 그 Task의 `TASKS/TASK-<ID>.md` `depends_on` 전부가 `WAVE_STATE`에서 `DONE`인지 확인한다(Wave 안 의존성뿐 아니라 다른 Wave의 선행 Task도 포함한다).
   - 의존성이 다 채워지지 않았으면 그 Task는 아직 READY가 아니다 — 다음 Task로 넘어가 같은 방식으로 찾는다. Wave 안에 READY Task가 하나도 없으면(전부 DONE이거나 전부 의존성 미충족) 6번으로 건너뛴다.

3. **선택한 Task를 `/prepare-task WXX <TASK_ID>` 규칙으로 검사한다**(별도 로직을 새로 만들지 않고 그대로 호출한다).
   - `READY_TO_IMPLEMENT`가 아니면(`BLOCKED_DIRTY_TREE`/`BLOCKED_INPUT`/`BLOCKED_SCOPE`/`BLOCKED_DEPENDENCY`) **Wave 실행을 여기서 멈춘다.** 다음 Task로 건너뛰거나 재시도를 반복하지 않는다 — 해당 `TASK_ID`를 `WAVE_STATE`에 `BLOCKED`로 기록하고, 상태·사유를 그대로 보고한 뒤 사람의 조치를 기다린다.

4. **`/implement-task <TASK_ID>` 규칙으로 Task 하나를 구현한다**(마찬가지로 그대로 호출한다). 진행 시작 시 `WAVE_STATE`의 해당 Task를 `IN_PROGRESS`로 표시한다(중단 시 `resume`이 알아볼 수 있도록).

5. **관련 검증이 PASS하면 Task 상태를 `DONE`으로 갱신한다.**
   - "관련 검증"은 `/implement-task`가 실행한 lint·타입체크·Unit Test와(해당하면) Playwright Smoke를 뜻한다.
   - 하나라도 FAIL이면 `DONE`으로 바꾸지 않는다 — `WAVE_STATE`에 `FAILED`로 기록하고, 실패 내용을 보고한 뒤 **Wave 실행을 멈춘다.** 실패를 무시하고 다음 Task로 넘어가지 않는다.

6. **같은 Wave의 다음 READY Task를 계속 처리한다** — 2번으로 돌아간다.

7. **Wave의 모든 Task가 `DONE`이면 종료한다.** `current_wave`는 그대로 두거나(재확인 대비) 다음 Wave 진행 여부는 사람이 정한다 — 이 Command가 다음 Wave로 자동 넘어가지 않는다.

8. **`WAVE_PLAN`에 이 Wave의 Preview Checkpoint가 `true`로 적혀 있으면**, 모든 Task가 `DONE`이 된 시점에 최종 상태를 `WAITING_FOR_PREVIEW`로 보고하고 멈춘다 — "Vercel Preview에서 사람이 직접 확인한 뒤 다음 Wave를 실행하라"(`CLAUDE.md` 규칙 22)를 함께 안내한다. Checkpoint가 `false`(또는 표기가 없으면 기본값 `true`로 취급 — 안전한 쪽으로 기본을 둔다)여도 마지막 Wave가 아니라면 다음 Wave를 자동으로 잇지 않는다. **Wave 하나를 실행한 뒤에는 항상 사람에게 결과를 보고하고 멈춘다.**

## `/run-wave status`

`TASKS/WAVE_PLAN.md`와 `TASKS/WAVE_STATE.json`을 읽기만 한다(아무것도 갱신하지 않는다). 아래 형태로 보고한다.

```
current_wave: W02

[W01] DONE (8/8)
  ...
[W02] IN PROGRESS (3/12)
  DONE:        SHARED-LAYOUT-HEADER-FOOTER, ...
  IN_PROGRESS: CMP-SCR001-HERO
  BLOCKED:     (없음)
  FAILED:      (없음)
  PENDING:     CMP-SCR001-DOMESTIC-DEST-CARDS, ...
[W03] PENDING (0/6)
```

## `/run-wave resume`

1. `TASKS/WAVE_STATE.json`의 `current_wave`를 읽는다. 파일이 없으면 "재개할 상태가 없다"고 보고하고 중단한다.
2. 그 Wave 안에서 `IN_PROGRESS` 또는 `FAILED` 상태인 Task가 있는지 찾는다.
   - `IN_PROGRESS`(구현 도중 중단됨): 이어서 진행하기 전에 `/prepare-task`를 **다시** 실행한다 — 중단 사이에 Working Tree가 바뀌었을 수 있으므로 처음부터 다시 검사한다.
   - `FAILED`(검증 실패로 멈췄던 Task): 원인이 고쳐졌다는 전제로 같은 Task부터 3번(prepare-task 검사) 단계를 다시 실행한다.
3. 그 뒤로는 `/run-wave WXX`의 2~8번 절차를 그대로 잇는다. **이미 `DONE`인 Task는 다시 실행하지 않는다.**

## `/run-wave dry-run WXX`

`/run-wave WXX`의 1~3번(읽기, READY Task 선택, `/prepare-task` 검사)까지만 실행하고 **4번(구현) 이후는 실행하지 않는다.** `WAVE_STATE`도 갱신하지 않는다.

Wave 전체의 예정 순서를 `WAVE_PLAN` 기준으로 나열하고, 각 Task의 현재 `WAVE_STATE` 상태와(다음에 실제로 선택될 Task에 한해) `/prepare-task` 판정 결과를 함께 보여준다. "지금 `/run-wave WXX`를 실행하면 무엇부터 어떻게 진행될지"를 사람이 실행 전에 확인하기 위한 용도다.

---

## 금지

- **Git Branch를 자동으로 만들지 않는다.**
- **PR을 자동으로 생성하지 않는다.**
- **자동 Merge를 실행하지 않는다.**
- Task 구현·커밋 정책은 `/implement-task` 문서를 그대로 따른다 — 이 Command가 별도로 자동 커밋을 켜지 않는다(기본은 커밋도 하지 않음).
- `TASKS/WAVE_PLAN.md`를 이 Command에서 수정하지 않는다(Wave 계획 변경은 사람이 직접 한다).
- 검증 실패(`FAILED`)나 차단(`BLOCKED`) 상태를 건너뛰고 다음 Task로 넘어가지 않는다 — Wave 전체를 억지로 끝까지 밀어붙이지 않는다.
