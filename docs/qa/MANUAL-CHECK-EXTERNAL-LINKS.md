# MANUAL-CHECK-EXTERNAL-LINKS — 외부 링크 점검 체크리스트

- 대상 Task: `TASKS/TASK-MANUAL-CHECK-EXTERNAL-LINKS.md`
- 기준: REQ-FUNC-016·024·049, `design-reference/D-001/DESIGN.md` §19(목적지·날짜 쿼리 파라미터 금지), `src/lib/externalLink.ts`
- 점검일: 2026-09-19
- 환경: 로컬 프로덕션 빌드, Playwright Chromium. 외부 사이트는 실제로 접속하지 않고 빈 문서로 대신 응답하게 해 새 탭 열림과 `window.opener`만 확인했다.

## 1. 항공·숙소·외교부 링크

| 링크 | 위치 | 새 탭 | `noopener` | 사용자 입력 쿼리 | 결과 |
|---|---|---|---|---|---|
| 항공(기본 `https://www.skyscanner.co.kr/`) | `/travel-tools` 항공 탭 | 열림 | `rel="noopener noreferrer"`, 새 탭 `window.opener` = null | 없음(`search` 빈 값) | 통과 |
| 숙소(기본 `https://www.agoda.com/ko-kr/`) | `/travel-tools` 숙소 탭 | 열림 | 위와 같음 | 없음 | 통과 |
| 외교부 해외안전여행 원문 | 메인 여행지 상세 → 안전정보 탭(예: 방콕) | 열림(`window.open(…, "noopener,noreferrer")`) | 새 탭 `window.opener` = null | `?idx=14`는 국가 페이지를 가리키는 고정 주소이며 사용자 입력이 아니다 | 통과 |

- 항공·숙소 링크는 조건 확인 전에는 `aria-disabled`로 막혀 있고, 확인 후에만 이동한다.
- 항공·숙소 입력값(지역·날짜)이 어떤 네트워크 요청의 URL·본문에도 실리지 않음을 `tests/e2e/travelTools.spec.ts`가 매번 검사한다.

## 2. 그 밖의 외부 링크 전수

5개 화면과 여행지 상세를 훑어 `http(s)`·`mailto` 링크를 모두 모았다. 모두 `target="_blank"` + `rel="noopener noreferrer"`였다.

- 사진 출처(Wikimedia Commons 파일 페이지) — 대표 소개 Hero·Gallery, 여행지 상세
- 항공·숙소 비교 사이트 — 여행 준비

## 3. 사람이 직접 확인해야 하는 항목(미완료)

- [ ] 실제 브라우저에서 세 링크가 새 탭으로 열리고 목적 사이트가 정상 표시되는지(자동 점검은 외부 접속을 막았다)
- [ ] 관리자 외부 URL 설정에서 허용목록 밖 도메인을 저장했을 때 여행 준비 화면이 이동을 막고 오류를 보이는지 — Supabase 마이그레이션 적용 후 확인
- [ ] 대표 소개의 문의·SNS 링크 — 관리자가 값을 저장한 뒤 새 탭·`noopener` 확인(현재 값이 없어 화면에 나타나지 않음)
