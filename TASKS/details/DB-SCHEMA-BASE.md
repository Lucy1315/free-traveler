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

## 목적
`DB-SCHEMA-BASE`(Supabase 6테이블 스키마 정의)은 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] user_profile, mate_post, mate_application, user_block, report, external_url_setting 정확히 6개 테이블
- [ ] [보안/개인정보] 정확한 생년월일 컬럼 없음(`is_adult`,`adult_verified_at`만)

## Expected Files
- 신규: 위 파일

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
