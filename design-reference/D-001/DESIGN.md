---
version: 1.0
name: Free-Traveler-Design-D001
status: LOCKED
description: Traveler 전용 디자인 정본(canonical design system)이다. Airbnb DESIGN.md는 spacing 리듬·둥근 모서리·단일 액센트·단일 elevation 단계라는 "문법"만 참고했고, 색상·폰트·워드마크·프로덕트 탭 구조 등 Airbnb 고유 요소는 포함하지 않는다. `docs/04_UIUX_PLAN.md`와 승인된 Stitch Screen(SCR-001~005, Mobile: SCR-001·003, `STITCH_VALIDATION_PASS`)을 기준으로 확정했다.
---

## 0. 문서 성격

본 문서는 Free Traveler의 **유일한 디자인 정본(Single Source of Truth)** 이다. 구현·디자인 변경 시 이 문서의 토큰과 규칙을 우선 적용하고, 벗어나는 값을 새로 추가할 때는 이 문서를 먼저 갱신한다. `design-reference/DESIGN_MANIFEST.md`가 이 문서를 활성 버전(D-001, LOCKED)으로 가리킨다.

---

## 1. Visual Theme

Free Traveler는 예약·결제·가격 비교가 없는 **여행 준비 허브**다. 사진 중심의 여행지 콘텐츠, 국가 안전정보, 항공·숙소 조건 정리, 신원을 보증하지 않는 동행 매칭을 다룬다. 순백 캔버스 위에 단 하나의 액센트(코랄)만 절제해서 쓰고, 나머지는 짙은 웜그레이 텍스트와 여백으로 구성한다. 카드·검색창·버튼은 모두 둥근 모서리를 쓰며, 그림자는 단일 단계만 존재한다. 예약 버튼, 가격 표시, 별점, 광고, Airbnb류 워드마크·상표는 이 시스템에 존재하지 않는다.

**핵심 원칙**
- 액센트 컬러는 Primary CTA·활성 탭 밑줄·즐겨찾기 채움 상태에만 쓴다. 한 화면에서 코랄이 차지하는 면적은 항상 작다.
- 사진이 위계를 만든다. 타이포그래피는 절제된 굵기(최대 700)만 쓰고, 카드·갤러리 이미지가 시각적 무게를 담당한다.
- 상태(오류·경고·안전정보)는 색상과 텍스트 라벨을 항상 함께 표기한다.
- 예약·결제·가격·별점·광고 UI는 어떤 화면에도 넣지 않는다.

---

## 2. Color Token

디자인 토큰 밖의 임의 색상은 추가하지 않는다. 새 색이 필요하면 이 표를 먼저 갱신한다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `color-canvas` | `#FFFFFF` | 페이지 기본 배경(흰 배경) |
| `color-surface-soft` | `#F7F6F4` | 섹션 배경 대비, CTA 배너 배경, 비활성 필드 |
| `color-surface-strong` | `#F0EFEC` | 원형 아이콘 버튼, Chip 비활성 배경 |
| `color-ink` | `#26282C` | 본문·제목 텍스트(짙은 회색, 순검정 금지) |
| `color-body` | `#4B4E54` | 보조 본문 텍스트 |
| `color-muted` | `#84878D` | 캡션, 메타 정보, 비활성 라벨 |
| `color-hairline` | `#E3E2DF` | 1px 구분선, 카드 테두리 |
| `color-border-strong` | `#C7C5C0` | 포커스 이전 입력 테두리, 비활성 버튼 테두리 |
| `color-coral-500` | `#FF6A4D` | 유일한 브랜드 포인트(Primary CTA, 활성 탭, 즐겨찾기 채움) |
| `color-coral-600` | `#E5502F` | Primary 버튼 Press/Active |
| `color-coral-100` | `#FFE3D8` | Primary 버튼 Disabled 배경, 코랄 톤 배지 배경 |
| `color-on-coral` | `#FFFFFF` | 코랄 배경 위 텍스트 |
| `color-focus-ring` | `#1D4ED8` | 키보드 포커스 링(코랄과 다른 파란 계열) |
| `color-error` | `#C7284B` | 폼 오류 텍스트·테두리 |
| `color-warning` | `#B8720B` | 안전정보 경고, stale 배지 |
| `color-success` | `#1F8A4C` | 제출 성공, 승인 완료 |
| `color-info` | `#2563A9` | 안전정보 카테고리 라벨, 중립 안내 |
| `color-scrim` | `rgba(38,40,44,0.5)` | Drawer/Modal 배경 스크림 |

> `color-error`·`color-warning`·`color-info`는 `color-coral-500`과 색상 계열이 다르며, 상태 표시는 항상 텍스트 라벨을 동반한다.

---

## 3. Typography

폰트는 오픈소스 **Inter** 하나만 쓴다(Proprietary Font 파일 사용 금지). 한글은 시스템 폰트로 자연 폴백한다.

```
font-family: 'Inter', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif;
```

| 토큰 | 크기 | 굵기 | 줄간격 | 용도 |
|---|---:|---:|---:|---|
| `display-xl` | 32px | 700 | 1.35 | SCR-001·002 Hero 제목 |
| `display-lg` | 24px | 600 | 1.35 | Section 제목 |
| `display-md` | 20px | 600 | 1.4 | 카드 그룹 소제목, Drawer 헤더 |
| `title-md` | 17px | 600 | 1.4 | 카드 제목, 탭 라벨 |
| `body-md` | 16px | 400 | 1.6 | 기본 본문 |
| `body-sm` | 14px | 400 | 1.55 | 카드 메타, 설명 |
| `caption` | 13px | 500 | 1.4 | 라벨, 배지, 폼 헬퍼 텍스트 |
| `button-md` | 16px | 600 | 1.25 | 버튼 라벨 |

한글 가독성을 위해 Airbnb 원본(라틴 전용, 1.43~1.5)보다 본문 줄간격을 넓게(1.55~1.6) 잡는다. 최대 굵기는 700을 넘지 않는다(과도한 타이포그래피 무게로 사진 위계를 침범하지 않음).

---

## 4. Spacing

기본 단위는 4px 배수다.

| 토큰 | 값 |
|---|---|
| `space-xs` | 4px |
| `space-sm` | 8px |
| `space-md` | 12px |
| `space-base` | 16px |
| `space-lg` | 24px |
| `space-xl` | 32px |
| `space-xxl` | 48px |
| `space-section-desktop` | 80px (64~96px 범위 내에서 선택) |
| `space-section-mobile` | 48px (40~64px 범위 내에서 선택) |

Card 내부 padding은 16~24px, Chip·배지 padding은 4~10px, Card 그리드 gutter는 16px을 기본으로 한다.

---

## 5. Radius

| 토큰 | 값 | 용도 |
|---|---|---|
| `radius-none` | 0px | CTA 배너 등 풀폭 밴드 |
| `radius-xs` | 4px | 미세 요소 |
| `radius-sm` | 8px | 버튼, 입력 필드 |
| `radius-md` | 14px | 카드(여행지·동행·호스트 등 모든 콘텐츠 카드) |
| `radius-full` | 9999px | Chip, 검색창, 배지, 아바타, 원형 아이콘 버튼 |

하드 코너(radius 0)는 CTA 배너류 풀폭 밴드에만 허용하고, 그 외 상호작용 요소는 전부 둥근 모서리를 쓴다.

---

## 6. Shadow(Elevation)

단일 그림자 단계만 존재한다.

```
box-shadow: 0 1px 2px rgba(38,40,44,0.06), 0 4px 10px rgba(38,40,44,0.08);
```

적용 대상: Card hover, Drawer/Modal, Toast. 그 외 모든 표면(Body, Hero, Footer, 편집형 섹션)은 그림자 없이 플랫하게 처리한다. 단계별 elevation(다중 shadow tier)은 만들지 않는다.

---

## 7. Header·Footer(5개 Screen 공통)

### Header
- Desktop 높이 72px, Mobile 높이 56px. 배경 `color-canvas`, 하단 1px `color-hairline`.
- 좌측: `Free Traveler` 텍스트 워드마크(로고 이미지·심볼 없음, `color-ink`).
- 중앙(Desktop): 5개 내비게이션 — 메인 · 대표 소개 · 여행 준비 · 동행 찾기 · 계정. 활성 항목은 `color-coral-500` 밑줄 2px + `color-ink` 텍스트.
- 우측: 즐겨찾기 아이콘, 계정/로그인 진입 아이콘.
- Mobile: 워드마크 + 햄버거 메뉴로 축소. 펼치면 5개 링크를 세로 목록으로 노출.

### Footer
- Desktop 3단 / Mobile 1단 스택. 배경 `color-canvas`(대비 없는 라이트 푸터), 상단 1px `color-hairline`.
- 컬럼 구성: "탐색"(메인·대표 소개·동행 찾기), "여행 준비"(여행 준비·로그인), "정책"(이용약관·개인정보 처리방침·동행 안전수칙·콘텐츠 면책 안내).
- 하단 밴드: 저작권, "여행경보·비자·보건 정보는 외교부 등 공식 출처를 직접 확인하세요" 고지.

---

## 8. Search·Filter

- **검색창(`search-bar-pill`)**: 흰 배경, `radius-full`, 높이 56px, 1px `color-hairline` 테두리, 내부 padding 14px 24px. 포커스 시 2px `color-ink` 테두리 + `color-focus-ring` 아웃라인.
- **필터 Chip(`chip` / `chip-active`)**: `radius-full`. 비활성은 `color-surface-strong` 배경 + `color-ink` 텍스트. 활성은 `color-coral-100` 배경 + `color-coral-600` 텍스트(본문에 코랄 solid fill을 쓰지 않는다).
- 필터는 항상 AND 조건으로 적용하고, 결과 0건일 때는 §14 Empty State 규칙을 따른다.
- 필터 상태는 허용된 값만 URL query로 직렬화한다(SCR-001).

---

## 9. Destination Card

- 구조: 4:3 비율 사진(상단) → 제목(`title-md`) → 국가/테마 메타(`body-sm`, `color-muted`) → 즐겨찾기 하트 아이콘(우상단 오버레이).
- `radius-md`(14px), 사진 없는 카드는 존재할 수 없다(placeholder 아이콘 금지, §14 참조).
- 가격·별점·리뷰 수는 표시하지 않는다.
- 관련 여행지·추천 카드도 동일 컴포넌트를 재사용한다.

---

## 10. Form·Tabs

### Form(`text-input`)
- 흰 배경, `radius-sm`(8px), 높이 48px, 1px `color-hairline` 테두리, padding 14px 12px.
- 라벨은 `caption`(입력 위 고정), 오류는 `color-error` 텍스트 + 2px 오류 테두리, `aria-describedby`로 필드와 연결.
- 포커스 시 2px `color-ink` 테두리 + `color-focus-ring` 아웃라인(그림자/글로우 없음).

### Tabs
- 밑줄형. 활성 탭은 `color-coral-500` 밑줄 2px + `color-ink` 텍스트, 비활성은 `color-muted`.
- SCR-003은 정확히 3개 탭(항공 / 숙소 / 동행 글쓰기)을 가지며, 탭마다 **입력 → 검증 → 완료** 상태를 서로 분리해서 관리한다(한 탭의 검증 오류가 다른 탭 상태에 영향을 주지 않는다).
- SCR-005는 좌측 세로 탭(역할 기반 노출, §15 참조)을 쓴다.

---

## 11. Mate Post Card(동행 모집글 카드)

- 구조: 제목(`title-md`) → 국가/지역·기간(`body-sm`) → 모집 상태 배지(`badge-status`, 모집중/마감 + 텍스트 라벨) → 여행 스타일 Chip 1~2개.
- 작성자 연락처(이메일·전화번호·메신저 ID)는 카드·상세 어디에도 노출하지 않는다.
- 가격·참가비·별점은 표시하지 않는다.
- 목록은 데이터가 있으면 카드 최대 8개를 우선 노출한다(SCR-004).

---

## 12. Drawer·Modal

- Desktop: 화면 우측에서 슬라이드, 폭 약 40%. Mobile: 화면 하단에서 전체 폭 바텀시트로 슬라이드.
- 배경 스크림 `color-scrim`, 닫기는 배경 클릭·`Esc`·닫기 버튼 3가지 모두 지원.
- 열릴 때 포커스를 Drawer 내부로 이동시키고, 닫히면 트리거 요소로 포커스를 되돌린다(포커스 트랩).
- 그림자는 §6의 단일 단계만 적용.
- 용도: 여행지 상세(SCR-001, 내부에 "상세정보/안전정보" 2개 탭 포함), 동행 상세(SCR-004, Desktop은 목록 옆 분할 패널로 대체).

---

## 13. Alert·Toast

- **Toast**: Mobile은 화면 하단 중앙, Desktop은 우하단. 4초 후 자동 소멸. `color-success`(성공)·`color-error`(오류)·`color-info`(정보) 3종 변형, 아이콘+텍스트 병기.
- **Alert(안전정보 경고 배지, `badge-warning`)**: `color-warning` 텍스트 + 연한 호박색 배경, `radius-full`. 색상만으로 상태를 표시하지 않고 "재확인 필요"류 텍스트 라벨을 항상 동반한다.
- 실제 이메일 발송은 하지 않는다. 모든 알림은 Toast 또는 화면 내 상태 표시로 대체한다.

---

## 14. Loading·Empty·Error 상태

| 상태 | 규칙 |
|---|---|
| **Loading** | 목록·카드 그리드는 스켈레톤(회색 블록, 은은한 애니메이션)만 쓴다. 실데이터처럼 보이는 가짜 텍스트를 채우지 않는다. |
| **Empty** | 완성형 문장으로 된 안내 + 조건 초기화·다음 행동 CTA를 항상 함께 표시한다(§18 참조). 빈 카드·빈 여백만 남기지 않는다. |
| **Error** | 인라인 오류 문구 + 재시도 버튼. 입력값은 유지한다(폼 오류 시 사용자가 다시 입력하지 않도록). |
| **Unauthorized** | 비로그인 상태에서 쓰기 액션 시도 시 "로그인이 필요합니다" 문장 + 로그인 이동 버튼을 표시한다. 조용히 막거나 빈 화면으로 대체하지 않는다. |

Dashboard형 통계·그래프 화면은 어떤 상태에서도 만들지 않는다(SCR-005 관리자 탭 포함).

---

## 15. Desktop·Mobile 규칙

| 항목 | Desktop | Mobile |
|---|---|---|
| 기준 폭 | 1440px | 390px(지원 하한 320px) |
| Header 높이 | 72px | 56px, 햄버거 메뉴 |
| Card Grid 열 수 | 3~4열 | 1열 |
| SCR-004 상세 | 목록 옆 분할 패널(좌 40% : 우 60%) | 목록 → 상세 바텀시트 Drawer |
| SCR-003 탭 | 가로 탭바 | 가로 스크롤 세그먼트 |
| 최소 터치 영역 | 44×44px 이상 | 44×44px 이상(필수) |
| 키보드 포커스 | 모든 상호작용 요소에 2px `color-focus-ring` 아웃라인, `outline-offset 2px` | 동일(스크린리더·키보드 내비게이션 기준 동일 적용) |

### Page Section 최대 폭과 상하 여백
- Desktop 콘텐츠 최대 폭: **1200~1280px**, 좌우 자동 중앙 정렬.
- Desktop Section 상하 여백: **64~96px**(`space-section-desktop` 기본값 80px).
- Mobile Section 상하 여백: **40~64px**(`space-section-mobile` 기본값 48px), Card는 1열.

### Hero 규칙
- Hero는 뷰포트 전체 높이를 차지하지 않는다. Desktop 1440px 기준 **뷰포트의 55~65%** 이내로 제한해, 스크롤 없이도 다음 Section의 시작이 보이게 한다.
- Hero 안에는 헤드라인, 1문장 설명, 핵심 CTA(검색창 또는 Primary 버튼) 이상을 넣지 않는다. 장식적 배경 사진 1장은 허용한다.

---

## 16. Section 계층과 시각적 리듬

모든 Section은 **제목 → 1~3문장 설명 → 본문(실제 콘텐츠) → (선택) CTA** 순서를 지킨다.

| 계층 | 토큰 | 정렬 |
|---|---|---|
| Section 제목 | `display-lg` | 좌측 정렬 기본 |
| Section 설명 | `body-md`, `color-body`, 1~3문장 | 제목 아래 8~12px |
| 본문 | Card Grid / 좌우 분할 / Chip 목록 / 3단계 안내 / Gallery / Timeline 중 택1 | 설명 아래 24~32px |
| CTA | `button-primary` 또는 `button-secondary` | 본문 하단, 좌측 또는 중앙 정렬 |

같은 Card 레이아웃을 연속 배치하지 않는다. 한 화면 안에서 **Hero, Card Grid, 좌우 분할, Chip 목록, 3단계 안내, CTA Banner, Gallery**를 교차 사용해 단조로움을 피한다.

---

## 17. 화면별 Section 순서와 최소 콘텐츠 수

### SCR-001 `/` 메인 — Desktop·Mobile, 7 Section
1. Hero(축소형) — 헤드라인 + 통합 검색창 + 국내/해외 진입 버튼
2. 테마·계절 Chip 목록 — **Chip 6개 이상**
3. 국내/해외 탭 + 필터 + Card Grid — 여행지 카드 **8개 이상**
4. 여행지 상세 Drawer/Modal — 상세정보 탭 + 안전정보 탭(2탭 필수)
5. 관련 여행지 Card Grid — **카드 4~6개**
6. CTA Banner — 여행 준비로 이동
7. 3단계 안내 — **정확히 3단계**

### SCR-002 `/about` 대표 소개 — Desktop, 7 Section
1. Hero — 대표 이미지 + 한 문장 소개 + 수치 카드 2개(`50+ Trips`, `30+ Countries`)
2. 추천 여행지 Card Grid — **카드 6개**
3. 방문 국가 Chip 목록 — **Chip 30개 이상**(대륙별 그룹)
4. 여행 타임라인 — **항목 3개 이상**(연도·장소·한줄 요약)
5. 사진 Gallery — **이미지 8장**(캡션·촬영 국가 병기)
6. 여행 철학 좌우 분할 — 인용구 + 편집 원칙
7. 여행 준비 체크리스트 3단계 안내 — **정확히 3단계** + CTA

### SCR-003 `/travel-tools` 통합 여행 준비 — Desktop·Mobile, 6 Section
1. Intro — 3개 미리보기 카드(항공/숙소/동행 모집글)
2. 탭바(**항공/숙소/동행 글쓰기 3탭**) + 여행정보 Form
3. 입력 요약 + 비전달 고지 + 외부이동 CTA(항공/숙소 탭 공통 패턴)
4. 찾기 Tip 카드 — **정확히 3개**
5. 로그인 안내 또는 동행 작성 Form + 안전수칙 요약
6. 안전 안내 CTA Banner

### SCR-004 `/mates` 동행 조회 — Desktop·Mobile, 6 Section
1. Intro + 모집글 작성 CTA
2. Filter + 결과 요약 텍스트
3. 동행글 Card Grid — 데이터가 있으면 **카드 최대 8개 우선 노출**
4. Desktop 목록+상세 분할 패널 / Mobile 목록→상세 Drawer
5. 동행 신청 방법 3단계 안내 — **정확히 3단계**
6. 안전·신고·차단 안내 + `/travel-tools` CTA

### SCR-005 `/account` 계정·관리 — Desktop, 역할 기반 탭(고정 Section 수 없음)
- **Guest**: 계정 기능 Intro, 로그인·가입·비밀번호 재설정 Card, 로그인 후 가능한 기능 안내, 보안 안내.
- **Member**: 프로필/내 글/참가 요청/차단 목록/즐겨찾기 — **5개 탭**, 각 탭에 Intro·핵심 작업·다음 행동을 갖춘다.
- **Admin**(Moderator/Admin 권한만 노출): Member 5개 탭 아래 구분선 + "관리자 설정" 라벨, **신고 상태 변경**(신고 카드 3건 이상, 상태별 필터) / **외부 URL 설정**(항공·숙소 URL 폼 2개, HTTPS 안내) — **정확히 2개 탭**.
- 역할에 없는 탭은 렌더링하지 않는다. Dashboard·통계 차트는 어떤 역할에서도 만들지 않는다.

---

## 18. 완성형 Empty State와 Placeholder 문구 금지 규칙

- `Lorem ipsum`, `준비 중`, `정보 확인 필요`, 텍스트 없는 빈 카드는 어떤 상태에서도 금지한다.
- 데이터가 0건인 목록(동행글 0건, 참가 요청 0건, 차단 목록 0건, 신고 0건 등)은 아래 3요소를 모두 포함한 **완성형 문장**으로 대체한다.
  1. 상황을 설명하는 완성된 한국어 문장(예: "아직 차단한 사용자가 없습니다.")
  2. 이용 방법 또는 조건 초기화 안내
  3. 다음 행동 CTA(예: "새 모집글 작성", "필터 초기화", "여행지 둘러보기")
- 이미지가 없는 콘텐츠 카드를 만들지 않는다 — 여행지·동행글·대표 소개 등 모든 카드는 실제 사진으로 채운 상태로만 완성 처리한다.
- 과도한 빈 여백(콘텐츠 없이 큰 여백만 있는 섹션)을 남기지 않는다.

---

## 19. Do / Do Not

### Do
- 코랄(`color-coral-500`) 액센트는 화면당 Primary CTA·활성 탭·즐겨찾기 상태 등 소수 지점에만 쓴다.
- 모든 카드·검색창·버튼에 정의된 `radius` 토큰만 쓴다(14px 카드, 8px 버튼, full 검색창/Chip).
- 오류·경고·안전정보는 색상 + 텍스트 라벨을 항상 함께 표기한다.
- Section은 제목·설명·본문·CTA 계층을 지키고 서로 다른 레이아웃 유형을 교차 배치한다.
- Empty 상태에는 완성형 문장 + 다음 행동 CTA를 함께 넣는다.
- Desktop 1440px·Mobile 390px 기준과 44px 터치 영역, 2px 포커스 링을 지킨다.

### Do Not
- Airbnb 로고·워드마크·"NEW" 배지·3-프로덕트 탭 구조 등 Airbnb 고유 상표 요소를 복제하지 않는다.
- 예약·결제·가격 비교·별점·광고·실시간 항공권/호텔 가격 UI를 만들지 않는다.
- Proprietary Font 파일(Airbnb Cereal 등)을 사용하지 않는다 — Inter와 시스템 폰트만 쓴다.
- 이 문서에 없는 임의 색상·radius·spacing 값을 새로 만들지 않는다. 필요하면 이 문서를 먼저 갱신한다.
- `Lorem ipsum`, `준비 중`, `정보 확인 필요`, 빈 이미지 카드로 화면을 채우지 않는다.
- SCR-005 Admin 탭 이외의 위치에서 통계 차트·Dashboard를 만들지 않는다.
- 다중 elevation 단계(그림자 레이어를 여러 겹 쌓는 것)를 쓰지 않는다 — 단일 그림자만 허용한다.
