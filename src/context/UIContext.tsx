import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useBillData } from "./BillDataContext";
import { useDarkMode } from "../hooks/useDarkMode";
import { useLanguage } from "../hooks/useLanguage";
import { useOCR } from "../hooks/useOCR";
import { useClipboard } from "../hooks/useClipboard";
import { useCalculator } from "../hooks/useCalculator";
import { useDragWidget } from "../hooks/useDragWidget";
import { useTypewriter } from "../hooks/useTypewriter";
import { formatMoneySplit } from "../utils/formatters";
import { VERSION_KEY, APP_VERSION, DEFAULT_ITEM, SHOW_CALCULATOR_KEY, SHOW_PAYMENT_TRACKER_KEY } from "../utils/constants";
import type { Language } from "../types";
import type { Translations } from "../translations";

interface UIContextValue {
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
  showCustomAccountModal: boolean;
  setShowCustomAccountModal: React.Dispatch<React.SetStateAction<boolean>>;
  showWhatsNew: boolean;
  setShowWhatsNew: React.Dispatch<React.SetStateAction<boolean>>;
  showBulkInsert: boolean;
  setShowBulkInsert: React.Dispatch<React.SetStateAction<boolean>>;
  bulkInsertText: string;
  setBulkInsertText: React.Dispatch<React.SetStateAction<string>>;
  openAccordions: Record<string, boolean>;
  setOpenAccordions: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  currentTime: Date;
  summaryRef: React.RefObject<HTMLDivElement | null>;
  paymentTrackerRef: React.RefObject<HTMLDivElement | null>;
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

const UIContext = createContext<UIContextValue | null>(null);

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}

export function UIProvider({ children }: { children: React.ReactNode }) {
  const {
    setPlaceName,
    items, setItems,
    persons, setPersons,
    setTax, setBiayaLayanan, setOngkir, setDiskon, setVoucher,
    bankAccounts, setBankAccounts,
    selectedAccount, setSelectedAccount,
    customAccountName, setCustomAccountName,
    customAccountNumber, setCustomAccountNumber,
    customAccountVendor, setCustomAccountVendor,
    setRoundTo100, setPaymentStatus, setTaxType, setParking,
    paymentStatus,
  } = useBillData();

  const [darkMode, toggleDarkMode] = useDarkMode();
  const [language, toggleLanguage, t] = useLanguage();

  const [newPersonName, setNewPersonName] = useState("");
  const [duplicatePersonError, setDuplicatePersonError] = useState(false);
  const [personSearch, setPersonSearch] = useState("");
  const [showPersonSuggestions, setShowPersonSuggestions] = useState(false);
  const [itemPersonSearch, setItemPersonSearch] = useState<Record<number, string>>({});
  const [showCalculator, setShowCalculator] = useState(() => {
    try {
      const saved = localStorage.getItem(SHOW_CALCULATOR_KEY);
      return saved === "true";
    } catch {
      return false;
    }
  });
  const [showPaymentTracker, setShowPaymentTracker] = useState(() => {
    try {
      const saved = localStorage.getItem(SHOW_PAYMENT_TRACKER_KEY);
      return saved === "true";
    } catch {
      return false;
    }
  });
  const [showOCR, setShowOCR] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showCustomAccountModal, setShowCustomAccountModal] = useState(false);
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

  const calculator = useCalculator();
  const dragWidget = useDragWidget();

  const ocr = useOCR({ t, setItems, setTax, setBiayaLayanan, setOngkir, setDiskon, setVoucher });
  const clipboard = useClipboard({ summaryRef, paymentTrackerRef, darkMode, t });
  const typewriter = useTypewriter({ t });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const seenVersion = localStorage.getItem(VERSION_KEY);
    if (seenVersion !== APP_VERSION) setShowWhatsNew(true);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SHOW_CALCULATOR_KEY, showCalculator.toString());
    } catch (error) {
      console.error("Error saving calculator preference:", error);
    }
  }, [showCalculator]);

  useEffect(() => {
    try {
      localStorage.setItem(SHOW_PAYMENT_TRACKER_KEY, showPaymentTracker.toString());
    } catch (error) {
      console.error("Error saving payment tracker preference:", error);
    }
  }, [showPaymentTracker]);

  const dismissWhatsNew = () => {
    localStorage.setItem(VERSION_KEY, APP_VERSION);
    setShowWhatsNew(false);
  };

  const addPerson = () => {
    const trimmed = newPersonName.trim();
    if (!trimmed) return;
    if (persons.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      setDuplicatePersonError(true);
      return;
    }
    setDuplicatePersonError(false);
    setPersons((prev) => [...prev, trimmed]);
    setNewPersonName("");
    setPaymentStatus((prev) => ({ ...prev, [trimmed]: false }));
  };

  const saveCustomAccount = () => {
    const newAccount = {
      name: customAccountName.trim(),
      number: customAccountNumber.trim(),
      vendor: customAccountVendor.trim(),
    };
    if (bankAccounts.some((acc) => acc.number === newAccount.number && acc.number !== "CUSTOM")) {
      return;
    }
    setBankAccounts((prev) => [...prev, newAccount]);
    setSelectedAccount(newAccount.number);
    setCustomAccountName("");
    setCustomAccountNumber("");
    setCustomAccountVendor("");
  };

  const resetAllData = () => {
    setPlaceName("");
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

  const value: UIContextValue = {
    darkMode, toggleDarkMode,
    language, toggleLanguage, t,
    calculator, ocr, clipboard, dragWidget, typewriter,
    newPersonName, setNewPersonName,
    duplicatePersonError, setDuplicatePersonError,
    personSearch, setPersonSearch,
    showPersonSuggestions, setShowPersonSuggestions,
    itemPersonSearch, setItemPersonSearch,
    showCalculator, setShowCalculator,
    showPaymentTracker, setShowPaymentTracker,
    showOCR, setShowOCR,
    showResetModal, setShowResetModal,
    showCustomAccountModal, setShowCustomAccountModal,
    showWhatsNew, setShowWhatsNew,
    showBulkInsert, setShowBulkInsert,
    bulkInsertText, setBulkInsertText,
    openAccordions, setOpenAccordions,
    currentTime,
    summaryRef, paymentTrackerRef, fileInputRef,
    appVersion: APP_VERSION,
    draggedItem, dragOverIndex,
    handleItemDragStart, handleItemDragOver, handleItemDragEnd,
    toggleAccordion,
    addPerson, saveCustomAccount, resetAllData, applyBulkInsert, dismissWhatsNew,
    formatMoneySplit,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
