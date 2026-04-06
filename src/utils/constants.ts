import type { BillItem, BankAccount } from "../types";

export const STORAGE_KEY = "splitBillData";
export const LANGUAGE_KEY = "splitBillLanguage";
export const VERSION_KEY = "splitBillSeenVersion";
export const SHOW_CALCULATOR_KEY = "splitBillShowCalculator";
export const SHOW_PAYMENT_TRACKER_KEY = "splitBillShowPaymentTracker";
export const APP_VERSION = "v2.8.1";

// All storage keys used by the app
export const STORAGE_KEYS = [
  `${STORAGE_KEY}_placeName`,
  `${STORAGE_KEY}_items`,
  `${STORAGE_KEY}_persons`,
  `${STORAGE_KEY}_ongkir`,
  `${STORAGE_KEY}_biayaLayanan`,
  `${STORAGE_KEY}_tax`,
  `${STORAGE_KEY}_taxType`,
  `${STORAGE_KEY}_parking`,
  `${STORAGE_KEY}_diskon`,
  `${STORAGE_KEY}_voucher`,
  `${STORAGE_KEY}_bankAccounts`,
  `${STORAGE_KEY}_selectedAccount`,
  `${STORAGE_KEY}_customAccountName`,
  `${STORAGE_KEY}_customAccountNumber`,
  `${STORAGE_KEY}_customAccountVendor`,
  `${STORAGE_KEY}_roundTo100`,
  `${STORAGE_KEY}_paymentStatus`,
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
    new: [
      "Migrate to React project",
      "Added Place / Resto Name field to label what the split bill is for",
      "Added Typewriter data sharing to transfer exact bill data between browsers and devices",
    ],
    improved: [],
    removed: [],
  },
  id: {
    new: [
      "Migrasi ke project React",
      "Menambahkan kolom Nama Tempat / Resto untuk menandai tagihan ini untuk apa",
      "Menambahkan fitur berbagi data Typewriter untuk memindahkan data tagihan yang sama persis antar browser dan perangkat",
    ],
    improved: [],
    removed: [],
  },
};

export type Changelog = typeof changelog;
