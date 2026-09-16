---
task_id: E2E-TRAVEL-TOOLS
type: test
screen_id: SCR-003
page_entry: "`tests/e2e/travelTools.spec.ts`"
depends_on:
  - PO-SCR-003
requirements_covered:
  - REQ-FUNC-014
  - REQ-FUNC-022
  - REQ-FUNC-031
browser: chromium
---

# E2E-TRAVEL-TOOLS — Playwright Chromium — 여행 준비 흐름

## Context
`E2E-TRAVEL-TOOLS`(Playwright Chromium — 여행 준비 흐름)은 SCR-003 화면의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).

## Requirement Ref
- **REQ-FUNC-014**: 시스템은 유효한 입력 후 국가·지역·출발일·귀국일 요약 단계를 표시한다.
- **REQ-FUNC-022**: 시스템은 유효한 입력 후 국가·지역·체크인·체크아웃 요약을 표시한다.
- **REQ-FUNC-031**: 시스템은 모집글에 제목, 국가, 지역, 시작일, 종료일, 모집 인원, 선호 조건, 여행 스타일, 상세 설명, 안전수칙 동의를 입력받는다.

## Screen / Route / Page Entry
- Screen: SCR-003
- Route: N/A
- Page Entry: `tests/e2e/travelTools.spec.ts`

## Design Ref
- UI_CONTRACT 3장 사용자 행동 흐름 검증
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- PO-SCR-003

## Expected Files
- 신규: 위 파일

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 항공 입력→요약→외부이동 새 탭 검증, 숙소 동일 흐름, 동행 글쓰기 폼 검증(로그인 없이 접근 시 안내)

## Visual AC
- Chromium만 사용

## Security/Privacy AC
- 네트워크 탭에서 원시 입력값 미전송 확인

## Test Cases
- TC-1(Functional): 항공 입력→요약→외부이동 새 탭 검증, 숙소 동일 흐름, 동행 글쓰기 폼 검증(로그인 없이 접근 시 안내)
- TC-2(Visual): Chromium만 사용
- TC-3(Security/Privacy): 네트워크 탭에서 원시 입력값 미전송 확인
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
