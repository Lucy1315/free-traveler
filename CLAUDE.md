# CLAUDE.md — Free Traveler

이 파일은 `traveler/app`(Free Traveler Next.js 앱)에서 작업하는 모든 Agent가 따르는 **최상위 규칙 파일**이다. 다른 Agent 규칙 파일을 가져오지(import) 않는다 — 필요한 규칙은 이 문서 안에 직접 기록한다. `AGENTS.md`는 `next dev`가 자동으로 관리하는 별도 파일(Next.js 버전 차이 안내)이며, 이 문서와는 독립적으로 계속 적용된다.

이 문서와 실제 프로젝트 상태가 어긋나면 이 문서를 먼저 갱신한 뒤 작업한다.

---

## Harness Marker

아래 키=값은 이 프로젝트의 고정 설정이다. 임의로 바꾸지 않는다. 바꿔야 한다면 이 문서를 먼저 갱신하고 관련 산출물(`scripts/*.py`, `TASKS/*`)을 함께 맞춘다.

```
HARNESS_SCHEMA=traveler-screen-route-v1
DESIGN_PATH=design-reference/D-001/DESIGN.md
SCREEN_CONTRACT=design-reference/SCREEN_ROUTE_CONTRACT.json
PROJECT_SCOPE=docs/PROJECT_SCOPE.md
PLAYWRIGHT_ENABLED=true
PLAYWRIGHT_SCOPE=chromium-smoke
AUTO_MERGE=false
AWS_ENABLED=false
```

| 키 | 의미 |
|---|---|
| `HARNESS_SCHEMA` | `SCREEN_CONTRACT` JSON의 `schema_version`과 일치해야 한다. 다르면 작업을 중단한다. |
| `DESIGN_PATH` | 디자인 정본 경로(아래 규칙 4). |
| `SCREEN_CONTRACT` | Screen·Route·Page Entry 정본 경로(아래 규칙 5). |
| `PROJECT_SCOPE` | IMPLEMENT/EXCLUDED 분류 정본 경로(아래 규칙 3). |
| `PLAYWRIGHT_ENABLED` | Playwright를 쓴다(단, 범위는 아래 `PLAYWRIGHT_SCOPE`로 제한). |
| `PLAYWRIGHT_SCOPE` | `chromium-smoke` — Chromium 핵심 Smoke만 작성한다(아래 규칙 18). |
| `AUTO_MERGE` | `false` — 자동 병합을 쓰지 않는다(아래 규칙 21). |
| `AWS_ENABLED` | `false` — AWS·EC2를 쓰지 않는다(아래 규칙 17). |

---

## 필수 규칙

1. 작업 전 `package.json`과 현재 설치된 Next.js 버전의 문서(`node_modules/next/dist/docs/`)를 확인한다. 이 저장소의 Next.js는 학습 데이터에 있는 버전과 API·관례가 다를 수 있다 — 아는 버전이라고 가정하고 코드를 쓰지 않는다.
2. SRS(요구사항) 정본은 `docs/06_SRS_UIUX_REVISED.md`다. 여기 없는 요구사항을 임의로 추가하거나, 있는 요구사항을 임의로 지우지 않는다.
3. Scope(IMPLEMENT/EXCLUDED) 분류 정본은 `docs/PROJECT_SCOPE.md`다. 어떤 Requirement를 구현할지 애매하면 이 문서를 먼저 확인한다.
4. 디자인 정본은 `design-reference/D-001/DESIGN.md`다. 색상·타이포·spacing·radius·shadow 등 이 문서에 없는 값을 임의로 새로 만들지 않는다.
5. Screen·Route·Page Entry 정본은 `design-reference/SCREEN_ROUTE_CONTRACT.json`이다(`schema_version: traveler-screen-route-v1`). 다른 문서의 화면 설명과 다르면 이 JSON을 따른다.
6. `/run-wave WXX`를 표준 개발 명령으로 쓴다(`docs/DECISION_LOG.md` DEC-010·DEC-011 — Wave 단위 실행, 세부 Wave 분할 산출물은 아직 없으므로 실행 전 `TASKS/TASK_MANIFEST.csv`의 `depends_on`으로 해당 Wave의 Task 순서를 직접 확인한다).
7. Wave 안의 Task는 Depends On 순서를 지켜 **한 번에 하나만** 구현한다. 여러 Task를 동시에 건드리지 않는다.
8. 지금 구현 중인 Task의 `TASKS/TASK-<ID>.md` "Expected Files" 절에 나열된 파일 밖은 수정하지 않는다.
9. Page Owner Task(`PO-SCR-*`)는 새 Component를 직접 만들지 않는다 — Page Entry(`src/app/.../page.tsx`)에서 이미 만들어진 Component를 실제로 조립하는 범위로 한정한다.
10. SCR-001(`PO-SCR-001`) 완료 시 `create-next-app` 기본 Starter 마크업(로고·"Get started"·기본 링크)을 완전히 제거한다.
11. SCR-003(`PO-SCR-003`)은 항공·숙소·동행 글쓰기 3개 탭을 실제로 조립한다 — 탭을 나열만 하고 전환·상태 분리를 연결하지 않으면 완료로 인정하지 않는다.
12. 항공·숙소 입력값은 서버 API·DB·URL 쿼리 파라미터·로그·분석 이벤트 어디로도 보내지 않는다. Client Component의 일시 상태로만 유지한다.
13. Supabase 쓰기(insert/update/delete)는 Auth(인증·프로필)·동행(모집글·참가 요청)·신고·차단·외부 URL 설정 범위로 제한한다. 이 범위 밖의 쓰기 경로를 새로 만들지 않는다.
14. RLS(Row Level Security)를 우회하는 Client 코드를 작성하지 않는다 — 권한 판단을 Client에서만 하고 서버 검증 없이 데이터를 반환하지 않는다.
15. Service Role Key는 서버 전용이다. Client Component·클라이언트 번들에 포함하거나 브라우저에서 접근 가능한 코드에 쓰지 않는다.
16. 여행지·국가 안전정보·대표 소개 콘텐츠는 DB가 아니라 `src/data`의 정적 데이터를 쓴다.
17. Prisma를 비롯한 ORM, AWS, EC2를 추가하지 않는다. DB 접근은 Supabase 클라이언트를 직접 쓰고, 인프라는 Vercel·Supabase로 한정한다.
18. Playwright는 핵심 Chromium Smoke Task(`E2E-PUBLIC-SMOKE`, `E2E-TRAVEL-TOOLS`, `E2E-MATE-AUTH`)만 작성한다. 다른 브라우저 엔진(Firefox·WebKit 등) 프로젝트를 추가하지 않는다.
19. `docs/PROJECT_SCOPE.md`에서 EXCLUDED로 분류된 기능을 임의로 구현하지 않는다. 필요하다고 판단되면 먼저 사용자에게 확인한다.
20. `git reset --hard`, `git checkout --`, `git clean -f`, 강제 push 등 destructive Git 명령을 임의로 쓰지 않는다. 되돌리기 어려운 작업 전에는 항상 사용자에게 먼저 확인한다.
21. 자동 PR 생성이나 자동 Merge를 실행하지 않는다. PR 초안까지는 만들 수 있어도, 병합은 항상 사람이 직접 한다.
22. 화면 단위 Wave를 완료하면 사람이 Vercel Preview에서 직접 확인한 뒤에만 다음 화면 Wave로 진행한다. 로컬 실행 확인만으로 다음 Wave를 시작하지 않는다.
23. 작업 완료 시 다음 세 가지를 보고한다 — (1) 변경한 파일 목록, (2) 실행한 검증 결과(lint·타입체크·테스트 등, 실행하지 않았으면 안 했다고 명시), (3) 남은 제한사항(미완료 항목, 확인하지 못한 부분).

---

## Task 완료 순서

Task 하나를 구현할 때는 항상 이 순서를 따른다.

1. **Task 읽기** — `TASKS/TASK-<ID>.md` 전체(Context, Requirement Ref, Design Ref, Depends On, Expected Files, Functional/Visual/Security AC, Test Cases, Forbidden)를 읽는다.
2. **입력 확인** — Depends On의 선행 Task가 실제로 완료됐는지, 참조하는 정본 문서(SRS·PROJECT_SCOPE·DESIGN·SCREEN_CONTRACT)의 해당 부분을 확인한다.
3. **구현** — Expected Files 안에서만 코드를 작성한다.
4. **관련 포맷·Unit Test** — 관련 lint/포맷터와 Unit Test(Vitest)를 실행하고 통과를 확인한다.
5. **필요 시 Playwright** — 해당 Task가 Chromium Smoke 3종(`E2E-PUBLIC-SMOKE`/`E2E-TRAVEL-TOOLS`/`E2E-MATE-AUTH`)과 관련되면 실행한다.
6. **Diff 확인** — 변경된 파일이 Expected Files와 정확히 일치하는지 `git diff`/`git status`로 확인한다.
7. **완료 보고** — 위 필수 규칙 23을 따라 보고한다.
