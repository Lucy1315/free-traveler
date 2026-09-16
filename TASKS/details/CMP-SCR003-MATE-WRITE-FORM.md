---
task_id: CMP-SCR003-MATE-WRITE-FORM
type: component
screen_id: SCR-003
route: "`/travel-tools`"
page_entry: "`src/components/scr003/MateWriteForm.tsx`"
depends_on:
  - CMP-SCR003-INTRO-TABS-SHELL
  - DB-ACCESS
  - DATA-POLICY-PAGES
requirements_covered:
  - REQ-FUNC-027
  - REQ-FUNC-028
  - REQ-FUNC-029
  - REQ-FUNC-031
  - REQ-FUNC-032
  - REQ-FUNC-054
  - REQ-FUNC-080
---

## 목적
`CMP-SCR003-MATE-WRITE-FORM`(동행 모집글 작성 Form)은 SCR-003(`/travel-tools`) 화면의 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] 로그인·성인확인 필요, 필수 필드+안전수칙 동의, 연락처 패턴 탐지 시 제출 차단
- [ ] [시각] 비로그인 시 SCR-005 유도 안내
- [ ] [보안/개인정보] 정확한 생년월일 미수집, 연락처 패턴 차단

## Expected Files
- 신규: 위 파일

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
