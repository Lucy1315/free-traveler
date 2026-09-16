# Decision Log — Free Traveler

- **Document ID:** DECLOG-TRAVEL-001
- **성격:** 이 문서는 프로젝트 진행 중 확정된 결정을 시간순이 아니라 **ID 순으로** 기록하는 의사결정 로그다. 결정의 "무엇"과 "왜"를 남기며, 구현 방법의 세부 사항은 각 결정이 가리키는 근거 문서(`docs/ARCHITECTURE.md`, `docs/PROJECT_SCOPE.md`, `TASKS/*`)를 따른다.
- **갱신 원칙:** 기존 결정을 뒤집을 때는 항목을 삭제하지 않고 **상태를 `SUPERSEDED`로 바꾼 뒤 후속 DEC 항목을 새로 추가**한다. 번호는 재사용하지 않는다.

---

## DEC-001 — 실제 개발 루트는 `traveler/app`

- **결정:** 저장소 상위 `AI_SERVICE/클로드실습/` 아래 여러 폴더 중, Free Traveler의 실제 Next.js 애플리케이션 루트는 `traveler/app`이다. `package.json`, `src/app`, `TASKS/`, `docs/`, `design-reference/`가 모두 이 경로를 기준으로 존재한다.
- **배경:** `클로드실습/`은 Claude Code 실습용 워크스페이스이며 그 안에 여러 독립 프로젝트가 섞여 있다(예: 이 프로젝트와 무관한 `test/` 디렉터리의 부동산 관련 파일). 개발·빌드·배포 명령은 항상 `traveler/app`에서 실행한다.
- **근거:** `traveler/app/package.json`(`name: "app"`), `traveler/app/AGENTS.md`.
- **상태:** 확정

## DEC-002 — 디자인 Screen은 핵심 4개·보조 1개

- **결정:** 승인된 디자인 Screen은 SCR-001(메인)·SCR-003(통합 여행 준비)·SCR-004(동행 조회)·SCR-005(계정·관리) **핵심 4개**와 SCR-002(대표 소개) **보조 1개**, 총 5개로 고정한다.
- **배경:** Baseline SRS의 16개 개별 Route(`/destinations/[slug]`, `/flights`, `/mates/new`, `/admin/*` 등)를 5개 Screen으로 통합한 결과다. 핵심 4개는 여행지 발견 → 조건 정리·동행 모집글 작성 → 동행 찾기 → 계정/내 활동이라는 주 전환 흐름을 담당하고, SCR-002는 전환 흐름 밖의 신뢰 구축용 정보 화면이라 보조로 분류한다.
- **근거:** `design-reference/SCREEN_ROUTE_CONTRACT.json`(`tier_summary`), `design-reference/UI_CONTRACT.md` §0, `docs/05_UIUX_APPROVED.md`.
- **상태:** 확정

## DEC-003 — `/travel-tools`에 항공·숙소·동행 작성을 통합

- **결정:** 항공 조건 정리, 숙소 조건 정리, 동행 모집글 작성을 별도 Route로 나누지 않고 **SCR-003(`/travel-tools`) 안의 3개 탭**으로 통합한다.
- **배경:** 세 기능 모두 "여행을 준비하는" 동일한 사용자 의도를 다루고, 탭 전환만으로 흐름이 자연스럽게 이어진다. 탭별로 **입력 → 검증 → 완료** 상태를 서로 분리해 한 탭의 오류가 다른 탭에 영향을 주지 않도록 한다.
- **근거:** `design-reference/UI_CONTRACT.md` §3(SCR-003 영역 순서·상태), `design-reference/D-001/DESIGN.md` §10(Tabs — 정확히 3탭), `TASKS/TASK-PO-SCR-003.md`.
- **상태:** 확정

## DEC-004 — 여행지·안전·대표는 정적 TypeScript Data

- **결정:** 여행지 정보, 국가 안전정보, 대표(`free_traveler`) 소개 콘텐츠는 DB 테이블이 아니라 **`src/data`의 정적 TypeScript 데이터**로 관리한다.
- **배경:** 콘텐츠 CRUD·검수·게시 워크플로(CMS)를 구축하지 않기로 했으므로(DEC-014, EXCLUDED 처리), 편집은 코드 변경(PR 리뷰)으로 충분하다. Stale 판정(안전정보 7일 경과 경고)과 여행지 필터·검색도 정적 데이터에 대한 클라이언트 연산으로 처리한다.
- **근거:** `docs/PROJECT_SCOPE.md` §3(정적 콘텐츠 원칙), `docs/ARCHITECTURE.md` §5, `TASKS/TASK-DATA-*.md`.
- **상태:** 확정

## DEC-005 — Supabase는 Auth와 동행 기능 중심

- **결정:** Supabase는 **인증(이메일 가입·로그인·비밀번호 재설정, 성인 확인)** 과 **동행 기능(모집글·참가 요청·차단·신고·외부 URL 설정)** 범위에만 쓴다. 여행지·안전·대표 콘텐츠(DEC-004)는 Supabase에 저장하지 않는다.
- **배경:** 로그인이 필요한 쓰기 기능과 사용자 간 상호작용(동행 매칭)만 실제 데이터베이스·행 단위 권한 제어가 필요하고, 그 외 콘텐츠는 정적 데이터로 충분하다. 이 구분이 DB 테이블 6개 제한(DEC-006)의 전제이기도 하다.
- **근거:** `docs/PROJECT_SCOPE.md` §2(구현 범위 개요), `docs/ARCHITECTURE.md` §6.
- **상태:** 확정

## DEC-006 — DB는 6개 Table로 제한

- **결정:** Supabase Postgres 테이블은 `user_profile`, `mate_post`, `mate_application`, `user_block`, `report`, `external_url_setting` **정확히 6개**로 제한한다. 감사 로그, 미디어 자산, 여행지/안전 콘텐츠용 테이블은 추가하지 않는다.
- **배경:** DEC-004(정적 데이터)·DEC-005(Supabase 범위 한정)의 직접적 결과다. 범용 감사 로그·미디어 업로드 파이프라인은 EXCLUDED(DEC-014)로 분류돼 있어 대응 테이블이 필요 없다.
- **근거:** `.claude/skills/traveler-project-pipeline/SKILL.md` §4(`DB_TABLES` 상수), `TASKS/TASK-DB-SCHEMA-BASE.md`, `scripts/audit_tasks.py`(검사 12 — DB Table 범위가 6개를 크게 넘지 않음).
- **상태:** 확정

## DEC-007 — 항공·숙소 입력은 Browser Memory에만 유지

- **결정:** 항공·숙소 조건 입력값(목적 국가·지역·날짜)은 **Client Component의 일시 상태(Browser Memory)로만** 보관한다. 서버 API·DB·로그·분석 이벤트로 전송하지 않고, 외부 이동 URL의 쿼리 파라미터에도 첨부하지 않는다.
- **배경:** 항공·숙소는 예약·결제를 대행하지 않는 "정보 정리 후 외부 사이트로 이동" 기능이라, 개인 여행 계획 정보를 서버에 남길 이유가 없다. 이 원칙에 따라 이 두 폼을 위한 서버 API 자체를 만들지 않는다.
- **근거:** `docs/06_SRS_UIUX_REVISED.md`(`REQ-FUNC-017`, `REQ-FUNC-025`, `REQ-NF-017`), `design-reference/SCREEN_ROUTE_CONTRACT.json`(`technical_routes` API 설명), `docs/ARCHITECTURE.md` §4.
- **상태:** 확정

## DEC-008 — Airbnb `DESIGN.md`는 vendor 참고본, D-001이 실제 정본

- **결정:** `design-reference/vender/airbnb/DESIGN.md`는 spacing 리듬·둥근 모서리·단일 액센트 같은 "문법"만 참고하는 **vendor 참고 자료**이며, 실제 구현 기준(색상·폰트·컴포넌트 규격 등 정본)은 `design-reference/D-001/DESIGN.md` 하나뿐이다. Airbnb 고유의 색상·워드마크·상표 요소는 가져오지 않는다.
- **배경:** 구조적 참고(레이아웃 문법)와 브랜드 요소 차용은 다른 문제다. D-001은 Airbnb와 색상·폰트·워드마크·프로덕트 탭 구조가 전혀 다른 독립 디자인 시스템으로 확정했다. 경로 철자 `vender`는 오타가 아니라 프로젝트 초기부터 쓰인 실제 경로이며 임의로 고치지 않는다.
- **근거:** `design-reference/DESIGN_MANIFEST.md`(Active Design Version D-001 / Vendor Reference), `design-reference/D-001/DESIGN.md` §0, §19(Do Not — Airbnb 상표 요소 금지).
- **상태:** 확정

## DEC-009 — Playwright는 Chromium Smoke만 필수

- **결정:** Playwright E2E 테스트는 **Chromium 브라우저로만** 실행하는 Smoke Test 3종(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`)만 필수로 둔다. Firefox·WebKit 등 다른 브라우저 엔진 프로젝트는 설정에 추가하지 않는다.
- **배경:** MVP 단계에서 크로스 브라우저 회귀 테스트까지 유지하는 비용을 지지 않기로 했다. 핵심 흐름이 하나의 렌더링 엔진에서 깨지지 않는지만 자동으로 확인하고, 그 외 검증은 수동 QA 체크리스트(`MANUAL-CHECK-*`)로 대체한다.
- **근거:** `.claude/skills/traveler-project-pipeline/SKILL.md` §3 규칙 13(`FORBIDDEN_TEST_BROWSERS`), `docs/ARCHITECTURE.md` §8, `scripts/audit_tasks.py`(검사 15·16b).
- **상태:** 확정

## DEC-010 — 사용자의 개발 실행 단위는 Wave

- **결정:** 구현 단계에서 `TASKS/TASK-*.md`를 한 번에 전부 실행하지 않고, 사용자가 승인하는 **Wave** 단위로 묶어 순차 진행한다. Wave 하나는 서로 의존하지 않거나 같은 계층(예: SHARED/DATA → DB → Component → Page Owner → Test)에 속하는 Task 묶음이다.
- **배경:** 66개 Task를 한 번에 실행하면 중간 검토·승인 지점이 사라져 오류가 누적된 채 뒤늦게 발견될 위험이 크다. Wave 단위로 끊으면 각 Wave 종료 시점마다 결과를 확인하고 다음 Wave 진행 여부를 사용자가 판단할 수 있다.
- **근거:** 이 결정은 이 문서에서 처음 기록되며, 아직 `TASKS/` 파이프라인 산출물(Wave 분할표 등)로 구체화되지 않았다. 후속 작업으로 `TASKS/TASK_MANIFEST.csv`의 `depends_on`·`type` 열을 근거로 Wave 분할 계획을 별도 문서화해야 한다.
- **상태:** 확정(세부 Wave 분할은 TODO)

## DEC-011 — Single Agent가 Wave 내부 Task를 순차 수행

- **결정:** 하나의 Wave 안에서는 **단일 Agent가 Task를 순차적으로** 수행한다. 여러 Agent를 동시에 투입해 병렬로 구현하지 않는다.
- **배경:** 이 프로젝트는 문서(SRS·PROJECT_SCOPE·DESIGN·UI_CONTRACT)를 서로 참조하며 세밀하게 교차 검증하는 방식으로 진행돼 왔다(예: `scripts/validate_inputs.py`, `scripts/audit_tasks.py`). 병렬 Multi-Agent 실행은 속도는 얻지만 같은 파일을 동시에 건드리거나 서로 다른 가정으로 구현할 위험이 있어, 이 단계에서는 단일 Agent의 순차 실행으로 일관성을 우선한다.
- **근거:** DEC-010과 함께 이 문서에서 처음 기록되는 운영 결정이며, 기존 `TASKS/*` 산출물에는 아직 실행 주체(Agent 배치)에 대한 규정이 없었다.
- **상태:** 확정

## DEC-012 — PR·Merge는 사용자가 수동 수행

- **결정:** Pull Request 생성과 병합(Merge)은 **자동화하지 않고 사용자가 직접** 검토·승인·병합한다. 자동 Merge(Auto Merge) 규칙을 저장소 설정에 켜지 않는다.
- **배경:** 코드 반영 전 사람의 리뷰를 항상 거치게 하기 위함이다. Task 상세 파일 Forbidden 절에도 이미 같은 원칙("코드 반영은 사람이 직접 리뷰한 뒤 진행한다")이 반복해서 명시돼 있다.
- **근거:** `docs/PROJECT_SCOPE.md` §4(무인 자동 Merge Runner 제외), `docs/ARCHITECTURE.md` §10, `.claude/skills/traveler-project-pipeline/SKILL.md`(`FORBIDDEN_KEYWORDS`에 "자동 병합"/"Auto Merge" 포함), `scripts/audit_tasks.py`(검사 16).
- **상태:** 확정

## DEC-013 — EC2·AWS는 사용하지 않음

- **결정:** 호스팅·인프라는 **Vercel(애플리케이션)과 Supabase(DB·Auth)로 한정**한다. AWS EC2를 비롯한 별도 클라우드 가상 서버를 구축하지 않는다.
- **배경:** MVP 단계의 월 인프라 비용을 통제하기 위함이다(콘텐츠 인건비를 제외하고 10만 원 이하를 목표로 한다). Vercel·Supabase의 무료/저가 티어만으로 요구되는 트래픽·데이터 규모를 감당할 수 있다고 판단했다.
- **근거:** `docs/06_SRS_UIUX_REVISED.md`(`REQ-NF-034`), `docs/PROJECT_SCOPE.md` §4(EC2·AWS 인프라 제외), `docs/ARCHITECTURE.md` §10.
- **상태:** 확정

## DEC-014 — 제외 기능은 EXCLUDED로 관리

- **결정:** 구현하지 않기로 한 요구사항은 목록에서 **삭제하지 않고 `EXCLUDED` 상태로 남겨 추적**한다. 각 EXCLUDED 항목에는 제외 사유와 후속 방향을 함께 기록한다.
- **배경:** 요구사항을 지우면 나중에 "원래 요구사항이었는지, 처음부터 없었는지"를 구분할 수 없게 된다. `EXCLUDED`로 남기면 전체 114개 요구사항(REQ-FUNC 80 + REQ-NF 34)에 대해 무엇을 왜 안 만들었는지 항상 추적 가능하다.
- **근거:** `docs/PROJECT_SCOPE.md`(REQ별 IMPLEMENT/EXCLUDED 분류), `docs/06_SRS_UIUX_REVISED.md` §0 개정 원칙, `TASKS/00_TASK_LIST.md` §3(NON_IMPLEMENTATION), `scripts/audit_tasks.py`(검사 17·18 — REQ 전량이 Task 또는 EXCLUDED에 존재하고, EXCLUDED는 상세 구현 파일이 없음을 검증).
- **상태:** 확정

---

## 요약

| ID | 결정 | 상태 |
|---|---|---|
| DEC-001 | 실제 개발 루트는 `traveler/app` | 확정 |
| DEC-002 | 디자인 Screen 핵심 4개·보조 1개 | 확정 |
| DEC-003 | `/travel-tools`에 항공·숙소·동행 작성 통합 | 확정 |
| DEC-004 | 여행지·안전·대표는 정적 TypeScript Data | 확정 |
| DEC-005 | Supabase는 Auth와 동행 기능 중심 | 확정 |
| DEC-006 | DB는 6개 Table로 제한 | 확정 |
| DEC-007 | 항공·숙소 입력은 Browser Memory에만 유지 | 확정 |
| DEC-008 | Airbnb `DESIGN.md`는 vendor 참고본, D-001이 정본 | 확정 |
| DEC-009 | Playwright는 Chromium Smoke만 필수 | 확정 |
| DEC-010 | 개발 실행 단위는 Wave | 확정(세부 Wave 분할은 TODO) |
| DEC-011 | Single Agent가 Wave 내부 Task를 순차 수행 | 확정 |
| DEC-012 | PR·Merge는 사용자가 수동 수행 | 확정 |
| DEC-013 | EC2·AWS는 사용하지 않음 | 확정 |
| DEC-014 | 제외 기능은 EXCLUDED로 관리 | 확정 |
