---
task_id: PO-SCR-003
type: page_owner
screen_id: SCR-003
route: "`/travel-tools`"
page_entry: "`src/app/travel-tools/page.tsx`"
depends_on:
  - SHARED-LAYOUT-HEADER-FOOTER
  - CMP-SCR003-INTRO-TABS-SHELL
  - CMP-SCR003-FLIGHT-FORM
  - CMP-SCR003-HOTEL-FORM
  - CMP-SCR003-MATE-WRITE-FORM
  - CMP-SCR003-TIPS-SAFETY-CTA
requirements_covered:
  - REQ-FUNC-011
  - REQ-FUNC-012
  - REQ-FUNC-013
  - REQ-FUNC-014
  - REQ-FUNC-015
  - REQ-FUNC-016
  - REQ-FUNC-017
  - REQ-FUNC-018
  - REQ-FUNC-019
  - REQ-FUNC-020
  - REQ-FUNC-021
  - REQ-FUNC-022
  - REQ-FUNC-023
  - REQ-FUNC-024
  - REQ-FUNC-025
  - REQ-FUNC-026
  - REQ-FUNC-027
  - REQ-FUNC-031
  - REQ-FUNC-032
  - REQ-FUNC-054
  - REQ-FUNC-080
---

# PO-SCR-003 — SCR-003 통합 여행 준비 Page Owner

## Context
`PO-SCR-003`(SCR-003 통합 여행 준비 Page Owner)은 SCR-003(`/travel-tools`) 화면의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).

## Requirement Ref
- **REQ-FUNC-011**: 시스템은 항공 폼에 목적 국가, 지역·도시, 출발일, 귀국일을 필수 입력으로 제공한다.
- **REQ-FUNC-012**: 시스템은 선택 국가에 속하는 지역·도시만 선택 가능하게 한다.
- **REQ-FUNC-013**: 시스템은 출발일이 오늘 이전이거나 귀국일이 출발일보다 빠르면 진행을 차단한다.
- **REQ-FUNC-014**: 시스템은 유효한 입력 후 국가·지역·출발일·귀국일 요약 단계를 표시한다.
- **REQ-FUNC-015**: 시스템은 폼과 요약에 "입력값은 외부 사이트로 전달되지 않습니다"를 표시한다.
- **REQ-FUNC-016**: 시스템은 외부 이동 시 설정된 항공 일반 URL을 새 탭으로 열고 `noopener,noreferrer`를 적용한다.
- **REQ-FUNC-017**: 시스템은 항공 입력값을 서버 DB, 서버 로그, 분석 이벤트에 저장하지 않는다.
- **REQ-FUNC-018**: 시스템은 외부 URL이 없거나 허용목록 밖이면 이동을 차단하고 오류와 재시도를 제공한다.
- **REQ-FUNC-019**: 시스템은 호텔 폼에 숙박 국가, 지역·도시, 체크인, 체크아웃을 필수 입력으로 제공한다.
- **REQ-FUNC-020**: 시스템은 선택 국가에 속하는 지역·도시만 선택 가능하게 한다.
- **REQ-FUNC-021**: 시스템은 체크인이 오늘 이전이거나 체크아웃이 체크인과 같거나 빠르면 진행을 차단한다.
- **REQ-FUNC-022**: 시스템은 유효한 입력 후 국가·지역·체크인·체크아웃 요약을 표시한다.
- **REQ-FUNC-023**: 시스템은 폼과 요약에 입력값 비전달 안내를 표시한다.
- **REQ-FUNC-024**: 시스템은 설정된 호텔 일반 URL을 새 탭으로 열고 `noopener,noreferrer`를 적용한다.
- **REQ-FUNC-025**: 시스템은 호텔 입력값을 서버 DB, 서버 로그, 분석 이벤트에 저장하지 않는다.
- **REQ-FUNC-026**: 시스템은 호텔 URL 오류 시 이동을 차단하고 재시도와 운영 오류 로그를 제공한다.
- **REQ-FUNC-027**: 시스템은 동행 쓰기 작업에 이메일 인증 세션을 요구한다.
- **REQ-FUNC-031**: 시스템은 모집글에 제목, 국가, 지역, 시작일, 종료일, 모집 인원, 선호 조건, 여행 스타일, 상세 설명, 안전수칙 동의를 입력받는다.
- **REQ-FUNC-032**: 시스템은 본문에서 전화번호·이메일·일반 메신저 ID 패턴을 탐지해 제출을 차단한다.
- **REQ-FUNC-054**: 시스템은 안전정보가 공식 판단을 대체하지 않으며 출국 직전 원문 재확인이 필요함을 고지한다.
- **REQ-FUNC-080**: 시스템은 이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책 안내를 제공하고 동행 글 작성 시 안전수칙 동의를 기록한다.

## Screen / Route / Page Entry
- Screen: SCR-003
- Route: `/travel-tools`
- Page Entry: `src/app/travel-tools/page.tsx`

## Design Ref
- D-001 §10(탭별 입력→검증→완료 상태 분리), §17(SCR-003 6 Section 순서), UI_CONTRACT 3장
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- SHARED-LAYOUT-HEADER-FOOTER
- CMP-SCR003-INTRO-TABS-SHELL
- CMP-SCR003-FLIGHT-FORM
- CMP-SCR003-HOTEL-FORM
- CMP-SCR003-MATE-WRITE-FORM
- CMP-SCR003-TIPS-SAFETY-CTA

## Expected Files
- 신규: `src/app/travel-tools/page.tsx`

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- **항공·숙소·동행 글쓰기 3개 탭을 실제로 조립**(단순 나열 금지, 탭 전환+상태 분리 연결). Section 순서: Intro(미리보기3) → 탭+Form → 요약·비전달고지·외부이동 → Tip3 → 로그인안내/동행Form → 안전CTA. 탭별 입력→검증→완료 상태를 서로 분리

## Visual AC
- Desktop 1200~1280px, 여백 64~96px/40~64px, 탭바 Mobile 가로스크롤
- **Loading**: 동행 글쓰기 탭의 로그인 상태·이력 조회 등 비동기 구간은 D-001 §14 기준 스켈레톤으로 표시한다. 항공·숙소 입력 폼은 Client 일시 상태만 쓰는 로컬 입력이라 비동기 Loading이 없다.

## Security/Privacy AC
- Placeholder 금지, 동행 탭 0건 이력이어도 안내+CTA 완성형, 항공·호텔 값 서버 미전송

## Test Cases
- TC-1(Functional): **항공·숙소·동행 글쓰기 3개 탭을 실제로 조립**(단순 나열 금지, 탭 전환+상태 분리 연결). Section 순서: Intro(미리보기3) → 탭+Form → 요약·비전달고지·외부이동 → Tip3 → 로그인안내/동행Form → 안전CTA. 탭별 입력→검증→완료 상태를 서로 분리
- TC-2(Visual): Desktop 1200~1280px, 여백 64~96px/40~64px, 탭바 Mobile 가로스크롤
- TC-3(Security/Privacy): Placeholder 금지, 동행 탭 0건 이력이어도 안내+CTA 완성형, 항공·호텔 값 서버 미전송
- TC-4(Verify 연동): E2E-TRAVEL-TOOLS로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- E2E-TRAVEL-TOOLS

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(E2E-TRAVEL-TOOLS)을 실행했거나 실행 계획이 명시돼 있다.
- [ ] Forbidden 절의 모든 항목을 위반하지 않았다.
- [ ] 항공·숙소·동행 글쓰기 3개 탭이 실제로 조립되어 탭 전환과 상태 분리가 동작한다(단순 나열 아님).

## Forbidden
- 새 Component 파일을 직접 만들지 않는다 — 이 Task는 Depends On의 CMP-* Task 산출물을 Route Page로 조립하는 범위로 한정한다.
- Expected Files 절에 나열되지 않은 파일은 신규 생성·수정하지 않는다(범위 밖 수정 금지).
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI를 만들지 않는다(D-001 §19 Do Not).
- 이 문서(D-001/DESIGN.md)에 없는 임의의 색상·radius·spacing 값을 새로 만들지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구와 빈 카드(CTA 없는 Empty)를 만들지 않는다.
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- docs/PROJECT_SCOPE.md에서 EXCLUDED로 분류된 Requirement를 이 Task 범위에서 구현하지 않는다.
- 구현 코드·Branch·Commit을 이 Task 파일 작성 과정에서 만들지 않는다(이 문서는 계획서다).
