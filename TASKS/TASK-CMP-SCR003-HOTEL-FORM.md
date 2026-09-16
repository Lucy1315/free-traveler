---
task_id: CMP-SCR003-HOTEL-FORM
type: component
screen_id: SCR-003
route: "`/travel-tools`"
page_entry: "`src/components/scr003/HotelForm.tsx`"
depends_on:
  - CMP-SCR003-INTRO-TABS-SHELL
  - SHARED-EXTERNAL-LINK-GUARD
requirements_covered:
  - REQ-FUNC-019
  - REQ-FUNC-020
  - REQ-FUNC-021
  - REQ-FUNC-022
  - REQ-FUNC-023
  - REQ-FUNC-024
  - REQ-FUNC-025
  - REQ-FUNC-026
  - REQ-NF-017
---

# CMP-SCR003-HOTEL-FORM — 숙소 조건 입력·요약·외부이동

## Context
`CMP-SCR003-HOTEL-FORM`(숙소 조건 입력·요약·외부이동)은 SCR-003(`/travel-tools`) 화면의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).

## Requirement Ref
- **REQ-FUNC-019**: 시스템은 호텔 폼에 숙박 국가, 지역·도시, 체크인, 체크아웃을 필수 입력으로 제공한다.
- **REQ-FUNC-020**: 시스템은 선택 국가에 속하는 지역·도시만 선택 가능하게 한다.
- **REQ-FUNC-021**: 시스템은 체크인이 오늘 이전이거나 체크아웃이 체크인과 같거나 빠르면 진행을 차단한다.
- **REQ-FUNC-022**: 시스템은 유효한 입력 후 국가·지역·체크인·체크아웃 요약을 표시한다.
- **REQ-FUNC-023**: 시스템은 폼과 요약에 입력값 비전달 안내를 표시한다.
- **REQ-FUNC-024**: 시스템은 설정된 호텔 일반 URL을 새 탭으로 열고 `noopener,noreferrer`를 적용한다.
- **REQ-FUNC-025**: 시스템은 호텔 입력값을 서버 DB, 서버 로그, 분석 이벤트에 저장하지 않는다.
- **REQ-FUNC-026**: 시스템은 호텔 URL 오류 시 이동을 차단하고 재시도와 운영 오류 로그를 제공한다.
- **REQ-NF-017**: 항공·호텔 원시 입력값을 서버·분석에 보존하지 않는다.

## Screen / Route / Page Entry
- Screen: SCR-003
- Route: `/travel-tools`
- Page Entry: `src/components/scr003/HotelForm.tsx`

## Design Ref
- D-001 §10(Form), §19(Do Not — 쿼리 파라미터 금지)
- `design-reference/UI_CONTRACT.md` 3장(SCR-003) — 영역 순서·주요 Component·상태·사용자 행동·금지 기능
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- CMP-SCR003-INTRO-TABS-SHELL
- SHARED-EXTERNAL-LINK-GUARD

## Expected Files
- 신규: 위 파일

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 국가/지역/체크인/체크아웃 검증, 요약, 외부이동

## Visual AC
- 비전달 고지 문구 고정 노출

## Security/Privacy AC
- 서버 DB·로그·분석 미저장

## Test Cases
- TC-1(Functional): 국가/지역/체크인/체크아웃 검증, 요약, 외부이동
- TC-2(Visual): 비전달 고지 문구 고정 노출
- TC-3(Security/Privacy): 서버 DB·로그·분석 미저장
- TC-4(Verify 연동): UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(UNIT-TRAVEL-DATES, E2E-TRAVEL-TOOLS)을 실행했거나 실행 계획이 명시돼 있다.
- [ ] Forbidden 절의 모든 항목을 위반하지 않았다.

## Forbidden
- 항공·숙소 입력값을 서버 DB·서버 로그·분석 이벤트에 저장하지 않는다(REQ-FUNC-017/025, NF-017).
- 외부 이동 URL에 목적지·날짜 등 입력값을 쿼리 파라미터로 첨부하지 않는다.
- Expected Files 절에 나열되지 않은 파일은 신규 생성·수정하지 않는다(범위 밖 수정 금지).
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI를 만들지 않는다(D-001 §19 Do Not).
- 이 문서(D-001/DESIGN.md)에 없는 임의의 색상·radius·spacing 값을 새로 만들지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구와 빈 카드(CTA 없는 Empty)를 만들지 않는다.
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- docs/PROJECT_SCOPE.md에서 EXCLUDED로 분류된 Requirement를 이 Task 범위에서 구현하지 않는다.
- 구현 코드·Branch·Commit을 이 Task 파일 작성 과정에서 만들지 않는다(이 문서는 계획서다).
