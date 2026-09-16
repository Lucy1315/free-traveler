---
task_id: TEST-RLS-BASIC
type: test
page_entry: "`tests/unit/rlsBasic.test.ts`"
depends_on:
  - DB-SCHEMA-BASE
  - DB-RLS-BASE
requirements_covered:
  - REQ-FUNC-044
  - REQ-NF-013
---

## 목적
`TEST-RLS-BASIC`(RLS 기본 정책 테스트)은 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] 권한별 부정 접근 테스트(본인 아님/비로그인/Moderator 아님) 전부 403 또는 빈 결과
- [ ] [보안/개인정보] 비공개 데이터 열람 차단 확인

## Expected Files
- 신규: 위 파일

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
