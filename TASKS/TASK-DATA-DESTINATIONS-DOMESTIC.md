---
task_id: DATA-DESTINATIONS-DOMESTIC
type: data
screen_id: SCR-001
page_entry: "`src/data/destinations.domestic.ts`"
requirements_covered:
  - REQ-FUNC-001
  - REQ-FUNC-004
  - REQ-FUNC-007
  - REQ-FUNC-008
  - REQ-NF-026
---

# DATA-DESTINATIONS-DOMESTIC — 국내 여행지 정적 데이터(10곳 이상)

## Context
`DATA-DESTINATIONS-DOMESTIC`(국내 여행지 정적 데이터(10곳 이상))은 SCR-001 화면의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).
범위가 축소된 Requirement가 있다 — 아래 범위를 넘지 않는다:
  - REQ-FUNC-007: IMPLEMENT(축소: alt·출처 URL만)
  - REQ-FUNC-008: IMPLEMENT(축소: 수동 검수)

## Requirement Ref
- **REQ-FUNC-001**: 시스템은 국내·해외 여행지 목록을 구분해 제공한다.
- **REQ-FUNC-004**: 시스템은 여행지 상세에 소개·명소 5개 이상·추천 시기·1일/3일 일정·예산·교통·음식 3개 이상·에티켓·출처·수정일을 표시한다.
- **REQ-FUNC-007**: 시스템은 대표 이미지에 대체텍스트·출처·작가·라이선스를 연결한다.
- **REQ-FUNC-008**: 시스템은 MVP 게시 기준 국내 10개 이상, 해외 15개국 30개 도시 이상을 검증한다.
- **REQ-NF-026**: 여행지 콘텐츠 완전성

## Screen / Route / Page Entry
- Screen: SCR-001
- Route: N/A
- Page Entry: `src/data/destinations.domestic.ts`

## Design Ref
- D-001 §9(Destination Card 구조), §17(SCR-001 최소 콘텐츠 수)
- `design-reference/UI_CONTRACT.md` 1장(SCR-001) — 영역 순서·주요 Component·상태·사용자 행동·금지 기능
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
없음(독립 Task)

## Expected Files
- 신규: 위 파일

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 소개 300자+, 명소 5개+, 1일/3일 일정, 예산/교통/음식3+/에티켓3+/출처

## Visual AC
- 이미지 alt+출처 URL 필수

## Security/Privacy AC
N/A

## Test Cases
- TC-1(Functional): 소개 300자+, 명소 5개+, 1일/3일 일정, 예산/교통/음식3+/에티켓3+/출처
- TC-2(Visual): 이미지 alt+출처 URL 필수
- TC-4(Verify 연동): RELEASE-CHECK-CONTENT-COMPLETENESS로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- RELEASE-CHECK-CONTENT-COMPLETENESS

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(RELEASE-CHECK-CONTENT-COMPLETENESS)을 실행했거나 실행 계획이 명시돼 있다.
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
