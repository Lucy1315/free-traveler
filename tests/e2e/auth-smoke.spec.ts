import { test, expect, type Page } from "@playwright/test";

/**
 * 인증 필요 Chromium Smoke — E2E-006~007 골격.
 *
 * 로그인 테스트 계정 환경변수(E2E_TEST_USER_EMAIL / E2E_TEST_USER_PASSWORD)가
 * 없으면 이 파일 전체를 명시적으로 skip한다 — 값 없이 실행해서 애매하게
 * 실패시키지 않는다(package.json/README 등 다른 문서에 이 두 이름의 선례가
 * 없어 이번에 새로 도입했다 — Supabase 프로젝트 준비 후 실제 테스트 계정을
 * 만들 때 이 이름을 따르거나, 다르게 정했다면 이 파일을 맞춰 고친다).
 *
 * Selector 우선순위: role/label > test id > (텍스트·CSS 구조는 쓰지 않는다).
 * 아래 getByTestId 셀렉터들은 이 테스트가 정의하는 계약이다 — 실제 구현
 * (Wave W03 Auth + W07~W09 Component)이 해당 data-testid를 붙여야 통과한다.
 */

const TEST_USER_EMAIL = process.env.E2E_TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.E2E_TEST_USER_PASSWORD;
const hasAuthEnv = Boolean(TEST_USER_EMAIL && TEST_USER_PASSWORD);

test.skip(
  !hasAuthEnv,
  "E2E_TEST_USER_EMAIL / E2E_TEST_USER_PASSWORD가 없어 인증 Smoke를 건너뜁니다(Supabase 테스트 계정 미준비).",
);

async function login(page: Page): Promise<void> {
  await page.goto("/account");
  await page.getByLabel("이메일").fill(TEST_USER_EMAIL as string);
  await page.getByLabel("비밀번호").fill(TEST_USER_PASSWORD as string);
  await page.getByRole("button", { name: "로그인" }).click();
  // 로그인 성공 시 Member 탭(좌측 세로 탭, design-reference/UI_CONTRACT.md §5)이 보인다.
  await expect(page.getByRole("tab", { name: "프로필" })).toBeVisible();
}

test.describe("E2E-006 로그인 사용자 — 동행글 작성과 목록·상세 확인", () => {
  test("동행글을 작성하면 목록·상세에서 확인된다", async ({ page }) => {
    await login(page);

    await page.goto("/travel-tools");
    await page.getByRole("tab", { name: "동행 글쓰기" }).click();

    const writeForm = page.getByTestId("mate-write-form");
    await expect(writeForm).toBeVisible();

    // REQ-FUNC-031: 제목·국가·지역·시작일·종료일·모집 인원·선호 조건·여행
    // 스타일·상세 설명·안전수칙 동의. 구체적인 값 세팅은 실제 Form 구현이
    // 확정된 뒤(Wave W07) 채운다 — 지금은 제출 흐름의 골격만 표시한다.
    await page.getByTestId("mate-write-submit").click();

    // REQ-FUNC-043 방식 변경: 제출 성공은 Toast로 안내한다(이메일 미발송).
    await expect(page.getByRole("status")).toContainText("등록");

    // 작성 완료 → SCR-004(해당 모집글 상세) 또는 목록에서 확인 가능해야 한다.
    await page.goto("/mates");
    const myPostCard = page.getByTestId("mate-card").first();
    await expect(myPostCard).toBeVisible();
    await myPostCard.click();
    await expect(page.getByTestId("mate-detail-panel")).toBeVisible();
  });
});

test.describe("E2E-007 동행글 신청과 계정 화면 — 내 활동 확인", () => {
  test("참가 신청 후 계정의 내 활동에서 확인된다", async ({ page }) => {
    await login(page);

    await page.goto("/mates");
    const targetCard = page.getByTestId("mate-card").first();
    await targetCard.click();

    await page
      .getByTestId("participation-request-message")
      .fill("E2E-007 스모크 테스트 참가 신청입니다.");
    await page.getByRole("button", { name: "참가 요청 보내기" }).click();

    // REQ-FUNC-034 접수 즉시 표시 — 확인 Dialog 대신 인라인 안내 문구로 나타난다.
    await expect(
      page.getByTestId("participation-request-status"),
    ).toContainText("PENDING");

    // 계정 화면 "참가 요청" 탭에서도 같은 신청이 보여야 한다(design-reference/
    // UI_CONTRACT.md §5 Member 5개 탭 중 "참가 요청").
    await page.goto("/account");
    await page.getByRole("tab", { name: "참가 요청" }).click();
    await expect(page.getByTestId("participation-request-list")).toContainText(
      "PENDING",
    );
  });
});
