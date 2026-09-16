---
task_id: API-MATES-ROUTES
type: api
screen_id: SCR-004
page_entry: "`src/app/api/mates/route.ts`, `src/app/api/mates/[id]/route.ts`, `src/app/api/mates/[id]/applications/route.ts`, `src/app/api/applications/[id]/route.ts`, `src/app/api/blocks/route.ts`"
depends_on:
  - DB-ACCESS
requirements_covered:
  - REQ-FUNC-030
  - REQ-FUNC-033
  - REQ-FUNC-034
  - REQ-FUNC-035
  - REQ-FUNC-036
  - REQ-FUNC-037
  - REQ-FUNC-039
  - REQ-FUNC-040
---

# API-MATES-ROUTES — 동행 Route Handler

## Context
`API-MATES-ROUTES`(동행 Route Handler)은 SCR-004 화면의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).

## Requirement Ref
- **REQ-FUNC-030**: 시스템은 국가·지역·여행 기간 겹침·연령대·성별·여행 스타일·모집 상태로 동행글을 필터한다.
- **REQ-FUNC-033**: 시스템은 모집글 작성자·상태·조건·설명을 표시하되 이메일과 외부 연락처를 노출하지 않는다.
- **REQ-FUNC-034**: 시스템은 모집중 글에 최대 500자의 참가 메시지를 비공개로 제출하게 한다.
- **REQ-FUNC-035**: 시스템은 동일 사용자의 동일 글 중복 PENDING·ACCEPTED 요청을 차단한다.
- **REQ-FUNC-036**: 시스템은 글 작성자가 참가 요청을 ACCEPTED 또는 REJECTED로 변경하게 한다.
- **REQ-FUNC-037**: 시스템은 여행 종료일 다음 날 모집글을 CLOSED로 자동 전환한다.
- **REQ-FUNC-039**: 시스템은 글·사용자·참가 요청을 사유 코드와 설명으로 신고하게 한다.
- **REQ-FUNC-040**: 시스템은 사용자가 다른 사용자를 차단·해제하게 한다.

## Screen / Route / Page Entry
- Screen: SCR-004
- Route: N/A
- Page Entry: `src/app/api/mates/route.ts`, `src/app/api/mates/[id]/route.ts`, `src/app/api/mates/[id]/applications/route.ts`, `src/app/api/applications/[id]/route.ts`, `src/app/api/blocks/route.ts`

## Design Ref
- 시각 규격 없음(Route Handler) — SCR-004 사용자 행동(UI_CONTRACT 4장) 지원
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- DB-ACCESS

## Expected Files
- 신규: 위 5개

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 목록/상세/참가요청/승인거절/차단 API

## Visual AC
N/A

## Security/Privacy AC
- 항공·호텔 관련 데이터 없음, 연락처 응답 제외

## Test Cases
- TC-1(Functional): 목록/상세/참가요청/승인거절/차단 API
- TC-3(Security/Privacy): 항공·호텔 관련 데이터 없음, 연락처 응답 제외
- TC-4(Verify 연동): UNIT-MATE-STATE, TEST-RLS-BASIC로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- UNIT-MATE-STATE, TEST-RLS-BASIC

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(UNIT-MATE-STATE, TEST-RLS-BASIC)을 실행했거나 실행 계획이 명시돼 있다.
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
