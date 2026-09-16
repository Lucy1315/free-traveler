---
task_id: MANUAL-CHECK-RESPONSIVE
type: manual_check
page_entry: "N/A(체크리스트 문서)"
depends_on:
  - SHARED-LAYOUT-HEADER-FOOTER
requirements_covered:
  - REQ-FUNC-065
  - REQ-NF-006
---

## 목적
`MANUAL-CHECK-RESPONSIVE`(반응형(320~1440px) 수동 확인)은 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] 320/390/768/1440px에서 가로 스크롤·겹침 없음 확인
- [ ] [시각] Hero 55~65% 유지, Section 여백 범위 준수

## Expected Files
- 신규 코드 파일 없음(문서화·체크리스트 산출물)

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
