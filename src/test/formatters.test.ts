import { describe, it, expect } from "vitest";
import { formatMoney, formatMoneySplit, roundToNearest100, formatCalcDisplay } from "../utils/formatters";

describe("formatMoney", () => {
  it("formats a whole number with id-ID locale", () => {
    expect(formatMoney(100000)).toBe("100.000");
  });

  it("formats zero", () => {
    expect(formatMoney(0)).toBe("0");
  });

  it("formats a string number", () => {
    expect(formatMoney("50000")).toBe("50.000");
  });

  it("returns '0' for NaN", () => {
    expect(formatMoney("abc")).toBe("0");
  });

  it("returns '0' for Infinity", () => {
    expect(formatMoney(Infinity)).toBe("0");
  });

  it("handles decimal values without decimal display", () => {
    expect(formatMoney(1500.5)).toBe("1.501");
  });
});

describe("formatMoneySplit", () => {
  it("formats and removes decimal fraction", () => {
    expect(formatMoneySplit(33333.33)).toBe("33.333");
  });

  it("formats zero", () => {
    expect(formatMoneySplit(0)).toBe("0");
  });

  it("returns '0' for NaN", () => {
    expect(formatMoneySplit("xyz")).toBe("0");
  });

  it("formats large numbers", () => {
    expect(formatMoneySplit(1000000)).toBe("1.000.000");
  });
});

describe("roundToNearest100", () => {
  it("rounds up to nearest 100", () => {
    expect(roundToNearest100(12350)).toBe(12400);
  });

  it("rounds down to nearest 100", () => {
    expect(roundToNearest100(12349)).toBe(12300);
  });

  it("leaves exact multiples unchanged", () => {
    expect(roundToNearest100(12300)).toBe(12300);
  });

  it("rounds 50 up", () => {
    expect(roundToNearest100(50)).toBe(100);
  });

  it("rounds 0 to 0", () => {
    expect(roundToNearest100(0)).toBe(0);
  });

  it("rounds negative values", () => {
    expect(roundToNearest100(-150)).toBe(-200);
  });
});

describe("formatCalcDisplay", () => {
  it("returns '0' for empty string", () => {
    expect(formatCalcDisplay("")).toBe("0");
  });

  it("returns '0' for '0'", () => {
    expect(formatCalcDisplay("0")).toBe("0");
  });

  it("formats integer with thousands separator", () => {
    expect(formatCalcDisplay("1000000")).toBe("1,000,000");
  });

  it("preserves trailing decimal point", () => {
    expect(formatCalcDisplay("1000.")).toBe("1,000.");
  });

  it("preserves decimal digits", () => {
    expect(formatCalcDisplay("1000.5")).toBe("1,000.5");
  });

  it("handles small integers", () => {
    expect(formatCalcDisplay("42")).toBe("42");
  });
});
