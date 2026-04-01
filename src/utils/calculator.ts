import type { BillItem, SplitResult, TaxType } from "../types";

/**
 * Returns the display price for a person's share of an item,
 * accounting for unit vs total price type. Returns null if the
 * person has no quantity or the item has no price.
 */
export function calculateItemDisplayPrice(item: BillItem, person: string): number | null {
  const itemPrice = Number(item.price || 0);
  const quantity = Number(item.persons[person] || 0);
  if (quantity === 0 || itemPrice === 0) return null;
  if (item.priceType === "total") {
    const totalPortions = Object.values(item.persons).reduce((s, q) => s + (Number(q) || 0), 0);
    if (totalPortions === 0) return null;
    return (itemPrice / totalPortions) * quantity;
  }
  return itemPrice * quantity;
}

interface CalculateSplitInput {
  items: BillItem[];
  persons: string[];
  ongkir: string;
  biayaLayanan: string;
  tax: string;
  taxType: TaxType;
  parking: string;
  diskon: string;
  voucher: string;
}

export function calculateSplit({
  items,
  persons,
  ongkir,
  biayaLayanan,
  tax,
  taxType,
  parking,
  diskon,
  voucher,
}: CalculateSplitInput): SplitResult {
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = Number(item.price || 0);
    const personsList = Object.keys(item.persons);
    if (personsList.length === 0 || itemPrice === 0) return sum;
    if (item.priceType === "total") return sum + itemPrice;
    const totalQuantity = Object.values(item.persons).reduce((q, qty) => q + (Number(qty) || 0), 0);
    return totalQuantity === 0 ? sum : sum + itemPrice * totalQuantity;
  }, 0);

  const shippingDiscount = Number(diskon || 0);
  const voucherDiscount = Number(voucher || 0);
  const totalDiscount = shippingDiscount + voucherDiscount;
  const netShipping = Math.max(0, Number(ongkir || 0) - shippingDiscount);
  const sharedFees = netShipping + Number(biayaLayanan || 0) + Number(parking || 0);

  const personTotals: Record<string, number> = {};
  const personSubtotals: Record<string, number> = {};
  persons.forEach((person) => {
    personTotals[person] = 0;
    personSubtotals[person] = 0;
  });

  items.forEach((item) => {
    const itemPrice = Number(item.price || 0);
    const personsList = Object.keys(item.persons);
    if (personsList.length === 0 || itemPrice === 0) return;
    if (item.priceType === "total") {
      const totalPortions = Object.values(item.persons).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
      if (totalPortions === 0) return;
      const pricePerPortion = itemPrice / totalPortions;
      personsList.forEach((person) => {
        const qty = Number(item.persons[person] || 0);
        if (qty > 0) personSubtotals[person] += pricePerPortion * qty;
      });
    } else {
      personsList.forEach((person) => {
        const qty = Number(item.persons[person] || 0);
        if (qty > 0) personSubtotals[person] += itemPrice * qty;
      });
    }
  });

  const totalItemsAssigned = Object.values(personSubtotals).reduce((sum, val) => sum + val, 0);
  const subtotalAfterDiscount = subtotal - voucherDiscount;
  const totalTaxAmount = taxType === "percentage" ? (subtotalAfterDiscount * Number(tax || 0)) / 100 : Number(tax || 0);

  if (totalItemsAssigned > 0 && persons.length > 0) {
    const sharedFeePerPerson = sharedFees / persons.length;
    persons.forEach((person) => {
      const proportion = personSubtotals[person] / totalItemsAssigned;
      personTotals[person] = personSubtotals[person] - voucherDiscount * proportion + totalTaxAmount * proportion + sharedFeePerPerson;
    });
  }

  return {
    subtotal,
    taxAmount: totalTaxAmount,
    totalDiscount,
    totalBiaya: sharedFees + totalTaxAmount,
    grandTotal: subtotalAfterDiscount + sharedFees + totalTaxAmount,
    personTotals,
    personSubtotals,
    sharedFees,
    netSharedAmount: sharedFees + totalTaxAmount,
  };
}
