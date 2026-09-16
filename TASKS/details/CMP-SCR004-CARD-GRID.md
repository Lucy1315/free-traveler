---
task_id: CMP-SCR004-CARD-GRID
type: component
screen_id: SCR-004
route: "`/mates`"
page_entry: "`src/components/scr004/MateCardGrid.tsx`"
depends_on:
  - API-MATES-ROUTES
  - CMP-SCR004-FILTER-SUMMARY
requirements_covered:
  - REQ-FUNC-033
  - REQ-FUNC-037
---

## 목적
`CMP-SCR004-CARD-GRID`(동행글 Card Grid(최대 8개))은 SCR-004(`/mates`) 화면의 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] 데이터 있으면 카드 최대 8개, 모집중/마감 상태는 조회 시 종료일 계산, 0건 시 완성형 Empty(필터 초기화+작성 CTA+이용 방법)
- [ ] [시각] 상태 배지 텍스트 라벨 병기, 가격·별점 없음
- [ ] [보안/개인정보] 연락처 미노출

## Expected Files
- 신규: 위 파일

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
