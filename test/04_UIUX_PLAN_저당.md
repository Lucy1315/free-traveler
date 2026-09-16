# UI/UX Plan — 시니어스윗 저당식품 큐레이션 서비스

- **Document ID:** UIUX-LOW-SUGAR-001
- **기반 문서:** `01_PRD.md`, `02_SRS_BASELINE.md`, `PROJECT_SCOPE.md`, `03_UI_COVERAGE_ANALYSIS.md`
- **대상 Screen:** SCR-001~005, 정확히 5개
- **디자인 목표:** “건강 쇼핑몰”보다 **차분하고 설명 가능한 큐레이션 도구**로 인식되게 한다.

---

## 1. 목적과 디자인 원칙

1. 상품 수보다 **판단 근거**를 먼저 보이게 한다.
2. 의료적 안전을 암시하지 않고 `조건 일치`, `주의`, `확인된 출처` 언어를 사용한다.
3. 40~59세 사용자가 부모 조건을 빠르게 입력하도록 긴 설문보다 Stepper와 큰 선택지를 사용한다.
4. 추천은 최대 3개이며 카드 간 비교가 한 화면에서 가능해야 한다.
5. Hard Exclusion은 사용자 결과 카드에 “추천 제외 상품”으로 노출하지 않고 후보 단계에서 제거한다. 필요한 경우 왜 후보가 적은지만 설명한다.
6. Soft Warning·No Match·오류는 색상만으로 구분하지 않고 텍스트 라벨을 병기한다.
7. 운영자 화면은 예쁜 대시보드보다 **누락 없는 검토와 추적성**을 우선한다.

## 2. 디자인 토큰

### 2.1 색상

| 토큰 | 값 | 용도 |
|---|---|---|
| `color-canvas` | `#FFFEFB` | 전체 배경 |
| `color-surface-soft` | `#F6F5EF` | 섹션·요약 박스 |
| `color-surface-strong` | `#ECEFEA` | 비활성 Chip·테이블 헤더 |
| `color-ink` | `#222824` | 제목·핵심 본문 |
| `color-body` | `#4C5550` | 일반 본문 |
| `color-muted` | `#78817C` | 메타·캡션 |
| `color-hairline` | `#E0E4DF` | 1px 구분선 |
| `color-primary-500` | `#2F6B57` | Primary CTA, 활성 상태 |
| `color-primary-600` | `#245545` | hover/pressed |
| `color-primary-100` | `#E2EFE9` | 선택 Chip·설명 배경 |
| `color-on-primary` | `#FFFFFF` | Primary 위 텍스트 |
| `color-accent` | `#B96F43` | 가격·실험 CTA 보조 강조 |
| `color-warning` | `#9A6517` | Soft Warning·재검토 |
| `color-error` | `#B3264A` | 입력 오류·차단 |
| `color-success` | `#287A4B` | Approved·결제 완료 |
| `color-info` | `#35679A` | 출처·중립 안내 |
| `color-focus-ring` | `#1D4ED8` | 키보드 포커스 |
| `color-scrim` | `rgba(34,40,36,0.45)` | Modal/Drawer |

> 건강 의미를 색상 하나로 전달하지 않는다. “주의”, “추천 가능”, “검토 만료” 같은 텍스트 라벨을 항상 병기한다.

### 2.2 타이포그래피

폰트: `Inter, Pretendard, -apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif`.

| 토큰 | 크기 | 굵기 | 줄간격 | 용도 |
|---|---:|---:|---:|---|
| `display-xl` | 34px | 700 | 1.35 | Hero |
| `display-lg` | 26px | 700 | 1.4 | Screen 제목 |
| `display-md` | 21px | 600 | 1.45 | Section 제목 |
| `title-md` | 18px | 600 | 1.45 | 카드 제목 |
| `body-lg` | 17px | 400 | 1.65 | 중요 설명·고지 |
| `body-md` | 16px | 400 | 1.6 | 기본 본문 |
| `body-sm` | 14px | 400 | 1.55 | 메타·출처 |
| `caption` | 13px | 500 | 1.45 | 라벨·배지 |
| `button-md` | 16px | 600 | 1.25 | 버튼 |

### 2.3 Spacing·Radius·Elevation

| 항목 | 값 |
|---|---|
| 기본 spacing | 4px 배수: 4/8/12/16/24/32/48/64/96 |
| Mobile 좌우 | 16px |
| Desktop 최대 폭 | 1180px |
| 카드 padding | 20~24px |
| 입력/버튼 높이 | 48px 이상 |
| 최소 터치 영역 | 44×44px |
| radius | 10px(입력/버튼), 16px(카드), full(Chip/Badge) |
| elevation | 카드 hover·Modal·Toast만 단일 그림자 사용 |

### 2.4 레이아웃

- Desktop 기준 1440px, Mobile 기준 390px.
- 사용자 추천 흐름은 Mobile 1열, Desktop도 본문 최대 760~900px로 제한해 설문 가독성을 우선한다.
- 추천 결과는 Desktop 3열, Tablet 2열, Mobile 1열.
- Admin은 Desktop table+drawer, Mobile card list+bottom sheet로 전환한다.

## 3. 공통 Header·Footer

### 3.1 Header

- 좌측: `SeniorSweet` 텍스트 로고 + 작은 `파일럿` Badge.
- Public 중앙/우측: “서비스 원칙”, “추천 시작”, “개인정보 안내”.
- Admin 로그인 시: “상품 검토”, “파일럿 지표” 링크를 권한에 따라 노출.
- Mobile: 로고 + 메뉴 버튼, 높이 56px. Desktop 72px.

### 3.2 Footer

- “서비스 범위”: 의료 상담/진단/치료 서비스가 아님.
- “근거”: 포장 표시·제조사 공식 정보 기반이며 최종 구매 전 제품 표시 재확인 권고.
- 개인정보 처리·이용약관 링크는 기술 Route로 제공하고 5개 Screen에 포함하지 않는다.

## 4. 공통 컴포넌트

| 컴포넌트 | 목적 |
|---|---|
| `button-primary` | 추천 시작·다음 단계. 진한 Sage 배경, 48px 높이 |
| `button-secondary` | 조건 수정·이전·재시도 |
| `stepper` | 스크리닝 → 조건 → 추천 → 선택/결제의 현재 단계 |
| `choice-card` | 라디오/체크박스 대신 큰 선택 영역. 제목+1문장 설명 |
| `form-field` | 라벨+입력+헬퍼+오류를 한 묶음으로 제공 |
| `condition-chip` | “우유 알레르기”, “단단한 식감 어려움” 등 사용자 입력 요약 |
| `recommend-card` | 상품명·가격·선정 이유≥2·주의·출처·검토일·선택 CTA |
| `reason-row` | 사용자 조건 → 제품 정보 → 설명의 3열/세로 연결 표현 |
| `warning-callout` | Soft Warning와 추가 확인 사항. 경고색+텍스트 |
| `boundary-callout` | “의학적 안전성 보증이 아님” 고정 안내 |
| `source-meta` | 출처 종류·원문 링크·검토일 |
| `status-badge` | Draft/Review/Approved/Expired, 결제 상태 등 |
| `empty-state` | No Match/데이터 없음 + 다음 행동 CTA |
| `metric-card` | KPI 값+목표+표본수+상태 라벨. 과한 그래프 대신 숫자 우선 |
| `toast` | 저장·상태 변경 피드백 |
| `confirm-dialog` | Approved 전환·결제 상태 수정·삭제 등 중요 액션 확인 |

---

## 5. Screen 계획

### 5.1 SCR-001 `/` — 홈·파일럿 시작, 6 Section

| # | 유형 | 목적 | 핵심 콘텐츠/CTA | Requirement |
|---|---|---|---|---|
| 1 | Hero | 가치 제안 | “저당 상품을 많이 찾기보다, 왜 부모님 조건에 맞는지 확인하세요.” + `추천 시작` | PRD §1, §3 |
| 2 | 3-Step | 서비스 이해 | 부모 조건 입력 → 최대 3개와 이유 확인 → 1회 구매 결정 | 제품 흐름 |
| 3 | Boundary | 의료 오인 방지 | 진단·치료·혈당 안전 보증 아님, 전문 식이 필요 시 제외 | PRD 원칙 1 |
| 4 | Screening | Core 대상 확인 | 40~59세, 부모 연령/별거, 당 관리 주의, 온라인 발송 경험 등 | COHORT-001 |
| 5 | Exclusion | 전문 판단 필요 케이스 | 인슐린 치료·중증 알레르기·삼킴 장애 등은 파일럿 제외 | PRD §2-2 |
| 6 | Confidence | 추천 전 측정 | 1~5점 선택 + `부모 조건 입력하기` | COHORT-002 |

**상태:** Default / Screening fail / Required missing / Session created. 비Core면 “서비스 대상이 아닙니다”보다 “이번 파일럿 범위와 맞지 않습니다”를 사용한다.

### 5.2 SCR-002 `/recommend` — 조건 입력·추천, 7 Section

| # | 유형 | 목적 | 핵심 콘텐츠/CTA | Requirement |
|---|---|---|---|---|
| 1 | Stepper | 진행상황 | 1 조건 입력 → 2 조건 확인 → 3 추천 → 4 선택 | PROFILE/RECO |
| 2 | Form | 필수 조건 | 당 관리 주의, 알레르기 상태/성분, 제외 성분, 선호/어려운 식감 | PROFILE-001/002 |
| 3 | Summary | 입력 검토 | Condition Chip + `수정` | PROFILE-003 |
| 4 | Result header | 결과 수 안내 | “확인된 후보 2개”처럼 실제 수 표시, 3개 강제 보충 금지 | RECO-004 |
| 5 | Cards | 설명 가능한 추천 | 최대 3개, 선정 이유 2개 이상, 주의, 출처, 검토일 | RECO-004/006, CONTENT |
| 6 | No Match | 실패를 정직하게 표현 | 조건 수정 + 운영 검토 요청, 임의 상품 추천 금지 | RECO-005 |
| 7 | Post confidence | 선택 측정 | 추천 후 1~5점 + 상품 선택 CTA | RECO-007 |

**추천 카드 정보 우선순위:** 상품명/가격 → “부모님 조건과 연결된 이유” → 주의사항 → 당류 수치/비교 기준 → 출처/검토일 → 선택 버튼. “추천 점수 93점” 같은 근거 없는 단일 점수는 사용하지 않는다.

### 5.3 SCR-003 `/order` — 결제 전 확인·1회 결제, 5 Section

| # | 유형 | 목적 | 핵심 콘텐츠/CTA | Requirement |
|---|---|---|---|---|
| 1 | Selected product | 선택 재확인 | 상품명·구성·59,000원 | PAY-001 |
| 2 | Suitability summary | 결정 근거 재확인 | 입력 조건, 일치 이유, Warning, 출처·검토일 | PRD AC-C01 |
| 3 | Boundary | 위험한 과신 방지 | “표시정보 비교이며 의학적 안전성 판단이 아닙니다” | RECO-006 |
| 4 | Payment CTA | 행동 검증 | `외부 결제 페이지로 이동` + 외부 결제 고지 | PAY-001 |
| 5 | Payment state | 상태 구분 | 완료/취소/실패/미완료를 각각 다른 문구로 표현 | PAY-002/003 |

결제 완료 전에는 “주문 완료”라고 표현하지 않는다. 외부 결제 상태가 확인되지 않으면 `결제 확인 중` 또는 `미완료`로 유지한다.

### 5.4 SCR-004 `/admin/products` — 운영자 상품 검토, 6 Section

| # | 유형 | 목적 | 핵심 콘텐츠 | Requirement |
|---|---|---|---|---|
| 1 | Toolbar | 검토 큐 | 상태 필터 Draft/Review/Approved/Expired, 검색 | REVIEW-005 |
| 2 | Product table | 상품 목록 | 브랜드·상품명·당류/1회·출처·검토일·상태 | REVIEW-001/005 |
| 3 | Data drawer | 표시정보 | 원재료, 알레르기, 식감, 출처 URL/증빙 | REVIEW-001/002 |
| 4 | Decision panel | 충돌 판정 | Hard code, Soft Warning, 사유, 근거 | REVIEW-003/004 |
| 5 | Reason editor | 선정 문구 검토 | 이유 2개+, 금지 표현 체크, 사용자 노출 미리보기 | REVIEW-006, CONTENT |
| 6 | Approval bar | 상태 전환 | Review → Approved, 90일 만료 안내, 확인 Dialog | REVIEW-005/006 |

Admin UI에서 제품이 “당뇨에 적합” 같은 의료 범주로 분류되지 않게 한다. 분류축은 표시정보·식감·검토 상태 중심이다.

### 5.5 SCR-005 `/admin/pilot` — 파일럿 지표, 7 Section

| # | 유형 | 목적 | 핵심 콘텐츠 | Requirement |
|---|---|---|---|---|
| 1 | Overview | 표본 현황 | 독립 Core 수, 유효 추천 수, No Match | METRIC-001/002 |
| 2 | North Star | 핵심 판정 | 확신 기반 1회 결제 전환율, 목표 20%, 표본 70명 | METRIC-002/003 |
| 3 | Decision band | 의사결정 | Go ≥20 / Retry 10~19 / Pivot <10, 표본 부족 시 “판정 보류” | METRIC-003 |
| 4 | Experience metrics | UX 가치 | 선택시간 median/P75, 추천후 확신도, 상승폭 | PRD KPI |
| 5 | Operations | 운영 가능성 | 검토 median/P90, 판정 일치율, Critical 누락 | OPS-001~003 |
| 6 | Cost | 단위경제 보조 | 월 도구비, 추천당 시스템비, 광고비/유료고객 기반 CAC | OPS-004~006 |
| 7 | Privacy/quality queue | 운영 처리 | 삭제 요청 접수일/기한, 미연결 결제, 만료 상품 수 | PRIV-003, AVAIL-004 |

차트보다 목표·현재값·표본수·판정 텍스트를 우선한다. 표본 70명 이전에는 성공/실패를 확정하는 녹색·빨간색 대형 배지를 사용하지 않는다.

---

## 6. Screen × 상태 매트릭스

| Screen | Loading | Success | Empty | Error | Unauthorized/Out-of-scope |
|---|:---:|:---:|:---:|:---:|:---:|
| SCR-001 | — | O | — | O | O(비Core 안내) |
| SCR-002 | O | O | O(No Match) | O | O(유효 세션 없음) |
| SCR-003 | O | O | O(결제 미완료) | O | O(선택 세션 없음) |
| SCR-004 | O | O | O | O | O |
| SCR-005 | O | O | O(표본 없음) | O | O |

## 7. 접근성·상호작용 체크리스트

- 모든 주요 버튼·Choice Card·탭은 44×44px 이상 클릭/터치 영역을 확보한다.
- 폼 라벨과 오류는 시맨틱하게 연결하고 `aria-describedby`를 사용한다.
- 키보드 `Tab` 순서가 시각 순서와 일치하며 2px 파란 Focus Ring을 표시한다.
- Soft Warning, Error, Approved, Expired는 색상 외 텍스트 라벨을 포함한다.
- 5점 확신도는 별 아이콘만 사용하지 않고 숫자/문장 라벨을 함께 제공한다.
- 추천 카드의 출처 링크는 새 탭임을 스크린리더 라벨에 포함한다.
- Modal/Drawer는 포커스 트랩·Esc 닫기·트리거 포커스 복귀를 지원한다.
- Mobile 320px에서 핵심 사용자 흐름의 가로 스크롤을 허용하지 않는다.

## 8. 범위 확인

- 화면은 정확히 SCR-001~005 다섯 개다.
- `PROJECT_SCOPE.md`에서 EXCLUDED한 부하시험·24/7 가용성 모니터링·정식 장애복구 SLA를 UI 기능으로 만들지 않는다.
- 정기구독, 재주문, AI 학습 추천, 전체 상품 검색·가격비교, 부모용 앱을 화면에 배치하지 않는다.
- Core 사용자 로그인/회원가입 기능은 만들지 않는다. 운영자만 인증한다.
- 제품 추천의 핵심은 “저당” 라벨이 아니라 **입력 조건과 표시정보 사이의 설명 가능한 연결**이다.
