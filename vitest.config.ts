import { defineConfig } from "vitest/config";

// Unit Test 정본: src 안의 *.test.ts(x)/*.spec.ts(x)와 tests/unit만 수집한다.
// tests/e2e는 Playwright 전용이라 여기서 절대 검색하지 않는다(CLAUDE.md 규칙 18 —
// Playwright는 핵심 Chromium Smoke Task로만 범위를 제한한다).
export default defineConfig({
  test: {
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "tests/unit/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    // 아직 Unit Test 파일이 없는 단계(W01~W12 Task 미착수)에서는 0건을
    // 실패로 취급하지 않는다. UNIT-*/TEST-RLS-BASIC Task가 실제 테스트
    // 파일을 만들면 자연히 이 옵션과 무관하게 정상 채점된다.
    passWithNoTests: true,
  },
});
