---
task_id: E2E-TRAVEL-TOOLS
type: test
screen_id: SCR-003
page_entry: "`tests/e2e/travelTools.spec.ts`"
depends_on:
  - PO-SCR-003
requirements_covered:
  - REQ-FUNC-014
  - REQ-FUNC-022
  - REQ-FUNC-031
browser: chromium
---

## 목적
`E2E-TRAVEL-TOOLS`(Playwright Chromium — 여행 준비 흐름)은 SCR-003() 화면의 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] 항공 입력→요약→외부이동 새 탭 검증, 숙소 동일 흐름, 동행 글쓰기 폼 검증(로그인 없이 접근 시 안내)
- [ ] [시각] Chromium만 사용
- [ ] [보안/개인정보] 네트워크 탭에서 원시 입력값 미전송 확인

## Expected Files
- 신규: 위 파일

## 금지 사항
- Chromium 이외의 브라우저 엔진은 사용하지 않는다 — Playwright 설정은 Chromium 프로젝트만 유지한다.
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
