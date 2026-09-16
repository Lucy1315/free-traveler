#!/usr/bin/env python3
"""
build_waves.py

Traveler 프로젝트의 66개 Task(`TASKS/TASK_MANIFEST.csv`)를 실행 가능한 Wave로
나눈다. `scripts/audit_tasks.py`(Task 문서 정합성)나 `scripts/check_screen_contract.py`
(Screen 계약)와는 다른 층위다 — 이 스크립트는 "어떤 순서·어떤 묶음으로 구현할
것인가"만 정한다. 구현 코드나 Task 문서 내용은 건드리지 않는다.

Task 상세 파일 정본은 `TASKS/TASK-<ID>.md`다. (`TASKS/details/`는 과거 방식으로
현재 어떤 스크립트·Command도 참조하지 않아 이 스크립트도 무시한다 — 이전 감사
작업에서 사용자가 `TASKS/TASK-<ID>.md`를 정본으로 확정했다.)

## 입력
  - TASKS/TASK_MANIFEST.csv
  - TASKS/TASK-*.md (Expected Files 절 — 파일 충돌 분리용)
  - design-reference/SCREEN_ROUTE_CONTRACT.json (5개 고정 Screen 목록 대조용)

## 출력
  - TASKS/TASK_DAG.md        사람이 읽는 의존 그래프·Wave 배치 문서
  - TASKS/WAVE_PLAN.md       `/run-wave`가 읽는 정적 Wave 계획(WAVE_PLAN 정본)
  - TASKS/WAVE_STATE.json    `/run-wave`가 읽고 쓰는 동적 진행 상태(최초 생성)
  - TASKS/TASK_MANIFEST.csv  마지막 열에 wave_id 추가(다른 열은 그대로 유지)

## Wave 그룹 순서(고정, 그룹 번호는 출력 전용 — Wave ID는 W01부터 순서대로 새로 매긴다)
   1. Scaffold, 문서, Harness 확인
   2. Airbnb 스타일 공통 UI, 정적 데이터, Layout (category: SHARED, DATA)
   3. Supabase Auth, 6개 Table, 기본 RLS, API Route
      (category: DB, API — API는 화면별로 보이지만 실제로는 DB-ACCESS에만
      의존하고 여러 Screen 그룹에서 공통으로 쓰이므로, screen_id로 뒤 그룹에
      두면 규칙 2(선행 Task가 뒤 Wave 배치 금지)를 어긴다. 실제
      TASKS/TASK_MANIFEST.csv를 대조해 확인한 사실이다 —
      CMP-SCR001-RECENT-MATE-CARDS(그룹 4)가 API-MATES-ROUTES에 의존한다.)
   4~8. SCR-001~005 Component와 Page Owner (category: COMPONENT, PAGE_OWNER,
        screen_id 기준)
   9. Unit·Playwright·접근성·CI (category: UNIT_TEST, E2E_TEST,
      INTEGRATION_TEST, MANUAL_CHECK, CI_DEVOPS)
  10. Vercel Preview와 Release 확인 (category: RELEASE_CHECK)

## 규칙
   1. depends_on으로 순환 의존성을 검사한다(DFS white/gray/black).
   2. 어떤 Task든 depends_on의 선행 Task가 더 뒤 Wave(또는 같은 Wave의 더
      뒤 순번)에 배치되면 실패로 기록하고 exit(1)한다 — 추측으로 넘어가지
      않는다.
   3. 기본적으로 Wave당 4~7개 Task. 그룹 안 Task가 7개를 넘으면 여러
      Wave로 나눈다(마지막 그룹처럼 4개 미만으로 남으면 그대로 둔다 —
      "기본적으로"이지 강제 하한은 아니다).
   4. Page Owner는 해당 Screen 그룹의 마지막 Wave에서 가장 마지막 순번으로
      배치한다.
   5. 같은 파일을 "기존 수정"으로 두 번 이상 건드리는 Task는 서로 다른
      Wave로 분리한다(TASK-<ID>.md의 "## Expected Files" 절에서 파싱).
   6. 한 Wave 안의 실행 순서는 의존성을 만족하는 한 Task ID 알파벳 순으로
      한 개씩 정한다.
   7. 실패 시 자동으로 다시 시도하는 등의 복잡한 로직은 만들지 않는다 —
      실패하면 원인을 보고하고 그대로 멈춘다.
   8. Git Branch·PR·Merge를 만들지 않는다(이 스크립트는 파일만 쓴다).
"""

from __future__ import annotations

import csv
import json
import re
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TASKS_DIR = ROOT / "TASKS"
MANIFEST_CSV = TASKS_DIR / "TASK_MANIFEST.csv"
SCREEN_CONTRACT = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"

TASK_DAG_MD = TASKS_DIR / "TASK_DAG.md"
WAVE_PLAN_MD = TASKS_DIR / "WAVE_PLAN.md"
WAVE_STATE_JSON = TASKS_DIR / "WAVE_STATE.json"

WAVE_MIN = 4
WAVE_MAX = 7

FIXED_SCREENS = ["SCR-001", "SCR-002", "SCR-003", "SCR-004", "SCR-005"]
SCREEN_GROUP_RANK = {"SCR-001": 4, "SCR-002": 5, "SCR-003": 6, "SCR-004": 7, "SCR-005": 8}
SCREEN_GROUP_TITLE = {
    4: "SCR-001 메인 Component와 Page Owner",
    5: "SCR-002 대표 소개 Component와 Page Owner",
    6: "SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner",
    7: "SCR-004 동행 목록·상세·신청 Component와 Page Owner",
    8: "SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner",
}
GROUP_TITLES = {
    1: "Scaffold, 문서, Harness 확인",
    2: "Airbnb 스타일 공통 UI, 정적 데이터, Layout",
    3: "Supabase Auth, 6개 Table, 기본 RLS, API Route",
    **SCREEN_GROUP_TITLE,
    9: "Unit·Playwright·접근성·CI",
    10: "Vercel Preview와 Release 확인",
}

errors: list[str] = []


def die(msg: str) -> None:
    print(f"[FATAL] {msg}")
    sys.exit(1)


# ---------------------------------------------------------------------------
# 입력 로드
# ---------------------------------------------------------------------------

def load_manifest() -> list[dict]:
    if not MANIFEST_CSV.exists():
        die(f"{MANIFEST_CSV.relative_to(ROOT)}가 없다. `python3 scripts/audit_tasks.py`를 먼저 실행한다.")
    with MANIFEST_CSV.open(encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    if not rows:
        die(f"{MANIFEST_CSV.relative_to(ROOT)}가 비어 있다.")
    return rows


def load_screen_contract() -> dict:
    if not SCREEN_CONTRACT.exists():
        die(f"{SCREEN_CONTRACT.relative_to(ROOT)}가 없다.")
    data = json.loads(SCREEN_CONTRACT.read_text(encoding="utf-8"))
    contract_screens = {s["screen_id"] for s in data.get("screens", [])}
    missing = set(FIXED_SCREENS) - contract_screens
    if missing:
        die(f"SCREEN_ROUTE_CONTRACT.json에 고정 Screen이 빠져 있다: {sorted(missing)}")
    return data


EXPECTED_FILES_HEADER_RE = re.compile(r"^##\s*Expected Files\s*$")
NEXT_HEADER_RE = re.compile(r"^##\s")
BACKTICK_PATH_RE = re.compile(r"`([^`]+)`")


def parse_expected_files(task_id: str, page_entry_fm: str) -> list[tuple[str, bool]]:
    """TASK-<ID>.md의 Expected Files 절에서 (경로, 기존수정여부) 목록을 뽑는다.

    형식이 파일마다 조금씩 달라("- 신규: `a.tsx`" / "- `b.tsx`(기존 수정)" /
    "- 신규: 위 2개") 줄 단위로 관대하게 파싱한다. "위 N개"처럼 경로가 직접
    안 적힌 줄은 frontmatter의 page_entry(콤마로 구분된 backtick 경로 목록)로
    보완한다.
    """
    path = TASKS_DIR / f"TASK-{task_id}.md"
    if not path.exists():
        return []
    lines = path.read_text(encoding="utf-8").splitlines()
    in_section = False
    block: list[str] = []
    for line in lines:
        if EXPECTED_FILES_HEADER_RE.match(line.strip()):
            in_section = True
            continue
        if in_section and NEXT_HEADER_RE.match(line.strip()):
            break
        if in_section:
            block.append(line)

    fallback_paths = [p for p in BACKTICK_PATH_RE.findall(page_entry_fm or "") if _looks_like_path(p)]

    out: list[tuple[str, bool]] = []
    for line in block:
        stripped = line.strip()
        if not stripped.startswith("-"):
            continue
        modified = "기존 수정" in stripped
        paths = [p for p in BACKTICK_PATH_RE.findall(stripped) if _looks_like_path(p)]
        if not paths and ("위" in stripped and ("개" in stripped)):
            paths = fallback_paths
        for p in paths:
            out.append((p, modified))
    return out


def _looks_like_path(candidate: str) -> bool:
    """backtick 안의 문자열이 실제 파일 경로인지 판별한다.

    Expected Files 절 서술에는 "`create-next-app`" 같이 파일 경로가 아닌
    고유명사도 backtick으로 감싸는 경우가 있다("기존 수정: `src/app/page.tsx`
    (현재 `create-next-app` 스타터...)"). 경로 구분자("/")가 있거나 알려진
    확장자로 끝나는 것만 경로로 인정한다.
    """
    if "/" in candidate:
        return True
    known_extensions = (".tsx", ".ts", ".sql", ".md", ".json", ".css")
    return candidate.endswith(known_extensions)


# ---------------------------------------------------------------------------
# 그룹 분류
# ---------------------------------------------------------------------------

def group_of(row: dict) -> int:
    category = row.get("category", "")
    screen_id = row.get("screen_id", "")
    if category in ("SHARED", "DATA"):
        return 2
    if category in ("DB", "API"):
        return 3
    if category in ("COMPONENT", "PAGE_OWNER"):
        rank = SCREEN_GROUP_RANK.get(screen_id)
        if rank is None:
            errors.append(
                f"분류 실패: {row['task_id']}는 category={category}인데 screen_id='{screen_id}'가 "
                f"고정 Screen 5개 중 하나가 아니다."
            )
            return -1
        return rank
    if category in ("UNIT_TEST", "E2E_TEST", "INTEGRATION_TEST", "MANUAL_CHECK", "CI_DEVOPS"):
        return 9
    if category == "RELEASE_CHECK":
        return 10
    errors.append(
        f"분류 실패: {row['task_id']}의 category='{category}'를 10개 그룹 중 어디에도 매칭할 수 없다. "
        f"build_waves.py의 group_of()에 새 category 분류 규칙을 추가해야 한다."
    )
    return -1


# ---------------------------------------------------------------------------
# 의존성 그래프 / 순환 검사
# ---------------------------------------------------------------------------

def detect_cycles(task_ids: set[str], deps: dict[str, list[str]]) -> list[list[str]]:
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {tid: WHITE for tid in task_ids}
    cycles: list[list[str]] = []
    stack: list[str] = []

    def dfs(tid: str) -> None:
        color[tid] = GRAY
        stack.append(tid)
        for dep in deps.get(tid, []):
            if dep not in color:
                continue  # 존재하지 않는 의존은 다른 검사(audit_tasks.py)의 몫
            if color[dep] == GRAY:
                cycle_start = stack.index(dep)
                cycles.append(stack[cycle_start:] + [dep])
            elif color[dep] == WHITE:
                dfs(dep)
        stack.pop()
        color[tid] = BLACK

    for tid in sorted(task_ids):
        if color[tid] == WHITE:
            dfs(tid)
    return cycles


# ---------------------------------------------------------------------------
# 그룹 내부 위상 정렬(Page Owner는 항상 마지막)
# ---------------------------------------------------------------------------

def topo_order_group(
    group_task_ids: list[str],
    deps: dict[str, list[str]],
    row_by_id: dict[str, dict],
) -> list[str]:
    group_set = set(group_task_ids)
    in_degree = {tid: 0 for tid in group_task_ids}
    for tid in group_task_ids:
        for dep in deps.get(tid, []):
            if dep in group_set:
                in_degree[tid] += 1

    def sort_key(tid: str) -> tuple[int, str]:
        # Page Owner는 그룹 안에서 항상 가장 마지막에 뽑히도록 우선순위를 낮춘다(규칙 4).
        is_page_owner = row_by_id[tid]["category"] == "PAGE_OWNER"
        return (1 if is_page_owner else 0, tid)

    ready = sorted([tid for tid in group_task_ids if in_degree[tid] == 0], key=sort_key)
    ordered: list[str] = []
    remaining = set(group_task_ids)

    while ready:
        # Page Owner가 유일한 후보가 아니면 뒤로 미룬다.
        non_owner_ready = [t for t in ready if row_by_id[t]["category"] != "PAGE_OWNER"]
        pick_pool = non_owner_ready if non_owner_ready else ready
        pick = sorted(pick_pool, key=sort_key)[0]
        ready.remove(pick)
        ordered.append(pick)
        remaining.discard(pick)
        for tid in group_task_ids:
            if tid in remaining and pick in deps.get(tid, []):
                in_degree[tid] -= 1
                if in_degree[tid] == 0 and tid not in ready:
                    ready.append(tid)
        ready.sort(key=sort_key)

    if remaining:
        # 그룹 내부 순환(전역 순환 검사에서 이미 잡히지만 방어적으로 기록).
        errors.append(f"그룹 내부 위상 정렬 실패(순환 의존 가능성): {sorted(remaining)}")
        ordered.extend(sorted(remaining))
    return ordered


# ---------------------------------------------------------------------------
# 그룹 -> Wave 청크 분할(파일 충돌 분리 + 4~7개 기본 크기 + Page Owner 마지막 고정)
# ---------------------------------------------------------------------------

def split_into_waves(
    ordered_task_ids: list[str],
    modified_files_by_task: dict[str, set[str]],
) -> list[list[str]]:
    """`ordered_task_ids`(의존성 위상 정렬 결과, Page Owner는 항상 맨 끝)를
    Wave로 나눈다. 목표 청크 크기를 균등 분배로 미리 계산해 "7+1"처럼 어색한
    나머지가 생기지 않게 한다(예: 8개 → 4+4, 11개 → 6+5). Page Owner는
    `topo_order_group()`이 이미 목록의 맨 끝에 둬서, 그대로 순서대로 채우면
    항상 마지막 청크의 마지막 자리에 들어간다(규칙 4 — 별도 처리 불필요).
    같은 파일을 "기존 수정"하는 Task가 겹치면 목표 크기보다 먼저 잘라
    다른 Wave로 분리한다(규칙 5, 균등 분배보다 우선).
    """
    total = len(ordered_task_ids)
    if total == 0:
        return []

    num_chunks = max(1, -(-total // WAVE_MAX))  # ceil(total / WAVE_MAX)
    target_size = -(-total // num_chunks)  # ceil(total / num_chunks) — 균등 목표 크기

    chunks: list[list[str]] = []
    current: list[str] = []
    current_files: set[str] = set()

    for tid in ordered_task_ids:
        tfiles = modified_files_by_task.get(tid, set())
        conflict = bool(current_files & tfiles)
        if current and (conflict or len(current) >= target_size):
            chunks.append(current)
            current, current_files = [], set()
        current.append(tid)
        current_files |= tfiles

    if current:
        chunks.append(current)

    # 그룹 전체 크기가 WAVE_MIN 미만이면(예: 마지막 그룹) 청크도 그만큼 작다 —
    # "기본적으로"의 예외로 그대로 둔다(규칙 3).
    return chunks


# ---------------------------------------------------------------------------
# 메인
# ---------------------------------------------------------------------------

def main() -> int:
    load_screen_contract()
    rows = load_manifest()
    row_by_id = {r["task_id"]: r for r in rows}
    task_ids = set(row_by_id)
    deps = {tid: [d for d in (row_by_id[tid]["depends_on"] or "").split(";") if d] for tid in task_ids}

    dangling = [(tid, d) for tid in task_ids for d in deps[tid] if d not in task_ids]
    if dangling:
        die(
            "depends_on이 존재하지 않는 Task를 가리킨다(먼저 `python3 scripts/audit_tasks.py`로 잡아야 한다): "
            + ", ".join(f"{a}->{b}" for a, b in dangling)
        )

    cycles = detect_cycles(task_ids, deps)
    if cycles:
        for c in cycles:
            print(f"[FAIL] 순환 의존성: {' -> '.join(c)}")
        die(f"순환 의존성 {len(cycles)}건 발견 — Wave를 만들 수 없다.")

    # 1) 그룹 분류
    group_map: dict[str, int] = {}
    for tid, row in row_by_id.items():
        group_map[tid] = group_of(row)
    if errors:
        for e in errors:
            print(f"[FAIL] {e}")
        die(f"그룹 분류 실패 {len(errors)}건 — group_of()를 보완한 뒤 다시 실행한다.")

    groups: dict[int, list[str]] = defaultdict(list)
    for tid, g in group_map.items():
        groups[g].append(tid)

    # 2) Expected Files 파싱 -> 파일별 "기존 수정" Task 목록(규칙 5)
    modified_files_by_task: dict[str, set[str]] = {}
    file_modifiers: dict[str, set[str]] = defaultdict(set)
    for tid, row in row_by_id.items():
        entries = parse_expected_files(tid, row.get("page_entry", ""))
        mod_paths = {p for p, modified in entries if modified}
        modified_files_by_task[tid] = mod_paths
        for p in mod_paths:
            file_modifiers[p].add(tid)
    conflict_files = {p: sorted(ts) for p, ts in file_modifiers.items() if len(ts) > 1}

    # 3) 그룹별 위상 정렬 + Wave 분할, 그룹 번호 순서대로 Wave ID를 새로 매긴다.
    wave_records: list[dict] = []
    wave_counter = 0
    for group_no in sorted(GROUP_TITLES):
        group_task_ids = groups.get(group_no, [])
        if not group_task_ids:
            continue
        ordered = topo_order_group(group_task_ids, deps, row_by_id)
        chunks = split_into_waves(ordered, modified_files_by_task)
        for chunk in chunks:
            wave_counter += 1
            wave_id = f"W{wave_counter:02d}"
            has_page_owner = any(row_by_id[t]["category"] == "PAGE_OWNER" for t in chunk)
            wave_records.append(
                {
                    "wave_id": wave_id,
                    "group_no": group_no,
                    "title": GROUP_TITLES[group_no],
                    "task_ids": chunk,
                    "checkpoint_required": has_page_owner,
                }
            )

    if errors:
        for e in errors:
            print(f"[FAIL] {e}")
        die(f"Wave 구성 실패 {len(errors)}건")

    # 4) 규칙 2 검증: 어떤 Task의 depends_on도 더 뒤 Wave(또는 같은 Wave의 더 뒤 순번)에 있으면 안 된다.
    wave_index_of: dict[str, int] = {}
    pos_in_wave_of: dict[str, int] = {}
    for wi, wr in enumerate(wave_records):
        for pos, tid in enumerate(wr["task_ids"]):
            wave_index_of[tid] = wi
            pos_in_wave_of[tid] = pos

    ordering_violations: list[str] = []
    for tid in task_ids:
        for dep in deps[tid]:
            if wave_index_of[dep] > wave_index_of[tid]:
                ordering_violations.append(
                    f"{tid}(Wave {wave_records[wave_index_of[tid]]['wave_id']})가 "
                    f"{dep}(Wave {wave_records[wave_index_of[dep]]['wave_id']})보다 먼저 배치됨"
                )
            elif wave_index_of[dep] == wave_index_of[tid] and pos_in_wave_of[dep] > pos_in_wave_of[tid]:
                ordering_violations.append(
                    f"{tid}와 {dep}가 같은 Wave({wave_records[wave_index_of[tid]]['wave_id']})인데 "
                    f"{dep}의 실행 순번이 {tid}보다 뒤다"
                )

    if ordering_violations:
        for v in ordering_violations:
            print(f"[FAIL] 규칙 2 위반: {v}")
        die(f"선행 Task가 뒤 Wave/순번에 배치된 사례 {len(ordering_violations)}건 — Wave 생성을 중단한다.")

    # 5) 산출물 작성
    generated_at = datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")
    write_task_dag(wave_records, deps, conflict_files, len(cycles), row_by_id)
    write_wave_plan(wave_records, generated_at)
    write_wave_state(wave_records, generated_at)
    write_manifest_with_wave_id(rows, wave_index_of, wave_records)

    # 6) 종료 보고
    print("=" * 72)
    print("build_waves.py 결과")
    print("=" * 72)
    print(f"순환 의존성: {len(cycles)}건")
    if conflict_files:
        print(f"파일 충돌로 분리된 파일: {len(conflict_files)}건")
        for p, ts in conflict_files.items():
            print(f"  - {p}: {', '.join(ts)}")
    print(f"총 Wave 수: {len(wave_records)}")
    for wr in wave_records:
        checkpoint = " [Preview Checkpoint]" if wr["checkpoint_required"] else ""
        print(f"  {wr['wave_id']} ({len(wr['task_ids'])}개){checkpoint}: {wr['title']}")
    print("Page Owner 위치:")
    for wr in wave_records:
        owners = [t for t in wr["task_ids"] if row_by_id[t]["category"] == "PAGE_OWNER"]
        for o in owners:
            last = wr["task_ids"][-1] == o
            print(f"  {o} -> {wr['wave_id']} (마지막 순번: {last})")
    print("=" * 72)
    print(f"BUILD_WAVES_DONE (waves: {len(wave_records)}, tasks: {len(task_ids)})")
    return 0


# ---------------------------------------------------------------------------
# 산출물 작성
# ---------------------------------------------------------------------------

def write_task_dag(
    wave_records: list[dict],
    deps: dict[str, list[str]],
    conflict_files: dict[str, list[str]],
    cycle_count: int,
    row_by_id: dict[str, dict],
) -> None:
    wave_of = {}
    for wr in wave_records:
        for tid in wr["task_ids"]:
            wave_of[tid] = wr["wave_id"]

    lines = [
        "# Task Dependency DAG",
        "",
        "이 문서는 `scripts/build_waves.py`가 `TASKS/TASK_MANIFEST.csv`의 depends_on을 읽어",
        "생성한 의존 그래프·Wave 배치 스냅샷이다. 사람이 읽는 참고용이며, 실행 정본은",
        "`TASKS/WAVE_PLAN.md`(정적)와 `TASKS/WAVE_STATE.json`(동적)이다.",
        "",
        f"- 순환 의존성: {cycle_count}건",
        f"- 파일 충돌로 분리된 파일: {len(conflict_files)}건",
        "",
        "## 의존 관계 (Task → Depends On → Wave)",
        "",
        "| Task ID | Depends On | Wave |",
        "|---|---|---|",
    ]
    for tid in sorted(deps):
        dep_str = ", ".join(deps[tid]) if deps[tid] else "(없음)"
        lines.append(f"| {tid} | {dep_str} | {wave_of.get(tid, '-')} |")

    if conflict_files:
        lines += ["", "## 파일 충돌로 분리된 파일(규칙 5)", "", "| 파일 | 관련 Task | Wave |", "|---|---|---|"]
        for p, ts in conflict_files.items():
            wave_list = ", ".join(f"{t}({wave_of.get(t, '-')})" for t in ts)
            lines.append(f"| `{p}` | {', '.join(ts)} | {wave_list} |")

    TASK_DAG_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"{TASK_DAG_MD.relative_to(ROOT)} 생성 완료")


def write_wave_plan(wave_records: list[dict], generated_at: str) -> None:
    lines = [
        "# Wave Plan",
        "",
        "`scripts/build_waves.py`가 생성한 정적 Wave 계획이다. Wave→Task 매핑의 정본이며,",
        "`/prepare-task`·`/run-wave`가 이 파일을 읽는다. Wave 계획 변경은 사람이 직접 하거나",
        "`scripts/build_waves.py`를 다시 실행해 전체를 재생성한다(부분 수동 편집은 피한다).",
        "",
        f"생성 시각: {generated_at}",
        "",
    ]
    for wr in wave_records:
        lines.append(f"## {wr['wave_id']} — {wr['title']}")
        lines.append(f"- Preview Checkpoint: {'true' if wr['checkpoint_required'] else 'false'}")
        for i, tid in enumerate(wr["task_ids"], start=1):
            lines.append(f"{i}. {tid}")
        lines.append("")

    WAVE_PLAN_MD.write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")
    print(f"{WAVE_PLAN_MD.relative_to(ROOT)} 생성 완료")


def write_wave_state(wave_records: list[dict], generated_at: str) -> None:
    tasks_map = {}
    for wr in wave_records:
        for tid in wr["task_ids"]:
            tasks_map[tid] = {"wave": wr["wave_id"], "status": "PENDING", "updated_at": generated_at}

    state = {
        "schema_version": "traveler-wave-state-v1",
        "generated_at": generated_at,
        "current_wave": wave_records[0]["wave_id"] if wave_records else None,
        "waves": [
            {
                "wave_id": wr["wave_id"],
                "title": wr["title"],
                "task_ids": wr["task_ids"],
                "status": "pending",
                "checkpoint_required": wr["checkpoint_required"],
                "checkpoint_result": None,
            }
            for wr in wave_records
        ],
        # "tasks"는 이 최소 필드 목록에는 없지만, `/run-wave`(`.claude/commands/run-wave.md`)가
        # 이미 이 키로 Task 개별 상태(PENDING/READY/IN_PROGRESS/DONE/FAILED/BLOCKED)를 읽고 쓴다.
        # 빠뜨리면 /run-wave가 매번 새로 만들어야 해서 여기서 함께 초기화한다.
        "tasks": tasks_map,
    }
    WAVE_STATE_JSON.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{WAVE_STATE_JSON.relative_to(ROOT)} 생성 완료")


def write_manifest_with_wave_id(
    rows: list[dict], wave_index_of: dict[str, int], wave_records: list[dict]
) -> None:
    wave_id_of = {}
    for wr in wave_records:
        for tid in wr["task_ids"]:
            wave_id_of[tid] = wr["wave_id"]

    fieldnames = list(rows[0].keys())
    if "wave_id" not in fieldnames:
        fieldnames.append("wave_id")

    with MANIFEST_CSV.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for r in rows:
            r["wave_id"] = wave_id_of.get(r["task_id"], "")
            writer.writerow(r)
    print(f"{MANIFEST_CSV.relative_to(ROOT)}에 wave_id 열 추가 완료({len(rows)}행)")


if __name__ == "__main__":
    sys.exit(main())
