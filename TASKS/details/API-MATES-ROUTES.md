---
task_id: API-MATES-ROUTES
type: api
screen_id: SCR-004
page_entry: "`src/app/api/mates/route.ts`, `src/app/api/mates/[id]/route.ts`, `src/app/api/mates/[id]/applications/route.ts`, `src/app/api/applications/[id]/route.ts`, `src/app/api/blocks/route.ts`"
depends_on:
  - DB-ACCESS
requirements_covered:
  - REQ-FUNC-030
  - REQ-FUNC-033
  - REQ-FUNC-034
  - REQ-FUNC-035
  - REQ-FUNC-036
  - REQ-FUNC-037
  - REQ-FUNC-039
  - REQ-FUNC-040
---

## 목적
`API-MATES-ROUTES`(동행 Route Handler)은 SCR-004() 화면의 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] 목록/상세/참가요청/승인거절/차단 API
- [ ] [보안/개인정보] 항공·호텔 관련 데이터 없음, 연락처 응답 제외

## Expected Files
- 신규: 위 5개

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
