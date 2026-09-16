---
task_id: E2E-MATE-AUTH
type: test
page_entry: "`tests/e2e/mateAuth.spec.ts`"
depends_on:
  - PO-SCR-004
  - PO-SCR-005
  - DB-SEED-BASE
requirements_covered:
  - REQ-FUNC-034
  - REQ-FUNC-036
  - REQ-FUNC-039
  - REQ-FUNC-040
browser: chromium
---

# E2E-MATE-AUTH — Playwright Chromium — 인증 필요 동행 흐름

## Context
`E2E-MATE-AUTH`(Playwright Chromium — 인증 필요 동행 흐름)은 SCR-004,005 영역의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).

## Requirement Ref
- **REQ-FUNC-034**: 시스템은 모집중 글에 최대 500자의 참가 메시지를 비공개로 제출하게 한다.
- **REQ-FUNC-036**: 시스템은 글 작성자가 참가 요청을 ACCEPTED 또는 REJECTED로 변경하게 한다.
- **REQ-FUNC-039**: 시스템은 글·사용자·참가 요청을 사유 코드와 설명으로 신고하게 한다.
- **REQ-FUNC-040**: 시스템은 사용자가 다른 사용자를 차단·해제하게 한다.

## Screen / Route / Page Entry
- Screen: SCR-004,005
- Route: N/A
- Page Entry: `tests/e2e/mateAuth.spec.ts`

## Design Ref
- UI_CONTRACT 4·5장 사용자 행동 흐름 검증
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- PO-SCR-004
- PO-SCR-005
- DB-SEED-BASE

## Expected Files
- 신규: 위 파일

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 로그인→참가 요청 제출→작성자 승인/거절→신고 접수→차단/해제 전체 흐름

## Visual AC
- Chromium만 사용

## Security/Privacy AC
- 연락처 미노출 확인

## Test Cases
- TC-1(Functional): 로그인→참가 요청 제출→작성자 승인/거절→신고 접수→차단/해제 전체 흐름
- TC-2(Visual): Chromium만 사용
- TC-3(Security/Privacy): 연락처 미노출 확인
- TC-4(Verify 연동): 수동 실행 결과 확인으로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- 수동 실행 결과 확인

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(수동 실행 결과 확인)을 실행했거나 실행 계획이 명시돼 있다.
- [ ] Forbidden 절의 모든 항목을 위반하지 않았다.

## Forbidden
- Chromium 이외의 브라우저 엔진은 사용하지 않는다 — Playwright 설정은 Chromium 프로젝트만 유지한다.
- Expected Files 절에 나열되지 않은 파일은 신규 생성·수정하지 않는다(범위 밖 수정 금지).
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI를 만들지 않는다(D-001 §19 Do Not).
- 이 문서(D-001/DESIGN.md)에 없는 임의의 색상·radius·spacing 값을 새로 만들지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구와 빈 카드(CTA 없는 Empty)를 만들지 않는다.
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- docs/PROJECT_SCOPE.md에서 EXCLUDED로 분류된 Requirement를 이 Task 범위에서 구현하지 않는다.
- 구현 코드·Branch·Commit을 이 Task 파일 작성 과정에서 만들지 않는다(이 문서는 계획서다).
