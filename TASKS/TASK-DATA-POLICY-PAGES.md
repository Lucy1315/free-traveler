---
task_id: DATA-POLICY-PAGES
type: data
screen_id: SCR-003
page_entry: "`src/data/policies.ts`"
requirements_covered:
  - REQ-FUNC-080
---

# DATA-POLICY-PAGES — 정책 문서 정적 콘텐츠(이용약관/개인정보/안전수칙/면책)

## Context
`DATA-POLICY-PAGES`(정책 문서 정적 콘텐츠(이용약관/개인정보/안전수칙/면책))은 SCR-003 화면의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).

## Requirement Ref
- **REQ-FUNC-080**: 시스템은 이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책 안내를 제공하고 동행 글 작성 시 안전수칙 동의를 기록한다.

## Screen / Route / Page Entry
- Screen: SCR-003
- Route: N/A
- Page Entry: `src/data/policies.ts`

## Design Ref
- D-001 §18(완성형 문장 규칙, Placeholder 금지)
- `design-reference/UI_CONTRACT.md` 3장(SCR-003) — 영역 순서·주요 Component·상태·사용자 행동·금지 기능
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
없음(독립 Task)

## Expected Files
- 신규: policies.ts

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 4개 문서 본문+버전 필드

## Visual AC
- 완성형 문장, Lorem ipsum 금지

## Security/Privacy AC
N/A

## Test Cases
- TC-1(Functional): 4개 문서 본문+버전 필드
- TC-2(Visual): 완성형 문장, Lorem ipsum 금지
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
