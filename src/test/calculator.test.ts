import { describe, it, expect } from "vitest";
import { calculateSplit, calculateItemDisplayPrice } from "../utils/calculator";
import type { BillItem } from "../types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeItem(overrides: Partial<BillItem> & { id?: number }): BillItem {
  return {
    id: overrides.id ?? 1,
    name: overrides.name ?? "Item",
    price: overrides.price ?? "0",
    persons: overrides.persons ?? {},
    priceType: overrides.priceType ?? "unit",
  };
}

const emptyInput = {
  ongkir: "",
  biayaLayanan: "",
  tax: "",
  taxType: "percentage" as const,
  parking: "0",
  diskon: "",
  voucher: "",
};

// ─── calculateSplit ──────────────────────────────────────────────────────────

describe("calculateSplit", () => {
  it("returns zeros when no items or persons", () => {
    const result = calculateSplit({ ...emptyInput, items: [], persons: [] });
    expect(result.subtotal).toBe(0);
    expect(result.grandTotal).toBe(0);
    expect(result.taxAmount).toBe(0);
    expect(result.totalDiscount).toBe(0);
    expect(result.sharedFees).toBe(0);
  });

  it("calculates subtotal for unit-price items", () => {
    const items = [
      makeItem({ id: 1, price: "10000", persons: { Alice: 2, Bob: 1 }, priceType: "unit" }),
    ];
    const result = calculateSplit({ ...emptyInput, items, persons: ["Alice", "Bob"] });
    // unit price: 10000 * 2 (Alice) + 10000 * 1 (Bob) = 30000
    expect(result.subtotal).toBe(30000);
  });

  it("calculates subtotal for total-price items", () => {
    const items = [
      makeItem({ id: 1, price: "30000", persons: { Alice: 1, Bob: 2 }, priceType: "total" }),
    ];
    const result = calculateSplit({ ...emptyInput, items, persons: ["Alice", "Bob"] });
    // total price: whole item is 30000
    expect(result.subtotal).toBe(30000);
  });

  it("splits total-price item proportionally by quantity", () => {
    const items = [
      makeItem({ id: 1, price: "30000", persons: { Alice: 1, Bob: 2 }, priceType: "total" }),
    ];
    const result = calculateSplit({ ...emptyInput, items, persons: ["Alice", "Bob"] });
    // Alice: 1/3 of 30000 = 10000, Bob: 2/3 of 30000 = 20000
    expect(result.personSubtotals["Alice"]).toBeCloseTo(10000);
    expect(result.personSubtotals["Bob"]).toBeCloseTo(20000);
  });

  it("calculates unit-price item per-person subtotals correctly", () => {
    const items = [
      makeItem({ id: 1, price: "5000", persons: { Alice: 3, Bob: 1 }, priceType: "unit" }),
    ];
    const result = calculateSplit({ ...emptyInput, items, persons: ["Alice", "Bob"] });
    expect(result.personSubtotals["Alice"]).toBe(15000); // 5000 * 3
    expect(result.personSubtotals["Bob"]).toBe(5000);    // 5000 * 1
  });

  it("ignores items with no assigned persons", () => {
    const items = [
      makeItem({ id: 1, price: "10000", persons: {}, priceType: "unit" }),
    ];
    const result = calculateSplit({ ...emptyInput, items, persons: ["Alice"] });
    expect(result.subtotal).toBe(0);
  });

  it("ignores items with zero price", () => {
    const items = [
      makeItem({ id: 1, price: "0", persons: { Alice: 1 }, priceType: "unit" }),
    ];
    const result = calculateSplit({ ...emptyInput, items, persons: ["Alice"] });
    expect(result.subtotal).toBe(0);
  });

  it("applies percentage tax correctly", () => {
    const items = [
      makeItem({ id: 1, price: "100000", persons: { Alice: 1 }, priceType: "unit" }),
    ];
    const result = calculateSplit({
      ...emptyInput,
      items,
      persons: ["Alice"],
      tax: "10",
      taxType: "percentage",
    });
    expect(result.taxAmount).toBe(10000); // 10% of 100000
    expect(result.grandTotal).toBe(110000);
  });

  it("applies fixed (currency) tax correctly", () => {
    const items = [
      makeItem({ id: 1, price: "100000", persons: { Alice: 1 }, priceType: "unit" }),
    ];
    const result = calculateSplit({
      ...emptyInput,
      items,
      persons: ["Alice"],
      tax: "5000",
      taxType: "currency",
    });
    expect(result.taxAmount).toBe(5000);
    expect(result.grandTotal).toBe(105000);
  });

  it("applies shipping and service fee as shared fees", () => {
    const items = [
      makeItem({ id: 1, price: "50000", persons: { Alice: 1, Bob: 1 }, priceType: "unit" }),
    ];
    const result = calculateSplit({
      ...emptyInput,
      items,
      persons: ["Alice", "Bob"],
      ongkir: "20000",
      biayaLayanan: "5000",
    });
    // sharedFees = ongkir + biayaLayanan = 25000, split equally → each pays 12500 extra
    expect(result.sharedFees).toBe(25000);
    expect(result.personTotals["Alice"]).toBeCloseTo(50000 + 12500);
    expect(result.personTotals["Bob"]).toBeCloseTo(50000 + 12500);
  });

  it("applies shipping discount (diskon) to reduce ongkir", () => {
    const items = [
      makeItem({ id: 1, price: "60000", persons: { Alice: 1, Bob: 1 }, priceType: "unit" }),
    ];
    const result = calculateSplit({
      ...emptyInput,
      items,
      persons: ["Alice", "Bob"],
      ongkir: "20000",
      diskon: "10000",
    });
    // netShipping = 20000 - 10000 = 10000
    expect(result.sharedFees).toBe(10000);
    expect(result.totalDiscount).toBe(10000);
  });

  it("applies voucher as proportional discount on personTotals", () => {
    const items = [
      makeItem({ id: 1, price: "100000", persons: { Alice: 1, Bob: 1 }, priceType: "unit" }),
    ];
    const result = calculateSplit({
      ...emptyInput,
      items,
      persons: ["Alice", "Bob"],
      voucher: "20000",
    });
    // Each person has 50000 subtotal, proportion = 0.5 each
    // personTotal = 50000 - 20000 * 0.5 = 40000
    expect(result.personTotals["Alice"]).toBeCloseTo(90000);
    expect(result.personTotals["Bob"]).toBeCloseTo(90000);
    expect(result.totalDiscount).toBe(20000);
  });

  it("grandTotal equals subtotal + sharedFees + tax - voucher", () => {
    const items = [
      makeItem({ id: 1, price: "100000", persons: { Alice: 1 }, priceType: "unit" }),
    ];
    const result = calculateSplit({
      ...emptyInput,
      items,
      persons: ["Alice"],
      ongkir: "10000",
      tax: "10",
      taxType: "percentage",
      voucher: "5000",
    });
    // subtotal = 100000
    // subtotalAfterDiscount = 95000
    // tax = 9500 (10% of 95000)
    // sharedFees = 10000
    // grandTotal = 95000 + 10000 + 9500 = 114500
    expect(result.grandTotal).toBeCloseTo(114500);
  });

  it("handles multiple items for multiple persons", () => {
    const items = [
      makeItem({ id: 1, price: "10000", persons: { Alice: 2 }, priceType: "unit" }),
      makeItem({ id: 2, price: "15000", persons: { Bob: 1 }, priceType: "unit" }),
      makeItem({ id: 3, price: "20000", persons: { Alice: 1, Bob: 1 }, priceType: "unit" }),
    ];
    const result = calculateSplit({ ...emptyInput, items, persons: ["Alice", "Bob"] });
    // Alice: 10000*2 + 20000*1 = 40000
    // Bob:   15000*1 + 20000*1 = 35000
    expect(result.personSubtotals["Alice"]).toBe(40000);
    expect(result.personSubtotals["Bob"]).toBe(35000);
    expect(result.subtotal).toBe(75000);
  });

  it("caps sharedFees at zero when diskon exceeds ongkir", () => {
    const items = [
      makeItem({ id: 1, price: "10000", persons: { Alice: 1 }, priceType: "unit" }),
    ];
    const result = calculateSplit({
      ...emptyInput,
      items,
      persons: ["Alice"],
      ongkir: "5000",
      diskon: "20000", // diskon > ongkir
    });
    expect(result.sharedFees).toBe(0); // Math.max(0, 5000 - 20000) = 0
  });

  it("handles parking fee in shared fees", () => {
    const items = [
      makeItem({ id: 1, price: "50000", persons: { Alice: 1, Bob: 1 }, priceType: "unit" }),
    ];
    const result = calculateSplit({
      ...emptyInput,
      items,
      persons: ["Alice", "Bob"],
      parking: "10000",
    });
    expect(result.sharedFees).toBe(10000);
  });
});

// ─── calculateItemDisplayPrice ───────────────────────────────────────────────

describe("calculateItemDisplayPrice", () => {
  it("returns null for item with quantity 0", () => {
    const item = makeItem({ price: "10000", persons: { Alice: 0 }, priceType: "unit" });
    expect(calculateItemDisplayPrice(item, "Alice")).toBeNull();
  });

  it("returns null for item with zero price", () => {
    const item = makeItem({ price: "0", persons: { Alice: 1 }, priceType: "unit" });
    expect(calculateItemDisplayPrice(item, "Alice")).toBeNull();
  });

  it("returns null for person not in item", () => {
    const item = makeItem({ price: "10000", persons: { Bob: 1 }, priceType: "unit" });
    expect(calculateItemDisplayPrice(item, "Alice")).toBeNull();
  });

  it("calculates unit price correctly", () => {
    const item = makeItem({ price: "5000", persons: { Alice: 3 }, priceType: "unit" });
    expect(calculateItemDisplayPrice(item, "Alice")).toBe(15000);
  });

  it("calculates total price split correctly", () => {
    const item = makeItem({ price: "30000", persons: { Alice: 1, Bob: 2 }, priceType: "total" });
    // Alice: 1/3 * 30000 = 10000
    expect(calculateItemDisplayPrice(item, "Alice")).toBeCloseTo(10000);
    // Bob: 2/3 * 30000 = 20000
    expect(calculateItemDisplayPrice(item, "Bob")).toBeCloseTo(20000);
  });

  it("returns null for total-price item with all zero quantities", () => {
    const item = makeItem({ price: "30000", persons: { Alice: 0, Bob: 0 }, priceType: "total" });
    expect(calculateItemDisplayPrice(item, "Alice")).toBeNull();
  });
});

