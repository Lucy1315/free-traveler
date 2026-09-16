---
task_id: PO-SCR-002
type: page_owner
screen_id: SCR-002
route: "`/about`"
page_entry: "`src/app/about/page.tsx`"
depends_on:
  - SHARED-LAYOUT-HEADER-FOOTER
  - CMP-SCR002-HERO-STATS
  - CMP-SCR002-RECOMMENDED-GRID
  - CMP-SCR002-COUNTRY-CHIPS
  - CMP-SCR002-TIMELINE
  - CMP-SCR002-GALLERY
  - CMP-SCR002-PHILOSOPHY-CHECKLIST
requirements_covered:
  - REQ-FUNC-057
  - REQ-FUNC-058
  - REQ-FUNC-059
  - REQ-FUNC-060
  - REQ-FUNC-061
  - REQ-FUNC-062
  - REQ-FUNC-063
---

# PO-SCR-002 — SCR-002 대표 소개 Page Owner

## Context
`PO-SCR-002`(SCR-002 대표 소개 Page Owner)은 SCR-002(`/about`) 화면의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).
범위가 축소된 Requirement가 있다 — 아래 범위를 넘지 않는다:
  - REQ-FUNC-061: IMPLEMENT(축소: alt·출처 URL만)

## Requirement Ref
- **REQ-FUNC-057**: 시스템은 대표명 `free_traveler`, `50+ Trips`, `30+ Countries`를 표시한다.
- **REQ-FUNC-058**: 시스템은 대표 소개문·여행 철학·콘텐츠 편집 원칙을 표시한다.
- **REQ-FUNC-059**: 시스템은 방문 권역 지도 또는 30개국 이상의 국가 목록을 제공한다.
- **REQ-FUNC-060**: 시스템은 대표 여행 타임라인과 대표 여행 기록을 제공한다.
- **REQ-FUNC-061**: 시스템은 대표 이미지에 대체텍스트·출처·작가·라이선스 URL을 제공한다.
- **REQ-FUNC-062**: 시스템은 관리자 설정 기반 문의·SNS 링크를 제공한다.
- **REQ-FUNC-063**: 시스템은 대표 추천 여행지 6개를 공개 여행지 상세로 연결한다.

## Screen / Route / Page Entry
- Screen: SCR-002
- Route: `/about`
- Page Entry: `src/app/about/page.tsx`

## Design Ref
- D-001 §17(SCR-002 7 Section 순서·최소 콘텐츠), UI_CONTRACT 2장
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- SHARED-LAYOUT-HEADER-FOOTER
- CMP-SCR002-HERO-STATS
- CMP-SCR002-RECOMMENDED-GRID
- CMP-SCR002-COUNTRY-CHIPS
- CMP-SCR002-TIMELINE
- CMP-SCR002-GALLERY
- CMP-SCR002-PHILOSOPHY-CHECKLIST

## Expected Files
- 신규: `src/app/about/page.tsx`

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- Section 순서 고정: Hero+수치 → 추천 여행지 6 → 방문국가 Chip 30+ → 타임라인 3+ → Gallery 8 → 철학 좌우분할 → 체크리스트3단계+CTA. 데이터 출처: 전량 DATA-ABOUT-PROFILE

## Visual AC
- Desktop 1200~1280px, 여백 64~96px/40~64px
- **Loading**: 전 Section이 DATA-ABOUT-PROFILE 정적 데이터로 즉시 렌더링되며 비동기 조회가 없으므로 Loading 상태가 없다(D-001 §14 스켈레톤은 비동기 조회가 있는 화면에만 적용).

## Security/Privacy AC
- Placeholder 문구 금지, 정적 데이터라 Empty 상태 없음(콘텐츠 항상 존재)

## Test Cases
- TC-1(Functional): Section 순서 고정: Hero+수치 → 추천 여행지 6 → 방문국가 Chip 30+ → 타임라인 3+ → Gallery 8 → 철학 좌우분할 → 체크리스트3단계+CTA. 데이터 출처: 전량 DATA-ABOUT-PROFILE
- TC-2(Visual): Desktop 1200~1280px, 여백 64~96px/40~64px
- TC-3(Security/Privacy): Placeholder 문구 금지, 정적 데이터라 Empty 상태 없음(콘텐츠 항상 존재)
- TC-4(Verify 연동): E2E-PUBLIC-SMOKE로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- E2E-PUBLIC-SMOKE

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(E2E-PUBLIC-SMOKE)을 실행했거나 실행 계획이 명시돼 있다.
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
