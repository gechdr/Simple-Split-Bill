export interface BillItem {
  id: number;
  name: string;
  price: string;
  persons: Record<string, number>;
  priceType: "unit" | "total";
}

export interface BankAccount {
  name: string;
  number: string;
  vendor: string;
}

export interface SavedData {
  placeName: string;
  items: BillItem[];
  persons: string[];
  ongkir: string;
  biayaLayanan: string;
  tax: string;
  taxType: "percentage" | "currency";
  parking: string;
  diskon: string;
  voucher: string;
  bankAccounts: BankAccount[];
  selectedAccount: string | null;
  customAccountName: string;
  customAccountNumber: string;
  customAccountVendor: string;
  roundTo100: boolean;
  paymentStatus: Record<string, boolean>;
  lastSaved: string;
}

export interface SplitResult {
  subtotal: number;
  taxAmount: number;
  totalDiscount: number;
  totalBiaya: number;
  grandTotal: number;
  personTotals: Record<string, number>;
  personSubtotals: Record<string, number>;
  sharedFees: number;
  netSharedAmount: number;
}

export interface ParsedReceipt {
  items: BillItem[];
  tax: string;
  biayaLayanan: string;
  ongkir: string;
  diskon: string;
  voucher: string;
}

export interface Position {
  x: number;
  y: number;
}

export type TaxType = "percentage" | "currency";
export type Language = "en" | "id";
