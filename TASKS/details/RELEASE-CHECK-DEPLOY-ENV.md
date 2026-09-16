---
task_id: RELEASE-CHECK-DEPLOY-ENV
type: release_check
page_entry: "N/A(체크리스트 문서)"
depends_on:
  - CI-LINT-TYPECHECK
requirements_covered:
  - REQ-NF-012
  - REQ-NF-016
  - REQ-NF-034
---

## 목적
`RELEASE-CHECK-DEPLOY-ENV`(배포 환경·보안 릴리스 점검)은 SKILL·UI_CONTRACT 정의를 구현한다.

## Acceptance Criteria
- [ ] Vercel/Supabase 연결 확인, TLS 적용 확인
- [ ] [보안/개인정보] 비밀키 클라이언트 번들 미포함 확인, 월 비용 목표(10만원 이하) 확인

## Expected Files
- 신규 코드 파일 없음(문서화·체크리스트 산출물)

## 금지 사항
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI 금지(D-001 Do Not).
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버·컴퓨팅 인스턴스 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구 금지, 빈 카드(CTA 없는 Empty) 금지.
- PROJECT_SCOPE.md EXCLUDED 항목을 이 Task 범위에서 재구현하지 않는다.
