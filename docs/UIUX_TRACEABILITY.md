# UI/UX Traceability — Free Traveler

- **Document ID:** UIUX-TRACE-TRAVEL-001
- **대상:** REQ-FUNC-001~080, REQ-NF-001~034 (총 114건, 전량 유지)
- **연결 문서:** `docs/02_SRS_BASELINE.md`, `docs/PROJECT_SCOPE.md`, `docs/03_UI_COVERAGE_ANALYSIS.md`, `design-reference/UI_CONTRACT.md`, `design-reference/SCREEN_ROUTE_CONTRACT.json`

## 열 정의

| 열 | 의미 |
|---|---|
| **Requirement** | `docs/02_SRS_BASELINE.md` Requirement ID |
| **Implementation Status** | `PLANNED`(이번 범위에서 구현 대상) 또는 `EXCLUDED`(`docs/PROJECT_SCOPE.md` 기준 이번 범위에서 구현하지 않음) |
| **Screen** | 승인된 5개 Screen(SCR-001~005) 중 배치 위치, 전역 공통, 기술 Route, 또는 N/A(비UI) |
| **Route** | Screen에 대응하는 Next.js Route, 또는 N/A |
| **Page Entry** | Screen에 대응하는 Page 파일 경로, 또는 N/A |
| **Task** | 구현 Task ID. Task가 아직 생성되지 않았으므로 `PLANNED` 행은 전부 `PENDING_TASK_GENERATION`, `EXCLUDED` 행은 `N/A` |
| **Test** | `docs/02_SRS_BASELINE.md` 5장 Traceability Matrix가 정의한 테스트 케이스 ID(TC-FUNC-xxx/TC-NF-xxx). 실제 테스트 파일은 아직 작성되지 않았으며, ID만 사전 배정된 상태다. `EXCLUDED` 행은 `N/A` |
| **Status** | 현재 실행 상태. `NOT_STARTED`(코드 미착수, `src/app`은 스캐폴드 상태) 또는 `N/A`(EXCLUDED라 실행 대상 아님) |

> 이 문서의 어떤 행도 `Status=DONE`을 기록하지 않는다. 실제 코드 구현이 착수되지 않았기 때문이다(허위 완료 기록 금지).

---

## F1. Destination Guide

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-001 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-001 | NOT_STARTED |
| REQ-FUNC-002 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-002 | NOT_STARTED |
| REQ-FUNC-003 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-003 | NOT_STARTED |
| REQ-FUNC-004 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-004 | NOT_STARTED |
| REQ-FUNC-005 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-005 | NOT_STARTED |
| REQ-FUNC-006 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-006 | NOT_STARTED |
| REQ-FUNC-007 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-007 | NOT_STARTED |
| REQ-FUNC-008 | PLANNED | N/A | N/A | N/A | PENDING_TASK_GENERATION | TC-FUNC-008 | NOT_STARTED |
| REQ-FUNC-009 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-009 | NOT_STARTED |
| REQ-FUNC-010 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-010 | NOT_STARTED |

## F2. Flight Link-out

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-011 | PLANNED | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-011 | NOT_STARTED |
| REQ-FUNC-012 | PLANNED | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-012 | NOT_STARTED |
| REQ-FUNC-013 | PLANNED | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-013 | NOT_STARTED |
| REQ-FUNC-014 | PLANNED | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-014 | NOT_STARTED |
| REQ-FUNC-015 | PLANNED | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-015 | NOT_STARTED |
| REQ-FUNC-016 | PLANNED | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-016 | NOT_STARTED |
| REQ-FUNC-017 | PLANNED | N/A | N/A | N/A | PENDING_TASK_GENERATION | TC-FUNC-017 | NOT_STARTED |
| REQ-FUNC-018 | PLANNED | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-018 | NOT_STARTED |

## F3. Hotel Link-out

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-019 | PLANNED | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-019 | NOT_STARTED |
| REQ-FUNC-020 | PLANNED | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-020 | NOT_STARTED |
| REQ-FUNC-021 | PLANNED | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-021 | NOT_STARTED |
| REQ-FUNC-022 | PLANNED | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-022 | NOT_STARTED |
| REQ-FUNC-023 | PLANNED | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-023 | NOT_STARTED |
| REQ-FUNC-024 | PLANNED | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-024 | NOT_STARTED |
| REQ-FUNC-025 | PLANNED | N/A | N/A | N/A | PENDING_TASK_GENERATION | TC-FUNC-025 | NOT_STARTED |
| REQ-FUNC-026 | PLANNED | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-026 | NOT_STARTED |

## F4. Travel Mate

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-027 | PLANNED | SCR-003 / SCR-005 | `/travel-tools` ; `/account` | `src/app/travel-tools/page.tsx` ; `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-027 | NOT_STARTED |
| REQ-FUNC-028 | PLANNED | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-028 | NOT_STARTED |
| REQ-FUNC-029 | PLANNED | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-029 | NOT_STARTED |
| REQ-FUNC-030 | PLANNED | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-030 | NOT_STARTED |
| REQ-FUNC-031 | PLANNED | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-031 | NOT_STARTED |
| REQ-FUNC-032 | PLANNED | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-032 | NOT_STARTED |
| REQ-FUNC-033 | PLANNED | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-033 | NOT_STARTED |
| REQ-FUNC-034 | PLANNED | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-034 | NOT_STARTED |
| REQ-FUNC-035 | PLANNED | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-035 | NOT_STARTED |
| REQ-FUNC-036 | PLANNED | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-036 | NOT_STARTED |
| REQ-FUNC-037 | PLANNED | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-037 | NOT_STARTED |
| REQ-FUNC-038 | PLANNED | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-038 | NOT_STARTED |
| REQ-FUNC-039 | PLANNED | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-039 | NOT_STARTED |
| REQ-FUNC-040 | PLANNED | SCR-004 / SCR-005 | `/mates` ; `/account` | `src/app/mates/page.tsx` ; `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-040 | NOT_STARTED |
| REQ-FUNC-041 | PLANNED | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-041 | NOT_STARTED |
| REQ-FUNC-042 | PLANNED | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-042 | NOT_STARTED |
| REQ-FUNC-043 | PLANNED | SCR-004 / SCR-005 | `/mates` ; `/account` | `src/app/mates/page.tsx` ; `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-043 | NOT_STARTED |
| REQ-FUNC-044 | PLANNED | N/A | N/A | N/A | PENDING_TASK_GENERATION | TC-FUNC-044 | NOT_STARTED |
| REQ-FUNC-045 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |

## F5. Country Safety

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-046 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-046 | NOT_STARTED |
| REQ-FUNC-047 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-047 | NOT_STARTED |
| REQ-FUNC-048 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-048 | NOT_STARTED |
| REQ-FUNC-049 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-049 | NOT_STARTED |
| REQ-FUNC-050 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-050 | NOT_STARTED |
| REQ-FUNC-051 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-051 | NOT_STARTED |
| REQ-FUNC-052 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-052 | NOT_STARTED |
| REQ-FUNC-053 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-053 | NOT_STARTED |
| REQ-FUNC-054 | PLANNED | SCR-001 / SCR-003 | `/` ; `/travel-tools` | `src/app/page.tsx` ; `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-054 | NOT_STARTED |
| REQ-FUNC-055 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-FUNC-056 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |

## F6. About free_traveler

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-057 | PLANNED | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-057 | NOT_STARTED |
| REQ-FUNC-058 | PLANNED | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-058 | NOT_STARTED |
| REQ-FUNC-059 | PLANNED | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-059 | NOT_STARTED |
| REQ-FUNC-060 | PLANNED | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-060 | NOT_STARTED |
| REQ-FUNC-061 | PLANNED | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-061 | NOT_STARTED |
| REQ-FUNC-062 | PLANNED | SCR-002 / SCR-005 | `/about` ; `/account` | `src/app/about/page.tsx` ; `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-062 | NOT_STARTED |
| REQ-FUNC-063 | PLANNED | SCR-002 | `/about` | `src/app/about/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-063 | NOT_STARTED |

## F7. Common, Admin, Governance

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-FUNC-064 | PLANNED | 전역 | 전역(모든 Route 공통) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-FUNC-064 | NOT_STARTED |
| REQ-FUNC-065 | PLANNED | 전역 | 전역(모든 Route 공통) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-FUNC-065 | NOT_STARTED |
| REQ-FUNC-066 | PLANNED | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-066 | NOT_STARTED |
| REQ-FUNC-067 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-067 | NOT_STARTED |
| REQ-FUNC-068 | PLANNED | SCR-001 / SCR-005 | `/` ; `/account` | `src/app/page.tsx` ; `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-068 | NOT_STARTED |
| REQ-FUNC-069 | PLANNED | SCR-001 / SCR-004 | `/` ; `/mates` | `src/app/page.tsx` ; `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-069 | NOT_STARTED |
| REQ-FUNC-070 | PLANNED | N/A | N/A | N/A | PENDING_TASK_GENERATION | TC-FUNC-070 | NOT_STARTED |
| REQ-FUNC-071 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-FUNC-072 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-FUNC-073 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-FUNC-074 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-FUNC-075 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-FUNC-076 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-FUNC-077 | PLANNED | SCR-005 | `/account` | `src/app/account/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-077 | NOT_STARTED |
| REQ-FUNC-078 | PLANNED | 기술 Route | 기술 Route | `src/app/not-found.tsx` ; `src/app/error.tsx` | PENDING_TASK_GENERATION | TC-FUNC-078 | NOT_STARTED |
| REQ-FUNC-079 | PLANNED | 전역 | 전역(모든 Route 공통) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-FUNC-079 | NOT_STARTED |
| REQ-FUNC-080 | PLANNED | SCR-003 | `/travel-tools` | `src/app/travel-tools/page.tsx` | PENDING_TASK_GENERATION | TC-FUNC-080 | NOT_STARTED |

## NF — Performance

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-001 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-NF-002 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-NF-003 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-NF-004 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-NF-005 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-NF-006 | PLANNED | 전역 | 전역(모든 Route 공통) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-NF-006 | NOT_STARTED |
| REQ-NF-007 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |

## NF — Reliability and Recovery

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-008 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-NF-009 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-NF-010 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-NF-011 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |

## NF — Security and Privacy

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-012 | PLANNED | N/A | N/A | N/A | PENDING_TASK_GENERATION | TC-NF-012 | NOT_STARTED |
| REQ-NF-013 | PLANNED | N/A | N/A | N/A | PENDING_TASK_GENERATION | TC-NF-013 | NOT_STARTED |
| REQ-NF-014 | PLANNED | N/A | N/A | N/A | PENDING_TASK_GENERATION | TC-NF-014 | NOT_STARTED |
| REQ-NF-015 | PLANNED | N/A | N/A | N/A | PENDING_TASK_GENERATION | TC-NF-015 | NOT_STARTED |
| REQ-NF-016 | PLANNED | N/A | N/A | N/A | PENDING_TASK_GENERATION | TC-NF-016 | NOT_STARTED |
| REQ-NF-017 | PLANNED | N/A | N/A | N/A | PENDING_TASK_GENERATION | TC-NF-017 | NOT_STARTED |
| REQ-NF-018 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |

## NF — Safety and Moderation

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-019 | PLANNED | SCR-004 | `/mates` | `src/app/mates/page.tsx` | PENDING_TASK_GENERATION | TC-NF-019 | NOT_STARTED |
| REQ-NF-020 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-NF-021 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-NF-022 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |

## NF — Accessibility

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-023 | PLANNED | 전역 | 전역(모든 Route 공통) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-NF-023 | NOT_STARTED |
| REQ-NF-024 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-NF-025 | PLANNED | 전역 | 전역(모든 Route 공통) | `src/app/layout.tsx` | PENDING_TASK_GENERATION | TC-NF-025 | NOT_STARTED |

## NF — Content, Freshness, SEO, Copyright

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-026 | PLANNED | N/A | N/A | N/A | PENDING_TASK_GENERATION | TC-NF-026 | NOT_STARTED |
| REQ-NF-027 | PLANNED | N/A | N/A | N/A | PENDING_TASK_GENERATION | TC-NF-027 | NOT_STARTED |
| REQ-NF-028 | PLANNED | SCR-001 | `/` | `src/app/page.tsx` | PENDING_TASK_GENERATION | TC-NF-028 | NOT_STARTED |
| REQ-NF-029 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-NF-030 | PLANNED | N/A | N/A | N/A | PENDING_TASK_GENERATION | TC-NF-030 | NOT_STARTED |

## NF — Maintainability, Monitoring, Cost

| Requirement | Implementation Status | Screen | Route | Page Entry | Task | Test | Status |
|---|---|---|---|---|---|---|---|
| REQ-NF-031 | PLANNED | N/A | N/A | N/A | PENDING_TASK_GENERATION | TC-NF-031 | NOT_STARTED |
| REQ-NF-032 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-NF-033 | EXCLUDED | N/A | N/A | N/A | N/A | N/A | N/A |
| REQ-NF-034 | PLANNED | N/A | N/A | N/A | PENDING_TASK_GENERATION | TC-NF-034 | NOT_STARTED |

---

## 집계

| 구분 | 건수 |
|---|---:|
| Requirement 총계(삭제 없음) | 114 |
| Implementation Status = PLANNED | 87 |
| Implementation Status = EXCLUDED | 27 |
| Task = PENDING_TASK_GENERATION | 87(PLANNED 행과 동일 건수) |
| Task = N/A(EXCLUDED) | 27 |
| Status = NOT_STARTED | 87 |
| Status = N/A(EXCLUDED) | 27 |
| Status = DONE | **0**(코드 구현 미착수, 허위 완료 기록 없음) |
