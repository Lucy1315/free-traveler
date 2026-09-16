---
task_id: MANUAL-CHECK-A11Y-KEYBOARD
type: manual_check
page_entry: "N/A(체크리스트 문서)"
depends_on:
  - SHARED-UI-KIT-PRIMITIVES
requirements_covered:
  - REQ-FUNC-079
  - REQ-NF-023
  - REQ-NF-025
---

## 목적
`MANUAL-CHECK-A11Y-KEYBOARD`(접근성·키보드 수동 확인)은 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] 5개 핵심 흐름 키보드만으로 완료 가능 여부 확인
- [ ] [시각] 44px 터치 영역, 2px focus ring

## Expected Files
- 신규 코드 파일 없음(문서화·체크리스트 산출물)

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
