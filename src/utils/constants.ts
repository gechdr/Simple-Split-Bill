import type { BillItem, BankAccount } from "../types";

export const STORAGE_KEY = "splitBillData";
export const LANGUAGE_KEY = "splitBillLanguage";
export const VERSION_KEY = "splitBillSeenVersion";
export const APP_VERSION = "v2.8.1";

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
    ],
    improved: [],
    removed: [],
  },
  id: {
    new: [
      "Migrasi ke project React",
      "Menambahkan kolom Nama Tempat / Resto untuk menandai tagihan ini untuk apa",
    ],
    improved: [],
    removed: [],
  },
};

export type Changelog = typeof changelog;
