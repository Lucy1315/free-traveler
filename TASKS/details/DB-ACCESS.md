---
task_id: DB-ACCESS
type: db
page_entry: "`src/lib/db/client.ts`, `src/lib/db/queries.ts`"
depends_on:
  - DB-SCHEMA-BASE
  - DB-RLS-BASE
requirements_covered:
  - REQ-NF-014
  - REQ-NF-015
  - REQ-NF-017
---

## 목적
`DB-ACCESS`(Supabase client·쿼리 레이어)은 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] CRUD 함수(mate_post/application/block/report/external_url_setting)
- [ ] [보안/개인정보] CSRF/SameSite 쿠키, 입력 이스케이프(XSS 차단), 항공·호텔 원시입력 저장 함수 없음

## Expected Files
- 신규: 위 2개

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
