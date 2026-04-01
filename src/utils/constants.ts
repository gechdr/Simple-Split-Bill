import type { BillItem, BankAccount } from "../types";

export const STORAGE_KEY = "splitBillData";
export const LANGUAGE_KEY = "splitBillLanguage";
export const VERSION_KEY = "splitBillSeenVersion";
export const APP_VERSION = "v2.8.0";

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
      "Bulk Insert — paste a list of Person : Item entries to add people and items at once",
    ],
    improved: [
      "People List redesigned with search, duplicate validation, and autocomplete",
    ],
    removed: [],
  },
  id: {
    new: [
      "Masukkan Massal — tempel daftar Orang : Barang untuk menambah orang dan barang sekaligus",
    ],
    improved: [
      "Daftar Orang didesain ulang dengan pencarian, validasi duplikat, dan autocomplete",
    ],
    removed: [],
  },
};

export type Changelog = typeof changelog;
