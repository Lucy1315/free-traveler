# RELEASE-CHECK-DEPLOY-ENV — 배포 환경 점검

- 대상 Task: `TASKS/TASK-RELEASE-CHECK-DEPLOY-ENV.md`
- 기준: REQ-NF-012(TLS 1.2 이상)·016(비밀키 환경변수 관리, 클라이언트 번들 미포함)·034(월 인프라 비용 10만 원 이하)
- 점검일: 2026-09-19
- 방식: 명령줄에서 직접 확인했다. 비밀값은 읽거나 출력하지 않고 키 이름·형식만 검사했다(CLAUDE.md 규칙 15).

## 1. 연결 상태

| 항목 | 결과 |
|---|---|
| GitHub → Vercel 자동 배포 | 동작 — main 푸시마다 Production 배포가 생성되고 최신 배포 상태 success |
| GitHub Actions CI | 통과 — 품질 검사(format·lint·typegen+tsc·unit·contract·build)와 Public E2E(프로덕션 빌드) 모두 success |
| Supabase Auth | 연결됨 — `/auth/v1/settings` 200, 이메일 가입 사용, 이메일 인증 필수(autoconfirm 꺼짐) |
| Supabase DB 테이블 | **미적용** — `mate_post` 등 6개 테이블이 없어 REST가 404를 돌려준다. 마이그레이션 0001~0004를 아직 실행하지 못했다 |
| Vercel 배포 URL 직접 열람 | 확인 못 함 — 배포 주소에 Vercel 로그인 보호(302)가 걸려 있어 명령줄에서 화면을 볼 수 없다 |

## 2. TLS(REQ-NF-012) — 충족

| 대상 | 협상된 버전 | TLS 1.1 이하 | http 접속 | HSTS |
|---|---|---|---|---|
| Supabase(`*.supabase.co`) | TLS 1.3 | 거부됨 | 서비스 안 함(404) | max-age 1년, preload |
| Vercel 배포 | TLS 1.3 | 거부됨 | https로 308 리디렉션 | max-age 2년, preload |

앱 코드에서 외부로 나가는 주소는 모두 https다(외부 URL 설정은 https만 저장 가능, DB 제약과 API에서 이중 검사).

## 3. 비밀키(REQ-NF-016) — 충족

| 검사 | 결과 |
|---|---|
| 클라이언트 번들(`.next/static`)에 `SUPABASE_SECRET_KEY` 이름 | 0건 |
| 클라이언트 번들에 `service_role` 문자열 | 0건 |
| 클라이언트 번들에 `sb_secret_` | 1건 — Supabase 라이브러리의 키 형식 검사 코드 `startsWith("sb_secret_")`이며 뒤에 키 값이 없음을 확인(오탐) |
| 비밀키를 참조하는 소스 | `src/lib/db/client.ts`(서버 전용) 한 곳. `process.env`로만 읽고, 브라우저에서 호출하면 예외를 던진다 |
| Client Component가 서버 전용 모듈을 import | 0건(브라우저용은 `src/lib/db/browser.ts`로 분리) |
| `.env*` 파일의 git 추적 | 없음(`.gitignore`에 `.env*`) |
| 브라우저에 노출되는 값 | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`(공개용 키) — 의도된 노출이며 접근 통제는 RLS·GRANT가 맡는다 |

## 4. 월 인프라 비용(REQ-NF-034) — 목표 10만 원 이하 충족(현재 0원)

| 서비스 | 현재 플랜 | 월 비용 | 비고 |
|---|---|---|---|
| Vercel | Hobby | 0원 | 개인·비상업 용도 한정. 상업 운영 시 Pro(1인 약 20달러) 필요 |
| Supabase | Free(대시보드 조직 표시 FREE) | 0원 | DB 500MB 등 한도. 일정 기간 활동이 없으면 프로젝트가 일시 정지된다 |
| GitHub Actions | 공개/무료 한도 | 0원 | — |
| 이미지 | 저장소에 자체 호스팅(약 7.4MB) | 0원 | 외부 이미지 서비스 미사용 |

유료 전환 시에도 Vercel Pro + Supabase Pro는 합계 약 45달러(6만 원대)로 목표 안이다. 요금은 변동될 수 있으므로 전환 전에 각 대시보드에서 확인한다.

## 5. 출시 전 사람이 해야 하는 일(미완료)

- [ ] **Supabase 마이그레이션 0001~0004 적용**(출시 차단 항목). 적용 전에는 동행 찾기 목록·계정의 회원 기능·관리자 기능이 모두 오류로 나온다. SQL Editor 실행이 실패했던 이력이 있어 `supabase link` + `supabase db push`(터미널 앱) 경로를 권장한다. 0004가 두 차례 수정됐으므로 예전에 복사해 둔 SQL은 쓰지 않는다.
- [ ] 마이그레이션 적용 후: 첫 관리자 계정의 `user_profile.role`을 대시보드 SQL로 `admin`으로 지정(사용자는 자기 role을 바꿀 수 없게 막아 두었다), 외부 URL·문의 링크 저장.
- [ ] Vercel 환경변수 확인: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`가 Production·Preview에 모두 있는지. `NEXT_PUBLIC_SITE_URL`은 선택(없으면 Vercel 프로덕션 도메인을 자동 사용).
- [ ] Supabase Auth → URL Configuration에 실제 사이트 주소와 `/account` 리디렉션 주소 등록(가입 인증 메일·비밀번호 재설정 링크가 돌아올 주소).
- [ ] 공개 출시 시 Vercel Deployment Protection 범위 확인(현재 배포 주소가 로그인 보호 상태).
- [ ] 인증 흐름 E2E(`tests/e2e/mateAuth.spec.ts`)와 RLS 라이브 검사(`tests/unit/rlsBasic.test.ts` 2부) 실행 — 테스트 계정 2개와 테스트용 DB 접속 정보 필요.
- [ ] 안전정보 주 1회 재확인 절차 지정(`docs/qa/RELEASE-CHECK-CONTENT-COMPLETENESS.md` 4절).
