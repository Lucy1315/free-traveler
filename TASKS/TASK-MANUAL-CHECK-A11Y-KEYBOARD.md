---
task_id: MANUAL-CHECK-A11Y-KEYBOARD
type: manual_check
page_entry: "N/A(체크리스트 문서)"
depends_on:
  - SHARED-UI-KIT-PRIMITIVES
requirements_covered:
  - REQ-FUNC-079
  - REQ-NF-023
  - REQ-NF-025
---

# MANUAL-CHECK-A11Y-KEYBOARD — 접근성·키보드 수동 확인

## Context
`MANUAL-CHECK-A11Y-KEYBOARD`(접근성·키보드 수동 확인)은 ALL(5) 영역의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).
범위가 축소된 Requirement가 있다 — 아래 범위를 넘지 않는다:
  - REQ-FUNC-079: IMPLEMENT(축소: 자동 검사 도구 없이 코딩 기준으로 적용)
  - REQ-NF-025: IMPLEMENT(축소: Playwright 핵심 흐름만)

## Requirement Ref
- **REQ-FUNC-079**: 시스템은 폼·모달·탭·알림에 올바른 HTML 의미와 ARIA 상태를 제공한다.
- **REQ-NF-023**: WCAG 2.2 준수 목표
- **REQ-NF-025**: 키보드·스크린리더 수동 검사

## Screen / Route / Page Entry
- Screen: ALL(5)
- Route: N/A
- Page Entry: N/A(체크리스트 문서)

## Design Ref
- D-001 §15(44px 터치 영역, 2px focus ring)
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- SHARED-UI-KIT-PRIMITIVES

## Expected Files
- 신규 코드 파일 없음(문서화·체크리스트 산출물)

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 5개 핵심 흐름 키보드만으로 완료 가능 여부 확인

## Visual AC
- 44px 터치 영역, 2px focus ring

## Security/Privacy AC
N/A

## Test Cases
- TC-1(Functional): 5개 핵심 흐름 키보드만으로 완료 가능 여부 확인
- TC-2(Visual): 44px 터치 영역, 2px focus ring
- TC-4(Verify 연동): 수동 QA 체크리스트로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- 수동 QA 체크리스트

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(수동 QA 체크리스트)을 실행했거나 실행 계획이 명시돼 있다.
- [ ] Forbidden 절의 모든 항목을 위반하지 않았다.

## Forbidden
- Expected Files 절에 나열되지 않은 파일은 신규 생성·수정하지 않는다(범위 밖 수정 금지).
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI를 만들지 않는다(D-001 §19 Do Not).
- 이 문서(D-001/DESIGN.md)에 없는 임의의 색상·radius·spacing 값을 새로 만들지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구와 빈 카드(CTA 없는 Empty)를 만들지 않는다.
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- docs/PROJECT_SCOPE.md에서 EXCLUDED로 분류된 Requirement를 이 Task 범위에서 구현하지 않는다.
- 구현 코드·Branch·Commit을 이 Task 파일 작성 과정에서 만들지 않는다(이 문서는 계획서다).
