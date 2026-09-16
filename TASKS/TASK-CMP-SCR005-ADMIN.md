---
task_id: CMP-SCR005-ADMIN
type: component
screen_id: SCR-005
route: "`/account`"
page_entry: "`src/components/scr005/AdminTabs.tsx`"
depends_on:
  - API-ADMIN-ROUTES
requirements_covered:
  - REQ-FUNC-041
  - REQ-FUNC-042
  - REQ-FUNC-062
  - REQ-FUNC-077
---

# CMP-SCR005-ADMIN — 관리자(신고 상태 변경+외부 URL 설정)

## Context
`CMP-SCR005-ADMIN`(관리자(신고 상태 변경+외부 URL 설정))은 SCR-005(`/account`) 화면의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).
범위가 축소된 Requirement가 있다 — 아래 범위를 넘지 않는다:
  - REQ-FUNC-041: IMPLEMENT(축소: 상태별 필터 목록만, 우선순위·증거첨부 제외)
  - REQ-FUNC-042: IMPLEMENT(축소: 신고 상태 변경만, 세부 제재 로그 제외)

## Requirement Ref
- **REQ-FUNC-041**: 시스템은 Moderator에게 신고 우선순위·상태·대상·증거·접수 시각 큐를 제공한다.
- **REQ-FUNC-042**: 시스템은 Moderator가 경고, 콘텐츠 숨김, 계정 일시 제한, 신고 기각 조치를 기록하게 한다.
- **REQ-FUNC-062**: 시스템은 관리자 설정 기반 문의·SNS 링크를 제공한다.
- **REQ-FUNC-077**: 시스템은 Admin이 항공·호텔 외부 URL을 허용목록 내 HTTPS 주소로 설정하게 한다.

## Screen / Route / Page Entry
- Screen: SCR-005
- Route: `/account`
- Page Entry: `src/components/scr005/AdminTabs.tsx`

## Design Ref
- D-001 §14(Dashboard·통계 차트 금지), UI_CONTRACT 5장 금지 기능
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- API-ADMIN-ROUTES

## Expected Files
- 신규: 위 파일

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 신고 목록 상태 필터+변경, 항공/숙소 외부 URL HTTPS 설정, 문의·SNS 링크 설정

## Visual AC
- 통계 차트·Dashboard 없음

## Security/Privacy AC
- Moderator/Admin 권한 없는 계정엔 탭 자체 미렌더링

## Test Cases
- TC-1(Functional): 신고 목록 상태 필터+변경, 항공/숙소 외부 URL HTTPS 설정, 문의·SNS 링크 설정
- TC-2(Visual): 통계 차트·Dashboard 없음
- TC-3(Security/Privacy): Moderator/Admin 권한 없는 계정엔 탭 자체 미렌더링
- TC-4(Verify 연동): TEST-RLS-BASIC, E2E-MATE-AUTH로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- TEST-RLS-BASIC, E2E-MATE-AUTH

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(TEST-RLS-BASIC, E2E-MATE-AUTH)을 실행했거나 실행 계획이 명시돼 있다.
- [ ] Forbidden 절의 모든 항목을 위반하지 않았다.

## Forbidden
- 통계 차트·Dashboard를 만들지 않는다 — 신고 상태 변경과 외부 URL 설정 2개 탭으로 범위를 한정한다.
- Expected Files 절에 나열되지 않은 파일은 신규 생성·수정하지 않는다(범위 밖 수정 금지).
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI를 만들지 않는다(D-001 §19 Do Not).
- 이 문서(D-001/DESIGN.md)에 없는 임의의 색상·radius·spacing 값을 새로 만들지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구와 빈 카드(CTA 없는 Empty)를 만들지 않는다.
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- docs/PROJECT_SCOPE.md에서 EXCLUDED로 분류된 Requirement를 이 Task 범위에서 구현하지 않는다.
- 구현 코드·Branch·Commit을 이 Task 파일 작성 과정에서 만들지 않는다(이 문서는 계획서다).
