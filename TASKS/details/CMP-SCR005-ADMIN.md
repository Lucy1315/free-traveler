---
task_id: CMP-SCR005-ADMIN
type: component
screen_id: SCR-005
route: "`/account`"
page_entry: "`src/components/scr005/AdminTabs.tsx`"
depends_on:
  - API-ADMIN-ROUTES
requirements_covered:
  - REQ-FUNC-041
  - REQ-FUNC-042
  - REQ-FUNC-062
  - REQ-FUNC-077
---

## 목적
`CMP-SCR005-ADMIN`(관리자(신고 상태 변경+외부 URL 설정))은 SCR-005(`/account`) 화면의 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] 신고 목록 상태 필터+변경, 항공/숙소 외부 URL HTTPS 설정, 문의·SNS 링크 설정
- [ ] [시각] 통계 차트·Dashboard 없음
- [ ] [보안/개인정보] Moderator/Admin 권한 없는 계정엔 탭 자체 미렌더링

## Expected Files
- 신규: 위 파일

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
