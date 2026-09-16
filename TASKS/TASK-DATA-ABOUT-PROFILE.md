---
task_id: DATA-ABOUT-PROFILE
type: data
screen_id: SCR-002
page_entry: "`src/data/about.ts`"
requirements_covered:
  - REQ-FUNC-057
  - REQ-FUNC-058
  - REQ-FUNC-059
  - REQ-FUNC-060
  - REQ-FUNC-061
  - REQ-FUNC-063
---

# DATA-ABOUT-PROFILE — 대표 소개 정적 데이터

## Context
`DATA-ABOUT-PROFILE`(대표 소개 정적 데이터)은 SCR-002 화면의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

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
- **REQ-FUNC-063**: 시스템은 대표 추천 여행지 6개를 공개 여행지 상세로 연결한다.

## Screen / Route / Page Entry
- Screen: SCR-002
- Route: N/A
- Page Entry: `src/data/about.ts`

## Design Ref
- D-001 §17(SCR-002 최소 콘텐츠 수: 추천 6/Chip 30+/Timeline 3+/Gallery 8)
- `design-reference/UI_CONTRACT.md` 2장(SCR-002) — 영역 순서·주요 Component·상태·사용자 행동·금지 기능
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
없음(독립 Task)

## Expected Files
- 신규: about.ts

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 50+/30+ 수치, 방문국가30+, 타임라인3+, 추천6, 철학

## Visual AC
- 이미지 alt+출처 URL

## Security/Privacy AC
N/A

## Test Cases
- TC-1(Functional): 50+/30+ 수치, 방문국가30+, 타임라인3+, 추천6, 철학
- TC-2(Visual): 이미지 alt+출처 URL
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
