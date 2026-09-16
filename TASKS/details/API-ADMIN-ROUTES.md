---
task_id: API-ADMIN-ROUTES
type: api
screen_id: SCR-005
page_entry: "`src/app/api/admin/reports/route.ts`, `src/app/api/admin/settings/outbound/route.ts`"
depends_on:
  - DB-ACCESS
requirements_covered:
  - REQ-FUNC-041
  - REQ-FUNC-042
  - REQ-FUNC-077
---

## 목적
`API-ADMIN-ROUTES`(관리자 Route Handler)은 SCR-005() 화면의 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] 신고 상태 변경, 외부 URL 설정(HTTPS만 저장)
- [ ] [보안/개인정보] Moderator/Admin RLS 재검증

## Expected Files
- 신규: 위 2개

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
