import React, { createContext, useContext } from "react";
import { BillDataProvider, useBillData } from "./BillDataContext";
import { UIProvider, useUI } from "./UIContext";
import { formatMoneySplit } from "../utils/formatters";
import type { BillItem, BankAccount, TaxType, Language, Position, SplitResult } from "../types";
import type { Translations } from "../translations";
import type { useCalculator } from "../hooks/useCalculator";
import type { useOCR } from "../hooks/useOCR";
import type { useClipboard } from "../hooks/useClipboard";
import type { useDragWidget } from "../hooks/useDragWidget";
import type { useTypewriter } from "../hooks/useTypewriter";

// Combined interface for backward-compatible useApp() consumers
interface AppContextValue {
  // --- Bill Data ---
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
  // --- UI ---
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: Language;
  toggleLanguage: () => void;
  t: Translations;
  calculator: ReturnType<typeof useCalculator>;
  ocr: ReturnType<typeof useOCR>;
  clipboard: ReturnType<typeof useClipboard>;
  dragWidget: ReturnType<typeof useDragWidget>;
  typewriter: ReturnType<typeof useTypewriter>;
  newPersonName: string;
  setNewPersonName: React.Dispatch<React.SetStateAction<string>>;
  duplicatePersonError: boolean;
  setDuplicatePersonError: React.Dispatch<React.SetStateAction<boolean>>;
  personSearch: string;
  setPersonSearch: React.Dispatch<React.SetStateAction<string>>;
  showPersonSuggestions: boolean;
  setShowPersonSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  itemPersonSearch: Record<number, string>;
  setItemPersonSearch: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  showCalculator: boolean;
  setShowCalculator: React.Dispatch<React.SetStateAction<boolean>>;
  showPaymentTracker: boolean;
  setShowPaymentTracker: React.Dispatch<React.SetStateAction<boolean>>;
  showOCR: boolean;
  setShowOCR: React.Dispatch<React.SetStateAction<boolean>>;
  showResetModal: boolean;
  setShowResetModal: React.Dispatch<React.SetStateAction<boolean>>;
  showWhatsNew: boolean;
  setShowWhatsNew: React.Dispatch<React.SetStateAction<boolean>>;
  showBulkInsert: boolean;
  setShowBulkInsert: React.Dispatch<React.SetStateAction<boolean>>;
  bulkInsertText: string;
  setBulkInsertText: React.Dispatch<React.SetStateAction<string>>;
  openAccordions: Record<string, boolean>;
  setOpenAccordions: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  currentTime: Date;
  paymentTrackerRef: React.RefObject<HTMLDivElement | null>;
  summaryRef: React.RefObject<HTMLDivElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  appVersion: string;
  draggedItem: number | null;
  dragOverIndex: number | null;
  handleItemDragStart: (_e: React.DragEvent, index: number) => void;
  handleItemDragOver: (e: React.DragEvent, index: number) => void;
  handleItemDragEnd: () => void;
  toggleAccordion: (person: string) => void;
  addPerson: () => void;
  saveCustomAccount: () => void;
  resetAllData: () => void;
  applyBulkInsert: () => void;
  dismissWhatsNew: () => void;
  formatMoneySplit: typeof formatMoneySplit;
}

const AppContext = createContext<AppContextValue | null>(null);

function AppContextBridge({ children }: { children: React.ReactNode }) {
  const billData = useBillData();
  const ui = useUI();
  const value: AppContextValue = { ...billData, ...ui };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <BillDataProvider>
      <UIProvider>
        <AppContextBridge>{children}</AppContextBridge>
      </UIProvider>
    </BillDataProvider>
  );
}
