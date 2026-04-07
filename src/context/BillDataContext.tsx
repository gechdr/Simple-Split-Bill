import React, { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useBillCalculator } from "../hooks/useBillCalculator";
import type { BillItem, BankAccount, TaxType, SplitResult } from "../types";
import { DEFAULT_ITEM, DEFAULT_BANK_ACCOUNT } from "../utils/constants";

interface BillDataContextValue {
  placeName: string;
  setPlaceName: React.Dispatch<React.SetStateAction<string>>;
  items: BillItem[];
  setItems: React.Dispatch<React.SetStateAction<BillItem[]>>;
  persons: string[];
  setPersons: React.Dispatch<React.SetStateAction<string[]>>;
  ongkir: string;
  setOngkir: React.Dispatch<React.SetStateAction<string>>;
  biayaLayanan: string;
  setBiayaLayanan: React.Dispatch<React.SetStateAction<string>>;
  tax: string;
  setTax: React.Dispatch<React.SetStateAction<string>>;
  taxType: TaxType;
  setTaxType: React.Dispatch<React.SetStateAction<TaxType>>;
  parking: string;
  setParking: React.Dispatch<React.SetStateAction<string>>;
  diskon: string;
  setDiskon: React.Dispatch<React.SetStateAction<string>>;
  voucher: string;
  setVoucher: React.Dispatch<React.SetStateAction<string>>;
  bankAccounts: BankAccount[];
  setBankAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
  selectedAccount: string | null;
  setSelectedAccount: React.Dispatch<React.SetStateAction<string | null>>;
  customAccountName: string;
  setCustomAccountName: React.Dispatch<React.SetStateAction<string>>;
  customAccountNumber: string;
  setCustomAccountNumber: React.Dispatch<React.SetStateAction<string>>;
  customAccountVendor: string;
  setCustomAccountVendor: React.Dispatch<React.SetStateAction<string>>;
  roundTo100: boolean;
  setRoundTo100: React.Dispatch<React.SetStateAction<boolean>>;
  paymentStatus: Record<string, boolean>;
  setPaymentStatus: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  splitResult: SplitResult;
  addItem: () => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, field: keyof BillItem, value: unknown) => void;
  togglePerson: (itemId: number, person: string) => void;
  setPersonQuantity: (itemId: number, person: string, quantity: string | number) => void;
  removePerson: (person: string) => void;
  deleteBankAccount: (accountNumber: string) => void;
  togglePayment: (person: string) => void;
  getPersonItems: (person: string) => BillItem[];
  getSelectedAccountName: () => string;
  getSelectedAccountVendor: () => string;
  getSelectedAccountNumber: () => string;
}

const BillDataContext = createContext<BillDataContextValue | null>(null);

export function useBillData(): BillDataContextValue {
  const ctx = useContext(BillDataContext);
  if (!ctx) throw new Error("useBillData must be used within BillDataProvider");
  return ctx;
}

export function BillDataProvider({ children }: { children: React.ReactNode }) {
  const [placeName, setPlaceName] = useLocalStorage<string>("placeName", "");
  const [items, setItems] = useLocalStorage<BillItem[]>("items", [DEFAULT_ITEM]);
  const [persons, setPersons] = useLocalStorage<string[]>("persons", []);
  const [ongkir, setOngkir] = useLocalStorage<string>("ongkir", "");
  const [biayaLayanan, setBiayaLayanan] = useLocalStorage<string>("biayaLayanan", "");
  const [tax, setTax] = useLocalStorage<string>("tax", "");
  const [taxType, setTaxType] = useLocalStorage<TaxType>("taxType", "percentage");
  const [parking, setParking] = useLocalStorage<string>("parking", "0");
  const [diskon, setDiskon] = useLocalStorage<string>("diskon", "");
  const [voucher, setVoucher] = useLocalStorage<string>("voucher", "");
  const [bankAccounts, setBankAccounts] = useLocalStorage<BankAccount[]>("bankAccounts", [DEFAULT_BANK_ACCOUNT]);
  const [selectedAccount, setSelectedAccount] = useLocalStorage<string | null>("selectedAccount", null);
  const [customAccountName, setCustomAccountName] = useLocalStorage<string>("customAccountName", "");
  const [customAccountNumber, setCustomAccountNumber] = useLocalStorage<string>("customAccountNumber", "");
  const [customAccountVendor, setCustomAccountVendor] = useLocalStorage<string>("customAccountVendor", "");
  const [roundTo100, setRoundTo100] = useLocalStorage<boolean>("roundTo100", false);
  const [paymentStatus, setPaymentStatus] = useLocalStorage<Record<string, boolean>>("paymentStatus", {});

  const splitResult = useBillCalculator({ items, persons, ongkir, biayaLayanan, tax, taxType, parking, diskon, voucher });

  const addItem = () =>
    setItems((prev) => [...prev, { id: Date.now() + Math.random() * 1000000, name: "", price: "", persons: {}, priceType: "unit" }]);

  const removeItem = (id: number) => setItems((prev) => prev.filter((item) => item.id !== id));

  const updateItem = (id: number, field: keyof BillItem, value: unknown) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));

  const togglePerson = (itemId: number, person: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const newPersons = { ...item.persons };
        if (newPersons[person]) delete newPersons[person];
        else newPersons[person] = 1;
        return { ...item, persons: newPersons };
      }),
    );
  };

  const setPersonQuantity = (itemId: number, person: string, quantity: string | number) => {
    const numQty = Number(quantity);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const newPersons = { ...item.persons };
        if (numQty <= 0 || isNaN(numQty)) delete newPersons[person];
        else newPersons[person] = numQty;
        return { ...item, persons: newPersons };
      }),
    );
  };

  const removePerson = (person: string) => {
    setPersons((prev) => prev.filter((p) => p !== person));
    setItems((prev) =>
      prev.map((item) => {
        const np = { ...item.persons };
        delete np[person];
        return { ...item, persons: np };
      }),
    );
    setPaymentStatus((prev) => {
      const next = { ...prev };
      delete next[person];
      return next;
    });
  };

  const deleteBankAccount = (accountNumber: string) => {
    if (accountNumber === "CUSTOM") return;
    setBankAccounts((prev) => prev.filter((acc) => acc.number !== accountNumber));
    setSelectedAccount((prev) => (prev === accountNumber ? null : prev));
  };

  const togglePayment = (person: string) =>
    setPaymentStatus((prev) => ({ ...prev, [person]: !prev[person] }));

  const getPersonItems = (person: string) => items.filter((item) => Number(item.persons[person] || 0) > 0);

  const getSelectedAccountName = () =>
    selectedAccount === "CUSTOM"
      ? customAccountName || "Custom"
      : bankAccounts.find((a) => a.number === selectedAccount)?.name || "";

  const getSelectedAccountVendor = () =>
    selectedAccount === "CUSTOM"
      ? customAccountVendor || "Custom"
      : bankAccounts.find((a) => a.number === selectedAccount)?.vendor || "";

  const getSelectedAccountNumber = () =>
    selectedAccount === "CUSTOM" ? customAccountNumber || "-" : selectedAccount || "";

  const value: BillDataContextValue = {
    placeName, setPlaceName,
    items, setItems,
    persons, setPersons,
    ongkir, setOngkir,
    biayaLayanan, setBiayaLayanan,
    tax, setTax,
    taxType, setTaxType,
    parking, setParking,
    diskon, setDiskon,
    voucher, setVoucher,
    bankAccounts, setBankAccounts,
    selectedAccount, setSelectedAccount,
    customAccountName, setCustomAccountName,
    customAccountNumber, setCustomAccountNumber,
    customAccountVendor, setCustomAccountVendor,
    roundTo100, setRoundTo100,
    paymentStatus, setPaymentStatus,
    splitResult,
    addItem, removeItem, updateItem,
    togglePerson, setPersonQuantity,
    removePerson, deleteBankAccount,
    togglePayment, getPersonItems,
    getSelectedAccountName, getSelectedAccountVendor, getSelectedAccountNumber,
  };

  return <BillDataContext.Provider value={value}>{children}</BillDataContext.Provider>;
}
