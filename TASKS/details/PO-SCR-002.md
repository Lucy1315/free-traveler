---
task_id: PO-SCR-002
type: page_owner
screen_id: SCR-002
route: "`/about`"
page_entry: "`src/app/about/page.tsx`"
depends_on:
  - SHARED-LAYOUT-HEADER-FOOTER
  - CMP-SCR002-HERO-STATS
  - CMP-SCR002-RECOMMENDED-GRID
  - CMP-SCR002-COUNTRY-CHIPS
  - CMP-SCR002-TIMELINE
  - CMP-SCR002-GALLERY
  - CMP-SCR002-PHILOSOPHY-CHECKLIST
requirements_covered:
  - REQ-FUNC-057
  - REQ-FUNC-058
  - REQ-FUNC-059
  - REQ-FUNC-060
  - REQ-FUNC-061
  - REQ-FUNC-062
  - REQ-FUNC-063
---

## 목적
`PO-SCR-002`(SCR-002 대표 소개 Page Owner)은 SCR-002(`/about`) 화면의 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] Section 순서 고정: Hero+수치 → 추천 여행지 6 → 방문국가 Chip 30+ → 타임라인 3+ → Gallery 8 → 철학 좌우분할 → 체크리스트3단계+CTA. 데이터 출처: 전량 DATA-ABOUT-PROFILE
- [ ] [시각] Desktop 1200~1280px, 여백 64~96px/40~64px | Placeholder 문구 금지, 정적 데이터라 Empty 상태 없음(콘텐츠 항상 존재)

## Expected Files
- 신규: `src/app/about/page.tsx`

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
