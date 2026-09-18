import { test, expect } from "@playwright/test";

/**
 * 공개(비로그인) Chromium Smoke — E2E-001~005.
 *
 * 범위 밖(하지 않는 것):
 * - 외부 사이트(항공/숙소 링크 대상)로 실제 이동해 그 페이지 내용을 검사하지 않는다.
 *   새 탭 열림 여부 + href/rel 속성만 확인한다(design-reference/UI_CONTRACT.md
 *   §3 "항공/숙소 탭 '보러 가기' → 외부 사이트, 앱 내 화면 전환 아님").
 * - 이미지 src의 실제 HTTP 응답 상태(200/404 등)는 검사하지 않는다.
 * - 버튼 클릭 후에는 확인 Dialog 또는 안내 문구 + href만 본다(더 깊은 흐름은
 *   auth-smoke.spec.ts나 향후 Task 몫이다).
 *
 * Selector 우선순위: role/label > test id > (텍스트·CSS 구조는 쓰지 않는다).
 * 아래 getByTestId 셀렉터들은 이 테스트가 정의하는 계약이다 — 실제 구현(Wave
 * W04~W07)이 해당 data-testid를 붙여야 통과한다(TDD: 테스트가 먼저 실패한다).
 */

test.describe("E2E-001 메인 페이지 — 추천 여행지와 주요 CTA", () => {
  test("추천 여행지 카드와 '여행 준비 시작하기' CTA가 보인다", async ({
    page,
  }) => {
    await page.goto("/");

    // 국내/해외 여행지 Card Grid(design-reference/UI_CONTRACT.md §1 영역 3) — 8개 이상.
    const destinationCards = page.getByTestId("destination-card");
    await expect(destinationCards.first()).toBeVisible();
    expect(await destinationCards.count()).toBeGreaterThanOrEqual(8);

    // CTA Banner("여행 준비 시작하기") → SCR-003(/travel-tools)으로 연결.
    const ctaLink = page.getByRole("link", { name: "여행 준비 시작하기" });
    await expect(ctaLink).toBeVisible();
    await expect(ctaLink).toHaveAttribute("href", "/travel-tools");
  });
});

test.describe("E2E-002 대표 소개 — free_traveler, 50+ Trips, 30+ Countries", () => {
  test("대표 프로필 핵심 수치가 정확히 표시된다", async ({ page }) => {
    await page.goto("/about");

    // REQ-FUNC-057: 대표명 free_traveler, 50+ Trips, 30+ Countries.
    await expect(page.getByTestId("about-hero-stats")).toContainText(
      "free_traveler",
    );
    await expect(page.getByTestId("about-hero-stats")).toContainText(
      "50+ Trips",
    );
    await expect(page.getByTestId("about-hero-stats")).toContainText(
      "30+ Countries",
    );
  });
});

test.describe("E2E-003 여행 도구 — 항공 외부 이동 안내와 href", () => {
  test("항공 탭에서 비전달 고지와 외부이동 링크 속성을 확인한다", async ({
    page,
  }) => {
    await page.goto("/travel-tools");

    await page.getByRole("tab", { name: "항공" }).click();

    // REQ-FUNC-015: 폼과 요약에 "입력값은 외부 사이트로 전달되지 않습니다" 고지.
    await expect(page.getByTestId("flight-form")).toContainText(
      "입력값은 외부 사이트로 전달되지 않습니다",
    );

    // REQ-FUNC-016: 외부 이동은 새 탭(target=_blank) + noopener noreferrer.
    // 실제 외부 사이트로 이동하거나 그 응답을 검사하지 않는다 — 속성만 확인한다.
    const externalLink = page.getByTestId("flight-external-link");
    await expect(externalLink).toHaveAttribute("target", "_blank");
    const rel = await externalLink.getAttribute("rel");
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
    await expect(externalLink).toHaveAttribute("href", /^https?:\/\//);
  });
});

test.describe("E2E-004 여행 도구 — 숙소 외부 이동 안내와 href", () => {
  test("숙소 탭에서 비전달 고지와 외부이동 링크 속성을 확인한다", async ({
    page,
  }) => {
    await page.goto("/travel-tools");

    await page.getByRole("tab", { name: "숙소" }).click();

    // REQ-FUNC-023: 폼과 요약에 입력값 비전달 안내.
    await expect(page.getByTestId("hotel-form")).toContainText(
      "입력값은 외부 사이트로 전달되지 않습니다",
    );

    // REQ-FUNC-024: 새 탭 + noopener noreferrer.
    const externalLink = page.getByTestId("hotel-external-link");
    await expect(externalLink).toHaveAttribute("target", "_blank");
    const rel = await externalLink.getAttribute("rel");
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
    await expect(externalLink).toHaveAttribute("href", /^https?:\/\//);
  });
});

test.describe("E2E-005 비로그인 동행글 작성 — 로그인 안내", () => {
  test("동행 글쓰기 탭에 비로그인 상태로 진입하면 로그인 안내가 보인다", async ({
    page,
  }) => {
    await page.goto("/travel-tools");

    await page.getByRole("tab", { name: "동행 글쓰기" }).click();

    // design-reference/UI_CONTRACT.md §3: "동행 글쓰기 탭에서 비로그인 → SCR-005(로그인 유도)".
    // 실제 이동 여부가 아니라, 이 탭 안에서 보이는 로그인 안내 문구 + 링크만 확인한다.
    const loginNotice = page.getByTestId("mate-write-login-notice");
    await expect(loginNotice).toBeVisible();
    await expect(loginNotice).toContainText("로그인");

    // 헤더·푸터에도 로그인 링크가 있으므로 안내 영역 안의 링크로 좁힌다.
    const loginLink = loginNotice.getByRole("link", { name: /로그인/ });
    await expect(loginLink).toHaveAttribute("href", "/account");
  });
});
