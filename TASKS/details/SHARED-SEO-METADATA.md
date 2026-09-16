---
task_id: SHARED-SEO-METADATA
type: shared
page_entry: "`src/lib/seo.ts`"
requirements_covered:
  - REQ-FUNC-070
  - REQ-NF-030
---

## 목적
`SHARED-SEO-METADATA`(페이지별 metadata 헬퍼)은 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] title/description/canonical/OG 생성 함수

## Expected Files
- 신규: seo.ts

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
