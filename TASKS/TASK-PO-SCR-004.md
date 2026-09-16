---
task_id: PO-SCR-004
type: page_owner
screen_id: SCR-004
route: "`/mates`"
page_entry: "`src/app/mates/page.tsx`"
depends_on:
  - SHARED-LAYOUT-HEADER-FOOTER
  - CMP-SCR004-INTRO-CTA
  - CMP-SCR004-FILTER-SUMMARY
  - CMP-SCR004-CARD-GRID
  - CMP-SCR004-DETAIL-PANEL
  - CMP-SCR004-PARTICIPATION-REQUEST
  - CMP-SCR004-REPORT-BLOCK-ACTIONS
requirements_covered:
  - REQ-FUNC-030
  - REQ-FUNC-033
  - REQ-FUNC-034
  - REQ-FUNC-035
  - REQ-FUNC-037
  - REQ-FUNC-039
  - REQ-FUNC-040
  - REQ-NF-019
---

# PO-SCR-004 — SCR-004 동행 조회 Page Owner

## Context
`PO-SCR-004`(SCR-004 동행 조회 Page Owner)은 SCR-004(`/mates`) 화면의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).

## Requirement Ref
- **REQ-FUNC-030**: 시스템은 국가·지역·여행 기간 겹침·연령대·성별·여행 스타일·모집 상태로 동행글을 필터한다.
- **REQ-FUNC-033**: 시스템은 모집글 작성자·상태·조건·설명을 표시하되 이메일과 외부 연락처를 노출하지 않는다.
- **REQ-FUNC-034**: 시스템은 모집중 글에 최대 500자의 참가 메시지를 비공개로 제출하게 한다.
- **REQ-FUNC-035**: 시스템은 동일 사용자의 동일 글 중복 PENDING·ACCEPTED 요청을 차단한다.
- **REQ-FUNC-037**: 시스템은 여행 종료일 다음 날 모집글을 CLOSED로 자동 전환한다.
- **REQ-FUNC-039**: 시스템은 글·사용자·참가 요청을 사유 코드와 설명으로 신고하게 한다.
- **REQ-FUNC-040**: 시스템은 사용자가 다른 사용자를 차단·해제하게 한다.
- **REQ-NF-019**: 신고 접수 응답

## Screen / Route / Page Entry
- Screen: SCR-004
- Route: `/mates`
- Page Entry: `src/app/mates/page.tsx`

## Design Ref
- D-001 §17(SCR-004 6 Section 순서), UI_CONTRACT 4장
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- SHARED-LAYOUT-HEADER-FOOTER
- CMP-SCR004-INTRO-CTA
- CMP-SCR004-FILTER-SUMMARY
- CMP-SCR004-CARD-GRID
- CMP-SCR004-DETAIL-PANEL
- CMP-SCR004-PARTICIPATION-REQUEST
- CMP-SCR004-REPORT-BLOCK-ACTIONS

## Expected Files
- 신규: `src/app/mates/page.tsx`

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 목록·필터·상세·참가·신고·차단을 각 Component로 분리 후 조립. Section 순서: Intro+CTA → Filter+요약 → Card Grid(8) → 목록+상세 분할/Drawer → 3단계 안내 → 안전·신고·차단 CTA

## Visual AC
- Desktop 1200~1280px, Card 3~4열/Mobile 1열
- **Loading**: Card Grid·상세 Drawer 비동기 조회 중에는 D-001 §14 기준 스켈레톤(회색 블록, 은은한 애니메이션)만 표시한다. 실데이터처럼 보이는 가짜 텍스트를 채우지 않는다.

## Security/Privacy AC
- 목록 0건이어도 안내+이용방법+CTA 완성형 Empty, Placeholder 금지, 연락처 비노출, 신고/차단 정상 동작

## Test Cases
- TC-1(Functional): 목록·필터·상세·참가·신고·차단을 각 Component로 분리 후 조립. Section 순서: Intro+CTA → Filter+요약 → Card Grid(8) → 목록+상세 분할/Drawer → 3단계 안내 → 안전·신고·차단 CTA
- TC-2(Visual): Desktop 1200~1280px, Card 3~4열/Mobile 1열
- TC-3(Security/Privacy): 목록 0건이어도 안내+이용방법+CTA 완성형 Empty, Placeholder 금지, 연락처 비노출, 신고/차단 정상 동작
- TC-4(Verify 연동): E2E-MATE-AUTH로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- E2E-MATE-AUTH

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(E2E-MATE-AUTH)을 실행했거나 실행 계획이 명시돼 있다.
- [ ] Forbidden 절의 모든 항목을 위반하지 않았다.

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
