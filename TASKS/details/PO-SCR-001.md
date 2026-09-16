---
task_id: PO-SCR-001
type: page_owner
screen_id: SCR-001
route: "`/`"
page_entry: "`src/app/page.tsx`"
depends_on:
  - SHARED-LAYOUT-HEADER-FOOTER
  - CMP-SCR001-HERO
  - CMP-SCR001-DOMESTIC-DEST-CARDS
  - CMP-SCR001-OVERSEAS-DEST-CARDS
  - CMP-SCR001-THEME-MOTIVATION-CHIPS
  - CMP-SCR001-SAFETY-PREVIEW-CARDS
  - CMP-SCR001-RECENT-MATE-CARDS
  - CMP-SCR001-DEST-DETAIL-DRAWER
requirements_covered:
  - REQ-FUNC-001
  - REQ-FUNC-002
  - REQ-FUNC-003
  - REQ-FUNC-004
  - REQ-FUNC-005
  - REQ-FUNC-006
  - REQ-FUNC-007
  - REQ-FUNC-008
  - REQ-FUNC-009
  - REQ-FUNC-010
  - REQ-FUNC-046
  - REQ-FUNC-047
  - REQ-FUNC-048
  - REQ-FUNC-049
  - REQ-FUNC-050
  - REQ-FUNC-051
  - REQ-FUNC-052
  - REQ-FUNC-053
  - REQ-FUNC-054
  - REQ-FUNC-067
  - REQ-FUNC-068
  - REQ-FUNC-069
---

## 목적
`PO-SCR-001`(SCR-001 메인 Page Owner)은 SCR-001(`/`) 화면의 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] **Next.js Starter 완전 제거**(로고·"Get started"·기본 링크 잔존 금지). Section 순서 고정: Hero → 국내 여행지 카드 6개 이상 → 해외 여행지 카드 6개 이상 → 여행 동기 Chip 6개 이상 → 국가별 주의사항 카드 6개 → 최근 동행글 카드 3개(또는 완성형 Empty). 각 Section 데이터 출처: Hero=검색 입력, 국내/해외=DATA-DESTINATIONS-*, 여행동기=ThemeChips 정적 목록, 안전=DATA-COUNTRY-SAFETY, 최근 동행글=API-MATES-ROUTES
- [ ] [시각] Desktop 콘텐츠 1200~1280px, Section 여백 64~96px(Mobile 40~64px), Mobile 1열, 44px 터치 영역 | `Lorem ipsum`/"준비 중"/"정보 확인 필요"/빈 카드 금지, 데이터 0건 섹션은 안내 문장+이용 방법+CTA를 갖춘 완성형 Empty만 허용

## Expected Files
- 기존 수정: `src/app/page.tsx`(현재 `create-next-app` 스타터 마크업 — **전량 제거 후 재작성**)

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
