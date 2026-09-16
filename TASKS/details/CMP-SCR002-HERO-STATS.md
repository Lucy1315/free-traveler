---
task_id: CMP-SCR002-HERO-STATS
type: component
screen_id: SCR-002
route: "`/about`"
page_entry: "`src/components/scr002/HeroStats.tsx`"
depends_on:
  - DATA-ABOUT-PROFILE
requirements_covered:
  - REQ-FUNC-057
---

## 목적
`CMP-SCR002-HERO-STATS`(대표 Hero+수치 카드)은 SCR-002(`/about`) 화면의 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] `50+ Trips`/`30+ Countries` 카드 2개
- [ ] [시각] Hero 55~65% 이내

## Expected Files
- 신규: 위 파일

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
