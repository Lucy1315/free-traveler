# Project Scope — Free Traveler

- **Document ID:** SCOPE-TRAVEL-001
- **기반 문서:** `01_PRD.md`, `02_SRS_BASELINE.md`
- **대상:** REQ-FUNC-001~080, REQ-NF-001~034 (모든 항목 1회씩 포함)

---

## 1. 목적

본 문서는 SRS의 요구사항 전체를 `IMPLEMENT`(구현하고 테스트) 또는 `EXCLUDED`(만들지 않으며 제외 이유를 기록)로 분류한다. 현재 저장소는 Next.js App Router 기본 스캐폴드(`src/app/layout.tsx`, `src/app/page.tsx`) 상태이며, Supabase·shadcn/ui 등은 아직 설치되지 않았다.

## 2. 구현 범위 개요

다음 12개 항목을 직접 구현한다.

1. 핵심 화면 4개(여행지, 비행기 찾기, 호텔 찾기, 동행 찾기)와 보조 화면 1개(국가별 주의사항)를 중심으로, 대표 소개·인증·마이페이지·관리자 화면을 추가로 구현한다.
2. 여행지 검색·필터와 상세 패널
3. 국가 안전정보 패널
4. `free_traveler` 대표 소개
5. 항공·숙소 입력·검증·요약·외부 이동
6. Supabase 이메일 인증과 성인 확인
7. 동행글 작성·조회·수정·마감
8. 참가 요청·승인·거절
9. 간단한 차단·신고
10. 내 활동과 간단한 관리자 탭
11. Playwright 핵심 Smoke Test
12. Vercel 배포

## 3. 구현 방식(공통 원칙)

| 원칙 | 내용 |
|---|---|
| 정적 콘텐츠 | 여행지·안전정보·대표 소개 콘텐츠는 `src/data`의 정적 데이터로 관리하고, 편집은 코드 변경으로 처리한다. |
| 즐겨찾기 | 서버 저장 없이 `localStorage`로 처리한다. |
| 알림 | 실제 이메일 발송 대신 Toast 또는 화면 상태로 표시한다. |
| 자동 마감 | 배치 작업 대신 조회 시점에 종료일을 계산해 상태를 판정한다. |
| Stale 판정 | 안전정보 최신성은 렌더링 시 최종 확인일과 현재일을 비교해 계산한다. |
| 이미지 | 일반 인터넷 URL과 `alt` 텍스트만 사용하고, 별도 라이선스 승인·업로드 파이프라인은 두지 않는다. |
| 관리자 범위 | 관리자 기능은 신고 상태 변경과 외부 URL 설정으로 한정한다. |

## 4. 제외 기능(공통)

| 제외 항목 | 사유 |
|---|---|
| 전체 콘텐츠 CMS | 콘텐츠는 정적 데이터로 관리하며 별도 편집기·워크플로를 두지 않는다. |
| 미디어 업로드·라이선스 승인 워크플로 | 이미지는 외부 URL 참조만 사용하므로 업로드·심사 절차가 필요 없다. |
| 범용 감사 로그 | 모든 관리자 행위를 기록하는 이력 시스템은 구축하지 않는다. |
| 자동 백업·장애 알림·부하 테스트 | 운영 모니터링·인프라 자동화는 MVP 범위 밖이다. |
| 외부 이메일 사업자 연동 | 실제 이메일 발송 없이 Toast/화면 상태로 대체한다. |
| EC2·AWS 인프라 | Vercel·Supabase만 사용한다. |
| 무인 자동 Merge Runner | 병합은 사람이 검토·승인한다. |

---

## 5. 기능 요구사항(REQ-FUNC-001~080)

### 5.1 F1. Destination Guide

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-001 | IMPLEMENT | 국내·해외 여행지를 `src/data`에서 `scope` 필드로 구분하고 탭 UI로 분리 표시한다. | Playwright: 탭 전환 시 다른 구분 항목이 섞이지 않음을 확인한다. |
| REQ-FUNC-002 | IMPLEMENT | 국가·도시·계절·테마·기간 필터를 클라이언트에서 AND 조건으로 적용한다. | Playwright + 수동: 복수 필터 조합 결과를 확인한다(정적 데이터라 별도 성능 측정은 하지 않는다). |
| REQ-FUNC-003 | IMPLEMENT | 여행지명·국가명·테마에 대한 클라이언트 부분 일치 검색을 구현한다. | 수동 QA: 한글 부분 검색과 결과 없음 상태를 확인한다. |
| REQ-FUNC-004 | IMPLEMENT | 정적 데이터 스키마에 소개·명소·시기·1일/3일 일정·예산·교통·음식·에티켓·출처·수정일 필드를 포함한다. | 수동 검수: 데이터 작성 시 필수 필드 체크리스트로 대조한다. |
| REQ-FUNC-005 | IMPLEMENT | 필터 결과가 0건이면 조건 완화 안내와 초기화 버튼을 표시한다. | Playwright: 빈 결과 상태와 초기화 동작을 확인한다. |
| REQ-FUNC-006 | IMPLEMENT | 해외 여행지 상세의 `country_code`로 안전정보 페이지 링크를 생성한다. | 수동 QA: 국가별 연결 오류가 없는지 표본 점검한다. |
| REQ-FUNC-007 | IMPLEMENT(축소) | 이미지에는 `alt` 텍스트와 원본 URL만 관리하고, 작가·라이선스 승인 메타데이터는 관리하지 않는다(미디어 업로드 워크플로 제외와 연계). | 수동 검수: 데이터의 `alt`·`source_url` 존재 여부만 확인한다. |
| REQ-FUNC-008 | IMPLEMENT(축소) | 자동 게이트 대신 `src/data` 작성 시 국내 10개 이상·해외 15개국 30개 도시 이상을 수동으로 채운다. | 수동 검수: 데이터 파일의 항목 수를 세어 기준과 대조한다. |
| REQ-FUNC-009 | IMPLEMENT | 같은 국가·테마 기준으로 관련 여행지 최대 6개를 상세 하단에 표시한다. | 수동 QA: 비공개·현재 여행지가 제외되는지 확인한다. |
| REQ-FUNC-010 | IMPLEMENT | 허용된 필터 값만 URL query로 직렬화하고 복원한다. | 수동 QA: 새로고침·공유 링크로 필터 복원을 확인한다. |

### 5.2 F2. Flight Link-out

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-011 | IMPLEMENT | 항공 폼에 국가·지역·출발일·귀국일 필수 입력 필드를 제공한다. | Playwright: 필드 렌더링과 라벨·오류 영역을 확인한다. |
| REQ-FUNC-012 | IMPLEMENT | 국가 선택값에 따라 지역 옵션을 필터링하고 국가 변경 시 지역값을 초기화한다. | 수동 QA: 국가 변경 시 지역값 초기화를 확인한다. |
| REQ-FUNC-013 | IMPLEMENT | 과거 출발일, 귀국일<출발일 조합을 클라이언트에서 차단한다. | Playwright: 경계값(과거일·역전 날짜) 케이스를 확인한다. |
| REQ-FUNC-014 | IMPLEMENT | 유효 입력 후 요약 단계를 표시하고 값은 브라우저 세션 상태로 유지한다. | 수동 QA: 수정 후 폼 복귀 시 값 유지를 확인한다. |
| REQ-FUNC-015 | IMPLEMENT | 폼·요약 화면에 입력값 비전달 고지 문구를 고정 표시한다. | Playwright: 고지 문구 노출 여부를 확인한다. |
| REQ-FUNC-016 | IMPLEMENT | 설정된 항공 외부 URL을 `noopener,noreferrer`로 새 탭에 연다. | Playwright: 새 탭 오픈과 `rel` 속성을 확인한다. |
| REQ-FUNC-017 | IMPLEMENT | 항공 입력값은 서버 API·DB·로그로 전송하지 않고 클라이언트 상태로만 처리한다(서버 API 자체를 두지 않음). | 수동 QA: 네트워크 탭에서 입력값이 요청에 포함되지 않음을 확인한다. |
| REQ-FUNC-018 | IMPLEMENT | 외부 URL 미설정·허용목록 밖일 때 이동을 차단하고 오류·재시도 UI를 제공한다. | Playwright: URL 미설정 상태를 시뮬레이션해 오류 표시를 확인한다. |

### 5.3 F3. Hotel Link-out

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-019 | IMPLEMENT | 호텔 폼에 국가·지역·체크인·체크아웃 필수 입력 필드를 제공한다. | Playwright: 필드 렌더링과 오류 영역을 확인한다. |
| REQ-FUNC-020 | IMPLEMENT | 국가 선택값에 따라 지역 옵션을 필터링하고 변경 시 초기화한다. | 수동 QA: 국가 변경 시 지역값 초기화를 확인한다. |
| REQ-FUNC-021 | IMPLEMENT | 과거 체크인, 체크아웃≤체크인 조합을 차단한다. | Playwright: 경계값 케이스를 확인한다. |
| REQ-FUNC-022 | IMPLEMENT | 유효 입력 후 국가·지역·체크인·체크아웃 요약을 폼 입력과 동일하게 표시한다. | 수동 QA: 요약과 입력값 일치를 확인한다. |
| REQ-FUNC-023 | IMPLEMENT | 폼·요약에 입력값 비전달 고지를 표시한다. | Playwright: 고지 문구 노출을 확인한다. |
| REQ-FUNC-024 | IMPLEMENT | 설정된 호텔 외부 URL을 `noopener,noreferrer`로 새 탭에 연다. | Playwright: 새 탭 오픈과 query 미포함을 확인한다. |
| REQ-FUNC-025 | IMPLEMENT | 호텔 입력값은 서버 DB·로그·분석 이벤트로 저장하지 않는다. | 수동 QA: 네트워크·콘솔에서 원시 입력값 미노출을 확인한다. |
| REQ-FUNC-026 | IMPLEMENT | URL 오류 시 이동을 차단하고 현재 입력을 유지한 채 오류를 표시한다. | Playwright: 오류 상태에서 입력값 유지 여부를 확인한다. |

### 5.4 F4. Travel Mate

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-027 | IMPLEMENT | Supabase Auth 세션이 없는 요청은 글 작성·참가 요청 API에서 차단한다. | 수동 QA: 비로그인 상태에서 쓰기 시도 시 로그인 리다이렉트를 확인한다. |
| REQ-FUNC-028 | IMPLEMENT | 정확한 생년월일 대신 `is_adult`, `adult_verified_at`만 Supabase에 저장한다. | 수동 검수: DB 스키마와 저장값을 확인한다. |
| REQ-FUNC-029 | IMPLEMENT | 닉네임·연령대·여행 스타일 필수, 성별 선택 필드를 프로필 폼에 둔다. | Playwright: 필수/선택 필드 검증을 확인한다. |
| REQ-FUNC-030 | IMPLEMENT | 국가·지역·기간 겹침·연령대·성별·스타일·모집 상태로 동행글을 필터한다. | 수동 QA: 필터 조합 결과와 차단 사용자 글 제외를 확인한다. |
| REQ-FUNC-031 | IMPLEMENT | 모집글 작성 폼에 제목·국가·지역·기간·인원·조건·설명·안전수칙 동의를 입력받고 검증한다. | Playwright: 필수값 누락·날짜 역전 케이스를 확인한다. |
| REQ-FUNC-032 | IMPLEMENT | 정규식 기반으로 전화번호·이메일·메신저 ID 패턴을 탐지해 제출을 차단한다. | 수동 QA: 대표 패턴 샘플로 탐지·오탐 여부를 확인한다(95% 탐지율 정량 측정은 하지 않는다). |
| REQ-FUNC-033 | IMPLEMENT | 상세·목록 응답에서 이메일·전화번호 필드를 제외하고 렌더링한다. | 수동 QA: 응답 HTML/JSON에 연락처 노출이 없는지 확인한다. |
| REQ-FUNC-034 | IMPLEMENT | 모집중 글에 500자 이하 비공개 참가 메시지를 제출하면 PENDING으로 저장한다. | Playwright: 참가 요청 제출과 상태 저장을 확인한다. |
| REQ-FUNC-035 | IMPLEMENT | 동일 사용자·동일 글의 PENDING/ACCEPTED 중복 요청을 DB unique 제약과 UI 오류로 차단한다. | 수동 QA: 중복 요청 시도 시 오류를 확인한다. |
| REQ-FUNC-036 | IMPLEMENT | 글 작성자만 참가 요청을 ACCEPTED/REJECTED로 변경할 수 있게 한다. | Playwright: 승인·거절 플로우를 확인한다. |
| REQ-FUNC-037 | IMPLEMENT(방식 변경) | 배치 작업 대신 목록·상세 조회 시 종료일을 현재일과 비교해 CLOSED 상태로 표시한다. | 수동 QA: 종료일 경과 게시물이 조회 시 자동 마감으로 표시되는지 확인한다. |
| REQ-FUNC-038 | IMPLEMENT | 작성자가 모집글을 수동 마감·수정·삭제할 수 있게 한다. | Playwright: 수정·마감·삭제 동작을 확인한다. |
| REQ-FUNC-039 | IMPLEMENT | 글·사용자·참가 요청에 대해 사유 코드와 설명으로 신고를 접수한다. | Playwright: 신고 제출과 접수 ID 표시를 확인한다. |
| REQ-FUNC-040 | IMPLEMENT | 사용자 간 차단·해제 기능을 제공하고 차단 시 상호 노출을 제한한다. | 수동 QA: 차단 후 글·프로필 비노출을 확인한다. |
| REQ-FUNC-041 | IMPLEMENT(축소) | 관리자 탭에서 신고 목록을 상태(OPEN/RESOLVED 등)로 필터하는 간단한 큐만 제공하고, 우선순위·증거 첨부 관리는 두지 않는다. | 수동 QA: 상태별 필터 동작을 확인한다. |
| REQ-FUNC-042 | IMPLEMENT(축소) | 관리자는 신고 상태만 변경(처리완료/기각 등)하며, 경고·콘텐츠 숨김·계정 제한 등 세부 제재 기록은 두지 않는다(범용 감사 로그 제외와 연계). | 수동 QA: 상태 변경 저장을 확인한다. |
| REQ-FUNC-043 | IMPLEMENT(방식 변경) | 이메일 발송 대신 Toast·인앱 상태 표시로 요청 접수·승인·거절·신고 처리 결과를 안내한다. | Playwright: 상태 변경 후 Toast/화면 상태 노출을 확인한다. |
| REQ-FUNC-044 | IMPLEMENT | Supabase RLS로 본인 글·요청, 대상 작성자, Moderator/Admin만 비공개 데이터를 조회하게 한다. | 수동 QA: 권한 없는 계정으로 조회 시 403/빈 결과를 확인한다. |
| REQ-FUNC-045 | EXCLUDED | 정식 탈퇴 시 비식별화·30일 내 개인정보 파기 파이프라인은 구축하지 않는다. Supabase Auth 기본 계정 삭제만 사용한다. | 해당 없음(운영 정책 수립 후 별도 반영). |

### 5.5 F5. Country Safety

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-046 | IMPLEMENT | 소개되는 모든 해외 국가에 대응하는 안전정보를 `src/data`에 작성한다. | 수동 검수: 해외 국가 수와 안전정보 항목 수 일치를 확인한다. |
| REQ-FUNC-047 | IMPLEMENT | 치안·사기·법규·교통·재난·보건·문화·긴급연락처 8개 카테고리를 데이터 스키마에 포함한다. | 수동 검수: 카테고리 누락 여부를 확인한다. |
| REQ-FUNC-048 | IMPLEMENT | 출처명·URL·최종 확인일·편집자 필드를 정적 데이터에 포함한다. | 수동 검수: 메타데이터 존재 여부를 확인한다. |
| REQ-FUNC-049 | IMPLEMENT | 외교부 해외안전여행 링크를 `noopener,noreferrer`로 새 탭에 연다. | 수동 QA: 링크 동작을 확인한다(주간 자동 점검은 제외). |
| REQ-FUNC-050 | IMPLEMENT | 렌더링 시 `verified_at` 기준 7일 초과 여부를 계산해 stale 경고를 표시한다. | Playwright: 7일 초과 데이터에서 경고 배지 노출을 확인한다. |
| REQ-FUNC-051 | IMPLEMENT | 중대 경보 단계·행동요령·범위를 텍스트로 상단에 표시한다(색상 단독 사용 금지). | 수동 QA: 경보 표시 위치와 텍스트 라벨을 확인한다. |
| REQ-FUNC-052 | IMPLEMENT | `scope_type`/`scope_text` 필드로 국가 전체와 지역 경보를 구분한다. | 수동 검수: 지역 경보 데이터의 범위 필드 존재를 확인한다. |
| REQ-FUNC-053 | IMPLEMENT | 현지 긴급전화와 재외공관/영사콜센터 정보를 표시한다. | 수동 검수: 연락처·출처 필드를 확인한다. |
| REQ-FUNC-054 | IMPLEMENT | 안전 페이지와 항공/호텔 요약에 "공식 판단 대체 아님" 고지를 고정 표시한다. | 수동 QA: 고지 문구 노출을 확인한다. |
| REQ-FUNC-055 | EXCLUDED | Editor/Admin의 안전 콘텐츠 작성·검수·게시 워크플로는 구축하지 않는다. 콘텐츠는 코드 변경(PR)으로 갱신한다(전체 콘텐츠 CMS 제외와 연계). | 해당 없음. |
| REQ-FUNC-056 | EXCLUDED | 안전정보 변경 이력을 별도 DB로 보존하지 않는다. 변경 이력은 git 커밋 이력으로 대체한다(범용 감사 로그 제외와 연계). | 해당 없음. |

### 5.6 F6. About free_traveler

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-057 | IMPLEMENT | 대표명·`50+ Trips`·`30+ Countries`를 단일 정적 데이터 소스에서 홈·대표 페이지에 공통 사용한다. | 수동 QA: 두 페이지의 수치 일치를 확인한다. |
| REQ-FUNC-058 | IMPLEMENT | 확정된 소개문·여행 철학·편집 원칙을 대표 페이지에 표시한다. | 수동 검수: PRD 확정 문구와 대조한다. |
| REQ-FUNC-059 | IMPLEMENT | 방문 국가 30개 이상 목록(이름·권역)을 정적 데이터로 제공한다. | 수동 검수: 국가 수와 필드 존재를 확인한다. |
| REQ-FUNC-060 | IMPLEMENT | 연도·장소·요약을 포함한 여행 타임라인을 정적 데이터로 제공한다. | 수동 검수: 타임라인 항목 필드를 확인한다. |
| REQ-FUNC-061 | IMPLEMENT(축소) | 대표 이미지에 `alt` 텍스트와 원본 URL만 관리한다(라이선스 승인 절차 제외와 연계). | 수동 검수: `alt`·URL 존재를 확인한다. |
| REQ-FUNC-062 | IMPLEMENT | 문의·SNS 링크를 관리자 외부 URL 설정 범위에 포함해 관리하고, 빈 값은 렌더링하지 않는다. | 수동 QA: 빈 링크 미노출과 허용 프로토콜만 열리는지 확인한다. |
| REQ-FUNC-063 | IMPLEMENT | 대표 추천 여행지 6개를 공개 여행지 상세로 연결한다. | 수동 QA: 비공개 여행지 제외 여부를 확인한다. |

### 5.7 F7. Common, Admin, Governance

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-FUNC-064 | IMPLEMENT | 모든 공개 페이지에 공통 내비게이션·푸터 레이아웃을 적용한다. | Playwright: 핵심 화면 2회 이내 이동 경로를 확인한다. |
| REQ-FUNC-065 | IMPLEMENT | Tailwind 기반 반응형 레이아웃을 320px부터 데스크톱까지 적용한다. | 수동 QA: 모바일·데스크톱 뷰포트에서 가로 스크롤·겹침을 확인한다. |
| REQ-FUNC-066 | IMPLEMENT | Supabase Auth로 이메일 가입·인증·로그인·로그아웃·비밀번호 재설정을 구현한다. | Playwright: 가입~로그인 핵심 흐름을 확인한다. |
| REQ-FUNC-067 | IMPLEMENT | 여행지·안전정보 정적 데이터를 대상으로 클라이언트 통합 검색을 구현한다. | 수동 QA: 결과 유형 라벨 표시를 확인한다. |
| REQ-FUNC-068 | IMPLEMENT | `localStorage`로 여행지 즐겨찾기·해제·목록 조회를 구현한다. | Playwright: 즐겨찾기 추가·해제와 중복 방지를 확인한다. |
| REQ-FUNC-069 | IMPLEMENT | Web Share API 실패 시 URL 복사로 폴백하는 공유 기능을 제공한다. | 수동 QA: 공유·복사 동작을 확인한다. |
| REQ-FUNC-070 | IMPLEMENT | Next.js Metadata API로 title·description·canonical·OG를 페이지별로 설정한다. | 수동 검수: 주요 페이지 메타 태그 존재를 확인한다. |
| REQ-FUNC-071 | EXCLUDED | 별도 행동 분석 이벤트 수집 파이프라인은 구축하지 않는다. | 해당 없음. |
| REQ-FUNC-072 | EXCLUDED | Editor/Admin용 콘텐츠 CRUD·미리보기·상태(DRAFT/REVIEW 등) 관리 화면은 만들지 않는다(전체 콘텐츠 CMS 제외). | 해당 없음. |
| REQ-FUNC-073 | EXCLUDED | 미디어 업로드 시 출처·작가·라이선스 필수 입력 절차는 만들지 않는다(미디어 업로드 워크플로 제외). | 해당 없음. |
| REQ-FUNC-074 | EXCLUDED | 게시 전 완전성 자동 게이트는 만들지 않는다. 완전성은 데이터 작성 시 수동 검수로 대체한다. | 해당 없음. |
| REQ-FUNC-075 | EXCLUDED | 안전정보 stale 현황 대시보드는 만들지 않는다(관리자 범위는 신고 상태·외부 URL 설정으로 한정). | 해당 없음. |
| REQ-FUNC-076 | EXCLUDED | 관리자 변경·신고 처리·권한 변경에 대한 감사 로그는 만들지 않는다(범용 감사 로그 제외). | 해당 없음. |
| REQ-FUNC-077 | IMPLEMENT | Admin이 항공·호텔 외부 URL을 허용목록 내 HTTPS 주소로만 설정하게 한다. | Playwright: HTTP/`javascript:` URL 저장 차단을 확인한다. |
| REQ-FUNC-078 | IMPLEMENT | 404·500·권한 없음·외부 연결 실패 화면에 홈/재시도 링크를 제공한다. | 수동 QA: 각 오류 화면에서 복구 행동을 확인한다. |
| REQ-FUNC-079 | IMPLEMENT(축소) | 폼·모달·탭·알림에 시맨틱 HTML과 기본 ARIA 속성을 적용한다(axe 자동 검사 도구는 도입하지 않는다). | 수동 QA: 키보드 탐색으로 핵심 흐름 동작을 확인한다. |
| REQ-FUNC-080 | IMPLEMENT | 이용약관·개인정보 처리방침·동행 안전수칙·면책 안내 정적 페이지를 제공하고, 동행 글 작성 시 동의 시각을 저장한다. | Playwright: 동의 체크 없이는 제출이 차단됨을 확인한다. |

---

## 6. 비기능 요구사항(REQ-NF-001~034)

### 6.1 Performance

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-001 | EXCLUDED | LCP 정량 측정·CI 게이트는 두지 않는다(부하·성능 테스트 제외). | 해당 없음. |
| REQ-NF-002 | EXCLUDED | INP 필드 데이터 측정 인프라는 두지 않는다. | 해당 없음. |
| REQ-NF-003 | EXCLUDED | CLS 측정 인프라는 두지 않는다. | 해당 없음. |
| REQ-NF-004 | EXCLUDED | 동시 사용자 50명 기준 성능 검증은 하지 않는다(부하 테스트 제외). | 해당 없음. |
| REQ-NF-005 | EXCLUDED | 쓰기 API 응답 시간 정량 측정은 하지 않는다. | 해당 없음. |
| REQ-NF-006 | IMPLEMENT | `next/image`로 반응형 크기와 지연 로딩을 적용하고, LCP 후보 이미지에 `priority`를 지정한다. | 수동 QA: 이미지 로딩 방식을 코드·네트워크 탭에서 확인한다. |
| REQ-NF-007 | EXCLUDED | Lighthouse CI 배포 전 자동 검사는 구축하지 않는다. | 해당 없음. |

### 6.2 Reliability and Recovery

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-008 | EXCLUDED | 월간 가용성 모니터링·SLA 산정은 하지 않는다. | 해당 없음. |
| REQ-NF-009 | EXCLUDED | 5xx 비율 모니터링은 구축하지 않는다(장애 알림 제외). | 해당 없음. |
| REQ-NF-010 | EXCLUDED | DB 자동 백업·RPO/RTO 정책은 구성하지 않는다(자동 백업 제외). | 해당 없음. |
| REQ-NF-011 | EXCLUDED | 외부 링크 주간 자동 점검 스케줄러는 두지 않는다. 배포 전 수동 점검으로 대체한다. | 해당 없음. |

### 6.3 Security and Privacy

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-012 | IMPLEMENT | Vercel·Supabase 기본 제공 TLS 1.2 이상을 사용한다. | 수동 확인: 배포 URL의 SSL 설정을 확인한다. |
| REQ-NF-013 | IMPLEMENT | Supabase RLS 정책과 서버 측 역할 검증을 적용한다. | 수동 QA: 권한별 부정 접근 테스트로 403/빈 결과를 확인한다. |
| REQ-NF-014 | IMPLEMENT | Next.js Server Actions 기본 보호와 SameSite 쿠키 설정을 사용한다. | 수동 확인: 쿠키 속성과 상태 변경 요청 동작을 확인한다. |
| REQ-NF-015 | IMPLEMENT | React 기본 이스케이프와 폼 입력 검증으로 저장 XSS를 방지한다. | 수동 QA: 스크립트 태그 입력 케이스를 확인한다. |
| REQ-NF-016 | IMPLEMENT | 비밀키는 Vercel 환경변수로 관리하고 클라이언트 번들에 포함하지 않는다. | 수동 확인: 빌드 산출물에서 비밀키 노출 여부를 확인한다. |
| REQ-NF-017 | IMPLEMENT | 항공·호텔 원시 입력값은 서버 API·로그·분석에 전달하지 않는다(REQ-FUNC-017/025와 동일 구현). | 수동 QA: 네트워크·로그 검사로 확인한다. |
| REQ-NF-018 | EXCLUDED | 개인정보 내보내기·정식 삭제 요청 파이프라인은 구축하지 않는다(REQ-FUNC-045와 동일 사유). | 해당 없음. |

### 6.4 Safety and Moderation

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-019 | IMPLEMENT | 신고 접수는 단일 Supabase insert로 처리해 즉시 접수 ID를 반환한다(정량 p95 측정은 하지 않는다). | 수동 QA: 신고 제출 후 접수 ID 표시를 확인한다. |
| REQ-NF-020 | EXCLUDED | 24시간 1차 검토 SLA는 운영 프로세스 영역으로 측정하지 않는다. | 해당 없음. |
| REQ-NF-021 | EXCLUDED | 글·요청·신고 속도 제한(rate limit)은 구현하지 않는다. | 해당 없음. |
| REQ-NF-022 | EXCLUDED | Moderator 조치 추적을 위한 감사 로그는 두지 않는다(범용 감사 로그 제외). | 해당 없음. |

### 6.5 Accessibility

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-023 | IMPLEMENT | WCAG 2.2 AA를 목표로 시맨틱 마크업과 대비를 적용한다(공식 인증은 하지 않는다). | 수동 QA: 핵심 화면에서 시각적 대비·라벨을 확인한다. |
| REQ-NF-024 | EXCLUDED | axe 등 자동 접근성 검사 도구는 도입하지 않는다. | 해당 없음. |
| REQ-NF-025 | IMPLEMENT(축소) | Playwright 스모크 테스트에서 핵심 흐름의 키보드 조작 일부를 확인한다(전체 스크린리더 수동 검사는 하지 않는다). | Playwright: 핵심 흐름 키보드 내비게이션 케이스를 확인한다. |

### 6.6 Content, Freshness, SEO, Copyright

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-026 | IMPLEMENT | 정적 데이터 작성 시 여행지 필수 항목을 수동 검수로 100% 충족시킨다. | 수동 검수: 데이터 체크리스트 대조. |
| REQ-NF-027 | IMPLEMENT | 소개되는 해외 국가 전체에 안전정보를 작성한다(REQ-FUNC-046과 동일). | 수동 검수: 국가 수 대조. |
| REQ-NF-028 | IMPLEMENT(축소) | 렌더링 시 stale 계산 로직으로 7일 초과 시 경고를 100% 표시한다. 95% 이상 최신성 유지는 데이터 운영에 달려 있어 별도 자동 검증은 하지 않는다. | Playwright: stale 경고 표시 로직을 확인한다. |
| REQ-NF-029 | EXCLUDED | 미디어 라이선스 메타데이터 100% 관리는 하지 않는다(미디어 업로드 워크플로 제외와 연계). | 해당 없음. |
| REQ-NF-030 | IMPLEMENT | 공개 페이지 전반에 SEO 메타데이터 누락이 없도록 Metadata API를 적용한다(REQ-FUNC-070과 동일). | 수동 검수: 페이지별 메타 태그 확인. |

### 6.7 Maintainability, Monitoring, Cost

| ID | 분류 | 처리 방법 | 확인 방법 |
|---|---|---|---|
| REQ-NF-031 | IMPLEMENT | TypeScript strict 모드와 ESLint를 유지하고, 병합 전 lint·타입 체크를 통과시킨다. | `npm run lint`, `tsc --noEmit` 실행 결과 확인. |
| REQ-NF-032 | EXCLUDED | 구조화 로그 수집 인프라는 구축하지 않는다. | 해당 없음. |
| REQ-NF-033 | EXCLUDED | 5xx·외부 링크 실패에 대한 5분 이내 자동 알림은 구축하지 않는다(장애 알림 제외). | 해당 없음. |
| REQ-NF-034 | IMPLEMENT | Vercel·Supabase 무료/저가 티어만 사용하고 EC2·AWS 인프라를 배제해 월 비용을 통제한다. | 수동 확인: 배포 후 각 서비스 사용량·요금 대시보드를 점검한다. |

---

## 7. 요약

| 구분 | 항목 수 |
|---|---:|
| REQ-FUNC 전체 | 80 |
| REQ-FUNC IMPLEMENT | 71 |
| REQ-FUNC EXCLUDED | 9 |
| REQ-NF 전체 | 34 |
| REQ-NF IMPLEMENT | 16 |
| REQ-NF EXCLUDED | 18 |
| 전체 요구사항 | 114 |
