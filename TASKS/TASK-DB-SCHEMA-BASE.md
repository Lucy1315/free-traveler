---
task_id: DB-SCHEMA-BASE
type: db
page_entry: "`supabase/migrations/0001_schema.sql`"
requirements_covered:
  - REQ-FUNC-028
  - REQ-FUNC-029
  - REQ-FUNC-030
  - REQ-FUNC-031
  - REQ-FUNC-034
  - REQ-FUNC-035
  - REQ-FUNC-036
  - REQ-FUNC-037
  - REQ-FUNC-038
  - REQ-FUNC-039
  - REQ-FUNC-040
  - REQ-FUNC-041
  - REQ-FUNC-042
  - REQ-FUNC-043
  - REQ-FUNC-077
tables:
  - user_profile
  - mate_post
  - mate_application
  - user_block
  - report
  - external_url_setting
---

# DB-SCHEMA-BASE — Supabase 6테이블 스키마 정의

## Context
`DB-SCHEMA-BASE`(Supabase 6테이블 스키마 정의)은 SCR-004,005 영역의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).
범위가 축소된 Requirement가 있다 — 아래 범위를 넘지 않는다:
  - REQ-FUNC-041: IMPLEMENT(축소: 상태별 필터 목록만, 우선순위·증거첨부 제외)
  - REQ-FUNC-042: IMPLEMENT(축소: 신고 상태 변경만, 세부 제재 로그 제외)
DB 테이블은 정확히 6개(user_profile, mate_post, mate_application, user_block, report, external_url_setting)로 제한한다(그 밖의 여행지·안전·감사 로그 테이블은 정적 데이터 또는 EXCLUDED).

## Requirement Ref
- **REQ-FUNC-028**: 시스템은 동행 글·요청 전에 만 19세 이상 확인 상태를 요구하며 정확한 생년월일은 저장하지 않는다.
- **REQ-FUNC-029**: 시스템은 동행 프로필에 닉네임, 연령대, 선택형 성별, 여행 스타일, 자기소개를 제공한다.
- **REQ-FUNC-030**: 시스템은 국가·지역·여행 기간 겹침·연령대·성별·여행 스타일·모집 상태로 동행글을 필터한다.
- **REQ-FUNC-031**: 시스템은 모집글에 제목, 국가, 지역, 시작일, 종료일, 모집 인원, 선호 조건, 여행 스타일, 상세 설명, 안전수칙 동의를 입력받는다.
- **REQ-FUNC-034**: 시스템은 모집중 글에 최대 500자의 참가 메시지를 비공개로 제출하게 한다.
- **REQ-FUNC-035**: 시스템은 동일 사용자의 동일 글 중복 PENDING·ACCEPTED 요청을 차단한다.
- **REQ-FUNC-036**: 시스템은 글 작성자가 참가 요청을 ACCEPTED 또는 REJECTED로 변경하게 한다.
- **REQ-FUNC-037**: 시스템은 여행 종료일 다음 날 모집글을 CLOSED로 자동 전환한다.
- **REQ-FUNC-038**: 시스템은 작성자가 모집글을 수동 마감·수정·삭제하게 한다.
- **REQ-FUNC-039**: 시스템은 글·사용자·참가 요청을 사유 코드와 설명으로 신고하게 한다.
- **REQ-FUNC-040**: 시스템은 사용자가 다른 사용자를 차단·해제하게 한다.
- **REQ-FUNC-041**: 시스템은 Moderator에게 신고 우선순위·상태·대상·증거·접수 시각 큐를 제공한다.
- **REQ-FUNC-042**: 시스템은 Moderator가 경고, 콘텐츠 숨김, 계정 일시 제한, 신고 기각 조치를 기록하게 한다.
- **REQ-FUNC-043**: 시스템은 참가 요청 접수·승인·거절·신고 처리 결과를 인앱 알림으로 제공하고 이메일은 선택적으로 발송한다.
- **REQ-FUNC-077**: 시스템은 Admin이 항공·호텔 외부 URL을 허용목록 내 HTTPS 주소로 설정하게 한다.

## Screen / Route / Page Entry
- Screen: SCR-004,005
- Route: N/A
- Page Entry: `supabase/migrations/0001_schema.sql`

## Design Ref
- 시각 규격 없음(데이터 계층) — REQ-FUNC-028~043,077
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
없음(독립 Task)

## Expected Files
- 신규: 위 파일

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- user_profile, mate_post, mate_application, user_block, report, external_url_setting 정확히 6개 테이블

## Visual AC
N/A

## Security/Privacy AC
- 정확한 생년월일 컬럼 없음(`is_adult`,`adult_verified_at`만)

## Test Cases
- TC-1(Functional): user_profile, mate_post, mate_application, user_block, report, external_url_setting 정확히 6개 테이블
- TC-3(Security/Privacy): 정확한 생년월일 컬럼 없음(`is_adult`,`adult_verified_at`만)
- TC-4(Verify 연동): TEST-RLS-BASIC로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- TEST-RLS-BASIC

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(TEST-RLS-BASIC)을 실행했거나 실행 계획이 명시돼 있다.
- [ ] Forbidden 절의 모든 항목을 위반하지 않았다.
- [ ] 테이블이 정의된 6개(user_profile, mate_post, mate_application, user_block, report, external_url_setting)를 넘지 않는다.

## Forbidden
- 정의된 6개 테이블(user_profile, mate_post, mate_application, user_block, report, external_url_setting) 외의 신규 테이블을 추가하지 않는다.
- Expected Files 절에 나열되지 않은 파일은 신규 생성·수정하지 않는다(범위 밖 수정 금지).
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI를 만들지 않는다(D-001 §19 Do Not).
- 이 문서(D-001/DESIGN.md)에 없는 임의의 색상·radius·spacing 값을 새로 만들지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구와 빈 카드(CTA 없는 Empty)를 만들지 않는다.
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- docs/PROJECT_SCOPE.md에서 EXCLUDED로 분류된 Requirement를 이 Task 범위에서 구현하지 않는다.
- 구현 코드·Branch·Commit을 이 Task 파일 작성 과정에서 만들지 않는다(이 문서는 계획서다).
