---
task_id: E2E-PUBLIC-SMOKE
type: test
page_entry: "`tests/e2e/publicSmoke.spec.ts`"
depends_on:
  - PO-SCR-001
  - PO-SCR-002
  - PO-SCR-004
requirements_covered:
  - REQ-NF-025
browser: chromium
---

# E2E-PUBLIC-SMOKE — Playwright Chromium — 공개 흐름 Smoke

## Context
`E2E-PUBLIC-SMOKE`(Playwright Chromium — 공개 흐름 Smoke)은 SCR-001,002,004 영역의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).
범위가 축소된 Requirement가 있다 — 아래 범위를 넘지 않는다:
  - REQ-NF-025: IMPLEMENT(축소: Playwright 핵심 흐름만)

## Requirement Ref
- **REQ-NF-025**: 키보드·스크린리더 수동 검사

## Screen / Route / Page Entry
- Screen: SCR-001,002,004
- Route: N/A
- Page Entry: `tests/e2e/publicSmoke.spec.ts`

## Design Ref
- UI_CONTRACT 1·2·4장 사용자 행동 흐름 검증
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- PO-SCR-001
- PO-SCR-002
- PO-SCR-004

## Expected Files
- 신규: 위 파일

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 홈 로드→여행지 상세 Drawer→안전정보 탭 전환, About 로드, 동행 목록 로드(비로그인) — 키보드 탐색 포함

## Visual AC
- Chromium만 사용

## Security/Privacy AC
N/A

## Test Cases
- TC-1(Functional): 홈 로드→여행지 상세 Drawer→안전정보 탭 전환, About 로드, 동행 목록 로드(비로그인) — 키보드 탐색 포함
- TC-2(Visual): Chromium만 사용
- TC-4(Verify 연동): 수동 실행 결과 확인으로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- 수동 실행 결과 확인

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(수동 실행 결과 확인)을 실행했거나 실행 계획이 명시돼 있다.
- [ ] Forbidden 절의 모든 항목을 위반하지 않았다.

## Forbidden
- Chromium 이외의 브라우저 엔진은 사용하지 않는다 — Playwright 설정은 Chromium 프로젝트만 유지한다.
- Expected Files 절에 나열되지 않은 파일은 신규 생성·수정하지 않는다(범위 밖 수정 금지).
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI를 만들지 않는다(D-001 §19 Do Not).
- 이 문서(D-001/DESIGN.md)에 없는 임의의 색상·radius·spacing 값을 새로 만들지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구와 빈 카드(CTA 없는 Empty)를 만들지 않는다.
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- docs/PROJECT_SCOPE.md에서 EXCLUDED로 분류된 Requirement를 이 Task 범위에서 구현하지 않는다.
- 구현 코드·Branch·Commit을 이 Task 파일 작성 과정에서 만들지 않는다(이 문서는 계획서다).
