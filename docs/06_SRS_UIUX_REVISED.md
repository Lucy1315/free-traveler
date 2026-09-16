# SRS — UI/UX Revised — Free Traveler

- **Document ID:** SRS-UIUX-REVISED-TRAVEL-001
- **기반 문서:** `docs/02_SRS_BASELINE.md`(Baseline, 변경 없음 — 본 문서는 대체가 아니라 UI 매핑을 추가한 개정본)
- **개정 근거:** `docs/PROJECT_SCOPE.md`, `docs/03_UI_COVERAGE_ANALYSIS.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`, `docs/05_UIUX_APPROVED.md`

## 0. 개정 원칙

- `docs/02_SRS_BASELINE.md`의 REQ-FUNC-001~080, REQ-NF-001~034는 **하나도 삭제하지 않는다.** 전 항목을 본 문서에 원문 그대로 재수록하고 UI 매핑 열을 추가한다.
- 각 Requirement에 **UI Screen/Route**(승인된 5개 Screen 중 어디에 배치되는지)와 **Project Scope Status**(`docs/PROJECT_SCOPE.md` 기준 IMPLEMENT/EXCLUDED)를 병기한다.
- `EXCLUDED`로 표시된 Requirement는 이번 범위에서 구현하지 않으며, 구현했다고 기록하지 않는다.
- Baseline SRS 3.5절의 16개 개별 Route는 승인된 5개 Screen(§2)으로 통합됐다. 통합 상세는 `docs/05_UIUX_APPROVED.md` 3장을 따른다.

---

## 1. 변경 요약

| 구분 | Baseline(02) | 본 개정본(06) |
|---|---|---|
| Route 수 | 16개 개별 Route(`/destinations/[slug]`, `/flights`, `/mates/new`, `/admin/*` 등) | 5개 Screen Route(`/`, `/about`, `/travel-tools`, `/mates`, `/account`) + 통합 표시 |
| Requirement 수 | REQ-FUNC 80 + REQ-NF 34 = 114 | 동일 114(삭제 없음) |
| 신규 표기 | 없음 | UI Screen/Route, Project Scope Status 열 추가 |
| 구현 범위 | 전 Requirement가 구현 대상으로 서술 | `docs/PROJECT_SCOPE.md` 기준 EXCLUDED 27건 명시(FUNC 9, NF 18) |

---

## 2. 승인된 Route Inventory(Baseline 3.5절 대체)

| Route | Page | Access | 비고 |
|---|---|---|---|
| `/` | SCR-001 메인 | Public | 여행지 탐색·필터·상세(Drawer)·안전정보(Drawer) 통합 |
| `/about` | SCR-002 대표 소개 | Public | |
| `/travel-tools` | SCR-003 통합 여행 준비 | Public(동행 글쓰기 탭은 Adult Member) | 항공/숙소/동행 글쓰기 3탭 통합 |
| `/mates` | SCR-004 동행 조회 | Public(쓰기 액션은 Adult Member) | 목록+상세(Desktop 분할/Mobile Drawer) 통합 |
| `/account` | SCR-005 계정·관리 | Public(Guest) / Adult Member / Role Restricted(Admin) | 인증·프로필·내 활동·간단 관리자 탭 통합 |

Baseline의 `/destinations*`, `/flights`, `/hotels`, `/mates/[id]`, `/mates/new`, `/safety*`, `/auth/*`, `/my/*`, `/admin/*`는 위 5개 Route의 하위 상태(탭·Drawer·패널)로 흡수되었으며 별도 Route로 존재하지 않는다.

## 3. Use Case → Screen 매핑(Baseline 3.6절 개정)

| ID | Use Case | Actor | Screen |
|---|---|---|---|
| UC-01 | 여행지 검색·필터·상세 열람 | Guest/Member | SCR-001 |
| UC-02 | 항공 여행 조건 입력·요약·외부 이동 | Guest/Member | SCR-003 |
| UC-03 | 호텔 숙박 조건 입력·요약·외부 이동 | Guest/Member | SCR-003 |
| UC-04 | 동행 모집글 작성·마감 | Adult Member | SCR-003(작성) / SCR-005(마감·관리) |
| UC-05 | 동행 참가 요청·승인·거절 | Adult Member | SCR-004(요청) / SCR-005(승인·거절) |
| UC-06 | 신고·차단·운영 처리 | Adult Member/Moderator | SCR-004(신고·차단 실행) / SCR-005(차단 관리·관리자 처리) |
| UC-07 | 국가별 안전정보 확인 | Guest/Member | SCR-001 |
| UC-08 | 대표 소개 확인 | Guest/Member | SCR-002 |
| UC-09 | 콘텐츠·외부 URL 관리 | Editor/Admin | SCR-005(외부 URL 설정만 해당, 콘텐츠 CRUD는 `EXCLUDED`) |

---

## 4. Requirement — UI 매핑(전량 유지, 114건)

### 4.1 Functional Requirements

#### 4.1.1 F1. Destination Guide

| ID | Requirement(Baseline 원문) | P | UI Screen/Route | Project Scope Status |
|---|---|:---:|---|---|
| REQ-FUNC-001 | 시스템은 국내·해외 여행지 목록을 구분해 제공한다. | M | SCR-001 `/` | IMPLEMENT |
| REQ-FUNC-002 | 시스템은 국가·도시·계절·테마·권장 기간 필터를 제공한다. | M | SCR-001 `/` | IMPLEMENT |
| REQ-FUNC-003 | 시스템은 키워드로 여행지명·국가명·테마를 검색한다. | M | SCR-001 `/` | IMPLEMENT |
| REQ-FUNC-004 | 시스템은 여행지 상세에 소개·명소 5개 이상·추천 시기·1일/3일 일정·예산·교통·음식 3개 이상·에티켓·출처·수정일을 표시한다. | M | SCR-001 `/`(Drawer) | IMPLEMENT |
| REQ-FUNC-005 | 시스템은 필터 결과가 없으면 조건 완화 안내와 전체 초기화 버튼을 제공한다. | M | SCR-001 `/` | IMPLEMENT |
| REQ-FUNC-006 | 시스템은 해외 여행지 상세에서 해당 국가의 안전 페이지를 연결한다. | M | SCR-001 `/`(Drawer) | IMPLEMENT |
| REQ-FUNC-007 | 시스템은 대표 이미지에 대체텍스트·출처·작가·라이선스를 연결한다. | M | SCR-001 `/` | IMPLEMENT(축소: alt·출처 URL만) |
| REQ-FUNC-008 | 시스템은 MVP 게시 기준 국내 10개 이상, 해외 15개국 30개 도시 이상을 검증한다. | M | N/A(콘텐츠 데이터 품질, 비UI) | IMPLEMENT(축소: 수동 검수) |
| REQ-FUNC-009 | 시스템은 같은 국가·테마의 관련 여행지를 상세 하단에 최대 6개 표시한다. | S | SCR-001 `/`(Drawer) | IMPLEMENT |
| REQ-FUNC-010 | 시스템은 목록 필터 상태를 URL query에 반영해 새로고침·공유 시 복원한다. | S | SCR-001 `/` | IMPLEMENT |

#### 4.1.2 F2. Flight Link-out

| ID | Requirement(Baseline 원문) | P | UI Screen/Route | Project Scope Status |
|---|---|:---:|---|---|
| REQ-FUNC-011 | 시스템은 항공 폼에 목적 국가, 지역·도시, 출발일, 귀국일을 필수 입력으로 제공한다. | M | SCR-003 `/travel-tools`(항공 탭) | IMPLEMENT |
| REQ-FUNC-012 | 시스템은 선택 국가에 속하는 지역·도시만 선택 가능하게 한다. | M | SCR-003 `/travel-tools` | IMPLEMENT |
| REQ-FUNC-013 | 시스템은 출발일이 오늘 이전이거나 귀국일이 출발일보다 빠르면 진행을 차단한다. | M | SCR-003 `/travel-tools` | IMPLEMENT |
| REQ-FUNC-014 | 시스템은 유효한 입력 후 국가·지역·출발일·귀국일 요약 단계를 표시한다. | M | SCR-003 `/travel-tools` | IMPLEMENT |
| REQ-FUNC-015 | 시스템은 폼과 요약에 "입력값은 외부 사이트로 전달되지 않습니다"를 표시한다. | M | SCR-003 `/travel-tools` | IMPLEMENT |
| REQ-FUNC-016 | 시스템은 외부 이동 시 설정된 항공 일반 URL을 새 탭으로 열고 `noopener,noreferrer`를 적용한다. | M | SCR-003 `/travel-tools` | IMPLEMENT |
| REQ-FUNC-017 | 시스템은 항공 입력값을 서버 DB, 서버 로그, 분석 이벤트에 저장하지 않는다. | M | N/A(클라이언트 처리 원칙, 비UI) | IMPLEMENT |
| REQ-FUNC-018 | 시스템은 외부 URL이 없거나 허용목록 밖이면 이동을 차단하고 오류와 재시도를 제공한다. | M | SCR-003 `/travel-tools` | IMPLEMENT |

#### 4.1.3 F3. Hotel Link-out

| ID | Requirement(Baseline 원문) | P | UI Screen/Route | Project Scope Status |
|---|---|:---:|---|---|
| REQ-FUNC-019 | 시스템은 호텔 폼에 숙박 국가, 지역·도시, 체크인, 체크아웃을 필수 입력으로 제공한다. | M | SCR-003 `/travel-tools`(숙소 탭) | IMPLEMENT |
| REQ-FUNC-020 | 시스템은 선택 국가에 속하는 지역·도시만 선택 가능하게 한다. | M | SCR-003 `/travel-tools` | IMPLEMENT |
| REQ-FUNC-021 | 시스템은 체크인이 오늘 이전이거나 체크아웃이 체크인과 같거나 빠르면 진행을 차단한다. | M | SCR-003 `/travel-tools` | IMPLEMENT |
| REQ-FUNC-022 | 시스템은 유효한 입력 후 국가·지역·체크인·체크아웃 요약을 표시한다. | M | SCR-003 `/travel-tools` | IMPLEMENT |
| REQ-FUNC-023 | 시스템은 폼과 요약에 입력값 비전달 안내를 표시한다. | M | SCR-003 `/travel-tools` | IMPLEMENT |
| REQ-FUNC-024 | 시스템은 설정된 호텔 일반 URL을 새 탭으로 열고 `noopener,noreferrer`를 적용한다. | M | SCR-003 `/travel-tools` | IMPLEMENT |
| REQ-FUNC-025 | 시스템은 호텔 입력값을 서버 DB, 서버 로그, 분석 이벤트에 저장하지 않는다. | M | N/A(클라이언트 처리 원칙, 비UI) | IMPLEMENT |
| REQ-FUNC-026 | 시스템은 호텔 URL 오류 시 이동을 차단하고 재시도와 운영 오류 로그를 제공한다. | M | SCR-003 `/travel-tools` | IMPLEMENT |

#### 4.1.4 F4. Travel Mate

| ID | Requirement(Baseline 원문) | P | UI Screen/Route | Project Scope Status |
|---|---|:---:|---|---|
| REQ-FUNC-027 | 시스템은 동행 쓰기 작업에 이메일 인증 세션을 요구한다. | M | SCR-003 `/travel-tools` / SCR-005 `/account` | IMPLEMENT |
| REQ-FUNC-028 | 시스템은 동행 글·요청 전에 만 19세 이상 확인 상태를 요구하며 정확한 생년월일은 저장하지 않는다. | M | SCR-005 `/account` | IMPLEMENT |
| REQ-FUNC-029 | 시스템은 동행 프로필에 닉네임, 연령대, 선택형 성별, 여행 스타일, 자기소개를 제공한다. | M | SCR-005 `/account` | IMPLEMENT |
| REQ-FUNC-030 | 시스템은 국가·지역·여행 기간 겹침·연령대·성별·여행 스타일·모집 상태로 동행글을 필터한다. | M | SCR-004 `/mates` | IMPLEMENT |
| REQ-FUNC-031 | 시스템은 모집글에 제목, 국가, 지역, 시작일, 종료일, 모집 인원, 선호 조건, 여행 스타일, 상세 설명, 안전수칙 동의를 입력받는다. | M | SCR-003 `/travel-tools`(동행 글쓰기 탭) | IMPLEMENT |
| REQ-FUNC-032 | 시스템은 본문에서 전화번호·이메일·일반 메신저 ID 패턴을 탐지해 제출을 차단한다. | M | SCR-003 `/travel-tools` | IMPLEMENT |
| REQ-FUNC-033 | 시스템은 모집글 작성자·상태·조건·설명을 표시하되 이메일과 외부 연락처를 노출하지 않는다. | M | SCR-004 `/mates` | IMPLEMENT |
| REQ-FUNC-034 | 시스템은 모집중 글에 최대 500자의 참가 메시지를 비공개로 제출하게 한다. | M | SCR-004 `/mates` | IMPLEMENT |
| REQ-FUNC-035 | 시스템은 동일 사용자의 동일 글 중복 PENDING·ACCEPTED 요청을 차단한다. | M | SCR-004 `/mates` | IMPLEMENT |
| REQ-FUNC-036 | 시스템은 글 작성자가 참가 요청을 ACCEPTED 또는 REJECTED로 변경하게 한다. | M | SCR-005 `/account`(내 활동 탭) | IMPLEMENT |
| REQ-FUNC-037 | 시스템은 여행 종료일 다음 날 모집글을 CLOSED로 자동 전환한다. | M | SCR-004 `/mates` | IMPLEMENT(방식 변경: 조회 시 종료일 계산) |
| REQ-FUNC-038 | 시스템은 작성자가 모집글을 수동 마감·수정·삭제하게 한다. | M | SCR-005 `/account`(내 활동 탭) | IMPLEMENT |
| REQ-FUNC-039 | 시스템은 글·사용자·참가 요청을 사유 코드와 설명으로 신고하게 한다. | M | SCR-004 `/mates` | IMPLEMENT |
| REQ-FUNC-040 | 시스템은 사용자가 다른 사용자를 차단·해제하게 한다. | M | SCR-004 `/mates`(차단 실행) / SCR-005 `/account`(차단 관리) | IMPLEMENT |
| REQ-FUNC-041 | 시스템은 Moderator에게 신고 우선순위·상태·대상·증거·접수 시각 큐를 제공한다. | M | SCR-005 `/account`(간단 관리자 탭) | IMPLEMENT(축소: 상태별 필터 목록만, 우선순위·증거첨부 제외) |
| REQ-FUNC-042 | 시스템은 Moderator가 경고, 콘텐츠 숨김, 계정 일시 제한, 신고 기각 조치를 기록하게 한다. | M | SCR-005 `/account`(간단 관리자 탭) | IMPLEMENT(축소: 신고 상태 변경만, 세부 제재 로그 제외) |
| REQ-FUNC-043 | 시스템은 참가 요청 접수·승인·거절·신고 처리 결과를 인앱 알림으로 제공하고 이메일은 선택적으로 발송한다. | M | SCR-004 `/mates` / SCR-005 `/account` | IMPLEMENT(방식 변경: 이메일 미발송, Toast·화면 상태로 대체) |
| REQ-FUNC-044 | 시스템은 RLS로 본인 글·요청, 요청 대상 작성자, Moderator/Admin만 비공개 데이터를 열람하게 한다. | M | N/A(서버 정책, 비UI) | IMPLEMENT |
| REQ-FUNC-045 | 시스템은 회원 탈퇴 시 공개 프로필을 즉시 비식별화하고 법적·분쟁 보존 대상이 아닌 개인정보를 30일 이내 삭제한다. | M | N/A | **EXCLUDED** |

#### 4.1.5 F5. Country Safety

| ID | Requirement(Baseline 원문) | P | UI Screen/Route | Project Scope Status |
|---|---|:---:|---|---|
| REQ-FUNC-046 | 시스템은 게시된 모든 해외 국가에 하나 이상의 공개 안전 페이지를 요구한다. | M | SCR-001 `/`(안전정보 Drawer) | IMPLEMENT |
| REQ-FUNC-047 | 시스템은 치안, 흔한 사기, 현지 법규, 교통, 재난·기후, 보건, 문화·복장, 긴급연락처 섹션을 제공한다. | M | SCR-001 `/` | IMPLEMENT |
| REQ-FUNC-048 | 시스템은 각 안전 페이지에 공식 출처명·URL·최종 확인일·편집자를 기록한다. | M | SCR-001 `/` | IMPLEMENT |
| REQ-FUNC-049 | 시스템은 외교부 해외안전여행 원문 링크를 새 탭으로 제공한다. | M | SCR-001 `/` | IMPLEMENT |
| REQ-FUNC-050 | 시스템은 최종 확인 후 7일이 지나면 stale 상태와 재확인 경고를 표시한다. | M | SCR-001 `/` | IMPLEMENT |
| REQ-FUNC-051 | 시스템은 출국권고·여행금지·특별여행주의보 등 중대 경보를 본문 상단에 텍스트로 표시한다. | M | SCR-001 `/` | IMPLEMENT |
| REQ-FUNC-052 | 시스템은 국가 전체 경보와 특정 지역 경보를 별도 범위로 모델링한다. | M | SCR-001 `/` | IMPLEMENT |
| REQ-FUNC-053 | 시스템은 현지 긴급전화와 대한민국 재외공관 또는 영사콜센터 연결 정보를 표시한다. | M | SCR-001 `/` | IMPLEMENT |
| REQ-FUNC-054 | 시스템은 안전정보가 공식 판단을 대체하지 않으며 출국 직전 원문 재확인이 필요함을 고지한다. | M | SCR-001 `/` / SCR-003 `/travel-tools` | IMPLEMENT |
| REQ-FUNC-055 | 시스템은 Editor/Admin이 안전 콘텐츠를 작성·검수·게시·보관하게 한다. | M | N/A | **EXCLUDED** |
| REQ-FUNC-056 | 시스템은 안전정보 변경 이력을 이전 값·새 값·사유·담당자·시각과 함께 보존한다. | M | N/A | **EXCLUDED** |

#### 4.1.6 F6. About free_traveler

| ID | Requirement(Baseline 원문) | P | UI Screen/Route | Project Scope Status |
|---|---|:---:|---|---|
| REQ-FUNC-057 | 시스템은 대표명 `free_traveler`, `50+ Trips`, `30+ Countries`를 표시한다. | M | SCR-002 `/about` | IMPLEMENT |
| REQ-FUNC-058 | 시스템은 대표 소개문·여행 철학·콘텐츠 편집 원칙을 표시한다. | M | SCR-002 `/about` | IMPLEMENT |
| REQ-FUNC-059 | 시스템은 방문 권역 지도 또는 30개국 이상의 국가 목록을 제공한다. | M | SCR-002 `/about` | IMPLEMENT |
| REQ-FUNC-060 | 시스템은 대표 여행 타임라인과 대표 여행 기록을 제공한다. | M | SCR-002 `/about` | IMPLEMENT |
| REQ-FUNC-061 | 시스템은 대표 이미지에 대체텍스트·출처·작가·라이선스 URL을 제공한다. | M | SCR-002 `/about` | IMPLEMENT(축소: alt·출처 URL만) |
| REQ-FUNC-062 | 시스템은 관리자 설정 기반 문의·SNS 링크를 제공한다. | S | SCR-002 `/about`(표시) / SCR-005 `/account`(설정) | IMPLEMENT |
| REQ-FUNC-063 | 시스템은 대표 추천 여행지 6개를 공개 여행지 상세로 연결한다. | S | SCR-002 `/about` | IMPLEMENT |

#### 4.1.7 F7. Common, Admin, Governance

| ID | Requirement(Baseline 원문) | P | UI Screen/Route | Project Scope Status |
|---|---|:---:|---|---|
| REQ-FUNC-064 | 시스템은 모든 공개 페이지에 일관된 전역 내비게이션과 푸터를 제공한다. | M | 전역(5개 Screen 공통, `src/app/layout.tsx`) | IMPLEMENT |
| REQ-FUNC-065 | 시스템은 320px부터 데스크톱까지 레이아웃을 반응형으로 제공한다. | M | 전역 | IMPLEMENT |
| REQ-FUNC-066 | 시스템은 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정을 제공한다. | M | SCR-005 `/account` | IMPLEMENT |
| REQ-FUNC-067 | 시스템은 여행지·국가 안전정보를 통합 검색한다. | M | SCR-001 `/` | IMPLEMENT |
| REQ-FUNC-068 | 시스템은 회원이 여행지를 즐겨찾기·해제·조회하게 한다. | S | SCR-001 `/` / SCR-005 `/account` | IMPLEMENT |
| REQ-FUNC-069 | 시스템은 여행지·안전·동행 공개 페이지의 URL 공유를 제공한다. | S | SCR-001 `/` / SCR-004 `/mates` | IMPLEMENT |
| REQ-FUNC-070 | 시스템은 공개 페이지별 title, description, canonical, Open Graph, 구조화 데이터를 제공한다. | M | N/A(전역, 비가시 메타) | IMPLEMENT |
| REQ-FUNC-071 | 시스템은 폼 시작·검증 완료·외부 클릭·안전 섹션 조회·동행 요청 이벤트를 기록하되 정확한 날짜와 자유서술은 기록하지 않는다. | M | N/A | **EXCLUDED** |
| REQ-FUNC-072 | 시스템은 Editor/Admin에게 여행지·콘텐츠 CRUD와 미리보기를 제공한다. | M | N/A | **EXCLUDED** |
| REQ-FUNC-073 | 시스템은 미디어 업로드 시 출처·작가·라이선스·원문 URL·대체텍스트를 필수 입력받는다. | M | N/A | **EXCLUDED** |
| REQ-FUNC-074 | 시스템은 여행지·안전·대표 콘텐츠의 게시 전 완전성 게이트를 실행한다. | M | N/A | **EXCLUDED** |
| REQ-FUNC-075 | 시스템은 안전정보 stale 현황, 최근 확인일, 검토 담당자 대시보드를 제공한다. | M | N/A | **EXCLUDED** |
| REQ-FUNC-076 | 시스템은 관리자 변경·신고 처리·권한 변경을 감사 로그로 남긴다. | M | N/A | **EXCLUDED** |
| REQ-FUNC-077 | 시스템은 Admin이 항공·호텔 외부 URL을 허용목록 내 HTTPS 주소로 설정하게 한다. | M | SCR-005 `/account`(간단 관리자 탭) | IMPLEMENT |
| REQ-FUNC-078 | 시스템은 404·500·권한 없음·외부 연결 실패 화면에 복구 행동을 제공한다. | M | 기술 Route(`src/app/not-found.tsx`, `src/app/error.tsx`) | IMPLEMENT |
| REQ-FUNC-079 | 시스템은 폼·모달·탭·알림에 올바른 HTML 의미와 ARIA 상태를 제공한다. | M | 전역 | IMPLEMENT(축소: 자동 검사 도구 없이 코딩 기준으로 적용) |
| REQ-FUNC-080 | 시스템은 이용약관, 개인정보 처리방침, 동행 안전수칙, 콘텐츠 면책 안내를 제공하고 동행 글 작성 시 안전수칙 동의를 기록한다. | M | SCR-003 `/travel-tools`(동의 체크) / 전역(정책 문서, Footer 링크) | IMPLEMENT |

### 4.2 Non-Functional Requirements

#### 4.2.1 Performance

| ID | Requirement(Baseline 원문) | Metric | Target | UI Screen/Route | Project Scope Status |
|---|---|---|---:|---|---|
| REQ-NF-001 | 공개 핵심 페이지의 LCP를 제한한다. | LCP p75 | ≤2.5s | N/A | **EXCLUDED** |
| REQ-NF-002 | 상호작용 지연을 제한한다. | INP p75 | ≤200ms | N/A | **EXCLUDED** |
| REQ-NF-003 | 레이아웃 이동을 제한한다. | CLS p75 | ≤0.1 | N/A | **EXCLUDED** |
| REQ-NF-004 | 여행지·동행 필터 응답을 제한한다. | p95 | ≤1s | N/A | **EXCLUDED** |
| REQ-NF-005 | 쓰기 API 응답을 제한한다. | p95 | ≤3s | N/A | **EXCLUDED** |
| REQ-NF-006 | 이미지 성능을 최적화한다. | 초기 로드 | responsive+lazy | 전역 | IMPLEMENT |
| REQ-NF-007 | 배포 전 성능 예산을 검사한다. | Lighthouse | ≥85 | N/A | **EXCLUDED** |

#### 4.2.2 Reliability and Recovery

| ID | Requirement(Baseline 원문) | Target | UI Screen/Route | Project Scope Status |
|---|---|---:|---|---|
| REQ-NF-008 | 월간 서비스 가용성 | ≥99.5% | N/A | **EXCLUDED** |
| REQ-NF-009 | 내부 API 5xx 비율 | ≤0.5% | N/A | **EXCLUDED** |
| REQ-NF-010 | DB 백업 RPO/RTO | RPO ≤24h, RTO ≤8h | N/A | **EXCLUDED** |
| REQ-NF-011 | 항공·호텔·공식 출처 링크 자동 검사 | 주 1회 | N/A | **EXCLUDED** |

#### 4.2.3 Security and Privacy

| ID | Requirement(Baseline 원문) | UI Screen/Route | Project Scope Status |
|---|---|---|---|
| REQ-NF-012 | 모든 통신에 TLS 1.2 이상을 사용한다. | N/A(인프라) | IMPLEMENT |
| REQ-NF-013 | 인증·역할·RLS 정책을 서버에서 검증한다. | N/A(서버 정책) | IMPLEMENT |
| REQ-NF-014 | 상태 변경 요청에 CSRF 방어·SameSite 쿠키를 적용한다. | N/A(서버 정책) | IMPLEMENT |
| REQ-NF-015 | 사용자 입력을 검증·이스케이프하고 저장 XSS를 차단한다. | N/A(서버·클라이언트 처리) | IMPLEMENT |
| REQ-NF-016 | 비밀키는 환경변수로 관리하고 클라이언트 번들에 포함하지 않는다. | N/A(배포 설정) | IMPLEMENT |
| REQ-NF-017 | 항공·호텔 원시 입력값을 서버·분석에 보존하지 않는다. | N/A(클라이언트 처리 원칙) | IMPLEMENT |
| REQ-NF-018 | 개인정보 내보내기·탈퇴·삭제 요청을 제공한다. | N/A | **EXCLUDED** |

#### 4.2.4 Safety and Moderation

| ID | Requirement(Baseline 원문) | Target | UI Screen/Route | Project Scope Status |
|---|---|---:|---|---|
| REQ-NF-019 | 신고 접수 응답 | p95 ≤3s | SCR-004 `/mates` | IMPLEMENT(정량 측정 제외, 즉시 접수 표시만) |
| REQ-NF-020 | 신고 1차 검토 | 24h 이내 90% 이상 | N/A | **EXCLUDED** |
| REQ-NF-021 | 동일 사용자의 글·요청·신고 속도 제한 | 정책 초과 시 429 | N/A | **EXCLUDED** |
| REQ-NF-022 | Moderator 조치 추적 가능성 | 감사 로그 누락 0건 | N/A | **EXCLUDED** |

#### 4.2.5 Accessibility

| ID | Requirement(Baseline 원문) | Target | UI Screen/Route | Project Scope Status |
|---|---|---:|---|---|
| REQ-NF-023 | WCAG 2.2 준수 목표 | Level AA | 전역 | IMPLEMENT |
| REQ-NF-024 | 자동 접근성 검사 | axe serious/critical 0건 | N/A | **EXCLUDED** |
| REQ-NF-025 | 키보드·스크린리더 수동 검사 | 핵심 UC 100% 통과 | 전역 | IMPLEMENT(축소: Playwright 핵심 흐름만) |

#### 4.2.6 Content, Freshness, SEO, Copyright

| ID | Requirement(Baseline 원문) | Target | UI Screen/Route | Project Scope Status |
|---|---|---:|---|---|
| REQ-NF-026 | 여행지 콘텐츠 완전성 | 게시 콘텐츠 100% | N/A(데이터 수동 검수) | IMPLEMENT |
| REQ-NF-027 | 해외 국가 안전정보 커버리지 | 게시 국가 100% | N/A(데이터 수동 검수) | IMPLEMENT |
| REQ-NF-028 | 안전정보 최신 확인 | 7일 이내 95% 이상, 초과 시 경고 100% | SCR-001 `/` | IMPLEMENT(축소: 경고 로직만, 수치 목표 미검증) |
| REQ-NF-029 | 미디어 라이선스 메타데이터 | 공개 미디어 100% | N/A | **EXCLUDED** |
| REQ-NF-030 | 공개 페이지 SEO 메타데이터 | 누락 0건 | N/A(비가시 메타) | IMPLEMENT |

#### 4.2.7 Maintainability, Monitoring, Cost

| ID | Requirement(Baseline 원문) | Target | UI Screen/Route | Project Scope Status |
|---|---|---:|---|---|
| REQ-NF-031 | TypeScript strict·lint·unit test | main 병합 전 통과 | N/A(개발 표준) | IMPLEMENT |
| REQ-NF-032 | 구조화 로그 | request_id, actor, action, result; 개인정보 제외 | N/A | **EXCLUDED** |
| REQ-NF-033 | 핵심 오류 알림 | 5xx>1% 또는 외부 링크 실패 시 5분 이내 | N/A | **EXCLUDED** |
| REQ-NF-034 | MVP 월 인프라 비용 | 콘텐츠 인건비 제외 100,000원 이하 목표 | N/A(Vercel·Supabase 저가 티어) | IMPLEMENT |

---

## 5. UI Route Contract 참조

Route·Page Entry의 기계 판독 가능한 원본은 `design-reference/SCREEN_ROUTE_CONTRACT.json`(`schema_version: traveler-screen-route-v1`)이다. 5개 Screen의 Route 중복·Page Entry 중복 없음, 핵심 4(SCR-001·003·004·005)·보조 1(SCR-002) 구분은 `design-reference/UI_CONTRACT.md` 6장에서 검증했다.

## 6. Release Acceptance Criteria 참조

릴리스 가능 조건과 현재 충족 여부는 `docs/05_UIUX_APPROVED.md` 5장을 단일 기준으로 한다. 현재 판정은 `NOT_READY`이며(구현 미착수), 본 개정본은 요구사항의 UI 배치를 확정한 것이지 구현 완료를 의미하지 않는다.

## 7. 집계 검증

| 구분 | 건수 |
|---|---:|
| REQ-FUNC 합계 | 80 |
| REQ-NF 합계 | 34 |
| **전체 합계(삭제 없음 확인)** | **114** |
| Project Scope Status = IMPLEMENT | 87 (FUNC 71 + NF 16) |
| Project Scope Status = EXCLUDED | 27 (FUNC 9 + NF 18) |
