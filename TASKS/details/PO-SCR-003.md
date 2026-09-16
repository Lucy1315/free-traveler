---
task_id: PO-SCR-003
type: page_owner
screen_id: SCR-003
route: "`/travel-tools`"
page_entry: "`src/app/travel-tools/page.tsx`"
depends_on:
  - SHARED-LAYOUT-HEADER-FOOTER
  - CMP-SCR003-INTRO-TABS-SHELL
  - CMP-SCR003-FLIGHT-FORM
  - CMP-SCR003-HOTEL-FORM
  - CMP-SCR003-MATE-WRITE-FORM
  - CMP-SCR003-TIPS-SAFETY-CTA
requirements_covered:
  - REQ-FUNC-011
  - REQ-FUNC-012
  - REQ-FUNC-013
  - REQ-FUNC-014
  - REQ-FUNC-015
  - REQ-FUNC-016
  - REQ-FUNC-017
  - REQ-FUNC-018
  - REQ-FUNC-019
  - REQ-FUNC-020
  - REQ-FUNC-021
  - REQ-FUNC-022
  - REQ-FUNC-023
  - REQ-FUNC-024
  - REQ-FUNC-025
  - REQ-FUNC-026
  - REQ-FUNC-027
  - REQ-FUNC-031
  - REQ-FUNC-032
  - REQ-FUNC-054
  - REQ-FUNC-080
---

## 목적
`PO-SCR-003`(SCR-003 통합 여행 준비 Page Owner)은 SCR-003(`/travel-tools`) 화면의 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] **항공·숙소·동행 글쓰기 3개 탭을 실제로 조립**(단순 나열 금지, 탭 전환+상태 분리 연결). Section 순서: Intro(미리보기3) → 탭+Form → 요약·비전달고지·외부이동 → Tip3 → 로그인안내/동행Form → 안전CTA. 탭별 입력→검증→완료 상태를 서로 분리
- [ ] [시각] Desktop 1200~1280px, 여백 64~96px/40~64px, 탭바 Mobile 가로스크롤 | Placeholder 금지, 동행 탭 0건 이력이어도 안내+CTA 완성형
- [ ] [보안/개인정보] 항공·호텔 값 서버 미전송

## Expected Files
- 신규: `src/app/travel-tools/page.tsx`

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
