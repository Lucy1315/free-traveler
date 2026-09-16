---
task_id: MANUAL-CHECK-EXTERNAL-LINKS
type: manual_check
page_entry: "N/A(체크리스트 문서)"
depends_on:
  - SHARED-EXTERNAL-LINK-GUARD
requirements_covered:
  - REQ-FUNC-016
  - REQ-FUNC-018
  - REQ-FUNC-024
  - REQ-FUNC-026
  - REQ-FUNC-049
---

# MANUAL-CHECK-EXTERNAL-LINKS — 외부 링크 실제 클릭 점검

## Context
`MANUAL-CHECK-EXTERNAL-LINKS`(외부 링크 실제 클릭 점검)은 SCR-001,003 영역의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).

## Requirement Ref
- **REQ-FUNC-016**: 시스템은 외부 이동 시 설정된 항공 일반 URL을 새 탭으로 열고 `noopener,noreferrer`를 적용한다.
- **REQ-FUNC-018**: 시스템은 외부 URL이 없거나 허용목록 밖이면 이동을 차단하고 오류와 재시도를 제공한다.
- **REQ-FUNC-024**: 시스템은 설정된 호텔 일반 URL을 새 탭으로 열고 `noopener,noreferrer`를 적용한다.
- **REQ-FUNC-026**: 시스템은 호텔 URL 오류 시 이동을 차단하고 재시도와 운영 오류 로그를 제공한다.
- **REQ-FUNC-049**: 시스템은 외교부 해외안전여행 원문 링크를 새 탭으로 제공한다.

## Screen / Route / Page Entry
- Screen: SCR-001,003
- Route: N/A
- Page Entry: N/A(체크리스트 문서)

## Design Ref
- D-001 §19(Do Not — 쿼리 파라미터 금지), SHARED-EXTERNAL-LINK-GUARD 산출물
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- SHARED-EXTERNAL-LINK-GUARD

## Expected Files
- 신규 코드 파일 없음(문서화·체크리스트 산출물)

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 항공/숙소/외교부 링크 실제 새 탭 오픈, `noopener` 확인

## Visual AC
N/A

## Security/Privacy AC
- 쿼리 파라미터 미첨부 확인

## Test Cases
- TC-1(Functional): 항공/숙소/외교부 링크 실제 새 탭 오픈, `noopener` 확인
- TC-3(Security/Privacy): 쿼리 파라미터 미첨부 확인
- TC-4(Verify 연동): 수동 QA 체크리스트로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- 수동 QA 체크리스트

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(수동 QA 체크리스트)을 실행했거나 실행 계획이 명시돼 있다.
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
