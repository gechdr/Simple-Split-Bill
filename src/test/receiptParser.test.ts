import { describe, it, expect } from "vitest";
import { parseReceiptText } from "../utils/receiptParser";

describe("parseReceiptText", () => {
  it("returns empty result for blank text", () => {
    const result = parseReceiptText("");
    expect(result.items).toHaveLength(0);
    expect(result.tax).toBe("");
    expect(result.biayaLayanan).toBe("");
    expect(result.ongkir).toBe("");
    expect(result.diskon).toBe("");
    expect(result.voucher).toBe("");
  });

  it("parses items with quantity prefix (2x format)", () => {
    const text = `2x Nasi Goreng Rp 25.000\n1x Es Teh Rp 5.000`;
    const result = parseReceiptText(text);
    expect(result.items).toHaveLength(2);
    const nasiGoreng = result.items.find((i) => i.name.toLowerCase().includes("nasi goreng"));
    expect(nasiGoreng).toBeDefined();
    // price should be divided by qty: 25000 / 2 = 12500
    expect(nasiGoreng?.price).toBe("12500");
    expect(nasiGoreng?.priceType).toBe("unit");
  });

  it("parses items with quantity (no x suffix)", () => {
    const text = `1 Ayam Bakar 30.000`;
    const result = parseReceiptText(text);
    expect(result.items.length).toBeGreaterThan(0);
  });

  it("stops parsing items at subtotal line", () => {
    const text = `1x Burger 20.000\nSubtotal 20.000\n1x Hidden Item 10.000`;
    const result = parseReceiptText(text);
    const names = result.items.map((i) => i.name.toLowerCase());
    expect(names.some((n) => n.includes("hidden"))).toBe(false);
  });

  it("stops parsing items at total line", () => {
    const text = `1x Coffee 15.000\nTotal 15.000\n1x After Total 5.000`;
    const result = parseReceiptText(text);
    const names = result.items.map((i) => i.name.toLowerCase());
    expect(names.some((n) => n.includes("after total"))).toBe(false);
  });

  it("extracts percentage tax", () => {
    const text = `1x Steak 100.000\ntax 10%\nTotal 110.000`;
    const result = parseReceiptText(text);
    expect(result.tax).toBe("10");
  });

  it("extracts PPN tax", () => {
    const text = `1x Pizza 50.000\nPPN 11%`;
    const result = parseReceiptText(text);
    expect(result.tax).toBe("11");
  });

  it("extracts service fee (biayaLayanan)", () => {
    const text = `1x Pasta 60.000\nService 6.000`;
    const result = parseReceiptText(text);
    expect(result.biayaLayanan).toBe("6000");
  });

  it("extracts order fee as biayaLayanan", () => {
    const text = `1x Ramen 45.000\nOrder Fee Rp 3.000`;
    const result = parseReceiptText(text);
    expect(result.biayaLayanan).toBe("3000");
  });

  it("extracts delivery fee (ongkir)", () => {
    const text = `1x Sushi 80.000\nDelivery Fee Rp 15.000`;
    const result = parseReceiptText(text);
    expect(result.ongkir).toBe("15000");
  });

  it("extracts ongkir keyword", () => {
    const text = `1x Soto 25.000\nOngkir 10.000`;
    const result = parseReceiptText(text);
    expect(result.ongkir).toBe("10000");
  });

  it("extracts voucher discount", () => {
    const text = `1x Item 50.000\nVoucher -5.000`;
    const result = parseReceiptText(text);
    expect(result.voucher).toBe("5000");
  });

  it("extracts promo discount (diskon)", () => {
    const text = `1x Item 50.000\nPromo Kota -10.000`;
    const result = parseReceiptText(text);
    expect(result.diskon).toBe("10000");
  });

  it("skips ignored keywords like 'thank you'", () => {
    const text = `1x Burger 20.000\nThank you for ordering!`;
    const result = parseReceiptText(text);
    const names = result.items.map((i) => i.name.toLowerCase());
    expect(names.some((n) => n.includes("thank"))).toBe(false);
  });

  it("sets correct defaults on parsed items (no persons, unit priceType)", () => {
    const text = `2x Coffee 10.000`;
    const result = parseReceiptText(text);
    expect(result.items[0].persons).toEqual({});
    expect(result.items[0].priceType).toBe("unit");
  });

  it("does not parse lines with fee/biaya/ongkir/tax keywords as items", () => {
    const text = `Biaya Layanan 5.000\nDelivery 10.000\ntax 5%`;
    const result = parseReceiptText(text);
    // These lines should not be parsed as bill items
    const names = result.items.map((i) => i.name.toLowerCase());
    expect(names.some((n) => n.includes("biaya") || n.includes("delivery") || n.includes("tax"))).toBe(false);
  });
});
