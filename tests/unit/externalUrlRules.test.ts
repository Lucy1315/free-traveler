import { describe, expect, it } from "vitest";
import {
  CONTACT_LINK_CATEGORIES,
  EXTERNAL_URL_CATEGORIES,
  isAllowedExternalUrl,
} from "@/lib/db/queries";

describe("isAllowedExternalUrl", () => {
  it("모든 category에서 https 주소를 허용한다", () => {
    for (const category of EXTERNAL_URL_CATEGORIES) {
      expect(isAllowedExternalUrl(category, "https://example.com")).toBe(true);
    }
  });

  it("문의(contact)만 mailto를 허용한다", () => {
    expect(isAllowedExternalUrl("contact", "mailto:hi@example.com")).toBe(true);
    expect(isAllowedExternalUrl("instagram", "mailto:hi@example.com")).toBe(
      false,
    );
    expect(isAllowedExternalUrl("flight", "mailto:hi@example.com")).toBe(false);
  });

  it("http·javascript 등 그 밖의 프로토콜은 막는다", () => {
    expect(isAllowedExternalUrl("contact", "http://example.com")).toBe(false);
    expect(isAllowedExternalUrl("blog", "javascript:alert(1)")).toBe(false);
    expect(isAllowedExternalUrl("hotel", "")).toBe(false);
  });

  it("문의·SNS category는 항공·숙소 category와 겹치지 않는다", () => {
    expect(CONTACT_LINK_CATEGORIES).not.toContain("flight");
    expect(CONTACT_LINK_CATEGORIES).not.toContain("hotel");
  });
});
