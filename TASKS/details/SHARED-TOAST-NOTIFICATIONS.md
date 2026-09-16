---
task_id: SHARED-TOAST-NOTIFICATIONS
type: shared
page_entry: "`src/components/ui/Toast.tsx`"
depends_on:
  - SHARED-UI-KIT-PRIMITIVES
requirements_covered:
  - REQ-FUNC-043
---

## 목적
`SHARED-TOAST-NOTIFICATIONS`(Toast 알림 컴포넌트)은 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] 성공/오류/정보 3종, 4초 자동 소멸, 이메일 미발송 대체 수단
- [ ] [시각] D-001 §13 색상(success/error/info)
- [ ] [보안/개인정보] 실제 이메일 미발송 확인

## Expected Files
- 신규: Toast.tsx

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
