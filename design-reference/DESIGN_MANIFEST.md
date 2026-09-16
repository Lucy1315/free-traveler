# Design Manifest — Free Traveler

이 파일은 Free Traveler 디자인 정본의 단일 진입점(pointer)이다. 구현·리뷰 시 항상 이 파일을 먼저 확인해 어떤 버전이 활성 상태인지 판단한다.

## Active

| 항목 | 값 |
|---|---|
| **Active Design Version** | D-001 |
| **Status** | LOCKED |
| **Active File** | `design-reference/D-001/DESIGN.md` |
| **Vendor Reference** | `design-reference/vender/airbnb/DESIGN.md` |
| **Approved Screens** | SCR-001, SCR-002, SCR-003, SCR-004, SCR-005 |
| **Mobile Variants** | SCR-001, SCR-003 |

> `Vendor Reference` 경로는 저장소에 실제 존재하는 경로(`vender`, 오타 아님 확인됨 — 프로젝트 초기부터 이 철자로 저장되어 있음)를 그대로 가리킨다. 새 파일을 만들거나 경로를 바꾸지 않았다.

## Status 정의

- **LOCKED**: 현재 버전은 확정되어 구현 기준으로 사용한다. 토큰·규칙 변경은 새 버전(D-002 등)을 만들거나, 이 문서와 `D-001/DESIGN.md`를 함께 갱신하는 명시적 변경으로만 수행한다. 임의 색상·radius·spacing 추가는 금지된다.
- **DRAFT**(참고, 현재 해당 없음): 검토 중인 초안 버전. 구현 기준으로 사용하지 않는다.
- **DEPRECATED**(참고, 현재 해당 없음): 더 이상 사용하지 않는 과거 버전. 이력 보존 목적으로만 유지한다.

## 승인 근거

| 항목 | 근거 문서 |
|---|---|
| UI/UX 계획 | `docs/04_UIUX_PLAN.md` |
| Stitch 화면 검증 | `docs/STITCH_VALIDATION_REPORT.md` — 최종 판정 `STITCH_VALIDATION_PASS` |
| Stitch Project | `https://stitch.withgoogle.com/projects/17325557364831050459` |

## Approved Screen ID (Stitch, 최종 정리본 — 중복 제거 완료)

| Screen | Device | Screen ID |
|---|---|---|
| SCR-001 메인 | Desktop | `5d31f236698d4cc8a1c33873732d75cb` |
| SCR-001 메인 | Mobile | `78ca18768f2d4d3c9c25ea68265012d3` |
| SCR-002 대표 소개 | Desktop | `e910f311e79d4b8f84633cb1a540181e` |
| SCR-003 통합 여행 준비 | Desktop | `ee1a4a3309b940fb92514c2ca2b87d79` |
| SCR-003 통합 여행 준비 | Mobile | `4beaeadd323b4350a0e8c47b6336ef71` |
| SCR-004 동행 조회 | Desktop | `a29c79d328814603ac11416e5e561a84` |
| SCR-005 계정·관리 - 관리자 모드 | Desktop | `08a13de0949a46b2af3f6e4e9b4c959d` |

## 금지 사항(D-001에 명시된 규칙의 요약)

- Airbnb 상표 요소(로고·워드마크·"NEW" 배지·프로덕트 탭 구조) 복제 금지
- 구매·예약·결제·가격 비교·별점 UI 금지
- Proprietary Font 파일 사용 금지 — Inter와 시스템 폰트만 허용
- `D-001/DESIGN.md`에 정의되지 않은 임의 색상·radius·spacing 토큰 추가 금지

## 버전 이력

| 버전 | Status | 날짜 | 비고 |
|---|---|---|---|
| D-001 | LOCKED | 2026-09-15 | 최초 정본. Airbnb 구조 참고 + 승인된 Stitch SCR-001~005(Mobile: SCR-001·003) 기준으로 확정 |
