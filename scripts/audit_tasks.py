#!/usr/bin/env python3
"""
audit_tasks.py

Traveler Task 생성 Pipeline의 최종 감사 스크립트다. `TASKS/00_TASK_LIST.md`와
`TASKS/TASK-*.md`(상세 Task 파일)의 정합성을 18개 규칙으로 검사하고,
`TASKS/TASK_MANIFEST.csv`(기계 판독용 목록)와 `TASKS/TASK_AUDIT_REPORT.md`(감사 리포트)를 만든다.

입력:
  - TASKS/00_TASK_LIST.md
  - TASKS/TASK-*.md
  - docs/PROJECT_SCOPE.md
  - design-reference/SCREEN_ROUTE_CONTRACT.json

검사(18개):
   1. Task List 구현 ID와 상세 Task 파일 1:1
   2. 중복 Task ID 0
   3. Depends On 누락 0(존재하지 않는 Task를 참조하지 않음)
   4. Dependency Cycle 0
   5. Screen 5개 모두 Page Owner 정확히 1개
   6. Route·Page Entry·Expected Files 일치(Task List ↔ 상세 파일)
   7. Component-only Screen 0(Component만 있고 Page Owner가 없는 Screen 없음)
   8. SCR-001 Starter 제거 AC 존재
   9. SCR-003 세 탭 조립 AC 존재
  10. SCR-005 역할별 상태 조립 AC 존재
  11. DB Schema·RLS·Access·Seed Task 존재
  12. DB Table 범위가 6개 기본 테이블을 크게 넘지 않음
  13. 외부 입력 비저장 AC 존재(항공·숙소 폼)
  14. Auth·성인·기본 RLS AC 존재
  15. Playwright Chromium Smoke Task 존재
  16. AWS·EC2·자동 Merge 구현 Task 0
  17. REQ-FUNC 80개와 REQ-NF 34개가 Task 또는 EXCLUDED(docs/PROJECT_SCOPE.md) 표에 존재
  18. EXCLUDED 상세 구현 파일이 생성되지 않음

오류가 있으면 exit(1). 모두 통과하면 "AUDIT_PASS"와 검사 수를 출력하고 exit(0).
"""

from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TASK_LIST_PATH = ROOT / "TASKS" / "00_TASK_LIST.md"
TASKS_DIR = ROOT / "TASKS"
DETAILS_GLOB = "TASK-*.md"
DETAILS_FILENAME_PREFIX = "TASK-"
PROJECT_SCOPE_PATH = ROOT / "docs" / "PROJECT_SCOPE.md"
SCREEN_ROUTE_CONTRACT = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"

MANIFEST_CSV = TASKS_DIR / "TASK_MANIFEST.csv"
REPORT_MD = TASKS_DIR / "TASK_AUDIT_REPORT.md"

DB_TABLES = [
    "user_profile",
    "mate_post",
    "mate_application",
    "user_block",
    "report",
    "external_url_setting",
]
DB_TABLE_SOFT_LIMIT = 6  # "크게 넘지 않음" 기준 — 이 값을 넘으면 FAIL

FORBIDDEN_KEYWORDS = ["EC2", "AWS", "자동 병합", "자동 머지", "Auto Merge", "auto-merge"]
FORBIDDEN_BROWSERS = ["firefox", "webkit", "safari"]

FIXED_DB_TASK_IDS = ["DB-SCHEMA-BASE", "DB-RLS-BASE", "DB-ACCESS", "DB-SEED-BASE"]
FIXED_SMOKE_TASK_ID = "E2E-PUBLIC-SMOKE"

results: list[tuple[str, str, bool, str]] = []  # (no, name, ok, detail)


def check(no: str, name: str, ok: bool, detail: str = "") -> None:
    results.append((no, name, ok, detail))


# ---------------------------------------------------------------------------
# frontmatter 파서(외부 의존성 없이 `key: value` / `key:\n  - item` 형태만 지원)
# ---------------------------------------------------------------------------

def parse_frontmatter(text: str) -> dict:
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    block = text[3:end].strip("\n")
    data: dict[str, object] = {}
    current_key: str | None = None
    for raw_line in block.splitlines():
        if not raw_line.strip():
            continue
        if raw_line.startswith(("  - ", "- ")) and current_key:
            item = raw_line.strip()[2:].strip()
            data.setdefault(current_key, [])
            data[current_key].append(item)  # type: ignore[union-attr]
            continue
        m = re.match(r"^([A-Za-z0-9_]+):\s*(.*)$", raw_line.strip())
        if not m:
            continue
        key, value = m.group(1), m.group(2).strip()
        current_key = key
        if value == "":
            data[key] = []
        elif value.lower() in ("true", "false"):
            data[key] = value.lower() == "true"
        else:
            data[key] = value.strip('"').strip("'")
    return data


def load_task_details() -> dict[str, dict]:
    tasks: dict[str, dict] = {}
    if not TASKS_DIR.exists():
        return tasks
    for p in sorted(TASKS_DIR.glob(DETAILS_GLOB)):
        text = p.read_text(encoding="utf-8")
        fm = parse_frontmatter(text)
        task_id = fm.get("task_id") or p.stem.removeprefix(DETAILS_FILENAME_PREFIX)
        body_after_fm = text.split("---", 2)[-1] if text.startswith("---") else text
        tasks[str(task_id)] = {"path": p, "frontmatter": fm, "body": text, "body_no_fm": body_after_fm}
    return tasks


def extract_section(body: str, heading: str) -> str:
    """`## <heading>` 절의 본문(다음 '## ' 전까지)을 뽑는다."""
    m = re.search(rf"^## {re.escape(heading)}\s*$", body, flags=re.MULTILINE)
    if not m:
        return ""
    start = m.end()
    m2 = re.search(r"^## ", body[start:], flags=re.MULTILINE)
    end = start + m2.start() if m2 else len(body)
    return body[start:end].strip()


# ---------------------------------------------------------------------------
# TASKS/00_TASK_LIST.md §2 표 파서
# ---------------------------------------------------------------------------

def split_row(line: str) -> list[str]:
    inner = line.strip()[1:-1]
    return [c.strip() for c in inner.split("|")]


def normalize_row(cells: list[str]) -> list[str]:
    if len(cells) == 16:
        return cells
    if len(cells) > 16:
        head = cells[:11]
        tail = cells[-3:]
        middle = cells[11:len(cells) - 3]
        if len(middle) == 2:
            functional_ac, visual_ac = middle
        else:
            functional_ac = middle[0]
            visual_ac = " | ".join(middle[1:])
        return head + [functional_ac, visual_ac] + tail
    raise ValueError(f"예상보다 열이 적은 행: {cells}")


def parse_task_list_rows() -> list[dict]:
    if not TASK_LIST_PATH.exists():
        return []
    text = TASK_LIST_PATH.read_text(encoding="utf-8")
    lines = text.splitlines()
    start = None
    for i, line in enumerate(lines):
        if line.strip().startswith("| Seq") and "Task ID" in line:
            start = i
            break
    if start is None:
        return []
    rows = []
    for line in lines[start + 2:]:
        stripped = line.strip()
        if not stripped.startswith("|"):
            break
        cells = split_row(stripped)
        if len(cells) < 16 or not cells[0].isdigit():
            continue
        cells = normalize_row(cells)
        (seq, task_id, title, category, impl_status, req_ref, screen, route,
         page_entry, depends_on_raw, expected_files, functional_ac, visual_ac,
         security_ac, verify, priority) = cells
        rows.append({
            "seq": int(seq), "task_id": task_id, "title": title, "category": category,
            "impl_status": impl_status, "req_ref_raw": req_ref, "screen": screen,
            "route": route, "page_entry": page_entry, "depends_on_raw": depends_on_raw,
            "expected_files": expected_files, "functional_ac": functional_ac,
            "visual_ac": visual_ac, "security_ac": security_ac, "verify": verify,
            "priority": priority,
        })
    return rows


def parse_depends_on_cell(raw: str) -> list[str]:
    raw = raw.strip()
    if raw in ("-", ""):
        return []
    out = []
    for item in raw.split(","):
        item = item.strip()
        if not item:
            continue
        out.append(re.sub(r"^CMP:", "", item))
    return out


def backtick_paths(text: str) -> set[str]:
    return set(re.findall(r"`([^`]+)`", text))


# ---------------------------------------------------------------------------
# docs/PROJECT_SCOPE.md 파서 — REQ ID -> 분류(IMPLEMENT/EXCLUDED)
# ---------------------------------------------------------------------------

def parse_project_scope() -> dict[str, str]:
    if not PROJECT_SCOPE_PATH.exists():
        return {}
    text = PROJECT_SCOPE_PATH.read_text(encoding="utf-8")
    out: dict[str, str] = {}
    row_re = re.compile(r"^\|\s*(REQ-(?:FUNC|NF)-\d{3})\s*\|\s*(IMPLEMENT[^|]*|EXCLUDED)\s*\|")
    for line in text.splitlines():
        m = row_re.match(line.strip())
        if not m:
            continue
        req_id, status = m.group(1), m.group(2).strip()
        out[req_id] = "EXCLUDED" if status.upper().startswith("EXCLUDED") else "IMPLEMENT"
    return out


def load_screens() -> list[dict]:
    if not SCREEN_ROUTE_CONTRACT.exists():
        return []
    data = json.loads(SCREEN_ROUTE_CONTRACT.read_text(encoding="utf-8"))
    return data.get("screens", [])


# ---------------------------------------------------------------------------
# 검사
# ---------------------------------------------------------------------------

def audit() -> int:
    if not TASK_LIST_PATH.exists():
        check("1", "TASKS/00_TASK_LIST.md 존재", False, "먼저 Task List를 생성하세요.")
        return finish([], {})

    rows = parse_task_list_rows()
    tasks = load_task_details()
    screens = load_screens()
    scope = parse_project_scope()

    row_by_id = {r["task_id"]: r for r in rows}
    list_ids = [r["task_id"] for r in rows]
    list_id_set = set(list_ids)
    file_id_set = set(tasks.keys())

    # 1. Task List 구현 ID와 상세 Task 파일 1:1
    missing_details = sorted(list_id_set - file_id_set)
    orphan_details = sorted(file_id_set - list_id_set)
    check(
        "1", "Task List 구현 ID와 상세 Task 파일 1:1",
        len(missing_details) == 0 and len(orphan_details) == 0,
        f"누락(상세 파일 없음)={missing_details}, 고아(Task List에 없음)={orphan_details}",
    )

    # 2. 중복 Task ID 0
    dup_ids = sorted({i for i in list_ids if list_ids.count(i) > 1})
    check("2", "중복 Task ID 0", len(dup_ids) == 0, f"중복: {dup_ids}")

    # 3. Depends On 누락 0
    dangling: list[str] = []
    for tid, t in tasks.items():
        deps = t["frontmatter"].get("depends_on", []) or []
        deps = deps if isinstance(deps, list) else [deps]
        for d in deps:
            if d not in file_id_set:
                dangling.append(f"{tid} -> {d}")
    check("3", "Depends On 누락 0", len(dangling) == 0, f"존재하지 않는 참조: {dangling}")

    # 4. Dependency Cycle 0
    graph = {
        tid: (t["frontmatter"].get("depends_on", []) or [])
        for tid, t in tasks.items()
    }
    for tid in graph:
        if not isinstance(graph[tid], list):
            graph[tid] = [graph[tid]]
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {tid: WHITE for tid in graph}
    cycle_path: list[str] = []

    def dfs(u: str, path: list[str]) -> bool:
        color[u] = GRAY
        path.append(u)
        for v in graph.get(u, []):
            if v not in graph:
                continue
            if color.get(v, WHITE) == GRAY:
                cycle_path[:] = path + [v]
                return True
            if color.get(v, WHITE) == WHITE:
                if dfs(v, path):
                    return True
        path.pop()
        color[u] = BLACK
        return False

    has_cycle = False
    for tid in list(graph.keys()):
        if color[tid] == WHITE:
            if dfs(tid, []):
                has_cycle = True
                break
    check("4", "Dependency Cycle 0", not has_cycle, f"발견된 순환: {' -> '.join(cycle_path)}" if has_cycle else "")

    # 5. Screen 5개 모두 Page Owner 정확히 1개
    page_owner_tasks = {tid: t for tid, t in tasks.items() if t["frontmatter"].get("type") == "page_owner"}
    component_tasks = {tid: t for tid, t in tasks.items() if t["frontmatter"].get("type") == "component"}
    for screen in screens:
        sid = screen.get("screen_id")
        owners = [tid for tid, t in page_owner_tasks.items() if t["frontmatter"].get("screen_id") == sid]
        check(f"5.{sid}", f"{sid} Page Owner Task 정확히 1개", len(owners) == 1, f"발견: {owners}")

    # 6. Route·Page Entry·Expected Files 일치(Task List ↔ 상세 파일)
    mismatches: list[str] = []
    for tid, t in tasks.items():
        row = row_by_id.get(tid)
        if row is None:
            continue
        fm = t["frontmatter"]
        list_route = row["route"].strip().strip("`")
        detail_route = str(fm.get("route", "")).strip().strip("`")
        if list_route not in ("-", "") and list_route != detail_route:
            mismatches.append(f"{tid}: route 불일치(List={list_route!r} / 상세={detail_route!r})")
        list_page_entry = row["page_entry"].strip()
        detail_page_entry = str(fm.get("page_entry", "")).strip()
        if list_page_entry not in ("-", "") and backtick_paths(list_page_entry) != backtick_paths(detail_page_entry) and list_page_entry != detail_page_entry:
            mismatches.append(f"{tid}: page_entry 불일치(List={list_page_entry!r} / 상세={detail_page_entry!r})")
        list_files = backtick_paths(row["expected_files"])
        detail_expected = extract_section(t["body_no_fm"], "Expected Files")
        detail_files = backtick_paths(detail_expected)
        missing_paths = list_files - detail_files
        if missing_paths:
            mismatches.append(f"{tid}: Expected Files 누락 {sorted(missing_paths)}")
    check("6", "Route·Page Entry·Expected Files 일치(Task List ↔ 상세 파일)", len(mismatches) == 0, "; ".join(mismatches))

    # 7. Component-only Screen 0
    component_only_screens = []
    for screen in screens:
        sid = screen.get("screen_id")
        has_component = any(t["frontmatter"].get("screen_id") == sid for t in component_tasks.values())
        has_owner = any(t["frontmatter"].get("screen_id") == sid for t in page_owner_tasks.values())
        if has_component and not has_owner:
            component_only_screens.append(sid)
    check("7", "Component-only Screen 0", len(component_only_screens) == 0, f"Page Owner 없이 Component만 있는 Screen: {component_only_screens}")

    # 8. SCR-001 Starter 제거 AC 존재
    po1 = page_owner_tasks.get("PO-SCR-001")
    if po1:
        body_lower = po1["body"].lower()
        check("8", "SCR-001 Starter 제거 AC 존재", ("starter" in body_lower) and ("제거" in po1["body"]))
    else:
        check("8", "SCR-001 Starter 제거 AC 존재", False, "PO-SCR-001 없음")

    # 9. SCR-003 세 탭 조립 AC 존재
    po3 = page_owner_tasks.get("PO-SCR-003")
    if po3:
        body = po3["body"]
        ok9 = all(kw in body for kw in ("항공", "숙소", "동행"))
        check("9", "SCR-003 세 탭 조립 AC 존재", ok9, f"항공/숙소/동행 포함 여부 확인 실패" if not ok9 else "")
    else:
        check("9", "SCR-003 세 탭 조립 AC 존재", False, "PO-SCR-003 없음")

    # 10. SCR-005 역할별 상태 조립 AC 존재
    po5 = page_owner_tasks.get("PO-SCR-005")
    if po5:
        body = po5["body"]
        has_guest = "Guest" in body or "게스트" in body
        has_member = "Member" in body or "회원" in body
        has_admin = "Admin" in body or "관리자" in body
        check("10", "SCR-005 역할별 상태 조립 AC 존재", has_guest and has_member and has_admin,
              f"Guest={has_guest}, Member={has_member}, Admin={has_admin}")
    else:
        check("10", "SCR-005 역할별 상태 조립 AC 존재", False, "PO-SCR-005 없음")

    # 11. DB Schema·RLS·Access·Seed Task 존재
    missing_db = [tid for tid in FIXED_DB_TASK_IDS if tid not in tasks]
    check("11", "DB Schema·RLS·Access·Seed Task 존재", len(missing_db) == 0, f"누락: {missing_db}")

    # 12. DB Table 범위가 6개 기본 테이블을 크게 넘지 않음
    db_schema = tasks.get("DB-SCHEMA-BASE")
    if db_schema:
        tables = db_schema["frontmatter"].get("tables", []) or []
        tables = tables if isinstance(tables, list) else [tables]
        unknown_tables = [t for t in tables if t not in DB_TABLES]
        check(
            "12", "DB Table 범위가 6개 기본 테이블을 크게 넘지 않음",
            len(tables) <= DB_TABLE_SOFT_LIMIT and len(unknown_tables) == 0,
            f"{len(tables)}개(허용 {DB_TABLE_SOFT_LIMIT}개): {tables}, 미정의 테이블: {unknown_tables}",
        )
    else:
        check("12", "DB Table 범위가 6개 기본 테이블을 크게 넘지 않음", False, "DB-SCHEMA-BASE 없음")

    # 13. 외부 입력 비저장 AC 존재(항공·숙소 폼)
    no_store_re = re.compile(r"(서버|DB|로그|분석).{0,10}(저장하지 않|보존하지 않|미저장|미보존)")
    target_reqs = {"REQ-FUNC-017", "REQ-FUNC-025", "REQ-NF-017"}
    covering_tasks = [
        tid for tid, t in tasks.items()
        if target_reqs & set(t["frontmatter"].get("requirements_covered", []) or [])
    ]
    satisfied = [tid for tid in covering_tasks if no_store_re.search(tasks[tid]["body"])]
    check(
        "13", "외부 입력 비저장 AC 존재(항공·숙소 폼)",
        len(covering_tasks) > 0 and len(satisfied) > 0,
        f"REQ-FUNC-017/025, REQ-NF-017을 커버하는 Task: {covering_tasks}, 비저장 문구 포함: {satisfied}",
    )

    # 14. Auth·성인·기본 RLS AC 존재
    auth_reqs = {"REQ-FUNC-027", "REQ-FUNC-028"}
    auth_tasks = [
        tid for tid, t in tasks.items()
        if auth_reqs & set(t["frontmatter"].get("requirements_covered", []) or [])
    ]
    auth_ok = any(("인증" in tasks[tid]["body"] or "성인" in tasks[tid]["body"]) for tid in auth_tasks)
    rls_tasks = [tid for tid in ("DB-RLS-BASE", "TEST-RLS-BASIC") if tid in tasks]
    rls_ok = any(("RLS" in tasks[tid]["body"] or "Row Level Security" in tasks[tid]["body"] or "권한" in tasks[tid]["body"]) for tid in rls_tasks)
    check(
        "14", "Auth·성인·기본 RLS AC 존재",
        len(auth_tasks) > 0 and auth_ok and len(rls_tasks) == 2 and rls_ok,
        f"인증/성인 Task: {auth_tasks}(문구 포함={auth_ok}), RLS Task: {rls_tasks}(문구 포함={rls_ok})",
    )

    # 15. Playwright Chromium Smoke Task 존재
    smoke = tasks.get(FIXED_SMOKE_TASK_ID)
    check(
        "15", "Playwright Chromium Smoke Task 존재",
        smoke is not None and str(smoke["frontmatter"].get("browser", "")).lower() == "chromium",
        f"{FIXED_SMOKE_TASK_ID} 존재={smoke is not None}, browser={smoke['frontmatter'].get('browser') if smoke else None}",
    )

    # 16. AWS·EC2·자동 Merge 구현 Task 0
    keyword_hits: list[str] = []
    browser_hits: list[str] = []
    for tid, t in tasks.items():
        body = t["body"]
        for kw in FORBIDDEN_KEYWORDS:
            if kw.lower() in body.lower():
                keyword_hits.append(f"{tid}: '{kw}'")
        for b in FORBIDDEN_BROWSERS:
            if b in body.lower():
                browser_hits.append(f"{tid}: '{b}'")
    check("16", "AWS·EC2·자동 Merge 구현 Task 0", len(keyword_hits) == 0, str(keyword_hits))
    check("16b", "Chromium 외 브라우저 언급 없음", len(browser_hits) == 0, str(browser_hits))

    # 17. REQ-FUNC 80개와 REQ-NF 34개가 Task 또는 EXCLUDED 표에 존재
    covered: dict[str, list[str]] = {}
    for tid, t in tasks.items():
        for r in (t["frontmatter"].get("requirements_covered", []) or []):
            covered.setdefault(r, []).append(tid)

    all_func = {f"REQ-FUNC-{n:03d}" for n in range(1, 81)}
    all_nf = {f"REQ-NF-{n:03d}" for n in range(1, 35)}
    all_reqs = all_func | all_nf

    unaccounted = []
    conflicting = []
    for req in sorted(all_reqs):
        in_task = req in covered
        scope_status = scope.get(req)
        if not in_task and scope_status != "EXCLUDED":
            unaccounted.append(req)
        if in_task and scope_status == "EXCLUDED":
            conflicting.append(req)
    missing_from_scope = sorted(r for r in all_reqs if r not in scope)
    check(
        "17", "REQ-FUNC 80개와 REQ-NF 34개가 Task 또는 EXCLUDED(PROJECT_SCOPE.md) 표에 존재",
        len(unaccounted) == 0 and len(missing_from_scope) == 0,
        f"어디에도 없음: {unaccounted[:10]}{'...' if len(unaccounted) > 10 else ''}, "
        f"docs/PROJECT_SCOPE.md에 미등재: {missing_from_scope[:10]}{'...' if len(missing_from_scope) > 10 else ''}",
    )

    # 18. EXCLUDED 상세 구현 파일이 생성되지 않음
    excluded_reqs = {r for r, s in scope.items() if s == "EXCLUDED"}
    excluded_but_covered = sorted(r for r in covered if r in excluded_reqs)
    excluded_task_files = sorted(
        tid for tid, t in tasks.items()
        if set(t["frontmatter"].get("requirements_covered", []) or []) & excluded_reqs
    )
    check(
        "18", "EXCLUDED 상세 구현 파일이 생성되지 않음",
        len(excluded_but_covered) == 0,
        f"EXCLUDED Requirement를 커버한다고 기록된 Task: {excluded_task_files}, Requirement: {excluded_but_covered}",
    )

    return finish(rows, tasks)


def finish(rows: list[dict], tasks: dict[str, dict]) -> int:
    write_manifest(rows, tasks)
    write_report()
    print_report()
    failed = sum(1 for _, _, ok, _ in results if not ok)
    if failed:
        return 1
    total = len(results)
    print(f"AUDIT_PASS (checks: {total})")
    return 0


def write_manifest(rows: list[dict], tasks: dict[str, dict]) -> None:
    row_by_id = {r["task_id"]: r for r in rows}

    # `scripts/build_waves.py`가 이 CSV 끝에 wave_id 열을 덧붙인다. 이 함수가
    # 매번 헤더를 task_id~file 11열로만 새로 쓰면 그 wave_id가 조용히 사라진다.
    # 기존 파일에 wave_id가 있으면 Task ID 기준으로 이어받는다(Wave 배치
    # 자체는 build_waves.py의 소관이라 여기서 새로 계산하지 않는다).
    existing_wave_id: dict[str, str] = {}
    if MANIFEST_CSV.exists():
        with MANIFEST_CSV.open(encoding="utf-8", newline="") as f:
            for r in csv.DictReader(f):
                wid = r.get("wave_id")
                if wid:
                    existing_wave_id[r["task_id"]] = wid

    TASKS_DIR.mkdir(parents=True, exist_ok=True)
    with MANIFEST_CSV.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        header = [
            "task_id", "type", "category", "priority", "screen_id", "route", "page_entry",
            "depends_on", "requirements_covered", "verify", "file",
        ]
        if existing_wave_id:
            header.append("wave_id")
        writer.writerow(header)
        for tid in sorted(tasks.keys()):
            t = tasks[tid]
            fm = t["frontmatter"]
            row = row_by_id.get(tid, {})
            deps = fm.get("depends_on", []) or []
            deps = deps if isinstance(deps, list) else [deps]
            reqs = fm.get("requirements_covered", []) or []
            reqs = reqs if isinstance(reqs, list) else [reqs]
            out_row = [
                tid,
                fm.get("type", ""),
                row.get("category", ""),
                row.get("priority", ""),
                fm.get("screen_id", ""),
                fm.get("route", ""),
                fm.get("page_entry", ""),
                ";".join(deps),
                ";".join(reqs),
                row.get("verify", ""),
                str(t["path"].relative_to(ROOT)),
            ]
            if existing_wave_id:
                out_row.append(existing_wave_id.get(tid, ""))
            writer.writerow(out_row)
    note = "(wave_id 유지)" if existing_wave_id else ""
    print(f"{MANIFEST_CSV.relative_to(ROOT)} 생성 완료({len(tasks)}행){note}")


def write_report() -> None:
    total = len(results)
    failed = [r for r in results if not r[2]]
    lines = [
        "# Task Audit Report",
        "",
        f"- 검사 도구: `scripts/audit_tasks.py`",
        f"- 총 검사 수: {total}",
        f"- PASS: {total - len(failed)} / FAIL: {len(failed)}",
        f"- 최종 판정: {'AUDIT_PASS' if not failed else 'AUDIT_FAIL'}",
        "",
        "## 검사 결과",
        "",
        "| No | 검사 항목 | 결과 | 상세 |",
        "|---|---|---|---|",
    ]
    for no, name, ok, detail in results:
        mark = "PASS" if ok else "FAIL"
        detail_cell = detail.replace("|", "\\|") if detail else ""
        lines.append(f"| {no} | {name} | {mark} | {detail_cell} |")
    lines.append("")
    REPORT_MD.write_text("\n".join(lines), encoding="utf-8")
    print(f"{REPORT_MD.relative_to(ROOT)} 생성 완료")


def print_report() -> None:
    print("=" * 72)
    print("audit_tasks.py 결과")
    print("=" * 72)
    for no, name, ok, detail in results:
        mark = "PASS" if ok else "FAIL"
        line = f"[{mark}] {no}. {name}"
        if detail and not ok:
            line += f"  — {detail}"
        print(line)
    print("=" * 72)
    failed = sum(1 for _, _, ok, _ in results if not ok)
    total = len(results)
    if failed:
        print(f"결과: AUDIT_FAIL ({failed}/{total} 실패). 상세 Task 파일 또는 Task List를 수정한 뒤 다시 실행하세요.")


if __name__ == "__main__":
    sys.exit(audit())
