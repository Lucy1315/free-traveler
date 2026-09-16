---
task_id: RELEASE-CHECK-CONTENT-COMPLETENESS
type: release_check
screen_id: SCR-001
page_entry: "N/A(체크리스트 문서)"
depends_on:
  - DATA-DESTINATIONS-DOMESTIC
  - DATA-DESTINATIONS-OVERSEAS
  - DATA-COUNTRY-SAFETY
requirements_covered:
  - REQ-FUNC-008
  - REQ-NF-026
  - REQ-NF-027
---

## 목적
`RELEASE-CHECK-CONTENT-COMPLETENESS`(콘텐츠 완전성·수량 릴리스 점검)은 SCR-001() 화면의 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] 국내 10+/해외 15개국 30도시+/해외 전 국가 안전정보 수량 검수

## Expected Files
- 신규 코드 파일 없음(문서화·체크리스트 산출물)

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
