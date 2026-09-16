#!/usr/bin/env python3
"""
validate_harness.py

Traveler 프로젝트의 Claude Code Harness(루트 CLAUDE.md, traveler-project-pipeline Skill,
7개 Command)가 실제로 갖춰져 있고, 핵심 규칙이 문서 어딘가에 실제로 적혀 있는지 검사한다.

`scripts/validate_inputs.py`(Task 생성용 입력 문서 검사)나 `scripts/audit_tasks.py`
(Task List·상세 Task 정합성 검사)와는 다른 층위다 — 이 스크립트는 "Harness 구성 자체가
온전한가"만 본다.

검사(13개):
   1. CLAUDE.md 존재
   2. Claude Code Skill 파일 존재(traveler-project-pipeline/SKILL.md)
   3. 7개 Command 존재
   4. traveler-screen-route-v1 Marker 존재(CLAUDE.md 마커 + SCREEN_ROUTE_CONTRACT.json 일치)
   5. D-001 DESIGN 경로 일치(CLAUDE.md 마커가 가리키는 파일이 실제로 존재)
   6. Screen Contract 경로 일치(CLAUDE.md 마커가 가리키는 파일이 실제로 존재)
   7. Page Owner 5개 규칙 존재
   8. DB Table 6개 기본 범위 규칙 존재
   9. 외부 입력 비저장 규칙 존재
  10. Playwright Chromium Smoke 규칙 존재
  11. AUTO_MERGE=false
  12. AWS_ENABLED=false
  13. EXCLUDED 보호 규칙 존재

성공 시 "VALIDATE_HARNESS_PASS"를 출력하고 exit(0). 실패 시 파일·누락 규칙을 출력하고 exit(1).
외부 패키지 없이 Python 3 표준 라이브러리만 쓴다.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CLAUDE_MD = ROOT / "CLAUDE.md"
SKILL_MD = ROOT / ".claude" / "skills" / "traveler-project-pipeline" / "SKILL.md"
COMMANDS_DIR = ROOT / ".claude" / "commands"
SCREEN_CONTRACT = ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
DESIGN_PATH = ROOT / "design-reference" / "D-001" / "DESIGN.md"

EXPECTED_COMMANDS = [
    "gen-tasklist.md",
    "gen-task-details.md",
    "audit-tasks.md",
    "prepare-task.md",
    "implement-task.md",
    "run-wave.md",
    "release-check.md",
]

HARNESS_SCHEMA_EXPECTED = "traveler-screen-route-v1"
DESIGN_PATH_MARKER_VALUE = "design-reference/D-001/DESIGN.md"
SCREEN_CONTRACT_MARKER_VALUE = "design-reference/SCREEN_ROUTE_CONTRACT.json"

results: list[tuple[str, bool, str]] = []


def check(name: str, ok: bool, detail: str = "") -> None:
    results.append((name, ok, detail))


def read_text(path: Path) -> str:
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8")


def line_contains_all(text: str, *needles: str) -> bool:
    """텍스트의 한 줄 안에 needles가 전부 들어 있는 줄이 있으면 True."""
    for line in text.splitlines():
        if all(n in line for n in needles):
            return True
    return False


def any_contains_all(*texts_and_needles: tuple[str, tuple[str, ...]]) -> bool:
    return any(line_contains_all(t, *needles) for t, needles in texts_and_needles)


def audit() -> int:
    claude_md_text = read_text(CLAUDE_MD)
    skill_md_text = read_text(SKILL_MD)
    combined = claude_md_text + "\n" + skill_md_text

    # 1. CLAUDE.md 존재
    check("1. CLAUDE.md 존재", CLAUDE_MD.exists(), str(CLAUDE_MD.relative_to(ROOT)) if not CLAUDE_MD.exists() else "")

    # 2. Claude Code Skill 파일 존재
    check(
        "2. Claude Code Skill 파일 존재(traveler-project-pipeline/SKILL.md)",
        SKILL_MD.exists(),
        str(SKILL_MD.relative_to(ROOT)),
    )

    # 3. 7개 Command 존재
    existing_commands = {p.name for p in COMMANDS_DIR.glob("*.md")} if COMMANDS_DIR.exists() else set()
    missing_commands = [c for c in EXPECTED_COMMANDS if c not in existing_commands]
    check(
        "3. 7개 Command 존재",
        len(missing_commands) == 0,
        f"누락: {missing_commands}" if missing_commands else f"확인됨: {len(EXPECTED_COMMANDS)}개",
    )

    # 4. traveler-screen-route-v1 Marker 존재(CLAUDE.md 마커 + JSON 실제 값 일치)
    marker_in_claude = f"HARNESS_SCHEMA={HARNESS_SCHEMA_EXPECTED}" in claude_md_text
    schema_in_json = None
    if SCREEN_CONTRACT.exists():
        try:
            schema_in_json = json.loads(SCREEN_CONTRACT.read_text(encoding="utf-8")).get("schema_version")
        except json.JSONDecodeError:
            schema_in_json = None
    check(
        "4. traveler-screen-route-v1 Marker 존재",
        marker_in_claude and schema_in_json == HARNESS_SCHEMA_EXPECTED,
        f"CLAUDE.md 마커={marker_in_claude}, SCREEN_ROUTE_CONTRACT.json schema_version={schema_in_json!r}",
    )

    # 5. D-001 DESIGN 경로 일치
    marker_design = f"DESIGN_PATH={DESIGN_PATH_MARKER_VALUE}" in claude_md_text
    check(
        "5. D-001 DESIGN 경로 일치",
        marker_design and DESIGN_PATH.exists(),
        f"CLAUDE.md 마커={marker_design}, 파일 존재={DESIGN_PATH.exists()}({DESIGN_PATH_MARKER_VALUE})",
    )

    # 6. Screen Contract 경로 일치
    marker_screen = f"SCREEN_CONTRACT={SCREEN_CONTRACT_MARKER_VALUE}" in claude_md_text
    check(
        "6. Screen Contract 경로 일치",
        marker_screen and SCREEN_CONTRACT.exists(),
        f"CLAUDE.md 마커={marker_screen}, 파일 존재={SCREEN_CONTRACT.exists()}({SCREEN_CONTRACT_MARKER_VALUE})",
    )

    # 7. Page Owner 5개 규칙 존재
    rule7 = any_contains_all(
        (combined, ("Page Owner", "정확히")),
        (combined, ("Page Owner", "5개")),
    )
    check("7. Page Owner 5개 규칙 존재", rule7, "CLAUDE.md·SKILL.md 어디에도 'Page Owner'와 '정확히'/'5개'가 같은 줄에 없음" if not rule7 else "")

    # 8. DB Table 6개 기본 범위 규칙 존재
    rule8 = any_contains_all(
        (combined, ("테이블", "6개")),
        (combined, ("Table", "6개")),
    )
    check("8. DB Table 6개 기본 범위 규칙 존재", rule8, "'테이블'/'Table'과 '6개'가 같은 줄에 없음" if not rule8 else "")

    # 9. 외부 입력 비저장 규칙 존재
    rule9 = ("외부 입력 비저장" in combined) or any_contains_all(
        (combined, ("항공", "숙소", "보내지 않는다")),
        (combined, ("항공", "숙소", "저장하지 않는다")),
    )
    check("9. 외부 입력 비저장 규칙 존재", rule9)

    # 10. Playwright Chromium Smoke 규칙 존재
    marker_playwright = "PLAYWRIGHT_SCOPE=chromium-smoke" in claude_md_text
    rule10_text = ("Chromium" in combined) and ("Smoke" in combined)
    check(
        "10. Playwright Chromium Smoke 규칙 존재",
        marker_playwright and rule10_text,
        f"CLAUDE.md 마커={marker_playwright}, 본문 언급={rule10_text}",
    )

    # 11. AUTO_MERGE=false
    check("11. AUTO_MERGE=false", "AUTO_MERGE=false" in claude_md_text)

    # 12. AWS_ENABLED=false
    check("12. AWS_ENABLED=false", "AWS_ENABLED=false" in claude_md_text)

    # 13. EXCLUDED 보호 규칙 존재
    rule13 = ("EXCLUDED 보호" in combined) or line_contains_all(combined, "EXCLUDED", "구현", "않는다")
    check("13. EXCLUDED 보호 규칙 존재", rule13)

    return report()


def report() -> int:
    print("=" * 72)
    print("validate_harness.py 결과")
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
    print("=" * 72)
    total = len(results)
    if failed:
        print(f"결과: FAIL ({failed}/{total} 실패). 위 파일·누락 규칙을 보완한 뒤 다시 실행하세요.")
        return 1
    print(f"VALIDATE_HARNESS_PASS ({total}/{total} 통과)")
    return 0


if __name__ == "__main__":
    sys.exit(audit())
