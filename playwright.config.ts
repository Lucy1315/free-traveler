import { defineConfig, devices } from "@playwright/test";

const DEFAULT_BASE_URL = "http://127.0.0.1:3000";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? DEFAULT_BASE_URL;
// PLAYWRIGHT_BASE_URL이 설정되면(Vercel Preview URL 등 원격 대상) 로컬 dev 서버를
// 새로 띄우지 않는다 — 그 URL이 이미 떠 있는 서버를 가리킨다고 본다.
const usingRemoteBaseURL = Boolean(process.env.PLAYWRIGHT_BASE_URL);

// CLAUDE.md 규칙 18 / SKILL.md §9 — Playwright는 핵심 Chromium Smoke만 쓴다.
// Firefox·WebKit 등 다른 브라우저 엔진 프로젝트를 추가하지 않는다.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: usingRemoteBaseURL
    ? undefined
    : {
        command: "npm run dev",
        url: DEFAULT_BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
