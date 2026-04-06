import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useBillCalculator } from "../hooks/useBillCalculator";

describe("useBillCalculator", () => {
  it("returns memoized split result structure", () => {
    const { result } = renderHook(() =>
      useBillCalculator({
        items: [{ id: 1, name: "Meal", price: "100000", persons: { Alice: 1 }, priceType: "unit" }],
        persons: ["Alice"],
        ongkir: "0",
        biayaLayanan: "0",
        tax: "10",
        taxType: "percentage",
        parking: "0",
        diskon: "",
        voucher: "",
      }),
    );

    expect(result.current.subtotal).toBe(100000);
    expect(result.current.taxAmount).toBe(10000);
    expect(result.current.grandTotal).toBe(110000);
  });
});
