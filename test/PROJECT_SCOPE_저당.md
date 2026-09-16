# Project Scope — 시니어스윗 저당식품 큐레이션 서비스

- **Document ID:** SCOPE-LOW-SUGAR-001
- **기반 문서:** `01_PRD.md`, `02_SRS_BASELINE.md`
- **대상:** 기능 요구사항 25개 + 비기능 요구사항 26개 = **51개 전량 1회 분류**
- **대상 플랫폼:** 모바일 우선 반응형 웹

---

## 1. 목적

본 문서는 SRS의 요구사항을 삭제하지 않고 이번 MVP 빌드에서 `IMPLEMENT`, `IMPLEMENT(축소/방식 변경)`, `EXCLUDED`로 분류한다. UI Coverage와 UI/UX Plan은 이 분류를 그대로 사용하며 별도로 구현 범위를 넓히지 않는다.

## 2. 구현 범위 개요

1. 5개 디자인 Screen: 홈/파일럿 시작, 부모조건·추천, 결제 전 확인·1회 결제, 운영자 상품검토, 파일럿 지표.
2. 로그인 없는 Core 파일럿 세션과 `cohort_id` 기반 측정.
3. 부모 조건 입력·상충 검증·요약.
4. 규칙 기반 Hard Exclusion·Soft Warning·Eligible·No Match.
5. 사전 승인 상품 최대 3개와 선정 근거 2개 이상.
6. Reviewer/Admin용 상품·출처·판정·승인·만료 관리.
7. 외부 1회 결제 이동과 주문번호 기반 완료/실패/취소 기록.
8. North Star 및 운영 지표의 최소 파일럿 대시보드.
9. 개인정보 최소수집·90일 보관·수동 삭제 처리.
10. Playwright 핵심 Smoke/E2E와 수동 검수, Vercel 배포.

## 3. 구현 방식(공통 원칙)

| 원칙 | 결정 |
|---|---|
| 앱 구조 | Next.js App Router + TypeScript 단일 웹 앱 |
| UI | Tailwind CSS + shadcn/ui, 5개 디자인 Screen 고정 |
| 데이터 | Supabase PostgreSQL |
| Core 사용자 | 회원가입 없이 세션·`cohort_id`; 다음 방문 프로필 자동 복원 없음 |
| 운영자 인증 | Supabase Auth, Reviewer/Admin 개별 계정 |
| 추천 | 규칙 기반 필터 + Approved 상품 + 설명 가능한 정렬. AI/ML 학습 없음 |
| 상품 검토 | Admin UI에서 표시정보·출처·Hard/Soft 판정·검토일 관리 |
| 결제 | 자체 PG 없음. 외부 결제 링크 + 주문번호/상태 운영 확인. 카드 원정보 미저장 |
| KPI | 이벤트·세션·결제 상태를 Supabase에 연결, 초기에는 단순 집계 |
| 배포 | Vercel |
| 테스트 | Playwright 핵심 흐름 + 수동 운영/콘텐츠 검수 |

## 4. 공통 제외 범위

| 제외 항목 | 사유/재검토 조건 |
|---|---|
| 정기구독·자동결제 | 2회차 구매율 35% 이상 + 단위경제 확인 후 |
| 저장 프로필 기반 재주문·가족 계정 | 반복 구매 증거 확보 후 |
| AI/ML 자동 추천 학습 | 유효 추천·선택 데이터 1,000건 이후 |
| 전체 상품 검색·최저가 비교 | 제한 상품군이 이탈 원인으로 확인될 때 |
| 자동 크롤링·대규모 상품 수집 | 등록 100개 초과 또는 수동 등록 주 10시간 초과 |
| 혈당 수치 기반 추천·질환 진단·치료 조언 | 제품 원칙상 MVP 제외, 별도 의료·규제 검토 필요 |
| 자체 물류·창고·배송 시스템 | 월 주문 500건 이상일 때 재검토 |
| 자동 부하시험·24/7 SLO 모니터링·장애 알림 | 파일럿 이전 MVP 개발 범위 밖 |

---

## 5. 기능 요구사항 — 25개

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| **REQ-FUNC-COHORT-001** | IMPLEMENT | 스크리닝 통과 시 충돌 없는 `cohort_id`를 발급하고 세션에 연결한다. | Playwright: 정상·오류·빈 상태 핵심 경로를 확인한다. |
| **REQ-FUNC-COHORT-002** | IMPLEMENT | 홈에서 5점 척도 추천 전 확신도를 필수 입력으로 수집한다. | Playwright: 정상·오류·빈 상태 핵심 경로를 확인한다. |
| **REQ-FUNC-PROFILE-001** | IMPLEMENT | `/recommend`에 당 관리 주의·알레르기·제외 성분·식감 입력 폼을 구현한다. | Playwright: 정상·오류·빈 상태 핵심 경로를 확인한다. |
| **REQ-FUNC-PROFILE-002** | IMPLEMENT | 알레르기 있음 시 성분 입력을 강제하고 없음+성분 입력 상충을 차단한다. | Playwright: 정상·오류·빈 상태 핵심 경로를 확인한다. |
| **REQ-FUNC-PROFILE-003** | IMPLEMENT | 추천 전 조건 요약과 수정 액션을 제공한다. | Playwright: 정상·오류·빈 상태 핵심 경로를 확인한다. |
| **REQ-FUNC-PROFILE-004** | IMPLEMENT | 프로필은 현재 파일럿 세션에만 사용하고 다음 방문 자동 채움 코드를 두지 않는다. | Playwright: 정상·오류·빈 상태 핵심 경로를 확인한다. |
| **REQ-FUNC-REVIEW-001** | IMPLEMENT | 상품 저장/승인 전 필수 데이터 체크리스트를 적용한다. | Playwright + 운영 검수: 상태/차단/기록 필드를 확인한다. |
| **REQ-FUNC-REVIEW-002** | IMPLEMENT | 포장 표시·제조사 공식 정보 등 허용 출처 타입만 승인 가능하게 한다. | Playwright + 운영 검수: 상태/차단/기록 필드를 확인한다. |
| **REQ-FUNC-REVIEW-003** | IMPLEMENT | 운영 화면에서 Hard Exclusion 코드·사유·근거를 구조화해 기록한다. | Playwright + 운영 검수: 상태/차단/기록 필드를 확인한다. |
| **REQ-FUNC-REVIEW-004** | IMPLEMENT | Soft Warning을 기록하고 2개 이상이면 Approved 전환을 차단한다. | Playwright + 운영 검수: 상태/차단/기록 필드를 확인한다. |
| **REQ-FUNC-REVIEW-005** | IMPLEMENT | Draft/Review/Approved/Expired 상태와 90일 만료 계산을 구현한다. | Playwright + 운영 검수: 상태/차단/기록 필드를 확인한다. |
| **REQ-FUNC-REVIEW-006** | IMPLEMENT | 금지 표현 체크리스트 통과 전 Approved/노출을 차단한다. | Playwright + 운영 검수: 상태/차단/기록 필드를 확인한다. |
| **REQ-FUNC-RECO-001** | IMPLEMENT | Approved·90일 이내·Available·필수 필드 완전 상품만 후보 쿼리에 포함한다. | Playwright: 정상·오류·빈 상태 핵심 경로를 확인한다. |
| **REQ-FUNC-RECO-002** | IMPLEMENT | 프로필과 원재료/알레르기/식감 조건을 규칙으로 비교해 Hard 충돌을 제외한다. | Playwright: 정상·오류·빈 상태 핵심 경로를 확인한다. |
| **REQ-FUNC-RECO-003** | IMPLEMENT | Hard 충돌이 없는 후보에 Eligible/Soft Warning 상태를 계산한다. | Playwright: 정상·오류·빈 상태 핵심 경로를 확인한다. |
| **REQ-FUNC-RECO-004** | IMPLEMENT | Eligible 후보를 정렬해 최대 3개만 표시한다. 미확정 가중치는 적용하지 않고 동점 규칙/운영 priority를 사용한다. | Playwright: 정상·오류·빈 상태 핵심 경로를 확인한다. |
| **REQ-FUNC-RECO-005** | IMPLEMENT | 0개면 Empty State와 조건 수정/운영 검토 요청을 표시하고 임의 상품을 채우지 않는다. | Playwright: 정상·오류·빈 상태 핵심 경로를 확인한다. |
| **REQ-FUNC-RECO-006** | IMPLEMENT | 상품별 선정 이유≥2, 출처, 검토일, 주의사항, 비의료적 고지를 표시한다. | Playwright: 정상·오류·빈 상태 핵심 경로를 확인한다. |
| **REQ-FUNC-RECO-007** | IMPLEMENT | 추천 후 확신도·선택 상품·선택 완료 시각을 동일 세션에 기록한다. | Playwright: 정상·오류·빈 상태 핵심 경로를 확인한다. |
| **REQ-FUNC-PAY-001** | IMPLEMENT | `/order`에서 선택 조건 요약 후 외부 결제 URL을 새 탭/안전한 링크로 제공한다. | Playwright: 정상·오류·빈 상태 핵심 경로를 확인한다. |
| **REQ-FUNC-PAY-002** | IMPLEMENT | 운영 확인된 주문번호·금액·완료 시각을 세션에 연결한다. | Playwright: 정상·오류·빈 상태 핵심 경로를 확인한다. |
| **REQ-FUNC-PAY-003** | IMPLEMENT | 완료/취소/실패/미완료를 분리 저장한다. | Playwright: 정상·오류·빈 상태 핵심 경로를 확인한다. |
| **REQ-FUNC-METRIC-001** | IMPLEMENT | 세션·추천·결제 이벤트에 cohort/session/order 식별자를 연결한다. | 테스트 데이터로 집계 결과를 수동 대조한다. |
| **REQ-FUNC-METRIC-002** | IMPLEMENT | SCR-005에서 유효 추천 Core 사용자 기준 분모/분자를 집계한다. | 테스트 데이터로 집계 결과를 수동 대조한다. |
| **REQ-FUNC-METRIC-003** | IMPLEMENT | 20% 이상 Go, 10~19% Retry, 10% 미만 Pivot 라벨을 계산·표시한다. | 테스트 데이터로 집계 결과를 수동 대조한다. |


## 6. 비기능 요구사항 — 26개

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| **REQ-NFR-PERF-001** | IMPLEMENT(축소) | Lighthouse/개발자도구로 대표 모바일 페이지를 표본 측정하되 CI p95 게이트는 두지 않는다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-PERF-002** | IMPLEMENT(축소) | 프로필 저장/검증을 단일 요청으로 처리하고 개발환경 표본 응답시간을 점검한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-PERF-003** | IMPLEMENT(축소) | 추천 쿼리와 규칙 평가를 한 요청에 묶고 대표 조건 표본에서 응답시간을 점검한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-PERF-004** | IMPLEMENT(축소) | 결제 링크 클릭 후 브라우저 이동 시작을 수동 측정한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-PERF-005** | EXCLUDED | 100명 동시 부하시험 환경은 구축하지 않는다. 기능 설계는 무상태/DB 인덱스 원칙으로 유지한다. | 해당 없음. 제외 상태가 UI/Scope에서 복원되지 않는지 검토한다. |
| **REQ-NFR-AVAIL-001** | EXCLUDED | 월간 99.5% SLO 측정·모니터링 파이프라인은 파일럿에서 구축하지 않는다. | 해당 없음. 제외 상태가 UI/Scope에서 복원되지 않는지 검토한다. |
| **REQ-NFR-AVAIL-002** | IMPLEMENT(축소) | 핵심 3개 사용자 흐름 Playwright Smoke를 배포 전 실행한다. 실제 99% 운영값 자동 산출은 하지 않는다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-AVAIL-003** | IMPLEMENT(축소) | 프로필 저장 오류 경로를 테스트하고 운영 중 오류 건을 수동 점검한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-AVAIL-004** | IMPLEMENT | 주문번호에 unique/idempotency 제약을 적용해 completed 중복 생성을 차단한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-AVAIL-005** | EXCLUDED | 4시간 복구 SLA 자동 추적·당직 체계는 파일럿 범위 밖이다. | 해당 없음. 제외 상태가 UI/Scope에서 복원되지 않는지 검토한다. |
| **REQ-NFR-SEC-001** | IMPLEMENT | Vercel/Supabase의 HTTPS/TLS를 사용한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-SEC-002** | IMPLEMENT | Supabase 저장·전송 기본 암호화와 비밀정보 환경변수 관리를 사용한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-SEC-003** | IMPLEMENT | Reviewer/Admin에 개별 Supabase Auth 계정을 발급하고 공유 계정을 금지한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-PRIV-001** | IMPLEMENT | 금지 민감정보 입력 필드를 만들지 않고 자유서술 필드도 최소화한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-PRIV-002** | IMPLEMENT | 미결제 세션/프로필에 90일 만료일을 저장하고 운영자가 만료 삭제할 수 있게 한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-PRIV-003** | IMPLEMENT(방식 변경) | 셀프서비스 삭제 UI 대신 Admin이 요청 접수일·처리일을 기록해 7일 이내 수동 삭제한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-PRIV-004** | IMPLEMENT | 프로필 자동 복원·재주문 기능을 구현하지 않는다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-OPS-001** | IMPLEMENT | 상품 검토 시작/완료 시각을 저장하고 SCR-005에서 median/P90을 집계한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-OPS-002** | IMPLEMENT | 이중 검토 샘플의 판정 결과를 저장하고 일치율을 집계한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-OPS-003** | IMPLEMENT | 검증용 Critical 샘플에서 누락 건수를 집계한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-OPS-004** | IMPLEMENT(방식 변경) | 월 도구 비용을 Admin이 수동 입력해 대시보드에서 비교한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-OPS-005** | IMPLEMENT(방식 변경) | 추천 처리량과 월 도구 비용으로 단순 시스템 원가를 산출한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-OPS-006** | IMPLEMENT(방식 변경) | 광고비와 유료 고객 수를 수동 입력해 CAC를 산출한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-CONTENT-001** | IMPLEMENT | 추천 카드마다 선정 이유 2개 이상 없으면 렌더링/승인을 차단한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-CONTENT-002** | IMPLEMENT | 출처 URL/증빙과 검토일 누락 상품을 추천 후보에서 제외한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |
| **REQ-NFR-CONTENT-003** | IMPLEMENT | 금지 표현 체크리스트 + 운영 승인 게이트로 공개를 차단한다. | Playwright/수동 QA/집계 데이터 대조로 확인한다. |


---

## 7. 요약

| 구분 | 수량 |
|---|---:|
| 기능 요구사항 | 25 |
| 비기능 요구사항 | 26 |
| 전체 | 51 |
| IMPLEMENT 계열 | 48 |
| EXCLUDED | 3 |
| 디자인 Screen | 5 |

**Scope Gate:** EXCLUDED 3개 요구사항을 UI Coverage 또는 UI/UX Plan에서 화면 기능으로 복원하지 않는다. 결제 제공자·법적 보존 세부·판매/배송 책임 주체 등 SRS Open Questions는 별도 결정 전까지 현재의 수동/외부 경계 방식을 유지한다.
