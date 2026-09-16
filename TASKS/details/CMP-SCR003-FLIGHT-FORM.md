---
task_id: CMP-SCR003-FLIGHT-FORM
type: component
screen_id: SCR-003
route: "`/travel-tools`"
page_entry: "`src/components/scr003/FlightForm.tsx`"
depends_on:
  - CMP-SCR003-INTRO-TABS-SHELL
  - SHARED-EXTERNAL-LINK-GUARD
requirements_covered:
  - REQ-FUNC-011
  - REQ-FUNC-012
  - REQ-FUNC-013
  - REQ-FUNC-014
  - REQ-FUNC-015
  - REQ-FUNC-016
  - REQ-FUNC-017
  - REQ-FUNC-018
  - REQ-NF-017
---

## 목적
`CMP-SCR003-FLIGHT-FORM`(항공 조건 입력·요약·외부이동)은 SCR-003(`/travel-tools`) 화면의 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] 국가/지역/출발일/귀국일 검증, 요약 표시, 외부이동(새 탭)
- [ ] [시각] 비전달 고지 문구 고정 노출
- [ ] [보안/개인정보] 서버 DB·로그·분석 미저장, 원시 입력값 미보존

## Expected Files
- 신규: 위 파일

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
