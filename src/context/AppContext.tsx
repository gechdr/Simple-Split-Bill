import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import domtoimage from "dom-to-image";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useDarkMode } from "../hooks/useDarkMode";
import { useLanguage } from "../hooks/useLanguage";
import { useBillCalculator } from "../hooks/useBillCalculator";
import { useOCR } from "../hooks/useOCR";
import { useClipboard } from "../hooks/useClipboard";
import { useCalculator } from "../hooks/useCalculator";
import { useDragWidget } from "../hooks/useDragWidget";
import type { BillItem, BankAccount, TaxType, Language, Position } from "../types";
import type { Translations } from "../translations";
import { formatMoneySplit } from "../utils/formatters";
import { STORAGE_KEY, VERSION_KEY, APP_VERSION, DEFAULT_ITEM, DEFAULT_BANK_ACCOUNT } from "../utils/constants";

interface AppContextValue {
  items: BillItem[];
  setItems: React.Dispatch<React.SetStateAction<BillItem[]>>;
  persons: string[];
  setPersons: React.Dispatch<React.SetStateAction<string[]>>;
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
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: Language;
  toggleLanguage: () => void;
  t: Translations;
  calculator: ReturnType<typeof useCalculator>;
  ocr: ReturnType<typeof useOCR>;
  clipboard: ReturnType<typeof useClipboard>;
  dragWidget: ReturnType<typeof useDragWidget>;
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
  addItem: () => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, field: keyof BillItem, value: unknown) => void;
  togglePerson: (itemId: number, person: string) => void;
  setPersonQuantity: (itemId: number, person: string, quantity: string | number) => void;
  addPerson: () => void;
  removePerson: (person: string) => void;
  handleItemDragStart: (_e: React.DragEvent, index: number) => void;
  handleItemDragOver: (e: React.DragEvent, index: number) => void;
  handleItemDragEnd: () => void;
  draggedItem: number | null;
  dragOverIndex: number | null;
  saveCustomAccount: () => void;
  deleteBankAccount: (accountNumber: string) => void;
  resetAllData: () => void;
  applyBulkInsert: () => void;
  toggleAccordion: (person: string) => void;
  togglePayment: (person: string) => void;
  getPersonItems: (person: string) => BillItem[];
  getSelectedAccountName: () => string;
  getSelectedAccountVendor: () => string;
  getSelectedAccountNumber: () => string;
  dismissWhatsNew: () => void;
  splitResult: ReturnType<typeof useBillCalculator>;
  formatMoneySplit: typeof formatMoneySplit;
  handlePaymentCopy: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<BillItem[]>(`${STORAGE_KEY}_items`, [DEFAULT_ITEM]);
  const [persons, setPersons] = useLocalStorage<string[]>(`${STORAGE_KEY}_persons`, []);
  const [ongkir, setOngkir] = useLocalStorage<string>(`${STORAGE_KEY}_ongkir`, "");
  const [biayaLayanan, setBiayaLayanan] = useLocalStorage<string>(`${STORAGE_KEY}_biayaLayanan`, "");
  const [tax, setTax] = useLocalStorage<string>(`${STORAGE_KEY}_tax`, "");
  const [taxType, setTaxType] = useLocalStorage<TaxType>(`${STORAGE_KEY}_taxType`, "percentage");
  const [parking, setParking] = useLocalStorage<string>(`${STORAGE_KEY}_parking`, "0");
  const [diskon, setDiskon] = useLocalStorage<string>(`${STORAGE_KEY}_diskon`, "");
  const [voucher, setVoucher] = useLocalStorage<string>(`${STORAGE_KEY}_voucher`, "");
  const [bankAccounts, setBankAccounts] = useLocalStorage<BankAccount[]>(`${STORAGE_KEY}_bankAccounts`, [DEFAULT_BANK_ACCOUNT]);
  const [selectedAccount, setSelectedAccount] = useLocalStorage<string | null>(`${STORAGE_KEY}_selectedAccount`, null);
  const [customAccountName, setCustomAccountName] = useLocalStorage<string>(`${STORAGE_KEY}_customAccountName`, "");
  const [customAccountNumber, setCustomAccountNumber] = useLocalStorage<string>(`${STORAGE_KEY}_customAccountNumber`, "");
  const [customAccountVendor, setCustomAccountVendor] = useLocalStorage<string>(`${STORAGE_KEY}_customAccountVendor`, "");
  const [roundTo100, setRoundTo100] = useLocalStorage<boolean>(`${STORAGE_KEY}_roundTo100`, false);
  const [paymentStatus, setPaymentStatus] = useLocalStorage<Record<string, boolean>>(`${STORAGE_KEY}_paymentStatus`, {});

  const [darkMode, toggleDarkMode] = useDarkMode();
  const [language, toggleLanguage, t] = useLanguage();

  const calculator = useCalculator();
  const dragWidget = useDragWidget();

  const [newPersonName, setNewPersonName] = useState("");
  const [duplicatePersonError, setDuplicatePersonError] = useState(false);
  const [personSearch, setPersonSearch] = useState("");
  const [showPersonSuggestions, setShowPersonSuggestions] = useState(false);
  const [itemPersonSearch, setItemPersonSearch] = useState<Record<number, string>>({});
  const [showCalculator, setShowCalculator] = useState(true);
  const [showPaymentTracker, setShowPaymentTracker] = useState(true);
  const [showOCR, setShowOCR] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const [showBulkInsert, setShowBulkInsert] = useState(false);
  const [bulkInsertText, setBulkInsertText] = useState("");
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const summaryRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const paymentTrackerRef = useRef<HTMLDivElement>(null);

  const clipboard = useClipboard({ summaryRef, darkMode, t });

  const ocr = useOCR({
    t,
    setItems,
    setTax,
    setBiayaLayanan,
    setOngkir,
    setDiskon,
    setVoucher,
  });

  const calculatorResult = useBillCalculator({ items, persons, ongkir, biayaLayanan, tax, taxType, parking, diskon, voucher });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const seenVersion = localStorage.getItem(VERSION_KEY);
    if (seenVersion !== APP_VERSION) setShowWhatsNew(true);
  }, []);

  const dismissWhatsNew = () => {
    localStorage.setItem(VERSION_KEY, APP_VERSION);
    setShowWhatsNew(false);
  };

  const [paymentCopyStatus, setPaymentCopyStatus] = useState("");

  const handlePaymentCopy = useCallback(async () => {
    if (!paymentTrackerRef.current) return;
    setPaymentCopyStatus(t.processing);
    try {
      await document.fonts.ready;
      const el = paymentTrackerRef.current;
      const dataUrl = await domtoimage.toPng(el, {
        quality: 1,
        bgcolor: darkMode ? "#1f2937" : "#ffffff",
        style: {
          transform: "scale(3)",
          transformOrigin: "top left",
          width: el.offsetWidth + "px",
          height: el.offsetHeight + "px",
        },
        width: el.offsetWidth * 3,
        height: el.offsetHeight * 3,
      });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setPaymentCopyStatus(t.copied);
    } catch {
      setPaymentCopyStatus(t.failedToCopy);
    }
    setTimeout(() => setPaymentCopyStatus(""), 2000);
  }, [darkMode, t]);

  const saveCustomAccount = () => {
    const newAccount: BankAccount = {
      name: customAccountName.trim(),
      number: customAccountNumber.trim(),
      vendor: customAccountVendor.trim(),
    };
    if (bankAccounts.some((acc) => acc.number === newAccount.number && acc.number !== "CUSTOM")) {
      ocr.captureStatus && void 0;
      return;
    }
    setBankAccounts([...bankAccounts, newAccount]);
    setSelectedAccount(newAccount.number);
    setCustomAccountName("");
    setCustomAccountNumber("");
    setCustomAccountVendor("");
  };

  const deleteBankAccount = (accountNumber: string) => {
    if (accountNumber === "CUSTOM") return;
    setBankAccounts(bankAccounts.filter((acc) => acc.number !== accountNumber));
    if (selectedAccount === accountNumber) setSelectedAccount(null);
  };

  const resetAllData = () => {
    setItems([DEFAULT_ITEM]);
    setPersons([]);
    setNewPersonName("");
    setOngkir("");
    setBiayaLayanan("");
    setTax("");
    setTaxType("percentage");
    setParking("0");
    setDiskon("");
    setVoucher("");
    setSelectedAccount(null);
    setCustomAccountName("");
    setCustomAccountNumber("");
    setCustomAccountVendor("");
    setRoundTo100(false);
    setPaymentStatus({});
    setShowResetModal(false);
  };

  const applyBulkInsert = () => {
    const lines = bulkInsertText.split("\n");
    const pairs: { person: string; itemName: string }[] = [];
    for (const line of lines) {
      const colonIdx = line.indexOf(":");
      if (colonIdx === -1) continue;
      const person = line.slice(0, colonIdx).trim();
      const itemName = line.slice(colonIdx + 1).trim();
      if (!person || !itemName) continue;
      pairs.push({ person, itemName });
    }
    if (pairs.length === 0) {
      setShowBulkInsert(false);
      return;
    }
    const newPersons = [...persons];
    const newPaymentStatus: Record<string, boolean> = {};
    for (const { person } of pairs) {
      if (!newPersons.some((p) => p.toLowerCase() === person.toLowerCase())) {
        newPersons.push(person);
        newPaymentStatus[person] = false;
      }
    }
    const newItems = [...items.filter((i) => i.name.trim() !== "")];
    for (const { person, itemName } of pairs) {
      const existingIdx = newItems.findIndex((i) => i.name.toLowerCase() === itemName.toLowerCase());
      const resolvedPerson = newPersons.find((p) => p.toLowerCase() === person.toLowerCase()) || person;
      if (existingIdx !== -1) {
        if (!newItems[existingIdx].persons[resolvedPerson])
          newItems[existingIdx] = { ...newItems[existingIdx], persons: { ...newItems[existingIdx].persons, [resolvedPerson]: 1 } };
      } else {
        newItems.push({
          id: Date.now() + Math.random() * 1000000,
          name: itemName,
          price: "",
          persons: { [resolvedPerson]: 1 },
          priceType: "unit",
        });
      }
    }
    setPersons(newPersons);
    setPaymentStatus((prev) => ({ ...prev, ...newPaymentStatus }));
    setItems(newItems);
    setBulkInsertText("");
    setShowBulkInsert(false);
  };

  const addItem = () =>
    setItems([...items, { id: Date.now() + Math.random() * 1000000, name: "", price: "", persons: {}, priceType: "unit" }]);

  const removeItem = (id: number) => setItems(items.filter((item) => item.id !== id));

  const updateItem = (id: number, field: keyof BillItem, value: unknown) =>
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));

  const togglePerson = (itemId: number, person: string) => {
    setItems(
      items.map((item) => {
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
    setItems(
      items.map((item) => {
        if (item.id !== itemId) return item;
        const newPersons = { ...item.persons };
        if (numQty <= 0 || isNaN(numQty)) delete newPersons[person];
        else newPersons[person] = numQty;
        return { ...item, persons: newPersons };
      }),
    );
  };

  const addPerson = () => {
    const trimmed = newPersonName.trim();
    if (!trimmed) return;
    if (persons.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      setDuplicatePersonError(true);
      return;
    }
    setDuplicatePersonError(false);
    setPersons([...persons, trimmed]);
    setNewPersonName("");
    setPaymentStatus((prev) => ({ ...prev, [trimmed]: false }));
  };

  const removePerson = (person: string) => {
    setPersons(persons.filter((p) => p !== person));
    setItems(
      items.map((item) => {
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

  const handleItemDragStart = (_e: React.DragEvent, index: number) => setDraggedItem(index);

  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleItemDragEnd = () => {
    if (draggedItem !== null && dragOverIndex !== null && draggedItem !== dragOverIndex) {
      const newItems = [...items];
      const [removed] = newItems.splice(draggedItem, 1);
      newItems.splice(dragOverIndex, 0, removed);
      setItems(newItems);
    }
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const toggleAccordion = (person: string) =>
    setOpenAccordions((prev) => ({ ...prev, [person]: !prev[person] }));

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
    selectedAccount === "CUSTOM"
      ? customAccountNumber || "-"
      : selectedAccount || "";

  const value: AppContextValue = {
    items,
    setItems,
    persons,
    setPersons,
    newPersonName,
    setNewPersonName,
    duplicatePersonError,
    setDuplicatePersonError,
    personSearch,
    setPersonSearch,
    showPersonSuggestions,
    setShowPersonSuggestions,
    itemPersonSearch,
    setItemPersonSearch,
    ongkir,
    setOngkir,
    biayaLayanan,
    setBiayaLayanan,
    tax,
    setTax,
    taxType,
    setTaxType,
    parking,
    setParking,
    diskon,
    setDiskon,
    voucher,
    setVoucher,
    bankAccounts,
    setBankAccounts,
    selectedAccount,
    setSelectedAccount,
    customAccountName,
    setCustomAccountName,
    customAccountNumber,
    setCustomAccountNumber,
    customAccountVendor,
    setCustomAccountVendor,
    roundTo100,
    setRoundTo100,
    paymentStatus,
    setPaymentStatus,
    darkMode,
    toggleDarkMode,
    language,
    toggleLanguage,
    t,
    calculator,
    ocr,
    clipboard,
    dragWidget,
    showCalculator,
    setShowCalculator,
    showPaymentTracker,
    setShowPaymentTracker,
    showOCR,
    setShowOCR,
    showResetModal,
    setShowResetModal,
    showWhatsNew,
    setShowWhatsNew,
    showBulkInsert,
    setShowBulkInsert,
    bulkInsertText,
    setBulkInsertText,
    openAccordions,
    setOpenAccordions,
    currentTime,
    paymentTrackerRef,
    summaryRef,
    fileInputRef,
    appVersion: APP_VERSION,
    addItem,
    removeItem,
    updateItem,
    togglePerson,
    setPersonQuantity,
    addPerson,
    removePerson,
    handleItemDragStart,
    handleItemDragOver,
    handleItemDragEnd,
    draggedItem,
    dragOverIndex,
    saveCustomAccount,
    deleteBankAccount,
    resetAllData,
    applyBulkInsert,
    toggleAccordion,
    togglePayment,
    getPersonItems,
    getSelectedAccountName,
    getSelectedAccountVendor,
    getSelectedAccountNumber,
    dismissWhatsNew,
    splitResult: calculatorResult,
    formatMoneySplit,
    handlePaymentCopy,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
