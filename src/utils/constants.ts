import type { BillItem, BankAccount } from "../types";

export const STORAGE_KEY = "splitBillData";
export const LANGUAGE_KEY = "language";
export const VERSION_KEY = "seenVersion";
export const SHOW_CALCULATOR_KEY = "showCalculator";
export const SHOW_PAYMENT_TRACKER_KEY = "showPaymentTracker";
export const DARK_MODE_KEY = "darkMode";
export const APP_VERSION = "v2.8.2";

// Bill data field names inside localStorage[STORAGE_KEY] JSON object
export const STORAGE_KEYS = [
  "placeName",
  "items",
  "persons",
  "ongkir",
  "biayaLayanan",
  "tax",
  "taxType",
  "parking",
  "diskon",
  "voucher",
  "bankAccounts",
  "selectedAccount",
  "customAccountName",
  "customAccountNumber",
  "customAccountVendor",
  "roundTo100",
  "paymentStatus",
] as const;

export const WIDGET_DEFAULT_OFFSET = 320;
export const NOTIFICATION_DURATION_MS = 2000;
export const OCR_COMPLETION_DELAY_MS = 3000;
export const IMAGE_SCALE_SUMMARY = 5;
export const IMAGE_SCALE_TRACKER = 3;

export const DEFAULT_ITEM: BillItem = {
  id: 1,
  name: "",
  price: "",
  persons: {},
  priceType: "unit",
};

export const DEFAULT_BANK_ACCOUNT: BankAccount = {
  name: "Custom",
  number: "CUSTOM",
  vendor: "Custom",
};

export const changelog = {
  en: {
    new: [],
    improved: [
      "Extracted Custom Account Modal into a separate component to fix dialog opening bugs",
    ],
    removed: [],
  },
  id: {
    new: [],
    improved: [
      "Memisahkan Custom Account Modal menjadi komponen terpisah untuk memperbaiki bug dialog yang tidak terbuka",
    ],
    removed: [],
  },
};

export type Changelog = typeof changelog;
