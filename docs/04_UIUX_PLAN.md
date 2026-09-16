# UI/UX Plan — Free Traveler

- **Document ID:** UIUX-TRAVEL-001
- **기반 문서:** `01_PRD.md`, `02_SRS_BASELINE.md`, `PROJECT_SCOPE.md`, `03_UI_COVERAGE_ANALYSIS.md`, `design-reference/vender/airbnb/DESIGN-airbnb.md`
- **대상 Screen:** SCR-001~005 (5개 고정)

---

## 1. 목적과 참고 범위

본 문서는 `03_UI_COVERAGE_ANALYSIS.md`가 5개 Screen에 배치한 요구사항을, 실제 화면 구조(Section·Tab·상태)로 구체화한다. Airbnb DESIGN.md는 **참고 자료**로만 사용하며 다음만 가져온다.

- 흰 캔버스 위에 단일 액센트 컬러 하나만 쓰는 절제된 색 사용 방식
- 카드·버튼의 둥근 모서리와 단일 그림자 단계(elevation) 철학
- 8px 배수 spacing 시스템의 사고방식
- 섹션형 페이지 구성(Hero → 콘텐츠 밴드 → Footer)이라는 레이아웃 문법

다음은 **가져오지 않는다**(상표 요소 배제).

- Airbnb 워드마크, Rausch(#ff385c) 정확한 색상값, Airbnb Cereal 폰트
- Homes/Experiences/Services 3-프로덕트 탭 구조, "NEW" 배지, 계정 등급(Luxe/Plus) 서브 브랜드
- 여행지 예약을 암시하는 문구·아이콘(별점 숫자 강조, "Reserve" 등)

## 2. 디자인 토큰

### 2.1 색상

| 토큰 | 값 | 용도 |
|---|---|---|
| `color-canvas` | `#FFFFFF` | 페이지 기본 배경(흰 배경) |
| `color-surface-soft` | `#F7F6F4` | 섹션 배경 대비, 비활성 필드 |
| `color-surface-strong` | `#F0EFEC` | 원형 아이콘 버튼, Chip 비활성 배경 |
| `color-ink` | `#26282C` | 본문·제목 텍스트(짙은 회색, 순검정 아님) |
| `color-body` | `#4B4E54` | 보조 본문 텍스트 |
| `color-muted` | `#84878D` | 캡션, 메타 정보, 비활성 라벨 |
| `color-hairline` | `#E3E2DF` | 1px 구분선, 카드 테두리 |
| `color-border-strong` | `#C7C5C0` | 포커스 이전 입력 테두리, 비활성 버튼 테두리 |
| `color-coral-500` | `#FF6A4D` | 브랜드 포인트(Primary CTA, 활성 탭, 강조 아이콘) |
| `color-coral-600` | `#E5502F` | Primary 버튼 Press/Active |
| `color-coral-100` | `#FFE3D8` | Primary 버튼 Disabled 배경, 코랄 톤 배지 배경 |
| `color-on-coral` | `#FFFFFF` | 코랄 배경 위 텍스트 |
| `color-focus-ring` | `#1D4ED8` | 키보드 포커스 링(코랄과 구분되는 파란 계열) |
| `color-error` | `#C7284B` | 폼 오류 텍스트·테두리(코랄과 다른 진한 적자색) |
| `color-warning` | `#B8720B` | 안전정보 경고, stale 배지(호박색) |
| `color-success` | `#1F8A4C` | 제출 성공, 승인 완료 |
| `color-info` | `#2563A9` | 안전정보 카테고리 라벨, 중립 안내 |
| `color-scrim` | `rgba(38,40,44,0.5)` | Drawer/Modal 배경 스크림 |

> 오류(`color-error`)·경고(`color-warning`)·안전정보 라벨(`color-info`)은 모두 코랄(`color-coral-500`)과 명도·색상 계열이 다르며, 상태 표시에는 항상 텍스트 라벨을 함께 표기해 색상 단독 구분을 피한다(REQ-NF-023).

### 2.2 타이포그래피

폰트: `Inter, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif`. 라틴 문자·숫자는 Inter, 한글은 시스템 한글 폰트로 자연 폴백된다. 한글 가독성을 위해 Airbnb 원본보다 줄 간격을 소폭 넓게 잡는다.

| 토큰 | 크기 | 굵기 | 줄간격 | 용도 |
|---|---:|---:|---:|---|
| `display-xl` | 32px | 700 | 1.35 | SCR-001/002 Hero 제목 |
| `display-lg` | 24px | 600 | 1.35 | Section 제목 |
| `display-md` | 20px | 600 | 1.4 | 카드 그룹 소제목, Drawer 헤더 |
| `title-md` | 17px | 600 | 1.4 | 카드 제목, 탭 라벨 |
| `body-md` | 16px | 400 | 1.6 | 기본 본문 |
| `body-sm` | 14px | 400 | 1.55 | 카드 메타, 설명 |
| `caption` | 13px | 500 | 1.4 | 라벨, 배지, 폼 헬퍼 텍스트 |
| `button-md` | 16px | 600 | 1.25 | 버튼 라벨 |

### 2.3 Spacing·Radius·Elevation

| 항목 | 값 |
|---|---|
| Spacing 기본 단위 | 4px 배수(`4/8/12/16/24/32/48/64/96`) |
| Desktop Section 상하 여백 | 64~96px(콘텐츠 밀도에 따라 선택) |
| Mobile Section 상하 여백 | 40~64px |
| Card 내부 padding | 16~24px |
| Card/버튼 radius | `sm 8px`(버튼, 입력), `md 14px`(카드), `full`(Chip, 배지, 아바타) |
| Elevation | 단일 그림자 톤만 사용: `0 1px 2px rgba(38,40,44,0.06), 0 4px 10px rgba(38,40,44,0.08)` — Card hover, Drawer, Toast에만 적용, 나머지는 플랫 |

### 2.4 레이아웃 기준

| 항목 | 값 |
|---|---|
| Desktop 기준 | 1440px |
| Desktop 콘텐츠 최대 폭 | 1200~1280px, 좌우 여백 자동 중앙 정렬 |
| Mobile 기준 | 390px |
| Mobile 콘텐츠 폭 | 100% - 좌우 16px 여백 |
| Card Grid 열 수 | Desktop 3~4열, Mobile 1열 |
| 최소 터치 영역 | 44×44px 이상(버튼, 아이콘 버튼, Chip, 탭) |
| 키보드 포커스 | 모든 상호작용 요소에 2px `color-focus-ring` 아웃라인, `outline-offset: 2px` |

## 3. 공통 Header·Footer(5개 Screen 공통)

### 3.1 Header

- 좌측: `Free Traveler` 워드마크(텍스트 로고, 코랄 포인트 없이 `color-ink`).
- 중앙(Desktop만): 5개 Screen 내비게이션 링크 — 메인 · 대표 소개 · 여행 준비 · 동행 찾기 · 계정.
- 우측: 즐겨찾기 아이콘(REQ-FUNC-068), 계정 진입 아이콘(SCR-005 이동, 로그인 전에는 "로그인" 텍스트 링크).
- Mobile: 워드마크 + 햄버거 메뉴로 축소, 열림 시 5개 링크를 세로 목록으로 표시.
- 높이: Desktop 72px, Mobile 56px. 배경 `color-canvas`, 하단 1px `color-hairline`.

### 3.2 Footer

- 3단 구성(Desktop) / 1단 스택(Mobile): "탐색"(메인·대표 소개·동행 찾기), "여행 준비"(여행 준비, 로그인), "정책"(이용약관·개인정보 처리방침·동행 안전수칙·콘텐츠 면책 안내 — REQ-FUNC-080).
- 하단 밴드: 저작권 문구, 참고 출처 고지("여행경보·비자·보건 정보는 외교부 등 공식 출처를 직접 확인").
- 배경 `color-canvas`(대비 없는 라이트 풋터), 상단 1px `color-hairline`로 본문과 구분.

## 4. 공통 컴포넌트

| 컴포넌트 | 요약 |
|---|---|
| `button-primary` | 코랄 배경, 흰 텍스트, radius 8px, 높이 48px(Desktop)/44px(Mobile), Disabled는 `color-coral-100` |
| `button-secondary` | 흰 배경, `color-ink` 텍스트, 1px `color-border-strong` 테두리 |
| `button-text` | 배경 없음, 밑줄은 hover/focus 시에만 |
| `card-destination` | 이미지(4:3) + 제목 + 국가/테마 메타 + 즐겨찾기 아이콘, radius 14px |
| `card-mate` | 제목 + 국가·지역·기간 + 모집 상태 Badge + 여행 스타일 Chip 요약 |
| `chip` | radius full, 선택 시 코랄 텍스트+코랄 테두리, 미선택 시 `color-surface-strong` 배경 |
| `badge-status` | radius full, 상태별 색상(모집중=coral-100 배경/ink 텍스트, 마감=surface-strong/muted, 경고=warning 배경 톤) + 텍스트 라벨 필수 |
| `drawer-panel` | 우측(Desktop) 또는 하단(Mobile) 슬라이드, 스크림 `color-scrim`, ESC/배경 클릭/닫기 버튼으로 닫힘, 포커스 트랩 |
| `tabs` | 밑줄형, 활성 탭 `color-coral-500` 밑줄 2px + `color-ink` 텍스트, 비활성 `color-muted` |
| `form-field` | 라벨(캡션) + 입력(높이 48px, radius 8px, 1px `color-border-strong`) + 헬퍼/오류 텍스트, 포커스 시 2px `color-ink` 테두리 + focus ring |
| `toast` | 화면 하단 중앙(Mobile) / 우하단(Desktop), 4초 자동 소멸, 성공(`color-success`)·오류(`color-error`)·정보(`color-info`) 변형 |
| `three-step-guide` | 숫자 원(코랄 아웃라인) + 제목 + 1문장 설명, 가로 3열(Desktop) / 세로 스택(Mobile) |
| `cta-banner` | `color-surface-soft` 배경 전폭 밴드, 제목+설명+Primary 버튼, 사진 없이 텍스트 중심 |

---

## 5. Screen 계획

### 5.1 SCR-001 `/` 메인 — 7 Section

| # | 유형 | 목적 | 핵심 콘텐츠/CTA | 관련 Requirement |
|---|---|---|---|---|
| 1 | Hero(축소형) | 서비스 한 줄 가치 제안과 즉시 검색 진입 | "어디로 떠날지 정하고, 항공·숙소 조건과 동행까지 한곳에서 준비하세요" 헤드라인 + 통합 검색 입력창(여행지·국가 검색) + 국내/해외 빠른 이동 버튼. Desktop 높이는 뷰포트의 55~65%로 제한해 1440px에서 2번 Section 상단이 보이게 한다. | REQ-FUNC-067 |
| 2 | Chip 목록 | 테마·계절 축약 탐색 | "해변", "도심", "자연", "미식", "봄 추천" 등 Chip을 가로 스크롤로 배열, 선택 시 3번 Section 필터에 반영 | REQ-FUNC-002 |
| 3 | Card Grid(탭+필터) | 여행지 탐색의 본체 | 국내/해외 탭, 국가·도시·계절·테마·기간 필터, 여행지 Card(최대 12개 노출 + "더 보기"), 결과 0건 시 Empty State | REQ-FUNC-001, 002, 003, 005, 008, 009, 010 |
| 4 | 좌우 분할(Drawer) | 여행지 상세 열람 | 카드 클릭 시 우측(Desktop)/하단 전체(Mobile) Drawer. 좌측 이미지, 우측 소개·명소·일정·예산·교통·음식·에티켓·출처, 하단에 "안전정보 보기"·"즐겨찾기"·"공유" 액션과 관련 여행지 6개 | REQ-FUNC-004, 006, 007, 009, 068, 069 |
| 5 | 좌우 분할(Drawer) | 국가 안전정보 열람 | 여행지 상세 Drawer에서 전환되는 2차 Drawer. 상단 경보 단계 텍스트 배지, 최종 확인일·stale 경고, 8개 카테고리 아코디언, 긴급연락처, 외교부 원문 링크, "공식 판단을 대체하지 않음" 고지 | REQ-FUNC-046~054 |
| 6 | CTA Banner | 여행 준비 다음 단계로 유도 | "여행지를 정했다면 항공·숙소 조건을 정리해 보세요" + `/travel-tools` 이동 버튼, 대표 소개 링크 카드 | REQ-FUNC-054(비Drawer 노출), SCR 이동 |
| 7 | 3단계 안내 | 서비스 전체 흐름 요약 | "① 여행지 탐색 → ② 조건 정리·동행 찾기 → ③ 외부 사이트·동행과 연결" 3열 안내, 각 단계에 해당 Screen 링크 | 서비스 흐름 안내(NON_UI 보완) |

**상태 정의**
- Loading: Card Grid 필터 적용 중 스켈레톤 카드(회색 블록, 실데이터 없음을 암시하지 않도록 애니메이션만 사용).
- Success: 필터 조건에 맞는 카드 1개 이상 노출.
- Empty: 필터 결과 0건 — "조건에 맞는 여행지가 없습니다" 문장 + 필터 초기화 버튼 + 추천 테마 Chip 재노출(REQ-FUNC-005).
- Error: 안전정보 외부 링크 또는 데이터 로드 실패 시 Drawer 내 인라인 오류 문구 + 다시 시도 버튼.
- Unauthorized: 해당 없음(전량 Public).

---

### 5.2 SCR-002 `/about` — 7 Section

| # | 유형 | 목적 | 핵심 콘텐츠/CTA | 관련 Requirement |
|---|---|---|---|---|
| 1 | Hero | 대표 프로필 한눈에 보기 | 대표 이미지 + 한 문장 소개 + `50+ Trips`·`30+ Countries` 수치 카드 2개 | REQ-FUNC-057 |
| 2 | 좌우 분할 | 신뢰의 근거(철학) 전달 | 좌측 인용구("좋은 여행은…"), 우측 콘텐츠 편집 원칙 3문장 | REQ-FUNC-058 |
| 3 | Chip 목록 | 방문 권역 한눈에 보기 | 대륙별로 그룹화한 방문 국가 Chip(30개 이상), Chip 클릭 시 SCR-001 관련 여행지로 이동 | REQ-FUNC-059 |
| 4 | 좌우 분할(타임라인) | 경험의 깊이 전달 | 연도·장소·한줄 요약으로 구성된 세로 타임라인(좌측 연도 축, 우측 카드) | REQ-FUNC-060 |
| 5 | Card Grid | 추천 콘텐츠로 연결 | 대표 추천 여행지 6개 Card, 클릭 시 SCR-001 상세 Drawer | REQ-FUNC-061, 063 |
| 6 | 3단계 안내 | 여행 준비 체크리스트 제공 | "① 목적지와 시기 정하기 → ② 안전정보·예산 확인하기 → ③ 동행 여부 결정하기" | PRD 6-3 체크리스트 |
| 7 | CTA Banner | 다음 행동 유도 | 문의·SNS 링크 + "지금 여행지 둘러보기" 버튼(SCR-001 이동) | REQ-FUNC-062 |

**상태 정의**
- Loading: 정적 데이터 기반이라 즉시 렌더링, 이미지만 지연 로딩 placeholder 사용.
- Success: 기본 상태(정적 콘텐츠 항상 존재).
- Empty: 해당 없음(콘텐츠가 항상 채워진 정적 데이터).
- Error: 이미지 로드 실패 시 대체 배경색 + alt 텍스트만 노출.
- Unauthorized: 해당 없음(Public).

---

### 5.3 SCR-003 `/travel-tools` — 6 Section, 3 Tab

| # | 유형 | 목적 | 핵심 콘텐츠/CTA | 관련 Requirement |
|---|---|---|---|---|
| 1 | Intro | 화면 목적과 탭 안내 | "여행 조건을 정리하고, 원하는 방식으로 다음 단계를 준비하세요" + 탭 3개 미리보기 카드(항공/숙소/동행 모집글) | 화면 안내 |
| 2 | 좌우 분할(탭 1: 항공) | 항공 조건 입력·요약·외부 이동 | 좌측 폼(국가·지역·출발일·귀국일), 우측 요약 카드(비전달 고지 포함) + "항공편 보러 가기" 버튼 | REQ-FUNC-011~018 |
| 3 | 좌우 분할(탭 2: 숙소) | 숙소 조건 입력·요약·외부 이동 | 좌측 폼(국가·지역·체크인·체크아웃), 우측 요약 카드 + "숙소 보러 가기" 버튼 | REQ-FUNC-019~026 |
| 4 | Form(탭 3: 동행 작성) | 동행 모집글 작성 | 제목·국가·지역·기간·인원·조건·설명 입력, 안전수칙 동의 체크박스, 연락처 탐지 경고 영역 | REQ-FUNC-027~032, 080 |
| 5 | Chip 목록 | 비전달·안전 원칙 확인 | "입력값은 외부로 전달되지 않습니다", "서버에 저장되지 않습니다", "동행 글에는 연락처를 남길 수 없습니다" 3개 원칙 카드 | REQ-FUNC-015, 017, 023, 025, 054 |
| 6 | CTA Banner | 완료 후 다음 행동 | 항공/숙소 탭 완료 시 "안전정보 다시 확인하기"(SCR-001), 동행작성 탭 완료 시 "내가 쓴 글 보기"(SCR-005) 또는 "동행 목록 보기"(SCR-004) | 화면 간 이동 |

**탭별 상태 분리**
| 탭 | 입력(Loading 없음, 즉시 반응) | 검증(Error) | 완료(Success) |
|---|---|---|---|
| 항공 | 필드 입력 중 — 실시간 형식 체크 | 과거일·역전 날짜·필수값 누락 시 필드별 인라인 오류, 외부이동 버튼 비활성화 | 요약 표시 후 외부 새 탭 오픈, 실패 시 Error(재시도 버튼) |
| 숙소 | 필드 입력 중 | 과거일·체크아웃≤체크인 시 인라인 오류 | 요약 표시 후 외부 새 탭 오픈, 실패 시 Error |
| 동행 작성 | 필드 입력 중, 미인증 시 Unauthorized 안내(로그인 유도) | 연락처 패턴 탐지, 필수값 누락, 동의 미체크 시 제출 차단 | 제출 성공 Toast + SCR-004 상세로 이동 |

---

### 5.4 SCR-004 `/mates` — 6 Section

| # | 유형 | 목적 | 핵심 콘텐츠/CTA | 관련 Requirement |
|---|---|---|---|---|
| 1 | Intro | 동행 찾기 목적 설명과 작성 유도 | "일정과 스타일이 맞는 동행을 찾아보세요. 연락처 없이 안전하게 참가를 요청할 수 있습니다" + "새 모집글 작성" 버튼(`/travel-tools` 동행작성 탭 이동) | REQ-FUNC-030, 화면 안내 |
| 2 | Filter + 요약 | 조건 검색 | 국가·지역·기간·모집 상태 Chip/Select 필터, "총 N건" 결과 요약 텍스트 | REQ-FUNC-030 |
| 3 | Card Grid | 모집글 목록 | 데이터가 있으면 모집글 Card 최대 8개 우선 노출(+더 보기), 각 Card는 제목·국가/지역·기간·모집상태 Badge·스타일 Chip 요약 | REQ-FUNC-030, 033, 037 |
| 4 | 좌우 분할(Desktop) / Drawer(Mobile) | 상세 열람과 액션 | Desktop은 좌측 목록 + 우측 상세 패널 동시 노출, Mobile은 Card 탭 시 하단 Drawer. 상세에는 작성자 정보(닉네임만)·조건·설명·참가 요청 폼·신고·차단 버튼 | REQ-FUNC-033, 034, 035, 039, 040 |
| 5 | 3단계 안내 | 참가 절차 이해 | "① 조건에 맞는 글 찾기 → ② 비공개 메시지로 참가 요청 → ③ 작성자 승인 후 연결" | REQ-FUNC-034, 036 |
| 6 | CTA Banner | 안전 안내와 다음 행동 | "동행은 신원을 보증하지 않습니다. 이상한 요청은 신고·차단하세요" + 안전수칙 링크 + "여행 조건 다시 정리하기"(`/travel-tools`) 버튼 | REQ-FUNC-039, 040, 080 |

**Empty State(목록 0건)**: "조건에 맞는 동행글이 없습니다" 문장 + "필터 초기화" 버튼 + "새 모집글 작성" CTA + 참가 절차 3단계 안내(5번 Section 내용 요약)를 함께 노출해 빈 화면처럼 보이지 않게 한다.

**상태 정의**
- Loading: Card Grid 스켈레톤.
- Success: 1건 이상 결과, 상세 패널 정상 표시.
- Empty: 상기 Empty State.
- Error: 참가 요청/신고/차단 제출 실패 시 인라인 오류 + 재시도.
- Unauthorized: 비로그인 상태에서 참가 요청·신고·차단 시도 시 "로그인이 필요합니다" 안내와 SCR-005 이동 버튼(목록·상세 열람 자체는 Public 유지).

---

### 5.5 SCR-005 `/account` — 역할별 Tab(고정 Section 수 없음, 역할에 없는 탭은 렌더링하지 않음)

SCR-004까지와 달리 SCR-005는 로그인 상태·권한에 따라 노출되는 탭이 달라지므로, Section 개수를 고정하지 않고 **역할별 탭 구성**으로 정의한다.

#### Guest(비로그인)
| Tab | 콘텐츠 |
|---|---|
| 계정 안내 | "로그인하면 즐겨찾기 동기화, 동행 모집글 작성, 참가 요청을 이용할 수 있습니다" Intro |
| 로그인 | 이메일·비밀번호 입력 폼 + 오류 안내 |
| 회원가입 | 이메일·비밀번호·닉네임 입력 폼 + 약관 동의 |
| 비밀번호 재설정 | 이메일 입력 → 안내 메시지 |
| 보안 안내 | "정확한 생년월일은 저장하지 않습니다", "비밀번호는 암호화되어 저장됩니다" 등 Chip 목록형 안내 |

관련 Requirement: REQ-FUNC-066, 028.

#### Member(로그인 + 일반 회원)
| Tab | 콘텐츠 |
|---|---|
| 프로필 | 닉네임·연령대·성별(선택)·여행 스타일, 성인확인 상태 요약 Badge |
| 내 글 | 내가 쓴 동행 모집글 목록(수정·마감·삭제 액션), 없으면 Empty State + "새 동행글 작성" CTA |
| 참가 요청 | 내가 보낸 요청(상태별) + 내 글에 들어온 요청(승인·거절 액션), 없으면 Empty State |
| 차단 목록 | 차단한 사용자 목록과 해제 버튼, 없으면 Empty State |
| 새 동행글 작성 CTA | 상단 고정 버튼, `/travel-tools` 동행작성 탭으로 이동 |

관련 Requirement: REQ-FUNC-028, 029, 036, 038, 040, 043, 068.

#### Admin(Moderator/Admin 권한)
| Tab | 콘텐츠 |
|---|---|
| 관리 Intro | "신고 상태와 외부 이동 링크만 이 화면에서 관리합니다" 범위 안내(콘텐츠 CMS·감사 로그 없음을 명시) |
| 신고 상태 변경 | 신고 목록(상태 필터: 접수/처리완료/기각), 각 항목 상태 변경 액션. Dashboard형 통계·그래프는 두지 않는다 |
| 외부 URL 설정 | 항공·숙소 외부 URL 입력 폼(HTTPS 허용목록 검증), 저장 성공/실패 안내 |

관련 Requirement: REQ-FUNC-041, 042, 077. Admin 탭은 Moderator/Admin 권한이 없는 계정에는 렌더링하지 않는다(Member는 위 3개 탭만 노출).

**상태 정의(SCR-005 공통)**
- Loading: 각 탭 데이터 조회 중 스켈레톤 리스트.
- Success: 데이터 정상 표시.
- Empty: 내 글/참가 요청/차단 목록/신고 목록이 0건일 때, 설명 문장 + 다음 행동 CTA(작성하기·둘러보기 등)를 항상 함께 표시.
- Error: 저장·상태 변경 실패 시 인라인 오류 + 재시도.
- Unauthorized: 비로그인 상태로 `/account`의 Member/Admin 탭에 직접 접근 시 Guest 뷰로 대체하고 로그인 유도 문구 표시. 권한 없는 계정이 Admin 탭에 접근 시 탭 자체를 렌더링하지 않는다(별도 오류 화면 없음).

---

## 6. Screen × 상태 매트릭스

| Screen | Loading | Success | Empty | Error | Unauthorized |
|---|:---:|:---:|:---:|:---:|:---:|
| SCR-001 | O | O | O | O | — |
| SCR-002 | — | O | — | O | — |
| SCR-003 | — | O | — | O | O(동행작성 탭) |
| SCR-004 | O | O | O | O | O |
| SCR-005 | O | O | O | O | O |

> "—"는 화면 특성상 정의하지 않는 상태다(정적 콘텐츠 위주 화면에 불필요한 상태를 추가하지 않는다).

## 7. 접근성·상호작용 체크리스트

- 모든 버튼·Chip·탭·카드 클릭 영역은 44×44px 이상을 확보한다.
- 모든 상호작용 요소는 `Tab` 키 이동과 `color-focus-ring` 포커스 표시를 지원한다.
- Drawer/Modal은 열릴 때 포커스를 이동시키고 `Esc`로 닫히며, 닫힌 뒤 트리거 요소로 포커스를 되돌린다.
- 상태 Badge·경고·오류는 색상과 텍스트 라벨을 함께 표기한다(예: "🟠 재확인 필요" 대신 "재확인 필요" 텍스트 + 색상 배경).
- 폼 오류 메시지는 `aria-describedby`로 해당 입력과 연결한다.

## 8. 범위 확인

- 본 문서의 모든 Section·Tab·상태는 `PROJECT_SCOPE.md`에서 IMPLEMENT로 분류된 요구사항만을 화면 요소로 구성했다. EXCLUDED 항목(전체 콘텐츠 CMS, 미디어 업로드·라이선스 워크플로, 범용 감사 로그, stale 대시보드, 이메일 발송 등)은 어떤 Screen에도 UI로 복원하지 않았다.
- 디자인 Screen은 SCR-001~005 5개로 고정했으며 추가 Screen을 생성하지 않았다. 기술 Route(API, 인증 콜백, 오류 페이지)는 Screen으로 세지 않았다.
- Admin 탭(SCR-005)은 신고 상태 변경과 외부 URL 설정만 포함하며, Dashboard·통계·그래프 화면은 만들지 않았다.
- 각 Section은 제목·1~3문장 설명·실제 콘텐츠 또는 CTA를 갖추도록 설계했고, `Lorem ipsum`·`준비 중`·`정보 확인 필요`류의 자리표시자 텍스트나 근거 없는 빈 카드를 배치하지 않았다. 데이터가 없는 상태는 모두 6장의 Empty 정의에 따라 안내 문장과 다음 행동 CTA를 동반한다.
