---
task_id: PO-SCR-005
type: page_owner
screen_id: SCR-005
route: "`/account`"
page_entry: "`src/app/account/page.tsx`"
depends_on:
  - SHARED-LAYOUT-HEADER-FOOTER
  - CMP-SCR005-AUTH-GUEST
  - CMP-SCR005-PROFILE
  - CMP-SCR005-MY-ACTIVITY-POSTS
  - CMP-SCR005-MY-ACTIVITY-BLOCKS-FAVORITES
  - CMP-SCR005-ADMIN
requirements_covered:
  - REQ-FUNC-027
  - REQ-FUNC-028
  - REQ-FUNC-029
  - REQ-FUNC-036
  - REQ-FUNC-038
  - REQ-FUNC-040
  - REQ-FUNC-041
  - REQ-FUNC-042
  - REQ-FUNC-062
  - REQ-FUNC-066
  - REQ-FUNC-068
  - REQ-FUNC-077
---

# PO-SCR-005 — SCR-005 계정·관리 Page Owner

## Context
`PO-SCR-005`(SCR-005 계정·관리 Page Owner)은 SCR-005(`/account`) 화면의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).
범위가 축소된 Requirement가 있다 — 아래 범위를 넘지 않는다:
  - REQ-FUNC-041: IMPLEMENT(축소: 상태별 필터 목록만, 우선순위·증거첨부 제외)
  - REQ-FUNC-042: IMPLEMENT(축소: 신고 상태 변경만, 세부 제재 로그 제외)

## Requirement Ref
- **REQ-FUNC-027**: 시스템은 동행 쓰기 작업에 이메일 인증 세션을 요구한다.
- **REQ-FUNC-028**: 시스템은 동행 글·요청 전에 만 19세 이상 확인 상태를 요구하며 정확한 생년월일은 저장하지 않는다.
- **REQ-FUNC-029**: 시스템은 동행 프로필에 닉네임, 연령대, 선택형 성별, 여행 스타일, 자기소개를 제공한다.
- **REQ-FUNC-036**: 시스템은 글 작성자가 참가 요청을 ACCEPTED 또는 REJECTED로 변경하게 한다.
- **REQ-FUNC-038**: 시스템은 작성자가 모집글을 수동 마감·수정·삭제하게 한다.
- **REQ-FUNC-040**: 시스템은 사용자가 다른 사용자를 차단·해제하게 한다.
- **REQ-FUNC-041**: 시스템은 Moderator에게 신고 우선순위·상태·대상·증거·접수 시각 큐를 제공한다.
- **REQ-FUNC-042**: 시스템은 Moderator가 경고, 콘텐츠 숨김, 계정 일시 제한, 신고 기각 조치를 기록하게 한다.
- **REQ-FUNC-062**: 시스템은 관리자 설정 기반 문의·SNS 링크를 제공한다.
- **REQ-FUNC-066**: 시스템은 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정을 제공한다.
- **REQ-FUNC-068**: 시스템은 회원이 여행지를 즐겨찾기·해제·조회하게 한다.
- **REQ-FUNC-077**: 시스템은 Admin이 항공·호텔 외부 URL을 허용목록 내 HTTPS 주소로 설정하게 한다.

## Screen / Route / Page Entry
- Screen: SCR-005
- Route: `/account`
- Page Entry: `src/app/account/page.tsx`

## Design Ref
- D-001 §15(좌측 세로 탭), §17(SCR-005 역할 기반 탭 구성), UI_CONTRACT 5장
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- SHARED-LAYOUT-HEADER-FOOTER
- CMP-SCR005-AUTH-GUEST
- CMP-SCR005-PROFILE
- CMP-SCR005-MY-ACTIVITY-POSTS
- CMP-SCR005-MY-ACTIVITY-BLOCKS-FAVORITES
- CMP-SCR005-ADMIN

## Expected Files
- 신규: `src/app/account/page.tsx`

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- **Guest·Member·Admin 3상태를 실제로 조립**(역할 조건 분기, 역할에 없는 탭 미렌더링). Section: Guest(Intro+Auth+안내), Member(프로필/내글/참가요청/차단/즐겨찾기 5탭), Admin(Member 5탭+구분선+관리자 2탭)

## Visual AC
- Desktop 좌측 세로탭, 1200~1280px
- **Loading**: 프로필·내 글·참가 요청·차단·즐겨찾기 등 Member/Admin 탭의 비동기 조회 중에는 D-001 §14 기준 스켈레톤만 표시한다. Guest 상태는 비동기 조회가 없어 Loading 상태가 없다.

## Security/Privacy AC
- 목록 0건 섹션마다 완성형 Empty, Placeholder 금지, 비로그인 Member/Admin 탭 접근 시 Guest 뷰로 대체

## Test Cases
- TC-1(Functional): **Guest·Member·Admin 3상태를 실제로 조립**(역할 조건 분기, 역할에 없는 탭 미렌더링). Section: Guest(Intro+Auth+안내), Member(프로필/내글/참가요청/차단/즐겨찾기 5탭), Admin(Member 5탭+구분선+관리자 2탭)
- TC-2(Visual): Desktop 좌측 세로탭, 1200~1280px
- TC-3(Security/Privacy): 목록 0건 섹션마다 완성형 Empty, Placeholder 금지, 비로그인 Member/Admin 탭 접근 시 Guest 뷰로 대체
- TC-4(Verify 연동): E2E-MATE-AUTH로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- E2E-MATE-AUTH

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(E2E-MATE-AUTH)을 실행했거나 실행 계획이 명시돼 있다.
- [ ] Forbidden 절의 모든 항목을 위반하지 않았다.
- [ ] Guest·Member·Admin 3상태가 실제로 조립되어 역할에 없는 탭은 렌더링되지 않는다.

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
