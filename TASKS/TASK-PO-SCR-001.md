---
task_id: PO-SCR-001
type: page_owner
screen_id: SCR-001
route: "`/`"
page_entry: "`src/app/page.tsx`"
depends_on:
  - SHARED-LAYOUT-HEADER-FOOTER
  - CMP-SCR001-HERO
  - CMP-SCR001-DOMESTIC-DEST-CARDS
  - CMP-SCR001-OVERSEAS-DEST-CARDS
  - CMP-SCR001-THEME-MOTIVATION-CHIPS
  - CMP-SCR001-SAFETY-PREVIEW-CARDS
  - CMP-SCR001-RECENT-MATE-CARDS
  - CMP-SCR001-DEST-DETAIL-DRAWER
requirements_covered:
  - REQ-FUNC-001
  - REQ-FUNC-002
  - REQ-FUNC-003
  - REQ-FUNC-004
  - REQ-FUNC-005
  - REQ-FUNC-006
  - REQ-FUNC-007
  - REQ-FUNC-008
  - REQ-FUNC-009
  - REQ-FUNC-010
  - REQ-FUNC-046
  - REQ-FUNC-047
  - REQ-FUNC-048
  - REQ-FUNC-049
  - REQ-FUNC-050
  - REQ-FUNC-051
  - REQ-FUNC-052
  - REQ-FUNC-053
  - REQ-FUNC-054
  - REQ-FUNC-067
  - REQ-FUNC-068
  - REQ-FUNC-069
---

# PO-SCR-001 — SCR-001 메인 Page Owner

## Context
`PO-SCR-001`(SCR-001 메인 Page Owner)은 SCR-001(`/`) 화면의 구현 Task다. `docs/06_SRS_UIUX_REVISED.md`가 정의한 Requirement와 `design-reference/UI_CONTRACT.md`가 정의한 화면 계약을 실제 개발 가능한 단위로 좁힌 것이며, 이 문서 자체는 계획서로서 구현 코드를 포함하지 않는다.

## Project Scope
Impl. Status = **IMPLEMENT**(`docs/PROJECT_SCOPE.md`·`docs/06_SRS_UIUX_REVISED.md` 기준).
범위가 축소된 Requirement가 있다 — 아래 범위를 넘지 않는다:
  - REQ-FUNC-007: IMPLEMENT(축소: alt·출처 URL만)
  - REQ-FUNC-008: IMPLEMENT(축소: 수동 검수)

## Requirement Ref
- **REQ-FUNC-001**: 시스템은 국내·해외 여행지 목록을 구분해 제공한다.
- **REQ-FUNC-002**: 시스템은 국가·도시·계절·테마·권장 기간 필터를 제공한다.
- **REQ-FUNC-003**: 시스템은 키워드로 여행지명·국가명·테마를 검색한다.
- **REQ-FUNC-004**: 시스템은 여행지 상세에 소개·명소 5개 이상·추천 시기·1일/3일 일정·예산·교통·음식 3개 이상·에티켓·출처·수정일을 표시한다.
- **REQ-FUNC-005**: 시스템은 필터 결과가 없으면 조건 완화 안내와 전체 초기화 버튼을 제공한다.
- **REQ-FUNC-006**: 시스템은 해외 여행지 상세에서 해당 국가의 안전 페이지를 연결한다.
- **REQ-FUNC-007**: 시스템은 대표 이미지에 대체텍스트·출처·작가·라이선스를 연결한다.
- **REQ-FUNC-008**: 시스템은 MVP 게시 기준 국내 10개 이상, 해외 15개국 30개 도시 이상을 검증한다.
- **REQ-FUNC-009**: 시스템은 같은 국가·테마의 관련 여행지를 상세 하단에 최대 6개 표시한다.
- **REQ-FUNC-010**: 시스템은 목록 필터 상태를 URL query에 반영해 새로고침·공유 시 복원한다.
- **REQ-FUNC-046**: 시스템은 게시된 모든 해외 국가에 하나 이상의 공개 안전 페이지를 요구한다.
- **REQ-FUNC-047**: 시스템은 치안, 흔한 사기, 현지 법규, 교통, 재난·기후, 보건, 문화·복장, 긴급연락처 섹션을 제공한다.
- **REQ-FUNC-048**: 시스템은 각 안전 페이지에 공식 출처명·URL·최종 확인일·편집자를 기록한다.
- **REQ-FUNC-049**: 시스템은 외교부 해외안전여행 원문 링크를 새 탭으로 제공한다.
- **REQ-FUNC-050**: 시스템은 최종 확인 후 7일이 지나면 stale 상태와 재확인 경고를 표시한다.
- **REQ-FUNC-051**: 시스템은 출국권고·여행금지·특별여행주의보 등 중대 경보를 본문 상단에 텍스트로 표시한다.
- **REQ-FUNC-052**: 시스템은 국가 전체 경보와 특정 지역 경보를 별도 범위로 모델링한다.
- **REQ-FUNC-053**: 시스템은 현지 긴급전화와 대한민국 재외공관 또는 영사콜센터 연결 정보를 표시한다.
- **REQ-FUNC-054**: 시스템은 안전정보가 공식 판단을 대체하지 않으며 출국 직전 원문 재확인이 필요함을 고지한다.
- **REQ-FUNC-067**: 시스템은 여행지·국가 안전정보를 통합 검색한다.
- **REQ-FUNC-068**: 시스템은 회원이 여행지를 즐겨찾기·해제·조회하게 한다.
- **REQ-FUNC-069**: 시스템은 여행지·안전·동행 공개 페이지의 URL 공유를 제공한다.

## Screen / Route / Page Entry
- Screen: SCR-001
- Route: `/`
- Page Entry: `src/app/page.tsx`

## Design Ref
- D-001 §16(Section 계층), §17(SCR-001 7 Section 순서·최소 콘텐츠), §18(Empty), UI_CONTRACT 1장
- `design-reference/SCREEN_ROUTE_CONTRACT.json`(schema_version: traveler-screen-route-v1) — Route·Page Entry 정본

## Depends On
- SHARED-LAYOUT-HEADER-FOOTER
- CMP-SCR001-HERO
- CMP-SCR001-DOMESTIC-DEST-CARDS
- CMP-SCR001-OVERSEAS-DEST-CARDS
- CMP-SCR001-THEME-MOTIVATION-CHIPS
- CMP-SCR001-SAFETY-PREVIEW-CARDS
- CMP-SCR001-RECENT-MATE-CARDS
- CMP-SCR001-DEST-DETAIL-DRAWER

## Expected Files
- 기존 수정: `src/app/page.tsx`(현재 `create-next-app` 스타터 마크업 — **전량 제거 후 재작성**)
- 추가(2026-09-18, 사용자 승인 후속 수정): `src/components/scr001/HomePage.tsx`(메인 본문 — `page.tsx`가 metadata를 내보내려면 Server Component여야 해서 인터랙티브 본문을 분리), `src/components/scr001/CtaBanner.tsx`·`src/components/scr001/ThreeStepGuide.tsx`(D-001 §17 SCR-001 6·7번 영역 — 최초 AC 목록에서 누락돼 E2E-001이 실패하던 부분)

(Expected Files 밖의 파일은 이 Task 범위에서 수정하지 않는다.)

## Functional AC
- **Next.js Starter 완전 제거**(로고·"Get started"·기본 링크 잔존 금지). Section 순서 고정: Hero → 국내 여행지 카드 6개 이상 → 해외 여행지 카드 6개 이상 → 여행 동기 Chip 6개 이상 → 국가별 주의사항 카드 6개 → 최근 동행글 카드 3개(또는 완성형 Empty) → CTA Banner("여행 준비 시작하기" → `/travel-tools`, 풀폭 밴드) → 3단계 안내(정확히 3단계: 여행지 탐색 → 조건 정리·동행 찾기 → 연결). 각 Section 데이터 출처: Hero=검색 입력, 국내/해외=DATA-DESTINATIONS-*, 여행동기=ThemeChips 정적 목록, 안전=DATA-COUNTRY-SAFETY, 최근 동행글=API-MATES-ROUTES, CTA·3단계 안내=정적 문구(UI_CONTRACT 1장)

## Visual AC
- Desktop 콘텐츠 1200~1280px, Section 여백 64~96px(Mobile 40~64px), Mobile 1열, 44px 터치 영역
- **Loading**: 최근 동행글 카드(API-MATES-ROUTES 비동기 조회) 로드 중에는 D-001 §14 기준 스켈레톤(회색 블록, 은은한 애니메이션)만 표시한다. 실데이터처럼 보이는 가짜 텍스트를 채우지 않는다. 국내/해외 여행지·주의사항 등 정적 데이터 Section은 즉시 렌더링되므로 Loading 상태가 없다.

## Security/Privacy AC
- `Lorem ipsum`/"준비 중"/"정보 확인 필요"/빈 카드 금지, 데이터 0건 섹션은 안내 문장+이용 방법+CTA를 갖춘 완성형 Empty만 허용

## Test Cases
- TC-1(Functional): **Next.js Starter 완전 제거**(로고·"Get started"·기본 링크 잔존 금지). Section 순서 고정: Hero → 국내 여행지 카드 6개 이상 → 해외 여행지 카드 6개 이상 → 여행 동기 Chip 6개 이상 → 국가별 주의사항 카드 6개 → 최근 동행글 카드 3개(또는 완성형 Empty) → CTA Banner("여행 준비 시작하기" → `/travel-tools`, 풀폭 밴드) → 3단계 안내(정확히 3단계: 여행지 탐색 → 조건 정리·동행 찾기 → 연결). 각 Section 데이터 출처: Hero=검색 입력, 국내/해외=DATA-DESTINATIONS-*, 여행동기=ThemeChips 정적 목록, 안전=DATA-COUNTRY-SAFETY, 최근 동행글=API-MATES-ROUTES, CTA·3단계 안내=정적 문구(UI_CONTRACT 1장)
- TC-2(Visual): Desktop 콘텐츠 1200~1280px, Section 여백 64~96px(Mobile 40~64px), Mobile 1열, 44px 터치 영역
- TC-3(Security/Privacy): `Lorem ipsum`/"준비 중"/"정보 확인 필요"/빈 카드 금지, 데이터 0건 섹션은 안내 문장+이용 방법+CTA를 갖춘 완성형 Empty만 허용
- TC-4(Verify 연동): E2E-PUBLIC-SMOKE, MANUAL-CHECK-RESPONSIVE로 위 시나리오를 실행해 통과를 확인한다.

## Verify
- E2E-PUBLIC-SMOKE, MANUAL-CHECK-RESPONSIVE

## Definition of Done
- [ ] Functional AC·Visual AC·Security/Privacy AC를 모두 충족한다.
- [ ] Expected Files에 나열된 파일만 신규 생성·수정했다(그 밖의 파일 변경 없음).
- [ ] Verify 절의 검증 수단(E2E-PUBLIC-SMOKE, MANUAL-CHECK-RESPONSIVE)을 실행했거나 실행 계획이 명시돼 있다.
- [ ] Forbidden 절의 모든 항목을 위반하지 않았다.
- [ ] Next.js Starter 기본 마크업(로고·"Get started"·기본 링크)이 완전히 제거됐다.

## Forbidden
- 새 Component 파일을 직접 만들지 않는다 — 이 Task는 Depends On의 CMP-* Task 산출물을 Route Page로 조립하는 범위로 한정한다. (예외: Expected Files의 2026-09-18 추가 항목 3개는 사용자가 명시적으로 승인해 만들었다.)
- Expected Files 절에 나열되지 않은 파일은 신규 생성·수정하지 않는다(범위 밖 수정 금지).
- Airbnb 상표 요소, 예약·결제·가격·별점·광고 UI를 만들지 않는다(D-001 §19 Do Not).
- 이 문서(D-001/DESIGN.md)에 없는 임의의 색상·radius·spacing 값을 새로 만들지 않는다.
- `Lorem ipsum`, "준비 중", "정보 확인 필요" 등 Placeholder 문구와 빈 카드(CTA 없는 Empty)를 만들지 않는다.
- 배포·인프라는 Vercel·Supabase 관리형 서비스만 사용한다(별도 클라우드 가상 서버 직접 구축 금지).
- 코드 반영은 사람이 직접 리뷰한 뒤 진행한다(리뷰 없이 저절로 반영되는 병합 절차 금지).
- docs/PROJECT_SCOPE.md에서 EXCLUDED로 분류된 Requirement를 이 Task 범위에서 구현하지 않는다.
- 구현 코드·Branch·Commit을 이 Task 파일 작성 과정에서 만들지 않는다(이 문서는 계획서다).
