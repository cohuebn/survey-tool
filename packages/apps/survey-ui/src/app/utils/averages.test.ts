import { mean } from "./averages";

describe("mean", () => {
  it("should handle an empty list", () => {
    expect(mean([])).toBe(0);
  });

  it("should handle a list of one item", () => {
    expect(mean([12])).toBe(12);
  });

  it("should handle an even number of items", () => {
    expect(mean([12, 14])).toBe(13);
  });

  it("should handle an odd number of items", () => {
    expect(mean([12, 14, 16])).toBe(14);
  });

  it("should handle decimals", () => {
    expect(mean([12.5, 14, 17.9])).toBeCloseTo(14.8);
  });
});
