---
task_id: PO-SCR-005
type: page_owner
screen_id: SCR-005
route: "`/account`"
page_entry: "`src/app/account/page.tsx`"
depends_on:
  - SHARED-LAYOUT-HEADER-FOOTER
  - CMP-SCR005-AUTH-GUEST
  - CMP-SCR005-PROFILE
  - CMP-SCR005-MY-ACTIVITY-POSTS
  - CMP-SCR005-MY-ACTIVITY-BLOCKS-FAVORITES
  - CMP-SCR005-ADMIN
requirements_covered:
  - REQ-FUNC-027
  - REQ-FUNC-028
  - REQ-FUNC-029
  - REQ-FUNC-036
  - REQ-FUNC-038
  - REQ-FUNC-040
  - REQ-FUNC-041
  - REQ-FUNC-042
  - REQ-FUNC-062
  - REQ-FUNC-066
  - REQ-FUNC-068
  - REQ-FUNC-077
---

## 목적
`PO-SCR-005`(SCR-005 계정·관리 Page Owner)은 SCR-005(`/account`) 화면의 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] **Guest·Member·Admin 3상태를 실제로 조립**(역할 조건 분기, 역할에 없는 탭 미렌더링). Section: Guest(Intro+Auth+안내), Member(프로필/내글/참가요청/차단/즐겨찾기 5탭), Admin(Member 5탭+구분선+관리자 2탭)
- [ ] [시각] Desktop 좌측 세로탭, 1200~1280px | 목록 0건 섹션마다 완성형 Empty, Placeholder 금지
- [ ] [보안/개인정보] 비로그인 Member/Admin 탭 접근 시 Guest 뷰로 대체

## Expected Files
- 신규: `src/app/account/page.tsx`

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
