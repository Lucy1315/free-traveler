---
task_id: SHARED-SHARE-UTIL
type: shared
page_entry: "`src/lib/share.ts`"
requirements_covered:
  - REQ-FUNC-069
---

## 목적
`SHARED-SHARE-UTIL`(URL 공유 유틸(Web Share API+복사 폴백))은 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] Web Share 실패 시 URL 복사 폴백

## Expected Files
- 신규: share.ts

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
