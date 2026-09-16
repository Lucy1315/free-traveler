---
task_id: CMP-SCR001-DEST-DETAIL-DRAWER
type: component
screen_id: SCR-001
route: "`/`"
page_entry: "`src/components/scr001/DestinationDetailDrawer.tsx`"
depends_on:
  - DATA-DESTINATIONS-DOMESTIC
  - DATA-DESTINATIONS-OVERSEAS
  - DATA-COUNTRY-SAFETY
  - SHARED-EXTERNAL-LINK-GUARD
requirements_covered:
  - REQ-FUNC-006
  - REQ-FUNC-009
  - REQ-FUNC-046
  - REQ-FUNC-047
  - REQ-FUNC-048
  - REQ-FUNC-049
  - REQ-FUNC-052
  - REQ-FUNC-053
  - REQ-FUNC-054
---

## 목적
`CMP-SCR001-DEST-DETAIL-DRAWER`(여행지 상세+안전정보 Drawer)은 SCR-001(`/`) 화면의 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] 상세정보/안전정보 2탭, 관련 여행지 4~6개, 외교부 링크, "공식 판단 대체 아님" 고지
- [ ] [시각] Desktop 우측 슬라이드/Mobile 하단 시트, 스크림+포커스 트랩

## Expected Files
- 신규: 위 파일

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
