import { test, expect, type Browser, type Page } from "@playwright/test";

/**
 * E2E-MATE-AUTH — 로그인이 필요한 동행 전체 흐름(Chromium).
 * 작성자 로그인 → 모집글 작성 → 신청자 로그인 → 상세(연락처 미노출) → 참가 요청
 * → 신고 접수 → 작성자 차단/해제 → 작성자가 계정 화면에서 요청 승인
 * → 신청자 계정 화면에서 ACCEPTED 확인.
 *
 * 실제 Supabase(마이그레이션 0001~0004 적용)와 테스트 계정 2개가 필요하다.
 * 두 계정 모두 이메일 인증을 마치고 프로필(닉네임·연령대)과 만 19세 이상 확인을
 * 끝낸 상태여야 한다. 환경변수가 없으면 이 파일 전체를 명시적으로 건너뛴다.
 *   E2E_AUTHOR_EMAIL / E2E_AUTHOR_PASSWORD       — 모집글 작성자
 *   E2E_TEST_USER_EMAIL / E2E_TEST_USER_PASSWORD — 참가 신청자
 * 실행: PLAYWRIGHT_BASE_URL=<Preview URL> npx playwright test tests/e2e/mateAuth.spec.ts
 */

const AUTHOR = {
  email: process.env.E2E_AUTHOR_EMAIL,
  password: process.env.E2E_AUTHOR_PASSWORD,
};
const APPLICANT = {
  email: process.env.E2E_TEST_USER_EMAIL,
  password: process.env.E2E_TEST_USER_PASSWORD,
};
const hasEnv = Boolean(
  AUTHOR.email && AUTHOR.password && APPLICANT.email && APPLICANT.password,
);

test.skip(
  !hasEnv,
  "E2E_AUTHOR_* / E2E_TEST_USER_* 계정 환경변수가 없어 인증 흐름을 건너뜁니다(Supabase 테스트 계정 미준비).",
);

// 한 흐름 안에서 순서가 중요하므로 직렬로 실행한다.
test.describe.configure({ mode: "serial" });

function isoDateAfter(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

const RUN_ID = Date.now().toString(36);
const POST_TITLE = `E2E 동행 모집 ${RUN_ID}`;
const POST_DESCRIPTION = `E2E 자동 테스트용 모집글입니다(${RUN_ID}). 일정을 함께 정해요.`;

async function signIn(
  browser: Browser,
  account: { email?: string; password?: string },
): Promise<Page> {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("/account");
  await page.getByLabel("이메일").fill(account.email as string);
  await page.getByLabel("비밀번호").fill(account.password as string);
  await page.getByRole("button", { name: "로그인" }).click();
  await expect(page.getByRole("tab", { name: "프로필" })).toBeVisible();
  return page;
}

let postUrl = "";

test("작성자가 모집글을 작성한다", async ({ browser }) => {
  const page = await signIn(browser, AUTHOR);
  await page.goto("/travel-tools");
  await page.getByRole("tab", { name: "동행 글쓰기" }).click();

  const form = page.getByTestId("mate-write-form");
  await expect(form).toBeVisible();
  await form.getByLabel("제목").fill(POST_TITLE);
  await form.getByLabel("국가").selectOption("일본");
  await form.getByLabel("지역·도시").selectOption("오사카");
  await form.getByLabel("시작일").fill(isoDateAfter(40));
  await form.getByLabel("종료일").fill(isoDateAfter(43));
  await form.getByLabel("모집 인원(명)").fill("2");
  await form
    .getByRole("group", { name: "여행 스타일" })
    .getByRole("button", { name: "미식" })
    .click();
  await form.getByLabel("상세 설명").fill(POST_DESCRIPTION);
  await form.getByLabel(/동행 안전수칙을 확인했으며/).check();
  await page.getByTestId("mate-write-submit").click();

  const link = page.getByRole("link", { name: "등록한 모집글 보기" });
  await expect(link).toBeVisible();
  postUrl = (await link.getAttribute("href")) as string;
  expect(postUrl).toMatch(/^\/mates\?postId=/);
  await page.context().close();
});

test("신청자가 상세를 보고 참가 요청·신고·차단/해제를 한다", async ({
  browser,
}) => {
  const page = await signIn(browser, APPLICANT);
  await page.goto(postUrl);

  const detail = page.getByTestId("mate-detail-panel");
  await expect(detail).toContainText(POST_TITLE);
  // REQ-FUNC-033: 작성자 이메일은 어디에도 보이지 않는다.
  await expect(page.locator("body")).not.toContainText(AUTHOR.email as string);

  await detail
    .getByTestId("participation-request-message")
    .fill("E2E 참가 요청입니다. 일정이 맞아 함께하고 싶어요.");
  await detail.getByRole("button", { name: "참가 요청 보내기" }).click();
  await expect(
    detail.getByTestId("participation-request-status"),
  ).toContainText("PENDING");

  // 신고 접수(REQ-FUNC-039, REQ-NF-019): 접수번호 Toast.
  await detail.getByRole("button", { name: "신고" }).click();
  await detail.getByLabel("신고 사유").selectOption("OTHER");
  await detail.getByLabel("설명(선택)").fill("E2E 신고 접수 확인용입니다.");
  await detail.getByRole("button", { name: "신고 접수" }).click();
  await expect(
    page.getByText(/신고가 접수되었습니다\. 접수번호/),
  ).toBeVisible();

  // 차단 → 목록에서 사라짐 → 계정 화면에서 해제(REQ-FUNC-040).
  await detail.getByRole("button", { name: "작성자 차단" }).click();
  await expect(page.getByText(/작성자를 차단했습니다/)).toBeVisible();
  await page.goto("/mates");
  await expect(
    page.getByTestId("mate-card").filter({ hasText: POST_TITLE }),
  ).toHaveCount(0);

  await page.goto("/account?tab=blocks");
  await page.getByRole("button", { name: "차단 해제" }).first().click();
  await page.goto("/mates");
  await expect(
    page.getByTestId("mate-card").filter({ hasText: POST_TITLE }),
  ).toHaveCount(1);
  await page.context().close();
});

test("작성자가 요청을 승인하고 신청자 화면에 ACCEPTED로 보인다", async ({
  browser,
}) => {
  const author = await signIn(browser, AUTHOR);
  await author.goto("/account?tab=posts");
  const item = author
    .getByTestId("my-post-item")
    .filter({ hasText: POST_TITLE });
  await item.getByRole("button", { name: "받은 참가 요청 보기" }).click();
  await item.getByRole("button", { name: "승인" }).click();
  await expect(item).toContainText("ACCEPTED");
  await author.context().close();

  const applicant = await signIn(browser, APPLICANT);
  await applicant.goto("/account?tab=applications");
  await expect(
    applicant.getByTestId("participation-request-list"),
  ).toContainText("ACCEPTED");
  await applicant.context().close();
});

test("작성자가 테스트 모집글을 마감·삭제해 정리한다", async ({ browser }) => {
  const page = await signIn(browser, AUTHOR);
  await page.goto("/account?tab=posts");
  const item = page.getByTestId("my-post-item").filter({ hasText: POST_TITLE });
  await item.getByRole("button", { name: "모집 마감" }).click();
  await expect(item).toContainText("마감");
  await item.getByRole("button", { name: "삭제", exact: true }).click();
  await item.getByRole("button", { name: "삭제 확인" }).click();
  await expect(
    page.getByTestId("my-post-item").filter({ hasText: POST_TITLE }),
  ).toHaveCount(0);
  await page.context().close();
});
