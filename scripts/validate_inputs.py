#!/usr/bin/env python3
"""
validate_inputs.py

Traveler Task 생성 Pipeline의 입력 검증 스크립트다.
`/gen-tasklist` 실행 전에 반드시 이 스크립트를 통과해야 한다(exit code 0).

검증 대상:
  - design-reference/SCREEN_ROUTE_CONTRACT.json
      schema_version == "traveler-screen-route-v1"
      screens 배열 정확히 5개, route/page_entry 중복 없음, core 4 / supplementary 1
  - docs/PROJECT_SCOPE.md
      IMPLEMENT/EXCLUDED 집계(REQ-FUNC 71/9, REQ-NF 16/18, 합계 114)
  - docs/UIUX_TRACEABILITY.md
      REQ-FUNC-001~080, REQ-NF-001~034 총 114건이 각각 정확히 1회 등장
      Implementation Status가 PLANNED 또는 EXCLUDED만 존재
      PLANNED/EXCLUDED 건수가 PROJECT_SCOPE.md 집계와 일치
  - 필수 입력 문서 5종의 파일 존재 여부
  - 현재 src/app 파일 트리(정보 제공용 — 실패 조건 아님, Expected Files 작성 근거로 출력)

실패 시 exit(1), 모두 통과 시 exit(0). 어떤 검사도 건너뛰지 않는다.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_DOCS = [
    "docs/06_SRS_UIUX_REVISED.md",
    "docs/PROJECT_SCOPE.md",
    "docs/UIUX_TRACEABILITY.md",
    "design-reference/D-001/DESIGN.md",
    "design-reference/UI_CONTRACT.md",
    "design-reference/SCREEN_ROUTE_CONTRACT.json",
    "package.json",
]

EXPECTED_SCHEMA_VERSION = "traveler-screen-route-v1"
EXPECTED_SCREEN_COUNT = 5
EXPECTED_CORE_COUNT = 4
EXPECTED_SUPPLEMENTARY_COUNT = 1

EXPECTED_FUNC_TOTAL = 80
EXPECTED_NF_TOTAL = 34
EXPECTED_TOTAL = EXPECTED_FUNC_TOTAL + EXPECTED_NF_TOTAL  # 114

results: list[tuple[str, bool, str]] = []


def check(name: str, ok: bool, detail: str = "") -> None:
    results.append((name, ok, detail))


def read_text(rel_path: str) -> str:
    p = ROOT / rel_path
    return p.read_text(encoding="utf-8")


# ---------------------------------------------------------------------------
# 1. 필수 입력 문서 존재 확인
# ---------------------------------------------------------------------------

def check_required_docs() -> None:
    for rel in REQUIRED_DOCS:
        p = ROOT / rel
        check(f"파일 존재: {rel}", p.exists(), "" if p.exists() else "파일이 없습니다.")


# ---------------------------------------------------------------------------
# 2. SCREEN_ROUTE_CONTRACT.json 검증
# ---------------------------------------------------------------------------

def check_screen_route_contract() -> dict | None:
    rel = "design-reference/SCREEN_ROUTE_CONTRACT.json"
    p = ROOT / rel
    if not p.exists():
        check("SCREEN_ROUTE_CONTRACT.json 파싱", False, "파일 없음")
        return None

    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        check("SCREEN_ROUTE_CONTRACT.json 파싱", False, f"JSON 파싱 오류: {e}")
        return None
    check("SCREEN_ROUTE_CONTRACT.json 파싱", True)

    schema_ok = data.get("schema_version") == EXPECTED_SCHEMA_VERSION
    check(
        f"schema_version == {EXPECTED_SCHEMA_VERSION}",
        schema_ok,
        f"실제 값: {data.get('schema_version')!r}",
    )

    screens = data.get("screens", [])
    check(
        f"screens 배열 정확히 {EXPECTED_SCREEN_COUNT}개",
        len(screens) == EXPECTED_SCREEN_COUNT,
        f"실제 개수: {len(screens)}",
    )

    routes = [s.get("route") for s in screens]
    entries = [s.get("page_entry") for s in screens]
    check("route 중복 없음", len(routes) == len(set(routes)), str(routes))
    check("page_entry 중복 없음", len(entries) == len(set(entries)), str(entries))

    expected_ids = {f"SCR-00{i}" for i in range(1, 6)}
    actual_ids = {s.get("screen_id") for s in screens}
    check("Screen ID가 SCR-001~005와 일치", actual_ids == expected_ids, str(sorted(actual_ids)))

    core = [s for s in screens if s.get("tier") == "core"]
    supplementary = [s for s in screens if s.get("tier") == "supplementary"]
    check(
        f"core Screen {EXPECTED_CORE_COUNT}개",
        len(core) == EXPECTED_CORE_COUNT,
        str([s.get("screen_id") for s in core]),
    )
    check(
        f"supplementary Screen {EXPECTED_SUPPLEMENTARY_COUNT}개",
        len(supplementary) == EXPECTED_SUPPLEMENTARY_COUNT,
        str([s.get("screen_id") for s in supplementary]),
    )

    for s in screens:
        check(
            f"{s.get('screen_id')}.page_owner_task_required == true",
            s.get("page_owner_task_required") is True,
        )
        check(
            f"{s.get('screen_id')}.preview_required == true",
            s.get("preview_required") is True,
        )

    scr001 = next((s for s in screens if s.get("screen_id") == "SCR-001"), None)
    if scr001 is not None:
        check(
            "SCR-001.starter_template_forbidden == true",
            scr001.get("starter_template_forbidden") is True,
        )

    tech_routes = data.get("technical_routes", [])
    check("technical_routes 존재", len(tech_routes) > 0, f"{len(tech_routes)}건")
    for t in tech_routes:
        check(
            f"technical_route {t.get('path')}.counted_as_screen == false",
            t.get("counted_as_screen") is False,
        )

    check("required_navigation 존재", len(data.get("required_navigation", [])) > 0)

    return data


# ---------------------------------------------------------------------------
# 3. PROJECT_SCOPE.md 요약 집계 파싱
# ---------------------------------------------------------------------------

def parse_project_scope_counts() -> dict[str, int] | None:
    rel = "docs/PROJECT_SCOPE.md"
    try:
        text = read_text(rel)
    except FileNotFoundError:
        check("PROJECT_SCOPE.md 파싱", False, "파일 없음")
        return None

    patterns = {
        "func_total": r"\|\s*REQ-FUNC 전체\s*\|\s*(\d+)\s*\|",
        "func_implement": r"\|\s*REQ-FUNC IMPLEMENT\s*\|\s*(\d+)\s*\|",
        "func_excluded": r"\|\s*REQ-FUNC EXCLUDED\s*\|\s*(\d+)\s*\|",
        "nf_total": r"\|\s*REQ-NF 전체\s*\|\s*(\d+)\s*\|",
        "nf_implement": r"\|\s*REQ-NF IMPLEMENT\s*\|\s*(\d+)\s*\|",
        "nf_excluded": r"\|\s*REQ-NF EXCLUDED\s*\|\s*(\d+)\s*\|",
        "total": r"\|\s*전체 요구사항\s*\|\s*(\d+)\s*\|",
    }
    out: dict[str, int] = {}
    ok = True
    for key, pat in patterns.items():
        m = re.search(pat, text)
        if not m:
            ok = False
            check(f"PROJECT_SCOPE.md에서 {key} 파싱", False, "패턴을 찾지 못함")
            continue
        out[key] = int(m.group(1))
    check("PROJECT_SCOPE.md 요약 표 전체 파싱", ok)

    if ok:
        check(
            "PROJECT_SCOPE.md 합계 정합성(func+nf == total)",
            out["func_total"] + out["nf_total"] == out["total"] == EXPECTED_TOTAL,
            str(out),
        )
        check(
            "PROJECT_SCOPE.md FUNC IMPLEMENT+EXCLUDED == FUNC 전체",
            out["func_implement"] + out["func_excluded"] == out["func_total"],
        )
        check(
            "PROJECT_SCOPE.md NF IMPLEMENT+EXCLUDED == NF 전체",
            out["nf_implement"] + out["nf_excluded"] == out["nf_total"],
        )
    return out if ok else None


# ---------------------------------------------------------------------------
# 4. UIUX_TRACEABILITY.md 행 파싱
# ---------------------------------------------------------------------------

ROW_RE = re.compile(
    r"^\|\s*(REQ-(?:FUNC|NF)-\d{3})\s*\|\s*(PLANNED|EXCLUDED)\s*\|"
)


def parse_traceability_rows() -> dict[str, str] | None:
    rel = "docs/UIUX_TRACEABILITY.md"
    try:
        text = read_text(rel)
    except FileNotFoundError:
        check("UIUX_TRACEABILITY.md 파싱", False, "파일 없음")
        return None

    rows: dict[str, str] = {}
    duplicates: list[str] = []
    for line in text.splitlines():
        m = ROW_RE.match(line.strip())
        if not m:
            continue
        req_id, status = m.group(1), m.group(2)
        if req_id in rows:
            duplicates.append(req_id)
        rows[req_id] = status

    check("UIUX_TRACEABILITY.md 최소 1행 이상 파싱", len(rows) > 0, f"{len(rows)}행")
    check("UIUX_TRACEABILITY.md 중복 Requirement 없음", len(duplicates) == 0, str(duplicates))

    expected_func = {f"REQ-FUNC-{i:03d}" for i in range(1, EXPECTED_FUNC_TOTAL + 1)}
    expected_nf = {f"REQ-NF-{i:03d}" for i in range(1, EXPECTED_NF_TOTAL + 1)}
    expected_all = expected_func | expected_nf

    missing = sorted(expected_all - rows.keys())
    extra = sorted(rows.keys() - expected_all)
    check("REQ-FUNC-001~080, REQ-NF-001~034 전량 존재(누락 없음)", len(missing) == 0, str(missing))
    check("정의되지 않은 Requirement ID 없음", len(extra) == 0, str(extra))

    check(
        f"Requirement 총계 {EXPECTED_TOTAL}건",
        len(rows) == EXPECTED_TOTAL,
        f"실제: {len(rows)}",
    )

    invalid_status = {k: v for k, v in rows.items() if v not in ("PLANNED", "EXCLUDED")}
    check("Implementation Status는 PLANNED 또는 EXCLUDED만 존재", len(invalid_status) == 0, str(invalid_status))

    return rows


def cross_check_counts(scope_counts: dict[str, int] | None, trace_rows: dict[str, str] | None) -> None:
    if scope_counts is None or trace_rows is None:
        check("PROJECT_SCOPE.md ↔ UIUX_TRACEABILITY.md 집계 교차검증", False, "선행 파싱 실패로 생략")
        return

    planned_func = sum(1 for k, v in trace_rows.items() if k.startswith("REQ-FUNC") and v == "PLANNED")
    excluded_func = sum(1 for k, v in trace_rows.items() if k.startswith("REQ-FUNC") and v == "EXCLUDED")
    planned_nf = sum(1 for k, v in trace_rows.items() if k.startswith("REQ-NF") and v == "PLANNED")
    excluded_nf = sum(1 for k, v in trace_rows.items() if k.startswith("REQ-NF") and v == "EXCLUDED")

    check(
        "REQ-FUNC PLANNED 건수 == PROJECT_SCOPE.md IMPLEMENT 건수",
        planned_func == scope_counts["func_implement"],
        f"traceability={planned_func}, project_scope={scope_counts['func_implement']}",
    )
    check(
        "REQ-FUNC EXCLUDED 건수 일치",
        excluded_func == scope_counts["func_excluded"],
        f"traceability={excluded_func}, project_scope={scope_counts['func_excluded']}",
    )
    check(
        "REQ-NF PLANNED 건수 == PROJECT_SCOPE.md IMPLEMENT 건수",
        planned_nf == scope_counts["nf_implement"],
        f"traceability={planned_nf}, project_scope={scope_counts['nf_implement']}",
    )
    check(
        "REQ-NF EXCLUDED 건수 일치",
        excluded_nf == scope_counts["nf_excluded"],
        f"traceability={excluded_nf}, project_scope={scope_counts['nf_excluded']}",
    )


# ---------------------------------------------------------------------------
# 5. 현재 src/app 파일 트리(정보 제공용 — 실패 조건 아님)
# ---------------------------------------------------------------------------

def report_current_app_tree() -> None:
    app_dir = ROOT / "src" / "app"
    print("\n[정보] 현재 src/app 파일 트리 (Expected Files 작성 시 이 목록을 기준으로 신규/기존 파일을 구분한다):")
    if not app_dir.exists():
        print("  (src/app 디렉터리가 없습니다)")
        return
    for p in sorted(app_dir.rglob("*")):
        if p.is_file():
            print(f"  - {p.relative_to(ROOT)}")


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------

def main() -> int:
    check_required_docs()
    check_screen_route_contract()
    scope_counts = parse_project_scope_counts()
    trace_rows = parse_traceability_rows()
    cross_check_counts(scope_counts, trace_rows)

    print("=" * 72)
    print("validate_inputs.py 결과")
    print("=" * 72)
    failed = 0
    for name, ok, detail in results:
        mark = "PASS" if ok else "FAIL"
        line = f"[{mark}] {name}"
        if detail and not ok:
            line += f"  — {detail}"
        print(line)
        if not ok:
            failed += 1

    report_current_app_tree()

    print("=" * 72)
    if failed:
        print(f"결과: FAIL ({failed}/{len(results)} 실패). /gen-tasklist를 실행하지 마세요.")
        return 1
    print(f"결과: PASS ({len(results)}/{len(results)} 통과). /gen-tasklist를 실행할 수 있습니다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
