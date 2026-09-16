# UI Contract — Free Traveler

- **Document ID:** UI-CONTRACT-TRAVEL-001
- **대상:** SCR-001~005 (5개, 핵심 4 / 보조 1)
- **참고 문서:** `docs/03_UI_COVERAGE_ANALYSIS.md`, `docs/04_UIUX_PLAN.md`, `docs/STITCH_VALIDATION_REPORT.md`, `design-reference/D-001/DESIGN.md`
- **짝 문서:** `design-reference/SCREEN_ROUTE_CONTRACT.json`(Route·Page Entry의 기계 판독 가능한 원본)

---

## 0. 목적과 범위

본 문서는 승인된 Stitch 5개 Screen(`STITCH_VALIDATION_PASS`)을 Next.js App Router 구현 계약으로 변환한다. 각 Screen은 Route·Page Entry·영역 순서·주요 Component·상태·사용자 행동·화면 간 이동·Desktop/Mobile 규칙·금지 기능을 갖는다. 현재 `src/app`은 기본 스캐폴드(`layout.tsx`, `page.tsx`, `globals.css`)만 존재하며, 본 계약이 이후 구현의 기준이 된다.

**핵심(Core) 4 / 보조(Supplementary) 1 구분**

| 구분 | Screen |
|---|---|
| 핵심 | SCR-001(메인), SCR-003(통합 여행 준비), SCR-004(동행 조회), SCR-005(계정·관리) |
| 보조 | SCR-002(대표 소개) |

핵심 4개는 여행지 발견 → 조건 정리·동행 모집글 작성 → 동행 찾기 → 계정/내 활동이라는 주 전환 흐름을 담당한다. SCR-002는 신뢰 구축용 정보 화면으로 전환 흐름 밖에 있어 보조로 분류한다.

---

## 1. SCR-001 메인

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-001 |
| **Route** | `/` |
| **Page Entry** | `src/app/page.tsx` |
| **구분** | 핵심 |

### 영역 순서(7 Section)
1. Hero(축소형) — 헤드라인 + 통합 검색창 + 국내/해외 진입 버튼
2. 테마·계절 Chip 목록(6개 이상)
3. 국내/해외 탭 + 필터 + 여행지 Card Grid(8개 이상)
4. 여행지 상세 Drawer/Modal(상세정보 탭 + 안전정보 탭)
5. 관련 여행지 Card Grid(4~6개)
6. CTA Banner("여행 준비 시작하기")
7. 3단계 안내(여행지 탐색 → 조건 정리·동행 찾기 → 연결)

### 주요 Component
`search-bar-pill`, `chip`/`chip-active`, `destination-card`, `drawer-panel`(상세/안전정보 탭 포함), `badge-warning`(stale 배지), `cta-banner`, `three-step-guide`, 공통 Header/Footer

### 상태
Loading(카드 그리드 스켈레톤) · Success · Empty(필터 결과 0건 — 조건 완화 안내 + 초기화 버튼) · Error(안전정보 외부 링크·데이터 로드 실패 시 인라인 오류) — Unauthorized 없음(전량 Public)

### 사용자 행동
여행지 검색·필터 적용/초기화 · 여행지 카드 클릭(Drawer 열기) · 즐겨찾기 토글 · 안전정보 탭 전환 · 관련 여행지 클릭 · 외교부 링크 새 탭 열기 · CTA/3단계 안내 클릭

### 다른 화면으로의 이동
- Drawer 내 "여행 준비 시작하기" / CTA Banner → **SCR-003**
- 대표 소개 링크 카드 → **SCR-002**
- Header 내비게이션 → SCR-002·003·004·005

### Desktop·Mobile 규칙
Desktop: Hero는 뷰포트 55~65% 이내, Card Grid 3~4열, Drawer는 우측 슬라이드(폭 약 40%). Mobile: Card Grid 1열, Drawer는 하단 바텀시트. 공통: 콘텐츠 최대 폭 1200~1280px(Desktop), Section 여백 Desktop 64~96px / Mobile 40~64px, 터치 영역 44px 이상.

### 금지 기능
Airbnb 상표 요소, 예약·결제·가격·별점 UI, 광고, 실시간 항공권/호텔 가격, `Lorem ipsum`·"준비 중"·"정보 확인 필요"·빈 이미지 카드, 임의 색상/radius 추가.

---

## 2. SCR-002 대표 소개

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-002 |
| **Route** | `/about` |
| **Page Entry** | `src/app/about/page.tsx` |
| **구분** | 보조 |

### 영역 순서(7 Section)
1. Hero — 대표 이미지 + 한 문장 소개 + 수치 카드 2개(`50+ Trips`, `30+ Countries`)
2. 추천 여행지 Card Grid(6개)
3. 방문 국가 Chip 목록(30개 이상, 대륙별 그룹)
4. 여행 타임라인(3개 이상, 연도·장소·요약)
5. 사진 Gallery(8장, 캡션·촬영 국가 병기)
6. 여행 철학 좌우 분할(인용구 + 편집 원칙)
7. 여행 준비 체크리스트 3단계 안내 + CTA

### 주요 Component
`destination-card`(추천 여행지 재사용), `chip`(국가), Gallery 그리드, Timeline 리스트, 좌우 분할 텍스트 블록, `three-step-guide`, `cta-banner`, 공통 Header/Footer

### 상태
Success만 정의(정적 데이터로 항상 채워짐) · 이미지 로드 실패 시에만 대체 배경 + alt 텍스트로 처리 — Loading/Empty/Unauthorized 없음

### 사용자 행동
추천 여행지 카드 클릭 · 방문 국가 Chip 클릭 · 문의·SNS 링크 클릭 · "지금 여행지 둘러보기" CTA 클릭

### 다른 화면으로의 이동
- 추천 여행지 카드/방문 국가 Chip → **SCR-001**(해당 여행지 상세 Drawer)
- Header 내비게이션 → SCR-001·003·004·005

### Desktop·Mobile 규칙
Desktop 전용 우선 구현(Mobile 변형은 별도 Stitch 승인 없음 — `SCREEN_ROUTE_CONTRACT.json`의 `stitch_screen_ids.mobile: null` 참조). Mobile 대응 시에도 D-001 §15 공통 규칙(콘텐츠 최대 폭, Section 여백, 44px 터치 영역)을 그대로 따른다.

### 금지 기능
SCR-001과 동일(Airbnb 상표, 예약·결제·가격·별점·광고 UI, placeholder 문구·빈 카드, 임의 토큰 추가 금지).

---

## 3. SCR-003 통합 여행 준비

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-003 |
| **Route** | `/travel-tools` |
| **Page Entry** | `src/app/travel-tools/page.tsx` |
| **구분** | 핵심 |

### 영역 순서(6 Section)
1. Intro — 3개 미리보기 카드(항공 조건 정리/숙소 조건 정리/동행 모집글 작성)
2. 탭바(**항공 / 숙소 / 동행 글쓰기**, 3탭) + 여행정보 Form
3. 입력 요약 + 비전달 고지("입력값은 외부 사이트로 전달되지 않습니다") + 외부이동 CTA
4. 찾기 Tip 카드(정확히 3개)
5. 로그인 안내(비로그인) 또는 동행 모집글 작성 Form + 안전수칙 요약(로그인)
6. 안전 안내 CTA Banner("동행 찾기로 이동")

### 주요 Component
`tabs`(3탭, 밑줄형), `text-input`, 요약 카드, `button-primary`(외부이동, 새 탭 아이콘), Tip 카드 3종, 로그인 유도 카드, 안전수칙 요약 배지, `cta-banner`, 공통 Header/Footer

### 상태
탭별로 **입력 → 검증 → 완료**를 분리 관리한다.
- 항공/숙소 탭: 입력 중(실시간 형식 체크) → 검증 오류(과거일·역전 날짜, 인라인 오류 + 외부이동 버튼 비활성화) → 완료(요약 표시 → 외부 새 탭 오픈, 실패 시 Error+재시도)
- 동행 글쓰기 탭: 입력 중(미인증 시 Unauthorized 안내) → 검증 오류(연락처 패턴 탐지, 필수값 누락, 동의 미체크 시 제출 차단) → 완료(제출 성공 Toast → SCR-004 이동)

### 사용자 행동
탭 전환 · 항공/숙소 조건 입력 및 검증 · 요약 확인 후 외부 사이트 이동(새 탭) · 동행 모집글 작성 및 안전수칙 동의 · 로그인 이동

### 다른 화면으로의 이동
- 항공/숙소 탭 "보러 가기" → 외부 사이트(새 탭, 앱 내 화면 전환 아님)
- 동행 글쓰기 탭에서 비로그인 → **SCR-005**(로그인 유도)
- 작성 완료 → **SCR-004**(해당 모집글 상세) 또는 안전 CTA Banner → **SCR-004**

### Desktop·Mobile 규칙
Desktop: 탭바는 가로 배치, Form은 그리드형. Mobile: 탭바는 가로 스크롤 세그먼트, Form은 세로 스택. 공통: Section 여백 Desktop 64~96px / Mobile 40~64px, 터치 영역 44px 이상, 탭별 상태 분리 유지(한 탭의 오류가 다른 탭에 영향 없음).

### 금지 기능
항공·호텔 입력값의 서버 저장·서버 API 생성 금지(브라우저 상태로만 처리), 예약·결제·가격 표시 금지, 외부 URL에 목적지·날짜 쿼리 파라미터 첨부 금지, Airbnb 상표 요소, placeholder 문구·빈 카드, 임의 토큰 추가 금지.

---

## 4. SCR-004 동행 조회

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-004 |
| **Route** | `/mates` |
| **Page Entry** | `src/app/mates/page.tsx` |
| **구분** | 핵심 |

### 영역 순서(6 Section)
1. Intro + "새 모집글 작성" CTA
2. Filter(국가·지역·기간·모집 상태) + 결과 요약 텍스트
3. 동행글 Card Grid — 데이터가 있으면 카드 최대 8개 우선 노출
4. Desktop 목록+상세 분할 패널(좌 40% : 우 60%) / Mobile 목록→상세 바텀시트 Drawer
5. 동행 신청 방법 3단계 안내
6. 안전·신고·차단 안내 + `/travel-tools` CTA

### 주요 Component
`chip`/필터 드롭다운, `mate-card`(가격·별점 없음, 상태 배지 필수), `drawer-panel`(Mobile 상세), 좌우 분할 패널(Desktop 상세), 참가 요청 폼, 신고·차단 아이콘 버튼, `three-step-guide`, `cta-banner`, 공통 Header/Footer

### 상태
Loading(Card Grid 스켈레톤) · Success · Empty(검색 조건 초기화 + 글 작성 CTA + 이용 방법 함께 표시) · Error(참가 요청/신고/차단 제출 실패 시 인라인 오류 + 재시도) · Unauthorized(비로그인 상태에서 참가 요청·신고·차단 시도 시 로그인 안내 — 목록·상세 열람 자체는 Public 유지)

### 사용자 행동
필터 적용/초기화 · 모집글 카드 클릭(상세 열람) · 참가 메시지 제출 · 신고·차단 · 작성자의 요청 승인/거절은 SCR-005에서 수행 · "새 모집글 작성" CTA 클릭

### 다른 화면으로의 이동
- "새 모집글 작성" → **SCR-003**(동행 글쓰기 탭)
- 비로그인 상태 참가 요청·신고·차단 → **SCR-005**(로그인)
- 안전 CTA Banner → **SCR-003**(여행 조건 다시 정리하기)

### Desktop·Mobile 규칙
Desktop: 목록+상세 동시 노출(분할 패널). Mobile: Card 탭 시 하단 Drawer로 상세 전환. 공통: Card Grid는 Desktop 3~4열/Mobile 1열, 8개 우선 노출 규칙은 두 해상도 동일 적용.

### 금지 기능
참가비·가격·별점 표시 금지, 연락처(이메일·전화번호·메신저 ID) 노출 금지, 실시간 채팅·영상통화·위치 공유 금지, Airbnb 상표 요소, placeholder 문구·빈 카드, 임의 토큰 추가 금지.

---

## 5. SCR-005 계정·관리

| 항목 | 내용 |
|---|---|
| **Screen ID** | SCR-005 |
| **Route** | `/account` |
| **Page Entry** | `src/app/account/page.tsx` |
| **구분** | 핵심 |

### 영역 순서(역할 기반 좌측 세로 탭, 고정 Section 수 없음)
- **Guest**: 계정 기능 Intro, 로그인·가입·비밀번호 재설정 Card, 로그인 후 가능한 기능 안내, 보안 안내
- **Member**(5개 탭): 프로필 · 내 글 · 참가 요청 · 차단 목록 · 즐겨찾기 — 각 탭에 Intro·핵심 작업·다음 행동 CTA
- **Admin**(Moderator/Admin 권한만 노출, Member 5개 탭 아래 구분선 + "관리자 설정"): 신고 상태 변경(신고 카드 3건 이상, 상태별 필터) · 외부 URL 설정(항공·숙소 URL 폼, HTTPS 안내) — 정확히 2개 탭

### 주요 Component
좌측 세로 `tabs`, `text-input`(로그인/URL 설정 폼), `mate-card`(내 글 목록 재사용), 참가 요청 상태 리스트 + 승인/거절 버튼, 차단 목록 + 해제 버튼, `destination-card`(즐겨찾기, 소형), 신고 상태 카드 + 상태 변경 드롭다운, `toast`, 공통 Header/Footer

### 상태
Loading(탭별 스켈레톤 리스트) · Success · Empty(내 글/참가 요청/차단 목록/신고 목록 0건 시 설명 문장 + 다음 행동 CTA를 항상 함께 표시) · Error(저장·상태 변경 실패 시 인라인 오류 + 재시도) · Unauthorized(비로그인 상태로 Member/Admin 탭 직접 접근 시 Guest 뷰로 대체 + 로그인 유도, 권한 없는 계정은 Admin 탭 자체를 렌더링하지 않음)

### 사용자 행동
로그인·가입·비밀번호 재설정 · 프로필 수정 · 내 모집글 수정/마감/삭제 · 참가 요청 승인/거절 · 차단 해제 · 즐겨찾기 조회 · (Admin) 신고 상태 변경 · (Admin) 외부 URL 저장

### 다른 화면으로의 이동
- 즐겨찾기 항목 클릭 → **SCR-001**(여행지 상세 Drawer)
- "내 글" 항목 클릭 → **SCR-004**(모집글 상세)

### Desktop·Mobile 규칙
Desktop 전용 우선 구현(Mobile 변형은 별도 Stitch 승인 없음). Mobile 대응 시 좌측 세로 탭은 상단 가로 스크롤 탭 또는 아코디언으로 전환하되 44px 터치 영역·D-001 §15 공통 규칙을 유지한다.

### 금지 기능
통계 차트·Dashboard(Admin 탭 포함 전 영역) 금지, 예약·결제·가격 UI 금지, 정확한 생년월일 저장 금지(성인 확인은 `is_adult`/`adult_verified_at`만), Airbnb 상표 요소, placeholder 문구·빈 카드, 임의 토큰 추가 금지.

---

## 6. 완료 조건 검증

| 조건 | 결과 |
|---|---|
| Route 중복 없음 | PASS — `/`, `/about`, `/travel-tools`, `/mates`, `/account` 5개 모두 고유 |
| Page Entry 중복 없음 | PASS — `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/travel-tools/page.tsx`, `src/app/mates/page.tsx`, `src/app/account/page.tsx` 5개 모두 고유 |
| Screen 수 5 | PASS — SCR-001~005 |
| 핵심 4·보조 1 구분 존재 | PASS — 핵심: SCR-001·003·004·005, 보조: SCR-002 |

기계 판독용 원본은 `design-reference/SCREEN_ROUTE_CONTRACT.json`을 참조한다(schema_version `traveler-screen-route-v1`, `technical_routes`에 auth callback·API Route·not-found·error boundary를 Screen과 분리 기록, `required_navigation`에 실제 이동 관계 기록).
