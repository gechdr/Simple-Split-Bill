import { useMemo } from "react";
import type { BillItem, SplitResult, TaxType } from "../types";
import { calculateSplit } from "../utils/calculator";

interface UseBillCalculatorInput {
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

export function useBillCalculator({
  items,
  persons,
  ongkir,
  biayaLayanan,
  tax,
  taxType,
  parking,
  diskon,
  voucher,
}: UseBillCalculatorInput): SplitResult {
  return useMemo(
    () => calculateSplit({ items, persons, ongkir, biayaLayanan, tax, taxType, parking, diskon, voucher }),
    [items, persons, ongkir, biayaLayanan, tax, taxType, parking, diskon, voucher],
  );
}
