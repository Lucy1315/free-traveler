---
task_id: CMP-SCR001-DEST-DETAIL-DRAWER
type: component
screen_id: SCR-001
route: "`/`"
page_entry: "`src/components/scr001/DestinationDetailDrawer.tsx`"
depends_on:
  - DATA-DESTINATIONS-DOMESTIC
  - DATA-DESTINATIONS-OVERSEAS
  - DATA-COUNTRY-SAFETY
  - SHARED-EXTERNAL-LINK-GUARD
requirements_covered:
  - REQ-FUNC-006
  - REQ-FUNC-009
  - REQ-FUNC-046
  - REQ-FUNC-047
  - REQ-FUNC-048
  - REQ-FUNC-049
  - REQ-FUNC-052
  - REQ-FUNC-053
  - REQ-FUNC-054
---

# CMP-SCR001-DEST-DETAIL-DRAWER — 여행지 상세+안전정보 Drawer

## Context
`CMP-SCR001-DEST-DETAIL-DRAWER`(여행지 상세+안전정보 Drawer)은 SCR-001(`/`) 화면의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).

## Requirement Ref
- **REQ-FUNC-006**: 시스템은 해외 여행지 상세에서 해당 국가의 안전 페이지를 연결한다.
- **REQ-FUNC-009**: 시스템은 같은 국가·테마의 관련 여행지를 상세 하단에 최대 6개 표시한다.
- **REQ-FUNC-046**: 시스템은 게시된 모든 해외 국가에 하나 이상의 공개 안전 페이지를 요구한다.
- **REQ-FUNC-047**: 시스템은 치안, 흔한 사기, 현지 법규, 교통, 재난·기후, 보건, 문화·복장, 긴급연락처 섹션을 제공한다.
- **REQ-FUNC-048**: 시스템은 각 안전 페이지에 공식 출처명·URL·최종 확인일·편집자를 기록한다.
- **REQ-FUNC-049**: 시스템은 외교부 해외안전여행 원문 링크를 새 탭으로 제공한다.
- **REQ-FUNC-052**: 시스템은 국가 전체 경보와 특정 지역 경보를 별도 범위로 모델링한다.
- **REQ-FUNC-053**: 시스템은 현지 긴급전화와 대한민국 재외공관 또는 영사콜센터 연결 정보를 표시한다.
- **REQ-FUNC-054**: 시스템은 안전정보가 공식 판단을 대체하지 않으며 출국 직전 원문 재확인이 필요함을 고지한다.

## Screen / Route / Page Entry
- Screen: SCR-001
- Route: `/`
- Page Entry: `src/components/scr001/DestinationDetailDrawer.tsx`

## Design Ref
- D-001 §12(Drawer·Modal — Desktop 우측 슬라이드/Mobile 바텀시트)
- `design-reference/UI_CONTRACT.md` 1장(SCR-001) — 영역 순서·주요 Component·상태·사용자 행동·금지 기능
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- DATA-DESTINATIONS-DOMESTIC
- DATA-DESTINATIONS-OVERSEAS
- DATA-COUNTRY-SAFETY
- SHARED-EXTERNAL-LINK-GUARD

## Expected Files
- 신규: 위 파일

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 상세정보/안전정보 2탭, 관련 여행지 4~6개, 외교부 링크, "공식 판단 대체 아님" 고지

## Visual AC
- Desktop 우측 슬라이드/Mobile 하단 시트, 스크림+포커스 트랩

## Security/Privacy AC
N/A

## Test Cases
- TC-1(Functional): 상세정보/안전정보 2탭, 관련 여행지 4~6개, 외교부 링크, "공식 판단 대체 아님" 고지
- TC-2(Visual): Desktop 우측 슬라이드/Mobile 하단 시트, 스크림+포커스 트랩
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
