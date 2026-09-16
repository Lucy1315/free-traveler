---
task_id: CMP-SCR004-CARD-GRID
type: component
screen_id: SCR-004
route: "`/mates`"
page_entry: "`src/components/scr004/MateCardGrid.tsx`"
depends_on:
  - API-MATES-ROUTES
  - CMP-SCR004-FILTER-SUMMARY
requirements_covered:
  - REQ-FUNC-033
  - REQ-FUNC-037
---

# CMP-SCR004-CARD-GRID — 동행글 Card Grid(최대 8개)

## Context
`CMP-SCR004-CARD-GRID`(동행글 Card Grid(최대 8개))은 SCR-004(`/mates`) 화면의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).

## Requirement Ref
- **REQ-FUNC-033**: 시스템은 모집글 작성자·상태·조건·설명을 표시하되 이메일과 외부 연락처를 노출하지 않는다.
- **REQ-FUNC-037**: 시스템은 여행 종료일 다음 날 모집글을 CLOSED로 자동 전환한다.

## Screen / Route / Page Entry
- Screen: SCR-004
- Route: `/mates`
- Page Entry: `src/components/scr004/MateCardGrid.tsx`

## Design Ref
- D-001 §11(Mate Post Card, 최대 8개)
- `design-reference/UI_CONTRACT.md` 4장(SCR-004) — 영역 순서·주요 Component·상태·사용자 행동·금지 기능
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- API-MATES-ROUTES
- CMP-SCR004-FILTER-SUMMARY

## Expected Files
- 신규: 위 파일

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 데이터 있으면 카드 최대 8개, 모집중/마감 상태는 조회 시 종료일 계산, 0건 시 완성형 Empty(필터 초기화+작성 CTA+이용 방법)

## Visual AC
- 상태 배지 텍스트 라벨 병기, 가격·별점 없음

## Security/Privacy AC
- 연락처 미노출

## Test Cases
- TC-1(Functional): 데이터 있으면 카드 최대 8개, 모집중/마감 상태는 조회 시 종료일 계산, 0건 시 완성형 Empty(필터 초기화+작성 CTA+이용 방법)
- TC-2(Visual): 상태 배지 텍스트 라벨 병기, 가격·별점 없음
- TC-3(Security/Privacy): 연락처 미노출
- TC-4(Verify 연동): E2E-PUBLIC-SMOKE로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- E2E-PUBLIC-SMOKE

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(E2E-PUBLIC-SMOKE)을 실행했거나 실행 계획이 명시돼 있다.
- [ ] Forbidden 절의 모든 항목을 위반하지 않았다.

## Forbidden
- 모집글 작성자의 이메일·전화번호 등 연락처를 카드·상세 어디에도 노출하지 않는다.
- Expected Files 절에 나열되지 않은 파일은 신규 생성·수정하지 않는다(범위 밖 수정 금지).
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI를 만들지 않는다(D-001 §19 Do Not).
- 이 문서(D-001/DESIGN.md)에 없는 임의의 색상·radius·spacing 값을 새로 만들지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구와 빈 카드(CTA 없는 Empty)를 만들지 않는다.
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- docs/PROJECT_SCOPE.md에서 EXCLUDED로 분류된 Requirement를 이 Task 범위에서 구현하지 않는다.
- 구현 코드·Branch·Commit을 이 Task 파일 작성 과정에서 만들지 않는다(이 문서는 계획서다).
