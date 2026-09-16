# UI Coverage Analysis — Free Traveler

- **Document ID:** UICOV-TRAVEL-001
- **기반 문서:** `01_PRD.md`, `02_SRS_BASELINE.md`, `PROJECT_SCOPE.md`
- **대상:** REQ-FUNC-001~080, REQ-NF-001~034 (총 114개, 전량 유지)

---

## 1. 목적

본 문서는 SRS의 요구사항 전체를 삭제 없이 유지한 채, 정확히 5개의 디자인 Screen에 UI 요구사항을 배치한다. 각 요구사항은 UI 성격에 따라 분류하고, `PROJECT_SCOPE.md`의 IMPLEMENT/EXCLUDED 분류를 그대로 인용해 구현 범위를 재확정하지 않는다.

## 2. UI 분류 기준

| 분류 | 정의 |
|---|---|
| **UI_DIRECT** | 화면에 직접 보이는 요소·상호작용으로 구현되는 요구사항(폼, 버튼, 목록, 패널, 표시 콘텐츠 등). |
| **UI_STATE** | 독립된 화면 요소는 아니지만 화면의 상태·동작을 결정하는 요구사항(검증 오류, 빈 상태, 로딩, 뱃지 계산 로직 등). |
| **NON_UI** | 화면에 직접 드러나지 않는 데이터·보안·처리 원칙 요구사항(서버 미저장, RLS, TLS, SEO 메타 등). |
| **OPERATIONS** | 운영·관리·인프라 성격의 요구사항으로, 본 5개 Screen 범위 밖에서 다뤄지거나 `PROJECT_SCOPE.md`에서 EXCLUDED로 처리된 항목이 다수 포함된다. |

## 3. 디자인 Screen 고정 목록(5개)

| Screen ID | 경로 | 역할 요약 |
|---|---|---|
| SCR-001 | `/` | 메인 — 여행지 탐색·필터·검색, 여행지 상세와 국가 안전정보를 Drawer/Modal로 제공 |
| SCR-002 | `/about` | 대표 소개 — `free_traveler` 프로필·철학·타임라인 |
| SCR-003 | `/travel-tools` | 통합 여행 준비 — 항공/숙소/동행작성 3탭 |
| SCR-004 | `/mates` | 동행 조회 — 모집글 목록과 상세 패널(참가 요청·신고·차단 실행) |
| SCR-005 | `/account` | 계정·관리 — 로그인/프로필/내 활동/차단 관리/간단 관리자 탭 |

> API Route, 인증 콜백(`/auth/callback` 등), 404/500 등 오류 처리 페이지는 기술 Route로서 위 5개 디자인 Screen에 포함하지 않는다. 해당 요구사항(REQ-FUNC-078 등)은 Screen 열에 "기술 Route(비Screen)"로 표기한다.

### 3.1 Screen 상세 프로필

#### SCR-001 `/` 메인
- **사용자 목표:** 여행지를 발견하고, 여행지 상세와 해당 국가 안전정보를 한 화면 흐름 안에서 확인한다.
- **주요 영역:** 검색바/통합검색, 국내·해외 탭, 필터(국가·테마·계절·기간), 여행지 카드 그리드, 관련 여행지 추천, 즐겨찾기 버튼, 여행지 상세 Drawer/Modal, 안전정보 Drawer/Modal.
- **상태:** 필터 적용·초기화, 빈 결과 안내, 여행지 상세 Drawer 열림/닫힘, 안전정보 Drawer 전환, stale 경고 배지, 즐겨찾기 토글, URL query 필터 복원.
- **이동 목적지:** 여행지 상세 Drawer 내 "안전정보 보기" → 같은 화면의 안전정보 Drawer/Modal로 전환. "여행 조건 입력하러 가기" → SCR-003. 대표 소개 링크 → SCR-002. 동행 찾기 링크 → SCR-004. 계정 아이콘 → SCR-005.

#### SCR-002 `/about`
- **사용자 목표:** `free_traveler`의 여행 경험과 편집 기준을 확인해 콘텐츠 신뢰도를 판단한다.
- **주요 영역:** 대표 이미지·한 문장 소개, `50+ Trips`/`30+ Countries` 카드, 철학·편집 원칙, 방문 권역 지도 또는 국가 목록, 여행 타임라인, 추천 여행지 6곳, 문의·SNS 링크.
- **상태:** 이미지 메타데이터 누락 시 대체 표시, 빈 링크 미노출, 추천 여행지 중 비공개 항목 자동 제외.
- **이동 목적지:** 추천 여행지 카드 → SCR-001 여행지 상세 Drawer. 방문 국가 항목 → SCR-001 관련 여행지 목록.

#### SCR-003 `/travel-tools`
- **사용자 목표:** 항공·숙소 조건을 정리해 외부 예약 사이트로 이동하거나, 동행 모집글을 새로 작성한다.
- **주요 영역:** 탭 1(항공 입력·요약·외부이동), 탭 2(숙소 입력·요약·외부이동), 탭 3(동행 모집글 작성 폼·안전수칙 동의).
- **상태:** 필드별 검증 오류, 날짜 역전/과거일 차단, 요약 단계 전환, 비전달 고지 노출, 외부 URL 오류 시 재시도 안내, 연락처 패턴 탐지 시 제출 차단, 비로그인·미성년 상태의 동행작성 탭 접근 제한.
- **이동 목적지:** 항공/숙소 탭 "보러 가기" → 설정된 외부 사이트 새 탭. 동행작성 탭에서 인증 필요 시 → SCR-005. 작성 완료 시 → SCR-004 해당 모집글 상세 패널.

#### SCR-004 `/mates`
- **사용자 목표:** 조건에 맞는 동행 모집글을 찾아 참가를 요청하거나, 문제가 있는 글·사용자를 신고·차단한다.
- **주요 영역:** 필터(국가·지역·기간·연령대·성별·스타일·모집상태), 모집글 목록, 상세 패널(작성자·조건·설명·모집상태·참가 요청 폼·신고·차단 버튼).
- **상태:** 필터 적용 결과, 모집중/마감 상태 뱃지(조회 시 종료일 계산), 중복 참가 요청 차단 안내, 신고 접수 완료 표시, 차단 후 상호 노출 제한, 비로그인 접근 시 로그인 유도.
- **이동 목적지:** "모집글 작성" → SCR-003 동행작성 탭. 참가 요청/신고/차단 시 비로그인 → SCR-005 로그인. 작성자의 요청 승인·거절 관리 → SCR-005 내 활동 탭.

#### SCR-005 `/account`
- **사용자 목표:** 로그인·회원가입·성인확인을 완료하고, 내가 쓴 글·참가 요청·즐겨찾기·차단 관계를 관리하며, 권한이 있는 경우 신고 상태와 외부 URL을 처리한다.
- **주요 영역:** 탭 1(로그인/가입/비밀번호 재설정), 탭 2(프로필: 닉네임·연령대·성별·여행 스타일·성인확인), 탭 3(내 활동: 내 모집글 관리·참가 요청 관리·즐겨찾기), 탭 4(차단 관리), 탭 5(간단 관리자: 신고 상태 변경·외부 URL 설정, Moderator/Admin 권한자만 노출).
- **상태:** 인증·성인확인 상태, 참가 요청 상태 필터(PENDING/ACCEPTED/REJECTED), 관리자 탭 노출 여부(권한 기반), 저장 성공/실패.
- **이동 목적지:** 내 모집글 클릭 → SCR-004 해당 상세 패널. 즐겨찾기 항목 클릭 → SCR-001 해당 여행지 상세 Drawer.

---

## 4. Requirement 매핑 — REQ-FUNC (80개)

### 4.1 F1. Destination Guide (001~010) — SCR-001

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-001 | 국내·해외 여행지 목록 구분 | UI_DIRECT | IMPLEMENT | SCR-001 | 탭 UI |
| REQ-FUNC-002 | 국가·도시·계절·테마·기간 필터 | UI_DIRECT | IMPLEMENT | SCR-001 | 필터 패널 |
| REQ-FUNC-003 | 키워드 검색 | UI_DIRECT | IMPLEMENT | SCR-001 | 검색바 |
| REQ-FUNC-004 | 상세 필수 콘텐츠 항목 표시 | UI_DIRECT | IMPLEMENT | SCR-001 | 여행지 상세 Drawer/Modal |
| REQ-FUNC-005 | 빈 결과 안내·초기화 버튼 | UI_STATE | IMPLEMENT | SCR-001 | 빈 상태 |
| REQ-FUNC-006 | 해외 상세 → 안전정보 연결 | UI_DIRECT | IMPLEMENT | SCR-001 | 상세 Drawer 내 안전정보 Drawer 전환 |
| REQ-FUNC-007 | 이미지 대체텍스트·출처 연결 | UI_STATE | IMPLEMENT(축소) | SCR-001 | alt·URL만 표시, 라이선스 관리 없음 |
| REQ-FUNC-008 | MVP 게시 수량 기준 검증 | NON_UI | IMPLEMENT(축소) | N/A | 콘텐츠 데이터 품질, 화면 요소 아님 |
| REQ-FUNC-009 | 관련 여행지 추천 최대 6개 | UI_DIRECT | IMPLEMENT | SCR-001 | 상세 Drawer 하단 |
| REQ-FUNC-010 | 필터 상태 URL query 반영 | UI_STATE | IMPLEMENT | SCR-001 | 새로고침·공유 복원 |

### 4.2 F2. Flight Link-out (011~018) — SCR-003 항공 탭

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-011 | 국가·지역·출발일·귀국일 필수 입력 | UI_DIRECT | IMPLEMENT | SCR-003 | 항공 탭 폼 |
| REQ-FUNC-012 | 국가별 지역 옵션 필터링 | UI_STATE | IMPLEMENT | SCR-003 | 종속 옵션 초기화 |
| REQ-FUNC-013 | 날짜 유효성 검증·차단 | UI_STATE | IMPLEMENT | SCR-003 | 오류 상태 |
| REQ-FUNC-014 | 입력 요약 단계 표시 | UI_DIRECT | IMPLEMENT | SCR-003 | 요약 화면 |
| REQ-FUNC-015 | 입력값 비전달 고지 | UI_DIRECT | IMPLEMENT | SCR-003 | 고지 문구 |
| REQ-FUNC-016 | 외부 항공 URL 새 탭 이동 | UI_DIRECT | IMPLEMENT | SCR-003 | 외부이동 버튼 |
| REQ-FUNC-017 | 항공 입력값 서버 미저장 | NON_UI | IMPLEMENT | N/A | 클라이언트 처리 원칙 |
| REQ-FUNC-018 | 외부 URL 오류 시 재시도 제공 | UI_STATE | IMPLEMENT | SCR-003 | 오류 상태 |

### 4.3 F3. Hotel Link-out (019~026) — SCR-003 숙소 탭

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-019 | 국가·지역·체크인·체크아웃 필수 입력 | UI_DIRECT | IMPLEMENT | SCR-003 | 숙소 탭 폼 |
| REQ-FUNC-020 | 국가별 지역 옵션 필터링 | UI_STATE | IMPLEMENT | SCR-003 | 종속 옵션 초기화 |
| REQ-FUNC-021 | 날짜 유효성 검증·차단 | UI_STATE | IMPLEMENT | SCR-003 | 오류 상태 |
| REQ-FUNC-022 | 입력 요약 표시 | UI_DIRECT | IMPLEMENT | SCR-003 | 요약 화면 |
| REQ-FUNC-023 | 입력값 비전달 고지 | UI_DIRECT | IMPLEMENT | SCR-003 | 고지 문구 |
| REQ-FUNC-024 | 외부 호텔 URL 새 탭 이동 | UI_DIRECT | IMPLEMENT | SCR-003 | 외부이동 버튼 |
| REQ-FUNC-025 | 호텔 입력값 서버 미저장 | NON_UI | IMPLEMENT | N/A | 클라이언트 처리 원칙 |
| REQ-FUNC-026 | URL 오류 시 이동 차단·재시도 | UI_STATE | IMPLEMENT | SCR-003 | 오류 상태 |

### 4.4 F4. Travel Mate (027~045) — SCR-003(작성) / SCR-004(조회·상세) / SCR-005(관리)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-027 | 동행 쓰기에 인증 세션 요구 | UI_STATE | IMPLEMENT | SCR-003 / SCR-005 | 작성 탭 진입 제한, 로그인 유도 |
| REQ-FUNC-028 | 성인확인 상태 요구, 생년월일 미저장 | UI_DIRECT | IMPLEMENT | SCR-005 | 프로필 탭 성인확인 |
| REQ-FUNC-029 | 동행 프로필 필드 | UI_DIRECT | IMPLEMENT | SCR-005 | 프로필 탭 |
| REQ-FUNC-030 | 동행글 필터(조건 겹침) | UI_DIRECT | IMPLEMENT | SCR-004 | 필터 패널 |
| REQ-FUNC-031 | 모집글 작성 필드·검증 | UI_DIRECT | IMPLEMENT | SCR-003 | 동행작성 탭 |
| REQ-FUNC-032 | 공개 연락처 패턴 탐지·차단 | UI_STATE | IMPLEMENT | SCR-003 | 동행작성 탭 제출 검증 |
| REQ-FUNC-033 | 작성자·상태 표시, 연락처 비노출 | UI_DIRECT | IMPLEMENT | SCR-004 | 상세 패널 |
| REQ-FUNC-034 | 참가 메시지 제출(PENDING) | UI_DIRECT | IMPLEMENT | SCR-004 | 상세 패널 참가 요청 폼 |
| REQ-FUNC-035 | 중복 참가 요청 차단 | UI_STATE | IMPLEMENT | SCR-004 | 제출 검증 |
| REQ-FUNC-036 | 참가 요청 승인·거절 | UI_DIRECT | IMPLEMENT | SCR-005 | 내 활동 탭(요청 관리) |
| REQ-FUNC-037 | 종료일 경과 시 자동 마감 | UI_STATE | IMPLEMENT(방식 변경) | SCR-004 | 목록 상태 뱃지, 조회 시 계산 |
| REQ-FUNC-038 | 수동 마감·수정·삭제 | UI_DIRECT | IMPLEMENT | SCR-005 | 내 활동 탭(내 글 관리) |
| REQ-FUNC-039 | 글·사용자·요청 신고 | UI_DIRECT | IMPLEMENT | SCR-004 | 상세 패널 신고 버튼 |
| REQ-FUNC-040 | 사용자 차단·해제 | UI_DIRECT | IMPLEMENT | SCR-004 / SCR-005 | 차단 실행(SCR-004), 차단 목록 관리(SCR-005) |
| REQ-FUNC-041 | 신고 큐(상태별 필터, 축소) | UI_DIRECT | IMPLEMENT(축소) | SCR-005 | 간단 관리자 탭 |
| REQ-FUNC-042 | 신고 상태 변경(축소) | UI_DIRECT | IMPLEMENT(축소) | SCR-005 | 간단 관리자 탭 |
| REQ-FUNC-043 | 참가·신고 처리 결과 알림(Toast) | UI_STATE | IMPLEMENT(방식 변경) | SCR-004 / SCR-005 | 전역 Toast, 주 발생 지점 |
| REQ-FUNC-044 | RLS 기반 비공개 데이터 접근 제어 | NON_UI | IMPLEMENT | N/A | 서버 정책 |
| REQ-FUNC-045 | 탈퇴 시 비식별화·개인정보 삭제 | OPERATIONS | EXCLUDED | N/A | PROJECT_SCOPE 유지, 복원하지 않음 |

### 4.5 F5. Country Safety (046~056) — SCR-001 안전정보 Drawer/Modal

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-046 | 해외 국가 안전 페이지 요구 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer/Modal |
| REQ-FUNC-047 | 8개 필수 카테고리 제공 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer 본문 |
| REQ-FUNC-048 | 출처명·URL·확인일·편집자 표시 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer 메타 |
| REQ-FUNC-049 | 외교부 원문 링크 새 탭 | UI_DIRECT | IMPLEMENT | SCR-001 | 외부 링크 |
| REQ-FUNC-050 | 7일 초과 stale 경고 | UI_STATE | IMPLEMENT | SCR-001 | 렌더링 시 계산 |
| REQ-FUNC-051 | 중대 경보 상단 텍스트 표시 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer 상단 |
| REQ-FUNC-052 | 국가·지역 경보 범위 구분 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer 표시 |
| REQ-FUNC-053 | 긴급연락처 표시 | UI_DIRECT | IMPLEMENT | SCR-001 | 안전정보 Drawer 본문 |
| REQ-FUNC-054 | 공식 판단 대체 아님 고지 | UI_DIRECT | IMPLEMENT | SCR-001 / SCR-003 | 안전 Drawer 및 항공·숙소 요약 |
| REQ-FUNC-055 | Editor/Admin 안전 콘텐츠 CRUD 워크플로 | OPERATIONS | EXCLUDED | N/A | PROJECT_SCOPE 유지, 복원하지 않음 |
| REQ-FUNC-056 | 안전정보 변경 이력 보존 | OPERATIONS | EXCLUDED | N/A | PROJECT_SCOPE 유지, 복원하지 않음 |

### 4.6 F6. About free_traveler (057~063) — SCR-002

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-057 | 대표명·50+·30+ 표시 | UI_DIRECT | IMPLEMENT | SCR-002 | 수치 카드 |
| REQ-FUNC-058 | 소개문·철학·편집 원칙 | UI_DIRECT | IMPLEMENT | SCR-002 | 본문 섹션 |
| REQ-FUNC-059 | 방문 권역 지도/국가 목록 | UI_DIRECT | IMPLEMENT | SCR-002 | 지도 또는 목록 |
| REQ-FUNC-060 | 여행 타임라인 | UI_DIRECT | IMPLEMENT | SCR-002 | 타임라인 섹션 |
| REQ-FUNC-061 | 대표 이미지 대체텍스트·출처 | UI_STATE | IMPLEMENT(축소) | SCR-002 | alt·URL만 관리 |
| REQ-FUNC-062 | 문의·SNS 링크 | UI_DIRECT | IMPLEMENT | SCR-002 / SCR-005 | 표시(SCR-002), 설정(SCR-005 관리자 탭) |
| REQ-FUNC-063 | 추천 여행지 6개 연결 | UI_DIRECT | IMPLEMENT | SCR-002 | SCR-001 상세로 이동 |

### 4.7 F7. Common, Admin, Governance (064~080)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-FUNC-064 | 전역 내비게이션·푸터 | UI_DIRECT | IMPLEMENT | 전역(5개 Screen 공통) | 레이아웃 셸 |
| REQ-FUNC-065 | 반응형 레이아웃(320px~) | UI_STATE | IMPLEMENT | 전역(5개 Screen 공통) | 뷰포트 대응 |
| REQ-FUNC-066 | 이메일 가입·로그인·로그아웃·재설정 | UI_DIRECT | IMPLEMENT | SCR-005 | 로그인 탭 |
| REQ-FUNC-067 | 여행지·안전정보 통합 검색 | UI_DIRECT | IMPLEMENT | SCR-001 | 검색바 |
| REQ-FUNC-068 | 여행지 즐겨찾기(localStorage) | UI_DIRECT | IMPLEMENT | SCR-001 / SCR-005 | 추가(SCR-001), 목록(SCR-005 내 활동 탭) |
| REQ-FUNC-069 | 공개 페이지 URL 공유 | UI_DIRECT | IMPLEMENT | SCR-001 / SCR-004 | 상세 Drawer·상세 패널 공유 버튼 |
| REQ-FUNC-070 | 페이지별 SEO 메타데이터 | NON_UI | IMPLEMENT | N/A | `<head>` 메타, 비가시 요소 |
| REQ-FUNC-071 | 행동 분석 이벤트 기록 | NON_UI | EXCLUDED | N/A | PROJECT_SCOPE 유지, 복원하지 않음 |
| REQ-FUNC-072 | Editor/Admin 콘텐츠 CRUD·미리보기 | OPERATIONS | EXCLUDED | N/A | PROJECT_SCOPE 유지, 복원하지 않음 |
| REQ-FUNC-073 | 미디어 업로드 필수 메타데이터 | OPERATIONS | EXCLUDED | N/A | PROJECT_SCOPE 유지, 복원하지 않음 |
| REQ-FUNC-074 | 게시 전 완전성 자동 게이트 | OPERATIONS | EXCLUDED | N/A | PROJECT_SCOPE 유지, 복원하지 않음 |
| REQ-FUNC-075 | 안전정보 stale 대시보드 | OPERATIONS | EXCLUDED | N/A | PROJECT_SCOPE 유지, 복원하지 않음 |
| REQ-FUNC-076 | 관리자 변경·신고 처리 감사 로그 | OPERATIONS | EXCLUDED | N/A | PROJECT_SCOPE 유지, 복원하지 않음 |
| REQ-FUNC-077 | 외부 URL 허용목록 설정 | UI_DIRECT | IMPLEMENT | SCR-005 | 간단 관리자 탭 |
| REQ-FUNC-078 | 404·500·권한없음·연결실패 화면 | UI_STATE | IMPLEMENT | 기술 Route(비Screen) | 5개 Screen에 포함하지 않음 |
| REQ-FUNC-079 | 시맨틱 HTML·ARIA 상태 | UI_STATE | IMPLEMENT(축소) | 전역(5개 Screen 공통) | 자동 검사 도구 없이 코딩 기준으로 적용 |
| REQ-FUNC-080 | 약관·안전수칙·면책 고지·동의 기록 | UI_DIRECT | IMPLEMENT | SCR-003 | 동행작성 탭 동의 체크(정책 문서는 전역 푸터 링크) |

---

## 5. Requirement 매핑 — REQ-NF (34개)

### 5.1 Performance (001~007)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-001 | LCP 목표 | NON_UI | EXCLUDED | N/A | 측정 인프라 미도입 |
| REQ-NF-002 | INP 목표 | NON_UI | EXCLUDED | N/A | 측정 인프라 미도입 |
| REQ-NF-003 | CLS 목표 | NON_UI | EXCLUDED | N/A | 측정 인프라 미도입 |
| REQ-NF-004 | 필터 응답 p95(동시 50명) | NON_UI | EXCLUDED | N/A | 부하 테스트 제외 |
| REQ-NF-005 | 쓰기 API 응답 p95 | NON_UI | EXCLUDED | N/A | 부하 테스트 제외 |
| REQ-NF-006 | 이미지 반응형·지연 로딩 | UI_STATE | IMPLEMENT | 전역(5개 Screen 공통) | `next/image` 적용 |
| REQ-NF-007 | Lighthouse 성능 예산 CI | OPERATIONS | EXCLUDED | N/A | CI 자동화 제외 |

### 5.2 Reliability and Recovery (008~011)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-008 | 월간 가용성 목표 | OPERATIONS | EXCLUDED | N/A | 모니터링 인프라 제외 |
| REQ-NF-009 | 내부 API 5xx 비율 | OPERATIONS | EXCLUDED | N/A | 모니터링 인프라 제외 |
| REQ-NF-010 | DB 백업 RPO/RTO | OPERATIONS | EXCLUDED | N/A | 자동 백업 제외 |
| REQ-NF-011 | 외부 링크 주간 자동 검사 | OPERATIONS | EXCLUDED | N/A | 스케줄러 미도입 |

### 5.3 Security and Privacy (012~018)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-012 | TLS 1.2 이상 | NON_UI | IMPLEMENT | N/A | 인프라 기본 제공 |
| REQ-NF-013 | 인증·역할·RLS 서버 검증 | NON_UI | IMPLEMENT | N/A | 서버 정책 |
| REQ-NF-014 | CSRF 방어·SameSite 쿠키 | NON_UI | IMPLEMENT | N/A | 서버 정책 |
| REQ-NF-015 | 입력 검증·XSS 차단 | NON_UI | IMPLEMENT | N/A | 서버·클라이언트 처리 |
| REQ-NF-016 | 비밀키 환경변수 관리 | NON_UI | IMPLEMENT | N/A | 배포 설정 |
| REQ-NF-017 | 항공·호텔 원시 입력값 미보존 | NON_UI | IMPLEMENT | N/A | 클라이언트 처리 원칙 |
| REQ-NF-018 | 개인정보 내보내기·삭제 요청 | OPERATIONS | EXCLUDED | N/A | PROJECT_SCOPE 유지, 복원하지 않음 |

### 5.4 Safety and Moderation (019~022)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-019 | 신고 접수 응답(p95) | UI_STATE | IMPLEMENT | SCR-004 | 접수 즉시 표시(정량 측정 제외) |
| REQ-NF-020 | 신고 1차 검토 24h SLA | OPERATIONS | EXCLUDED | N/A | 운영 프로세스 영역 |
| REQ-NF-021 | 글·요청·신고 속도 제한 | NON_UI | EXCLUDED | N/A | Rate limit 미구현 |
| REQ-NF-022 | Moderator 조치 추적성(감사 로그) | OPERATIONS | EXCLUDED | N/A | PROJECT_SCOPE 유지, 복원하지 않음 |

### 5.5 Accessibility (023~025)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-023 | WCAG 2.2 AA 목표 | UI_STATE | IMPLEMENT | 전역(5개 Screen 공통) | 시맨틱·대비 기준 적용 |
| REQ-NF-024 | 자동 접근성 검사(axe) | OPERATIONS | EXCLUDED | N/A | 자동화 도구 미도입 |
| REQ-NF-025 | 키보드·스크린리더 수동 검사 | UI_STATE | IMPLEMENT(축소) | 전역(5개 Screen 공통) | Playwright 핵심 흐름만 확인 |

### 5.6 Content, Freshness, SEO, Copyright (026~030)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-026 | 여행지 콘텐츠 완전성 100% | NON_UI | IMPLEMENT | N/A | 데이터 수동 검수 |
| REQ-NF-027 | 해외 안전정보 커버리지 100% | NON_UI | IMPLEMENT | N/A | 데이터 수동 검수 |
| REQ-NF-028 | 안전정보 최신성 95%+경고 100% | UI_STATE | IMPLEMENT(축소) | SCR-001 | 경고 로직은 구현, 수치 목표는 미검증 |
| REQ-NF-029 | 미디어 라이선스 메타데이터 100% | OPERATIONS | EXCLUDED | N/A | PROJECT_SCOPE 유지, 복원하지 않음 |
| REQ-NF-030 | 공개 페이지 SEO 메타 누락 0건 | NON_UI | IMPLEMENT | N/A | `<head>` 메타, 비가시 요소 |

### 5.7 Maintainability, Monitoring, Cost (031~034)

| ID | 요구사항 요약 | UI 분류 | PROJECT_SCOPE | Screen | 비고 |
|---|---|---|---|---|---|
| REQ-NF-031 | TS strict·lint·유닛테스트 | NON_UI | IMPLEMENT | N/A | 개발 표준 |
| REQ-NF-032 | 구조화 로그 | OPERATIONS | EXCLUDED | N/A | 로깅 인프라 미도입 |
| REQ-NF-033 | 핵심 오류 5분 이내 알림 | OPERATIONS | EXCLUDED | N/A | 장애 알림 제외 |
| REQ-NF-034 | 월 인프라 비용 통제 | OPERATIONS | IMPLEMENT | N/A | Vercel·Supabase 저가 티어, AWS/EC2 배제 |

---

## 6. 검증

### 6.1 Requirement 총수 확인

| 구분 | 개수 |
|---|---:|
| REQ-FUNC-001~080 | 80 |
| REQ-NF-001~034 | 34 |
| **합계** | **114** |

114개 전량이 본 문서 4장·5장 표에 정확히 1회씩 등장하며, `PROJECT_SCOPE.md`의 IMPLEMENT/EXCLUDED 분류와 동일하게 유지된다. EXCLUDED로 표기된 항목(FUNC 9개, NF 18개, 합계 27개)은 UI 배치 없이 Screen 열을 `N/A`로 남겨 구현 범위로 되돌리지 않았음을 표시한다.

### 6.2 UI 분류별 집계

| UI 분류 | REQ-FUNC | REQ-NF | 합계 |
|---|---:|---:|---:|
| UI_DIRECT | 47 | 0 | 47 |
| UI_STATE | 19 | 5 | 24 |
| NON_UI | 6 | 16 | 22 |
| OPERATIONS | 8 | 13 | 21 |
| **합계** | **80** | **34** | **114** |

### 6.3 Screen별 배치 요구사항 수(UI_DIRECT·UI_STATE만 집계, NON_UI·OPERATIONS·전역·기술 Route 제외)

| Screen | 배치된 UI 요구사항 수(중복 배치 포함) |
|---|---:|
| SCR-001 `/` | 23 |
| SCR-002 `/about` | 7 |
| SCR-003 `/travel-tools` | 19 |
| SCR-004 `/mates` | 10 |
| SCR-005 `/account` | 13 |

> 일부 요구사항(REQ-FUNC-027, 040, 043, 054, 062, 068, 069)은 두 Screen에 걸쳐 동작이 나뉘어 양쪽에 중복 집계된다. 디자인 Screen 자체는 5개로 고정되어 있으며 추가 Screen을 생성하지 않았다.
