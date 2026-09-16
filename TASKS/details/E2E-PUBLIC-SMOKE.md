---
task_id: E2E-PUBLIC-SMOKE
type: test
page_entry: "`tests/e2e/publicSmoke.spec.ts`"
depends_on:
  - PO-SCR-001
  - PO-SCR-002
  - PO-SCR-004
requirements_covered:
  - REQ-NF-025
browser: chromium
---

## 목적
`E2E-PUBLIC-SMOKE`(Playwright Chromium — 공개 흐름 Smoke)은 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] 홈 로드→여행지 상세 Drawer→안전정보 탭 전환, About 로드, 동행 목록 로드(비로그인) — 키보드 탐색 포함
- [ ] [시각] Chromium만 사용

## Expected Files
- 신규: 위 파일

## 금지 사항
- Chromium 이외의 브라우저 엔진은 사용하지 않는다 — Playwright 설정은 Chromium 프로젝트만 유지한다.
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
