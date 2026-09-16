---
task_id: PO-SCR-004
type: page_owner
screen_id: SCR-004
route: "`/mates`"
page_entry: "`src/app/mates/page.tsx`"
depends_on:
  - SHARED-LAYOUT-HEADER-FOOTER
  - CMP-SCR004-INTRO-CTA
  - CMP-SCR004-FILTER-SUMMARY
  - CMP-SCR004-CARD-GRID
  - CMP-SCR004-DETAIL-PANEL
  - CMP-SCR004-PARTICIPATION-REQUEST
  - CMP-SCR004-REPORT-BLOCK-ACTIONS
requirements_covered:
  - REQ-FUNC-030
  - REQ-FUNC-033
  - REQ-FUNC-034
  - REQ-FUNC-035
  - REQ-FUNC-037
  - REQ-FUNC-039
  - REQ-FUNC-040
  - REQ-NF-019
---

## 목적
`PO-SCR-004`(SCR-004 동행 조회 Page Owner)은 SCR-004(`/mates`) 화면의 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] 목록·필터·상세·참가·신고·차단을 각 Component로 분리 후 조립. Section 순서: Intro+CTA → Filter+요약 → Card Grid(8) → 목록+상세 분할/Drawer → 3단계 안내 → 안전·신고·차단 CTA
- [ ] [시각] Desktop 1200~1280px, Card 3~4열/Mobile 1열 | 목록 0건이어도 안내+이용방법+CTA 완성형 Empty, Placeholder 금지
- [ ] [보안/개인정보] 연락처 비노출, 신고/차단 정상 동작

## Expected Files
- 신규: `src/app/mates/page.tsx`

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
