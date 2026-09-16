---
task_id: DATA-COUNTRY-SAFETY
type: data
screen_id: SCR-001
page_entry: "`src/data/safety.ts`"
requirements_covered:
  - REQ-FUNC-046
  - REQ-FUNC-047
  - REQ-FUNC-048
  - REQ-FUNC-049
  - REQ-FUNC-050
  - REQ-FUNC-051
  - REQ-FUNC-052
  - REQ-FUNC-053
  - REQ-NF-027
  - REQ-NF-028
---

# DATA-COUNTRY-SAFETY — 국가 안전정보 정적 데이터(해외 전 국가)

## Context
`DATA-COUNTRY-SAFETY`(국가 안전정보 정적 데이터(해외 전 국가))은 SCR-001 화면의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).
범위가 축소된 Requirement가 있다 — 아래 범위를 넘지 않는다:
  - REQ-NF-028: IMPLEMENT(축소: 경고 로직만, 수치 목표 미검증)

## Requirement Ref
- **REQ-FUNC-046**: 시스템은 게시된 모든 해외 국가에 하나 이상의 공개 안전 페이지를 요구한다.
- **REQ-FUNC-047**: 시스템은 치안, 흔한 사기, 현지 법규, 교통, 재난·기후, 보건, 문화·복장, 긴급연락처 섹션을 제공한다.
- **REQ-FUNC-048**: 시스템은 각 안전 페이지에 공식 출처명·URL·최종 확인일·편집자를 기록한다.
- **REQ-FUNC-049**: 시스템은 외교부 해외안전여행 원문 링크를 새 탭으로 제공한다.
- **REQ-FUNC-050**: 시스템은 최종 확인 후 7일이 지나면 stale 상태와 재확인 경고를 표시한다.
- **REQ-FUNC-051**: 시스템은 출국권고·여행금지·특별여행주의보 등 중대 경보를 본문 상단에 텍스트로 표시한다.
- **REQ-FUNC-052**: 시스템은 국가 전체 경보와 특정 지역 경보를 별도 범위로 모델링한다.
- **REQ-FUNC-053**: 시스템은 현지 긴급전화와 대한민국 재외공관 또는 영사콜센터 연결 정보를 표시한다.
- **REQ-NF-027**: 해외 국가 안전정보 커버리지
- **REQ-NF-028**: 안전정보 최신 확인

## Screen / Route / Page Entry
- Screen: SCR-001
- Route: N/A
- Page Entry: `src/data/safety.ts`

## Design Ref
- D-001 §13(Alert — 색상+텍스트 라벨 병기), §17(안전정보 카드 수)
- `design-reference/UI_CONTRACT.md` 1장(SCR-001) — 영역 순서·주요 Component·상태·사용자 행동·금지 기능
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
없음(독립 Task)

## Expected Files
- 신규: safety.ts

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- 8개 카테고리+출처+확인일+긴급연락처+경보범위

## Visual AC
- 색상 단독 아님, 텍스트 라벨 병기

## Security/Privacy AC
N/A

## Test Cases
- TC-1(Functional): 8개 카테고리+출처+확인일+긴급연락처+경보범위
- TC-2(Visual): 색상 단독 아님, 텍스트 라벨 병기
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
