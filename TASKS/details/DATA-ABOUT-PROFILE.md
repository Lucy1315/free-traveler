---
task_id: DATA-ABOUT-PROFILE
type: data
screen_id: SCR-002
page_entry: "`src/data/about.ts`"
requirements_covered:
  - REQ-FUNC-057
  - REQ-FUNC-058
  - REQ-FUNC-059
  - REQ-FUNC-060
  - REQ-FUNC-061
  - REQ-FUNC-063
---

## 목적
`DATA-ABOUT-PROFILE`(대표 소개 정적 데이터)은 SCR-002() 화면의 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] 50+/30+ 수치, 방문국가30+, 타임라인3+, 추천6, 철학
- [ ] [시각] 이미지 alt+출처 URL

## Expected Files
- 신규: about.ts

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
