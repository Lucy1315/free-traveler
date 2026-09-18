import { test, expect, type BrowserContext, type Page } from "@playwright/test";

/**
 * E2E-TRAVEL-TOOLS — SCR-003(/travel-tools) Chromium Smoke.
 * 항공: 입력 → 요약 → 외부 이동(새 탭), 숙소: 같은 흐름, 동행 글쓰기: 비로그인 안내.
 *
 * Security/Privacy(REQ-FUNC-017·025, REQ-NF-017, CLAUDE.md 규칙 12): 항공·숙소
 * 입력값이 어떤 네트워크 요청(URL·쿼리·본문)에도 실리지 않는지 확인한다.
 * 외부 사이트는 실제로 열지 않는다 — context.route로 빈 페이지를 돌려준다.
 */

function isoDateAfter(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

const START = isoDateAfter(30);
const END = isoDateAfter(34);
const COUNTRY = "일본";
const REGION = "오사카";

interface CapturedRequest {
  url: string;
  body: string;
}

// 외부 비교 사이트는 실제로 접속하지 않고 빈 문서로 대신한다.
async function stubExternalSites(context: BrowserContext) {
  await context.route(
    (url) => !["localhost", "127.0.0.1"].includes(url.hostname),
    (route) =>
      route.request().resourceType() === "document"
        ? route.fulfill({
            contentType: "text/html",
            body: "<title>ext</title>",
          })
        : route.abort(),
  );
}

function captureRequests(context: BrowserContext): CapturedRequest[] {
  const captured: CapturedRequest[] = [];
  context.on("request", (request) => {
    captured.push({
      url: decodeURIComponent(request.url()),
      body: request.postData() ?? "",
    });
  });
  return captured;
}

function expectNoRawInput(captured: CapturedRequest[]) {
  for (const value of [REGION, START, END]) {
    const leaked = captured.filter(
      (request) => request.url.includes(value) || request.body.includes(value),
    );
    expect(leaked, `입력값 "${value}"이 네트워크로 전송되면 안 된다`).toEqual(
      [],
    );
  }
}

async function openExternal(page: Page, testId: string) {
  const link = page.getByTestId(testId);
  await expect(link).not.toHaveAttribute("aria-disabled", "true");
  await expect(link).toHaveAttribute("target", "_blank");
  const rel = (await link.getAttribute("rel")) ?? "";
  expect(rel).toContain("noopener");
  expect(rel).toContain("noreferrer");
  // D-001 §19: 입력 조건을 쿼리 파라미터로 붙이지 않는다.
  const href = (await link.getAttribute("href")) ?? "";
  expect(href).toMatch(/^https:\/\//);
  expect(new URL(href).search).toBe("");

  const [popup] = await Promise.all([
    page.context().waitForEvent("page"),
    link.click(),
  ]);
  await popup.waitForLoadState();
  expect(popup.url()).toBe(href);
  // noopener: 새 탭에서 원래 창을 참조할 수 없다.
  expect(await popup.evaluate(() => window.opener)).toBeNull();
  await popup.close();
}

test.describe("항공 탭", () => {
  test("입력 → 요약 → 외부 이동(새 탭), 입력값 미전송", async ({
    page,
    context,
  }) => {
    await stubExternalSites(context);
    const captured = captureRequests(context);
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "항공" }).click();

    const form = page.getByTestId("flight-form");
    await expect(page.getByTestId("flight-external-link")).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    // 잘못된 입력: 귀국일이 출발일보다 빠르면 요약으로 넘어가지 않는다.
    await form.getByLabel("목적 국가").selectOption(COUNTRY);
    await form.getByLabel("지역·도시").selectOption(REGION);
    await form.getByLabel("출발일").fill(END);
    await form.getByLabel("귀국일").fill(START);
    await form.getByRole("button", { name: "조건 확인" }).click();
    await expect(
      page.getByRole("region", { name: "항공 조건 요약" }),
    ).toHaveCount(0);

    await form.getByLabel("출발일").fill(START);
    await form.getByLabel("귀국일").fill(END);
    await form.getByRole("button", { name: "조건 확인" }).click();
    const summary = page.getByRole("region", { name: "항공 조건 요약" });
    await expect(summary).toContainText(REGION);
    await expect(summary).toContainText(
      "입력값은 외부 사이트로 전달되지 않습니다",
    );

    await openExternal(page, "flight-external-link");
    expectNoRawInput(captured);
  });
});

test.describe("숙소 탭", () => {
  test("입력 → 요약 → 외부 이동(새 탭), 입력값 미전송", async ({
    page,
    context,
  }) => {
    await stubExternalSites(context);
    const captured = captureRequests(context);
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "숙소" }).click();

    const form = page.getByTestId("hotel-form");
    await form.getByLabel("숙박 국가").selectOption(COUNTRY);
    await form.getByLabel("지역·도시").selectOption(REGION);
    // 체크아웃이 체크인과 같으면 막힌다(REQ-FUNC-021).
    await form.getByLabel("체크인").fill(START);
    await form.getByLabel("체크아웃").fill(START);
    await form.getByRole("button", { name: "조건 확인" }).click();
    await expect(
      page.getByRole("region", { name: "숙소 조건 요약" }),
    ).toHaveCount(0);

    await form.getByLabel("체크아웃").fill(END);
    await form.getByRole("button", { name: "조건 확인" }).click();
    await expect(
      page.getByRole("region", { name: "숙소 조건 요약" }),
    ).toContainText(REGION);

    await openExternal(page, "hotel-external-link");
    expectNoRawInput(captured);
  });

  test("탭을 오가도 항공·숙소 입력 상태가 따로 유지된다", async ({ page }) => {
    await page.goto("/travel-tools");
    await page
      .getByTestId("flight-form")
      .getByLabel("목적 국가")
      .selectOption(COUNTRY);
    await page.getByRole("tab", { name: "숙소" }).click();
    await expect(
      page.getByTestId("hotel-form").getByLabel("숙박 국가"),
    ).toHaveValue("");
    await page.getByRole("tab", { name: "항공" }).click();
    await expect(
      page.getByTestId("flight-form").getByLabel("목적 국가"),
    ).toHaveValue(COUNTRY);
  });
});

test.describe("동행 글쓰기 탭", () => {
  test("비로그인으로 들어오면 로그인 안내와 /account 링크를 보여준다", async ({
    page,
  }) => {
    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "동행 글쓰기" }).click();
    const notice = page.getByTestId("mate-write-login-notice");
    await expect(notice).toBeVisible();
    await expect(
      notice.getByRole("link", { name: "로그인하러 가기" }),
    ).toHaveAttribute("href", "/account");
    await expect(page.getByTestId("mate-write-form")).toHaveCount(0);
  });
});
