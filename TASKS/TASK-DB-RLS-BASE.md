---
task_id: DB-RLS-BASE
type: db
page_entry: "`supabase/migrations/0002_rls.sql`"
depends_on:
  - DB-SCHEMA-BASE
requirements_covered:
  - REQ-FUNC-044
  - REQ-NF-013
---

# DB-RLS-BASE — Row Level Security 정책

## Context
`DB-RLS-BASE`(Row Level Security 정책)은 SCR-004,005 영역의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).

## Requirement Ref
- **REQ-FUNC-044**: 시스템은 RLS로 본인 글·요청, 요청 대상 작성자, Moderator/Admin만 비공개 데이터를 열람하게 한다.
- **REQ-NF-013**: 인증·역할·RLS 정책을 서버에서 검증한다.

## Screen / Route / Page Entry
- Screen: SCR-004,005
- Route: N/A
- Page Entry: `supabase/migrations/0002_rls.sql`

## Design Ref
- 시각 규격 없음(서버 정책) — REQ-FUNC-044/NF-013
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- DB-SCHEMA-BASE

## Expected Files
- 신규: 위 파일

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 본인 글/요청, 대상 작성자, Moderator/Admin만 비공개 데이터 열람(SELECT)
- **쓰기(INSERT/UPDATE/DELETE) 정책**: 로그인하지 않은 요청은 모든 쓰기를 거부한다. `mate_post`·`user_profile`은 본인(`auth.uid()` = 소유자)만 수정·삭제할 수 있다. `mate_application`은 요청 본인만 생성·취소하고, 상태(ACCEPTED/REJECTED) 변경은 대상 글 작성자만 할 수 있다. `user_block`·`report`는 본인만 생성한다. `external_url_setting`은 Moderator/Admin만 쓸 수 있다(REQ-NF-013, `CLAUDE.md` 규칙 14 — RLS 우회 Client 코드 금지).

## Visual AC
N/A

## Security/Privacy AC
- 권한별 부정 접근 시 403/빈 결과(열람·쓰기 모두 해당)

## Test Cases
- TC-1(Functional): 본인 글/요청, 대상 작성자, Moderator/Admin만 비공개 데이터 열람 + 위 쓰기 정책 4개 그룹(mate_post/user_profile 본인 수정, mate_application 생성·상태변경 분리, user_block/report 본인 생성, external_url_setting Moderator/Admin 전용)
- TC-3(Security/Privacy): 권한별 부정 접근 시 403/빈 결과(열람·쓰기 모두)
- TC-4(Verify 연동): TEST-RLS-BASIC로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- TEST-RLS-BASIC

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(TEST-RLS-BASIC)을 실행했거나 실행 계획이 명시돼 있다.
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
