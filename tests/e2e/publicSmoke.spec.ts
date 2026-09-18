import { test, expect } from "@playwright/test";

/**
 * E2E-PUBLIC-SMOKE — 비로그인 핵심 흐름 Chromium Smoke(키보드 탐색 포함).
 * 홈 로드 → 여행지 상세 Drawer → 안전정보 탭 전환, 대표 소개 로드, 동행 목록 로드.
 *
 * 동행 목록은 /api/mates를 page.route로 고정한다 — CI에는 Supabase 접속 정보가
 * 없고, 이 Smoke는 DB가 아니라 화면 조립(목록·상세·로그인 안내)을 검증한다.
 * 실제 DB 연동은 E2E-MATE-AUTH(tests/e2e/mateAuth.spec.ts)가 맡는다.
 *
 * Selector 우선순위: role/label > test id.
 */

const SAMPLE_POST = {
  id: "e2e-post-1",
  author_id: "e2e-author-1",
  title: "오사카 미식 여행 같이 가실 분",
  country: "일본",
  region: "오사카",
  start_date: "2099-11-01",
  end_date: "2099-11-04",
  capacity: 2,
  preferred_conditions: "평일 일정 가능하신 분",
  travel_style: ["미식", "도심"],
  description: "다코야키부터 스시까지 먹으러 다닐 계획입니다.",
  safety_agreement_consented_at: "2099-01-01T00:00:00Z",
  status: "RECRUITING",
  closed_manually_at: null,
  created_at: "2099-01-01T00:00:00Z",
  updated_at: "2099-01-01T00:00:00Z",
  effectiveStatus: "RECRUITING",
};

test.describe("홈 → 여행지 상세 Drawer → 안전정보 탭", () => {
  test("마우스로 상세를 열고 안전정보 탭으로 전환한다", async ({ page }) => {
    await page.goto("/");
    const cards = page.getByTestId("destination-card");
    expect(await cards.count()).toBeGreaterThanOrEqual(8);

    await cards.first().click();
    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();

    await drawer.getByRole("tab", { name: "안전정보" }).click();
    await expect(drawer.getByRole("tab", { name: "안전정보" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    // REQ-FUNC-054: 안전정보는 공식 판단을 대체하지 않는다는 고지.
    await expect(drawer).toContainText("공식");

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
  });

  test("키보드만으로 상세를 열고 탭을 전환·닫는다", async ({ page }) => {
    await page.goto("/");
    const firstCard = page.getByTestId("destination-card").first();
    await firstCard.focus();
    await page.keyboard.press("Enter");

    const drawer = page.getByRole("dialog");
    await expect(drawer).toBeVisible();
    // 포커스가 Drawer 안으로 이동한다(포커스 트랩).
    await expect
      .poll(() =>
        page.evaluate(() =>
          Boolean(document.activeElement?.closest("[role='dialog']")),
        ),
      )
      .toBe(true);

    await drawer.getByRole("tab", { name: "상세정보" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(drawer.getByRole("tab", { name: "안전정보" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();
  });
});

test.describe("대표 소개", () => {
  test("대표 소개 핵심 영역이 로드된다", async ({ page }) => {
    await page.goto("/about");
    const hero = page.getByTestId("about-hero-stats");
    await expect(hero).toContainText("free_traveler");
    await expect(hero).toContainText("50+ Trips");
    await expect(hero).toContainText("30+ Countries");
    expect(await page.getByTestId("destination-card").count()).toBe(6);
  });
});

test.describe("동행 목록(비로그인)", () => {
  test("목록과 상세를 보고, 참가 요청 시 로그인 안내를 받는다", async ({
    page,
  }) => {
    await page.route("**/api/mates", (route) =>
      route.fulfill({ json: { posts: [SAMPLE_POST] } }),
    );
    await page.goto("/mates");

    await expect(page.getByTestId("mate-result-summary")).toHaveText(
      "동행글 1개",
    );
    const card = page.getByTestId("mate-card").first();
    await expect(card).toContainText(SAMPLE_POST.title);

    // 키보드로 카드를 열어 상세를 본다.
    await card.focus();
    await page.keyboard.press("Enter");
    const detail = page.getByTestId("mate-detail-panel");
    await expect(detail).toContainText(SAMPLE_POST.description);
    await expect(detail.getByTestId("mate-apply-login-notice")).toBeVisible();
  });

  test("목록을 불러오지 못하면 오류와 다시 시도를 보여준다", async ({
    page,
  }) => {
    await page.route("**/api/mates", (route) =>
      route.fulfill({ status: 500, json: { error: "db down" } }),
    );
    await page.goto("/mates");
    await expect(
      page.getByRole("alert").filter({ hasText: "불러오지 못했습니다" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "다시 시도" })).toBeVisible();
  });
});
