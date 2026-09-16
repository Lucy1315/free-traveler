---
task_id: DATA-COUNTRY-SAFETY
type: data
screen_id: SCR-001
page_entry: "`src/data/safety.ts`"
requirements_covered:
  - REQ-FUNC-046
  - REQ-FUNC-047
  - REQ-FUNC-048
  - REQ-FUNC-049
  - REQ-FUNC-050
  - REQ-FUNC-051
  - REQ-FUNC-052
  - REQ-FUNC-053
  - REQ-NF-027
  - REQ-NF-028
---

## 목적
`DATA-COUNTRY-SAFETY`(국가 안전정보 정적 데이터(해외 전 국가))은 SCR-001() 화면의 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] 8개 카테고리+출처+확인일+긴급연락처+경보범위
- [ ] [시각] 색상 단독 아님, 텍스트 라벨 병기

## Expected Files
- 신규: safety.ts

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
