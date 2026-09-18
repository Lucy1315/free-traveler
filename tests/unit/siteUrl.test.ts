import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl } from "@/lib/seo";

describe("getSiteUrl", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("NEXT_PUBLIC_SITE_URL을 가장 먼저 쓴다", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.kr");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "app.vercel.app");
    expect(getSiteUrl()).toBe("https://example.kr");
  });

  it("직접 지정이 없으면 Vercel 프로덕션 도메인에 https를 붙여 쓴다", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "app.vercel.app");
    expect(getSiteUrl()).toBe("https://app.vercel.app");
  });

  it("둘 다 없으면 로컬 주소를 쓰고, 남의 도메인을 기본값으로 쓰지 않는다", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    expect(getSiteUrl()).toBe("http://localhost:3000");
    expect(getSiteUrl()).not.toContain("free-traveler.vercel.app");
  });
});
