import { describe, expect, it } from "vitest";
import { calculateScore } from "@/data/scoring";

describe("评分规则", () => {
  it("完整且无安全错误时通过", () => {
    const result = calculateScore(15, 15, 0);
    expect(result.total).toBe(100);
    expect(result.passed).toBe(true);
  });

  it("安全错误独立扣分并可能导致不通过", () => {
    const result = calculateScore(15, 15, 3);
    expect(result.safety).toBe(6);
    expect(result.passed).toBe(false);
  });
});
