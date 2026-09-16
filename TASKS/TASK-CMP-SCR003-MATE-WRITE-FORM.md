---
task_id: CMP-SCR003-MATE-WRITE-FORM
type: component
screen_id: SCR-003
route: "`/travel-tools`"
page_entry: "`src/components/scr003/MateWriteForm.tsx`"
depends_on:
  - CMP-SCR003-INTRO-TABS-SHELL
  - DB-ACCESS
  - DATA-POLICY-PAGES
requirements_covered:
  - REQ-FUNC-027
  - REQ-FUNC-028
  - REQ-FUNC-029
  - REQ-FUNC-031
  - REQ-FUNC-032
  - REQ-FUNC-054
  - REQ-FUNC-080
---

# CMP-SCR003-MATE-WRITE-FORM — 동행 모집글 작성 Form

## Context
`CMP-SCR003-MATE-WRITE-FORM`(동행 모집글 작성 Form)은 SCR-003(`/travel-tools`) 화면의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).

## Requirement Ref
- **REQ-FUNC-027**: 시스템은 동행 쓰기 작업에 이메일 인증 세션을 요구한다.
- **REQ-FUNC-028**: 시스템은 동행 글·요청 전에 만 19세 이상 확인 상태를 요구하며 정확한 생년월일은 저장하지 않는다.
- **REQ-FUNC-029**: 시스템은 동행 프로필에 닉네임, 연령대, 선택형 성별, 여행 스타일, 자기소개를 제공한다.
- **REQ-FUNC-031**: 시스템은 모집글에 제목, 국가, 지역, 시작일, 종료일, 모집 인원, 선호 조건, 여행 스타일, 상세 설명, 안전수칙 동의를 입력받는다.
- **REQ-FUNC-032**: 시스템은 본문에서 전화번호·이메일·일반 메신저 ID 패턴을 탐지해 제출을 차단한다.
- **REQ-FUNC-054**: 시스템은 안전정보가 공식 판단을 대체하지 않으며 출국 직전 원문 재확인이 필요함을 고지한다.
- **REQ-FUNC-080**: 시스템은 이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책 안내를 제공하고 동행 글 작성 시 안전수칙 동의를 기록한다.

## Screen / Route / Page Entry
- Screen: SCR-003
- Route: `/travel-tools`
- Page Entry: `src/components/scr003/MateWriteForm.tsx`

## Design Ref
- D-001 §10(Form), §18(완성형 문장/Empty 규칙)
- `design-reference/UI_CONTRACT.md` 3장(SCR-003) — 영역 순서·주요 Component·상태·사용자 행동·금지 기능
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- CMP-SCR003-INTRO-TABS-SHELL
- DB-ACCESS
- DATA-POLICY-PAGES

## Expected Files
- 신규: 위 파일

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 로그인·성인확인 필요, 필수 필드+안전수칙 동의, 연락처 패턴 탐지 시 제출 차단

## Visual AC
- 비로그인 시 SCR-005 유도 안내

## Security/Privacy AC
- 정확한 생년월일 미수집, 연락처 패턴 차단

## Test Cases
- TC-1(Functional): 로그인·성인확인 필요, 필수 필드+안전수칙 동의, 연락처 패턴 탐지 시 제출 차단
- TC-2(Visual): 비로그인 시 SCR-005 유도 안내
- TC-3(Security/Privacy): 정확한 생년월일 미수집, 연락처 패턴 차단
- TC-4(Verify 연동): UNIT-CONTACT-DETECTION, E2E-TRAVEL-TOOLS로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- UNIT-CONTACT-DETECTION, E2E-TRAVEL-TOOLS

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(UNIT-CONTACT-DETECTION, E2E-TRAVEL-TOOLS)을 실행했거나 실행 계획이 명시돼 있다.
- [ ] Forbidden 절의 모든 항목을 위반하지 않았다.

## Forbidden
- 정확한 생년월일을 수집·저장하지 않는다 — 성인 확인은 `is_adult`/`adult_verified_at`만 쓴다(REQ-FUNC-028).
- Expected Files 절에 나열되지 않은 파일은 신규 생성·수정하지 않는다(범위 밖 수정 금지).
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI를 만들지 않는다(D-001 §19 Do Not).
- 이 문서(D-001/DESIGN.md)에 없는 임의의 색상·radius·spacing 값을 새로 만들지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구와 빈 카드(CTA 없는 Empty)를 만들지 않는다.
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- docs/PROJECT_SCOPE.md에서 EXCLUDED로 분류된 Requirement를 이 Task 범위에서 구현하지 않는다.
- 구현 코드·Branch·Commit을 이 Task 파일 작성 과정에서 만들지 않는다(이 문서는 계획서다).
