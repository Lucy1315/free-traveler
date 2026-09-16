# UI Coverage Analysis — 시니어스윗 저당식품 큐레이션 서비스

- **Document ID:** UICOV-LOW-SUGAR-001
- **기반 문서:** `01_PRD.md`, `02_SRS_BASELINE.md`, `PROJECT_SCOPE.md`
- **대상:** 기능 요구사항 25개 + 비기능 요구사항 26개 = 51개 전량

---

## 1. 목적

SRS 요구사항을 삭제 없이 유지하면서 정확히 5개의 디자인 Screen에 UI 요구사항을 배치한다. `PROJECT_SCOPE.md`의 구현 분류를 그대로 인용하며 이 문서에서 EXCLUDED 요구사항을 다시 구현 범위로 올리지 않는다.

## 2. UI 분류 기준

| 분류 | 정의 |
|---|---|
| **UI_DIRECT** | 사용자가 직접 보고 조작하는 폼·카드·버튼·표·상태 라벨 |
| **UI_STATE** | 오류·빈 상태·로딩·게이트·계산 결과처럼 화면 상태를 결정 |
| **NON_UI** | 서버 규칙·데이터·보안·재사용 금지·idempotency 등 |
| **OPERATIONS** | 운영·분석·비용·SLA·관리 프로세스. 일부는 Admin Screen에 표현 |

## 3. 디자인 Screen 고정 목록(5개)

| Screen ID | 경로 | 역할 요약 |
|---|---|---|
| **SCR-001** | `/` | 홈·파일럿 안내·Core 스크리닝·추천 전 확신도 |
| **SCR-002** | `/recommend` | 부모 조건 입력·요약·추천 Top 3·선정 근거·추천 후 확신도 |
| **SCR-003** | `/order` | 결제 전 조건/주의 요약·외부 1회 결제·상태 안내 |
| **SCR-004** | `/admin/products` | 상품·출처·Hard/Soft 판정·승인·만료·표현 검토 |
| **SCR-005** | `/admin/pilot` | Core/추천/결제/KPI/운영시간/삭제 요청 관리 |

> 기술 Route(`/payment/return`, API/Server Action, auth callback, 정책·오류 Route)는 디자인 Screen에 포함하지 않는다.

### 3.1 Screen 상세 프로필

#### SCR-001 `/`
- **사용자 목표:** 서비스의 비의료적 경계를 이해하고 Core 대상 여부를 확인한 뒤 추천을 시작한다.
- **주요 영역:** Hero, 서비스 3단계 설명, Core 스크리닝, 제외 대상 안내, 추천 전 확신도, 시작 CTA.
- **상태:** 비Core 안내, 스크리닝 오류, 확신도 미입력, 세션 시작 성공.

#### SCR-002 `/recommend`
- **사용자 목표:** 부모 조건을 입력하고 최대 3개 추천과 이유를 이해해 하나를 선택한다.
- **주요 영역:** Stepper, 프로필 폼, 조건 요약, 추천 카드, 선정 근거/출처/검토일, Warning, No Match, 추천 후 확신도.
- **상태:** 입력 오류, 추천 로딩, 1~3개 결과, No Match, 조건 수정.

#### SCR-003 `/order`
- **사용자 목표:** 선택 상품이 어떤 입력과 연결됐는지 다시 확인한 뒤 실제 1회 결제로 이동한다.
- **주요 영역:** 선택 상품, 조건 일치 요약, 주의사항, 비의료 고지, 59,000원, 외부 결제 CTA, 결제 상태 안내.
- **상태:** 준비, 외부 이동, 완료 확인, 취소/실패/미완료.

#### SCR-004 `/admin/products`
- **사용자 목표:** 추천에 사용할 상품 근거와 충돌 판정을 일관되게 검토한다.
- **주요 영역:** 상품 목록, 필수정보 완전성, 출처, 알레르기/식감, Hard/Soft 코드, 선정 문구, Draft/Review/Approved/Expired.
- **상태:** 미완전, 재검토, Approved, Expired, 금지 표현 차단.

#### SCR-005 `/admin/pilot`
- **사용자 목표:** 파일럿 진행 상황과 Go/Retry/Pivot 판단 근거를 확인한다.
- **주요 영역:** Core 수, 유효 추천, 선택시간, 확신도, 결제전환, No Match, 검토시간, 일치율, Critical 누락, 비용/CAC, 삭제 요청.
- **상태:** 표본 부족, 정상 집계, 목표 미달 경고, 데이터 연결 오류.

---

## 4. 기능 요구사항 매핑 — 25개

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | Screen | 비고 |
|---|---|---|---|---|---|
| **REQ-FUNC-COHORT-001** | Core 스크리닝 상태와 cohort_id 기록 | UI_STATE | IMPLEMENT | SCR-001 | 핵심 사용자 흐름 |
| **REQ-FUNC-COHORT-002** | 추천 전 확신도 기록 | UI_DIRECT | IMPLEMENT | SCR-001 | 핵심 사용자 흐름 |
| **REQ-FUNC-PROFILE-001** | 필수 부모 조건 입력 | UI_DIRECT | IMPLEMENT | SCR-002 | 핵심 사용자 흐름 |
| **REQ-FUNC-PROFILE-002** | 알레르기 조건부 필수·상충 검증 | UI_STATE | IMPLEMENT | SCR-002 | 핵심 사용자 흐름 |
| **REQ-FUNC-PROFILE-003** | 조건 요약과 수정 | UI_DIRECT | IMPLEMENT | SCR-002 | 핵심 사용자 흐름 |
| **REQ-FUNC-PROFILE-004** | 다음 방문 자동 재사용 금지 | NON_UI | IMPLEMENT | N/A | 화면 밖 규칙/데이터 처리 |
| **REQ-FUNC-REVIEW-001** | 상품 필수 데이터 완전성 검사 | OPERATIONS | IMPLEMENT | SCR-004 | 운영자 전용 |
| **REQ-FUNC-REVIEW-002** | 허용 근거 출처 제한 | OPERATIONS | IMPLEMENT | SCR-004 | 운영자 전용 |
| **REQ-FUNC-REVIEW-003** | Hard Exclusion 판정·사유 기록 | UI_DIRECT | IMPLEMENT | SCR-004 | 운영자 전용 |
| **REQ-FUNC-REVIEW-004** | Soft Warning 판정·재검토 게이트 | UI_STATE | IMPLEMENT | SCR-004 | 운영자 전용 |
| **REQ-FUNC-REVIEW-005** | 검토 상태·90일 만료 관리 | UI_STATE | IMPLEMENT | SCR-004 | 운영자 전용 |
| **REQ-FUNC-REVIEW-006** | 금지 표현 공개 차단 | UI_STATE | IMPLEMENT | SCR-004 | 운영자 전용 |
| **REQ-FUNC-RECO-001** | Approved·최신·재고 가능 후보 풀 게이트 | NON_UI | IMPLEMENT | N/A | 화면 밖 규칙/데이터 처리 |
| **REQ-FUNC-RECO-002** | 사용자 조건 기반 Hard Exclusion 적용 | NON_UI | IMPLEMENT | N/A | 화면 밖 규칙/데이터 처리 |
| **REQ-FUNC-RECO-003** | Eligible·Soft Warning 판정 | NON_UI | IMPLEMENT | N/A | 화면 밖 규칙/데이터 처리 |
| **REQ-FUNC-RECO-004** | 정렬 후 최대 3개 노출 | UI_DIRECT | IMPLEMENT | SCR-002 | 핵심 사용자 흐름 |
| **REQ-FUNC-RECO-005** | No Match 안내·조건 수정/검토 요청 | UI_STATE | IMPLEMENT | SCR-002 | 핵심 사용자 흐름 |
| **REQ-FUNC-RECO-006** | 선정 근거·출처·검토일·비의료 경계 표시 | UI_DIRECT | IMPLEMENT | SCR-002 | 핵심 사용자 흐름 |
| **REQ-FUNC-RECO-007** | 추천 후 확신도·선택 완료 기록 | UI_DIRECT | IMPLEMENT | SCR-002 | 핵심 사용자 흐름 |
| **REQ-FUNC-PAY-001** | 외부 1회 결제 경로 제공 | UI_DIRECT | IMPLEMENT | SCR-003 | 핵심 사용자 흐름 |
| **REQ-FUNC-PAY-002** | 결제 완료 상태 기록 | UI_STATE | IMPLEMENT | SCR-003 | 핵심 사용자 흐름 |
| **REQ-FUNC-PAY-003** | 취소·실패·미완료 상태 구분 | UI_STATE | IMPLEMENT | SCR-003 | 핵심 사용자 흐름 |
| **REQ-FUNC-METRIC-001** | 핵심 이벤트를 cohort/session/payment에 연결 | NON_UI | IMPLEMENT | N/A | 화면 밖 규칙/데이터 처리 |
| **REQ-FUNC-METRIC-002** | North Star KPI 분모·분자 계산 | OPERATIONS | IMPLEMENT | SCR-005 | 파일럿 분석/판정 |
| **REQ-FUNC-METRIC-003** | Go/Retry/Pivot 구간 판정 | UI_DIRECT | IMPLEMENT | SCR-005 | 파일럿 분석/판정 |


## 5. 비기능 요구사항 매핑 — 26개

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | Screen | 비고 |
|---|---|---|---|---|---|
| **REQ-NFR-PERF-001** | 모바일 초기 화면 p95 2.5초 | NON_UI | IMPLEMENT(축소) | N/A | 인프라/서버/운영 기준 |
| **REQ-NFR-PERF-002** | 프로필 저장/검증 p95 1초 | UI_STATE | IMPLEMENT(축소) | SCR-002 | 화면 품질/상태 기준 |
| **REQ-NFR-PERF-003** | 추천 결과 p95 3초 | UI_STATE | IMPLEMENT(축소) | SCR-002 | 화면 품질/상태 기준 |
| **REQ-NFR-PERF-004** | 외부 결제 이동 2초 | UI_STATE | IMPLEMENT(축소) | SCR-003 | 화면 품질/상태 기준 |
| **REQ-NFR-PERF-005** | 동시 사용자 100명 지원 | NON_UI | EXCLUDED | N/A | Scope 제외 — UI로 복원 금지 |
| **REQ-NFR-AVAIL-001** | 월간 가용성 99.5% | OPERATIONS | EXCLUDED | N/A | Scope 제외 — UI로 복원 금지 |
| **REQ-NFR-AVAIL-002** | 핵심 흐름 오류 없는 완료율 99% | OPERATIONS | IMPLEMENT(축소) | N/A | 인프라/서버/운영 기준 |
| **REQ-NFR-AVAIL-003** | 프로필 저장 실패율 1% 미만 | OPERATIONS | IMPLEMENT(축소) | N/A | 인프라/서버/운영 기준 |
| **REQ-NFR-AVAIL-004** | 중복 결제 완료 기록 0건 | NON_UI | IMPLEMENT | N/A | 인프라/서버/운영 기준 |
| **REQ-NFR-AVAIL-005** | 핵심 장애 4시간 이내 복구 | OPERATIONS | EXCLUDED | N/A | Scope 제외 — UI로 복원 금지 |
| **REQ-NFR-SEC-001** | TLS 1.2 이상 | NON_UI | IMPLEMENT | N/A | 인프라/서버/운영 기준 |
| **REQ-NFR-SEC-002** | 저장 데이터 암호화 | NON_UI | IMPLEMENT | N/A | 인프라/서버/운영 기준 |
| **REQ-NFR-SEC-003** | 관리자 개별 계정 | NON_UI | IMPLEMENT | N/A | 인프라/서버/운영 기준 |
| **REQ-NFR-PRIV-001** | 주민번호·진료기록·혈당 원자료 수집 금지 | NON_UI | IMPLEMENT | N/A | 인프라/서버/운영 기준 |
| **REQ-NFR-PRIV-002** | 미결제 프로필 최대 90일 보관 | OPERATIONS | IMPLEMENT | N/A | 인프라/서버/운영 기준 |
| **REQ-NFR-PRIV-003** | 삭제 요청 7일 이내 처리 | OPERATIONS | IMPLEMENT(방식 변경) | SCR-005 | 관리/집계 상태 |
| **REQ-NFR-PRIV-004** | 분석 프로필의 다음 방문 재사용 금지 | NON_UI | IMPLEMENT | N/A | 인프라/서버/운영 기준 |
| **REQ-NFR-OPS-001** | 수동 검토 중앙값 7분/P90 10분 | OPERATIONS | IMPLEMENT | SCR-005 | 관리/집계 상태 |
| **REQ-NFR-OPS-002** | 검토자 판정 일치율 90% | OPERATIONS | IMPLEMENT | SCR-005 | 관리/집계 상태 |
| **REQ-NFR-OPS-003** | Critical 충돌 누락 0건 | OPERATIONS | IMPLEMENT | SCR-005 | 관리/집계 상태 |
| **REQ-NFR-OPS-004** | 월 클라우드·도구 비용 50만원 이하 | OPERATIONS | IMPLEMENT(방식 변경) | SCR-005 | 관리/집계 상태 |
| **REQ-NFR-OPS-005** | 추천 1건당 시스템 비용 1천원 이하 | OPERATIONS | IMPLEMENT(방식 변경) | SCR-005 | 관리/집계 상태 |
| **REQ-NFR-OPS-006** | 유료 CAC 2.7만원 이하 목표 | OPERATIONS | IMPLEMENT(방식 변경) | SCR-005 | 관리/집계 상태 |
| **REQ-NFR-CONTENT-001** | 상품별 선정 이유 2개 이상 | UI_STATE | IMPLEMENT | SCR-002 | 화면 품질/상태 기준 |
| **REQ-NFR-CONTENT-002** | 출처·검토일 누락 0건 | UI_STATE | IMPLEMENT | SCR-002 | 화면 품질/상태 기준 |
| **REQ-NFR-CONTENT-003** | 금지 의료·건강 표현 공개 0건 | UI_STATE | IMPLEMENT | SCR-002/SCR-004 | 화면 품질/상태 기준 |


---

## 6. 검증

### 6.1 Requirement 총수

| 구분 | 개수 |
|---|---:|
| 기능 | 25 |
| 비기능 | 26 |
| **합계** | **51** |

### 6.2 UI 분류별 집계

| UI 분류 | 개수 |
|---|---:|
| UI_DIRECT | 9 |
| UI_STATE | 14 |
| NON_UI | 13 |
| OPERATIONS | 15 |
| **합계** | **51** |

### 6.3 Screen별 UI 요구사항 수

| Screen | UI_DIRECT·UI_STATE 배치 수 |
|---|---:|
| SCR-001 | 2 |
| SCR-002 | 12 |
| SCR-003 | 4 |
| SCR-004 | 5 |
| SCR-005 | 1 |

- 51개 요구사항은 본 문서 4·5장에 정확히 1회씩 등장한다.
- `PROJECT_SCOPE.md`에서 EXCLUDED한 요구사항은 Screen을 `N/A`로 유지하거나 비구현 상태로만 설명한다.
- 운영 요구사항이 SCR-005에 보이더라도 이는 지표/처리 상태의 시각화이며 SRS 요구 자체를 변경하지 않는다.
