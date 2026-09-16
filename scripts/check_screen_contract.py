#!/usr/bin/env python3
"""
check_screen_contract.py

Traveler 프로젝트의 5개 고정 Screen·Route·Page Entry 계약
(`design-reference/SCREEN_ROUTE_CONTRACT.json`)이 Task 계획(`TASKS/TASK_MANIFEST.csv`)
및 실제 구현(`src/app`)과 어긋나지 않는지 검사한다.

`scripts/audit_tasks.py`(Task 문서 자체의 정합성)나 `scripts/validate_harness.py`
(Harness 구성 자체)와는 다른 층위다 — 이 스크립트는 "Screen 계약이 계획·구현
양쪽에서 실제로 지켜지고 있는가"만 본다.

## 실행 모드

  --mode=plan     Page Owner Task와 경로 계획만 검사한다(파일 시스템의 실제
                   구현 상태는 보지 않는다). 검사 1·2·3·5.
  --mode=ci       plan의 검사에 더해, 구현된 Page 파일과 공개 경로를
                   `src/app`에서 실제로 확인한다. 검사 1·2·3·4·5.
  --mode=release  ci의 검사에 더해, Preview Checkpoint 문서
                   (`docs/preview-checks/SCR-00X.md`) 존재 여부를 확인한다.
                   검사 1·2·3·4·5·6.

## 검사

  1. 고정 화면 5개(SCR-001 `/`, SCR-002 `/about`, SCR-003 `/travel-tools`,
     SCR-004 `/mates`, SCR-005 `/account`)가 정확히 존재한다.
  2. 각 화면의 Page Owner Task(TASK_MANIFEST.csv 기준)가 정확히 하나다.
  3. 기술 경로(`/auth/callback`, `/api/**`, `not-found`)를 사용자 화면으로
     세지 않는다.
  4. (ci/release) 여행지 상세·안전정보 등을 새 Page(`src/app/**/page.tsx`)로
     만들지 않았는지 — 5개 고정 Page 외의 Page 파일이 없는지 검사한다.
     각 고정 Screen의 page_entry 파일이 실제로 존재하는지도 함께 본다.
  5. SCR-003 Task가 여행 입력(항공·숙소, REQ-FUNC-011~026)과 동행 작성
     (REQ-FUNC-031~032) 양쪽 요구를 모두 포함한다.
  6. (release) `docs/preview-checks/SCR-001.md` ~ `SCR-005.md` 5개가 모두
     존재하고 비어 있지 않다.

오류는 파일·화면 ID·수정 힌트를 포함해 출력하고 exit(1)로 끝낸다.
모두 통과하면 "CHECK_SCREEN_CONTRACT_PASS"를 출력하고 exit(0).
외부 패키지 없이 Python 3 표준 라이브러리만 쓴다.
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCREEN_CONTRACT = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
TASK_MANIFEST = ROOT / "TASKS" / "TASK_MANIFEST.csv"
SRC_APP = ROOT / "src" / "app"
PREVIEW_CHECKS_DIR = ROOT / "docs" / "preview-checks"

FIXED_SCREENS = {
    "SCR-001": "/",
    "SCR-002": "/about",
    "SCR-003": "/travel-tools",
    "SCR-004": "/mates",
    "SCR-005": "/account",
}

# 허용 기술 경로 — 디자인 Screen으로 세지 않는다.
ALLOWED_TECHNICAL_ROUTES = [
    "/auth/callback",
    "/api/**",
    "not-found",
]

# design-reference/SCREEN_ROUTE_CONTRACT.json의 technical_routes 항목과 매칭되는
# src/app 파일 패턴(page.tsx가 아닌 것들 — Page로 세지 않는다).
TECHNICAL_ROUTE_FILE_SUFFIXES = (
    "auth/callback/route.ts",
    "not-found.tsx",
    "error.tsx",
)

# SCR-003 "여행 입력"(항공 REQ-FUNC-011~018 + 숙소 REQ-FUNC-019~026) 요구 범위.
TRAVEL_INPUT_REQS = {f"REQ-FUNC-{n:03d}" for n in range(11, 27)}
# SCR-003 "동행 작성"(REQ-FUNC-031·032) 요구 범위.
MATE_WRITE_REQS = {"REQ-FUNC-031", "REQ-FUNC-032"}

results: list[tuple[str, bool, str]] = []


def check(check_no: str, ok: bool, detail: str = "") -> None:
    results.append((check_no, ok, detail))


def fail(check_no: str, file: str, screen_id: str, hint: str) -> None:
    check(check_no, False, f"file={file}, screen_id={screen_id}, hint={hint}")


def load_json(path: Path) -> dict | None:
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None


def load_manifest_rows() -> list[dict]:
    if not TASK_MANIFEST.exists():
        return []
    with TASK_MANIFEST.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def check_1_fixed_screens(contract: dict | None) -> None:
    if contract is None:
        fail(
            "1",
            str(SCREEN_CONTRACT.relative_to(ROOT)),
            "-",
            "SCREEN_ROUTE_CONTRACT.json이 없거나 JSON 파싱에 실패했다. 파일을 생성·복구한다.",
        )
        return

    screens = {s.get("screen_id"): s.get("route") for s in contract.get("screens", [])}

    for screen_id, expected_route in FIXED_SCREENS.items():
        if screen_id not in screens:
            fail(
                "1",
                str(SCREEN_CONTRACT.relative_to(ROOT)),
                screen_id,
                f"screens 배열에 {screen_id}가 없다. route={expected_route}로 추가한다.",
            )
        elif screens[screen_id] != expected_route:
            fail(
                "1",
                str(SCREEN_CONTRACT.relative_to(ROOT)),
                screen_id,
                f"route가 '{screens[screen_id]}'로 기록돼 있다. 고정값 '{expected_route}'로 맞춘다.",
            )
        else:
            check("1", True)

    extra = set(screens) - set(FIXED_SCREENS)
    for screen_id in sorted(extra):
        fail(
            "1",
            str(SCREEN_CONTRACT.relative_to(ROOT)),
            screen_id,
            "고정 화면 5개 목록에 없는 Screen이다. 신규 Screen 추가는 SCREEN_ROUTE_CONTRACT.json과 CLAUDE.md를 먼저 갱신한 뒤에만 한다.",
        )


def check_2_page_owner_one_each(rows: list[dict]) -> None:
    if not rows:
        fail(
            "2",
            str(TASK_MANIFEST.relative_to(ROOT)),
            "-",
            "TASK_MANIFEST.csv가 없거나 비어 있다. `python3 scripts/audit_tasks.py`로 먼저 생성한다.",
        )
        return

    for screen_id in FIXED_SCREENS:
        owners = [
            r["task_id"]
            for r in rows
            if r.get("screen_id") == screen_id and r.get("type") == "page_owner"
        ]
        if len(owners) == 1:
            check("2", True)
        elif len(owners) == 0:
            fail(
                "2",
                str(TASK_MANIFEST.relative_to(ROOT)),
                screen_id,
                f"{screen_id}의 Page Owner Task가 없다. TASKS/TASK-PO-{screen_id}.md를 만들고 type: page_owner로 등록한다.",
            )
        else:
            fail(
                "2",
                str(TASK_MANIFEST.relative_to(ROOT)),
                screen_id,
                f"{screen_id}의 Page Owner Task가 {len(owners)}개다({', '.join(owners)}). 정확히 1개만 남긴다.",
            )


def check_3_technical_routes_not_screens(contract: dict | None, rows: list[dict]) -> None:
    if contract is None:
        # check_1에서 이미 보고했다 — 중복 보고하지 않는다.
        return

    screen_page_entries = {s.get("page_entry") for s in contract.get("screens", [])}
    screen_routes = {s.get("route") for s in contract.get("screens", [])}

    for tech in contract.get("technical_routes", []):
        path = tech.get("path", "")
        if tech.get("counted_as_screen"):
            fail(
                "3",
                str(SCREEN_CONTRACT.relative_to(ROOT)),
                "-",
                f"기술 경로 '{path}'의 counted_as_screen이 true다. false로 고친다(디자인 Screen이 아니다).",
            )
            continue
        if path in screen_page_entries:
            fail(
                "3",
                str(SCREEN_CONTRACT.relative_to(ROOT)),
                "-",
                f"기술 경로 '{path}'가 5개 고정 Screen의 page_entry와 겹친다. 서로 다른 경로여야 한다.",
            )
        else:
            check("3", True)

    # TASK_MANIFEST에 기술 경로를 screen_id로 등록한 Task가 있는지 확인한다.
    tech_keywords = ("AUTH-CALLBACK", "NOT-FOUND", "API-ROUTE")
    for r in rows:
        screen_id = (r.get("screen_id") or "").upper()
        if screen_id and screen_id not in FIXED_SCREENS and any(k in screen_id for k in tech_keywords):
            fail(
                "3",
                str(TASK_MANIFEST.relative_to(ROOT)),
                r.get("screen_id", ""),
                f"Task {r.get('task_id')}가 기술 경로를 screen_id로 쓰고 있다. screen_id는 5개 고정 Screen 중 하나이거나 비워둔다.",
            )
        else:
            check("3", True)

    if screen_routes & set(ALLOWED_TECHNICAL_ROUTES):
        fail(
            "3",
            str(SCREEN_CONTRACT.relative_to(ROOT)),
            "-",
            "고정 Screen의 route가 허용 기술 경로와 겹친다.",
        )
    else:
        check("3", True)


def check_4_no_extra_pages(contract: dict | None) -> None:
    if contract is None:
        return
    if not SRC_APP.exists():
        fail(
            "4",
            str(SRC_APP.relative_to(ROOT)),
            "-",
            "src/app 디렉터리가 없다. Next.js App Router 스캐폴드가 아직 생성되지 않았다.",
        )
        return

    allowed_page_files = {ROOT / s.get("page_entry") for s in contract.get("screens", [])}

    for screen in contract.get("screens", []):
        screen_id = screen.get("screen_id")
        page_entry_path = ROOT / screen.get("page_entry", "")
        if not page_entry_path.exists():
            fail(
                "4",
                screen.get("page_entry", ""),
                screen_id,
                f"{screen_id}의 page_entry 파일이 아직 없다. `{screen.get('page_entry')}`를 구현한다.",
            )
        else:
            check("4", True)

    all_page_files = sorted(SRC_APP.glob("**/page.tsx"))
    for page_file in all_page_files:
        if page_file in allowed_page_files:
            check("4", True)
            continue
        rel = page_file.relative_to(ROOT)
        name_lower = str(rel).lower()
        if "destination" in name_lower or "safety" in name_lower or "안전" in name_lower:
            hint = (
                "여행지 상세·안전정보는 SCR-001의 Drawer로만 노출한다"
                "(design-reference/SCREEN_ROUTE_CONTRACT.json required_navigation 참조). "
                "새 Page로 만들지 말고 이 파일을 제거한다."
            )
        else:
            hint = "5개 고정 Screen 목록 밖의 Page다. SCREEN_ROUTE_CONTRACT.json을 먼저 갱신하지 않았다면 이 파일을 제거한다."
        fail("4", str(rel), "-", hint)


def check_5_scr003_covers_both(rows: list[dict]) -> None:
    po003 = next((r for r in rows if r.get("task_id") == "PO-SCR-003"), None)
    if po003 is None:
        fail(
            "5",
            str(TASK_MANIFEST.relative_to(ROOT)),
            "SCR-003",
            "PO-SCR-003 Task가 TASK_MANIFEST.csv에 없다. 먼저 생성한다.",
        )
        return

    covered = set((po003.get("requirements_covered") or "").split(";"))
    covered.discard("")

    has_travel_input = bool(covered & TRAVEL_INPUT_REQS)
    has_mate_write = bool(covered & MATE_WRITE_REQS)

    if not has_travel_input:
        fail(
            "5",
            "TASKS/TASK-PO-SCR-003.md",
            "SCR-003",
            "requirements_covered에 여행 입력(REQ-FUNC-011~026, 항공·숙소) 요구가 없다. 관련 REQ ID를 추가한다.",
        )
    else:
        check("5", True)

    if not has_mate_write:
        fail(
            "5",
            "TASKS/TASK-PO-SCR-003.md",
            "SCR-003",
            "requirements_covered에 동행 작성(REQ-FUNC-031·032) 요구가 없다. 관련 REQ ID를 추가한다.",
        )
    else:
        check("5", True)


def check_6_preview_checkpoints() -> None:
    for screen_id in FIXED_SCREENS:
        p = PREVIEW_CHECKS_DIR / f"{screen_id}.md"
        if not p.exists():
            fail(
                "6",
                str(p.relative_to(ROOT)),
                screen_id,
                f"Preview Checkpoint 문서가 없다. `{p.relative_to(ROOT)}`를 사람이 Vercel Preview 확인 후 작성한다.",
            )
        elif p.stat().st_size == 0:
            fail(
                "6",
                str(p.relative_to(ROOT)),
                screen_id,
                "Preview Checkpoint 문서가 비어 있다. 확인 내용을 채운다.",
            )
        else:
            check("6", True)


def run(mode: str) -> int:
    contract = load_json(SCREEN_CONTRACT)
    rows = load_manifest_rows()

    check_1_fixed_screens(contract)
    check_2_page_owner_one_each(rows)
    check_3_technical_routes_not_screens(contract, rows)
    check_5_scr003_covers_both(rows)

    if mode in ("ci", "release"):
        check_4_no_extra_pages(contract)

    if mode == "release":
        check_6_preview_checkpoints()

    return report(mode)


def report(mode: str) -> int:
    print("=" * 72)
    print(f"check_screen_contract.py 결과 (mode={mode})")
    print("=" * 72)
    failed = 0
    for check_no, ok, detail in results:
        mark = "PASS" if ok else "FAIL"
        line = f"[{mark}] {check_no}"
        if detail:
            line += f" — {detail}"
        print(line)
        if not ok:
            failed += 1
    print("=" * 72)
    total = len(results)
    if failed:
        print(f"결과: FAIL ({failed}/{total} 실패, mode={mode})")
        return 1
    print(f"CHECK_SCREEN_CONTRACT_PASS (mode={mode}, checks: {total})")
    return 0


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Screen·Route 계약 검사")
    parser.add_argument(
        "--mode",
        choices=["plan", "ci", "release"],
        default="plan",
        help="plan | ci | release",
    )
    return parser.parse_args(argv)


if __name__ == "__main__":
    args = parse_args(sys.argv[1:])
    sys.exit(run(args.mode))
