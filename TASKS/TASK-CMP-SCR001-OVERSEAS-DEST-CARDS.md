---
task_id: CMP-SCR001-OVERSEAS-DEST-CARDS
type: component
screen_id: SCR-001
route: "`/`"
page_entry: "`src/components/scr001/OverseasDestinationGrid.tsx`"
depends_on:
  - DATA-DESTINATIONS-OVERSEAS
  - SHARED-FAVORITES-STORE
requirements_covered:
  - REQ-FUNC-001
  - REQ-FUNC-002
  - REQ-FUNC-004
  - REQ-FUNC-005
  - REQ-FUNC-007
  - REQ-FUNC-009
  - REQ-FUNC-010
---

# CMP-SCR001-OVERSEAS-DEST-CARDS — 해외 여행지 카드 목록(필터 포함)

## Context
`CMP-SCR001-OVERSEAS-DEST-CARDS`(해외 여행지 카드 목록(필터 포함))은 SCR-001(`/`) 화면의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).
범위가 축소된 Requirement가 있다 — 아래 범위를 넘지 않는다:
  - REQ-FUNC-007: IMPLEMENT(축소: alt·출처 URL만)

## Requirement Ref
- **REQ-FUNC-001**: 시스템은 국내·해외 여행지 목록을 구분해 제공한다.
- **REQ-FUNC-002**: 시스템은 국가·도시·계절·테마·권장 기간 필터를 제공한다.
- **REQ-FUNC-004**: 시스템은 여행지 상세에 소개·명소 5개 이상·추천 시기·1일/3일 일정·예산·교통·음식 3개 이상·에티켓·출처·수정일을 표시한다.
- **REQ-FUNC-005**: 시스템은 필터 결과가 없으면 조건 완화 안내와 전체 초기화 버튼을 제공한다.
- **REQ-FUNC-007**: 시스템은 대표 이미지에 대체텍스트·출처·작가·라이선스를 연결한다.
- **REQ-FUNC-009**: 시스템은 같은 국가·테마의 관련 여행지를 상세 하단에 최대 6개 표시한다.
- **REQ-FUNC-010**: 시스템은 목록 필터 상태를 URL query에 반영해 새로고침·공유 시 복원한다.

## Screen / Route / Page Entry
- Screen: SCR-001
- Route: `/`
- Page Entry: `src/components/scr001/OverseasDestinationGrid.tsx`

## Design Ref
- D-001 §8(Search·Filter), §9(Destination Card)
- `design-reference/UI_CONTRACT.md` 1장(SCR-001) — 영역 순서·주요 Component·상태·사용자 행동·금지 기능
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- DATA-DESTINATIONS-OVERSEAS
- SHARED-FAVORITES-STORE

## Expected Files
- 신규: 위 파일

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 위와 동일, 카드 최소 6개

## Visual AC
- 동일

## Security/Privacy AC
N/A

## Test Cases
- TC-1(Functional): 위와 동일, 카드 최소 6개
- TC-2(Visual): 동일
- TC-4(Verify 연동): E2E-PUBLIC-SMOKE로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- E2E-PUBLIC-SMOKE

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(E2E-PUBLIC-SMOKE)을 실행했거나 실행 계획이 명시돼 있다.
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
