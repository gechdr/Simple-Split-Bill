import React, { useState, useEffect, useRef } from "react";
import domtoimage from "dom-to-image";
import { recognize } from "tesseract.js";
import { translations, type Translations } from "./translations";
import { FormattedInput } from "./components/FormattedInput";
import { AccountSelector } from "./components/AccountSelector";
import { ConfirmModal } from "./components/ConfirmModal";
import {
  Trash2,
  Plus,
  DollarSign,
  Users,
  CreditCard,
  Download,
  Copy,
  ChevronDown,
  Camera,
  Upload,
  RefreshCw,
  Repeat,
  Globe,
  Eye,
  EyeOff,
  Moon,
  Sun,
  GripVertical,
  Calculator,
  ListChecks,
} from "./icons";
import type {
  BillItem,
  BankAccount,
  SavedData,
  SplitResult,
  ParsedReceipt,
  Position,
  TaxType,
  Language,
} from "./types";

const STORAGE_KEY = "splitBillData";
const LANGUAGE_KEY = "splitBillLanguage";
const VERSION_KEY = "splitBillSeenVersion";

function SplitBill() {
  const appVersion = "v2.8.0";

  const changelog = {
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

  const loadLanguage = (): Language => {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY);
      return (saved === "id" ? "id" : "en") as Language;
    } catch {
      return "en";
    }
  };

  const [language, setLanguage] = useState<Language>(loadLanguage);
  const t: Translations = translations[language];

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  }, [language]);

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "id" : "en"));

  const loadFromStorage = (): Partial<SavedData> | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<SavedData>;
        if (parsed.items) {
          parsed.items = parsed.items.map((item) => {
            const newPersons: Record<string, number> = {};
            if (item.persons && typeof item.persons === "object") {
              Object.keys(item.persons).forEach((person) => {
                const qty = Number(
                  (item.persons as Record<string, unknown>)[person],
                );
                if (!isNaN(qty) && qty > 0) newPersons[person] = qty;
              });
            }
            return { ...item, persons: newPersons };
          });
        }
        if (!parsed.paymentStatus || typeof parsed.paymentStatus !== "object")
          parsed.paymentStatus = {};
        return parsed;
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
    return null;
  };

  const initialData = loadFromStorage();
  const defaultItem: BillItem = {
    id: 1,
    name: "",
    price: "",
    persons: {},
    priceType: "unit",
  };

  const [items, setItems] = useState<BillItem[]>(
    initialData?.items || [defaultItem],
  );
  const [persons, setPersons] = useState<string[]>(initialData?.persons || []);
  const [newPersonName, setNewPersonName] = useState("");
  const [duplicatePersonError, setDuplicatePersonError] = useState(false);
  const [personSearch, setPersonSearch] = useState("");
  const [showPersonSuggestions, setShowPersonSuggestions] = useState(false);
  const [itemPersonSearch, setItemPersonSearch] = useState<
    Record<number, string>
  >({});
  const [ongkir, setOngkir] = useState(initialData?.ongkir || "");
  const [biayaLayanan, setBiayaLayanan] = useState(
    initialData?.biayaLayanan || "",
  );
  const [tax, setTax] = useState(initialData?.tax || "");
  const [taxType, setTaxType] = useState<TaxType>(
    initialData?.taxType || "percentage",
  );
  const [parking, setParking] = useState(initialData?.parking || "0");
  const [diskon, setDiskon] = useState(initialData?.diskon || "");
  const [voucher, setVoucher] = useState(initialData?.voucher || "");
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(
    initialData?.bankAccounts || [
      { name: "Custom", number: "CUSTOM", vendor: "Custom" },
    ],
  );
  const [selectedAccount, setSelectedAccount] = useState<string | null>(
    initialData?.selectedAccount || null,
  );
  const [customAccountName, setCustomAccountName] = useState(
    initialData?.customAccountName || "",
  );
  const [customAccountNumber, setCustomAccountNumber] = useState(
    initialData?.customAccountNumber || "",
  );
  const [customAccountVendor, setCustomAccountVendor] = useState(
    initialData?.customAccountVendor || "",
  );
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureStatus, setCaptureStatus] = useState("");
  const [downloadStatus, setDownloadStatus] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const paymentTrackerRef = useRef<HTMLDivElement>(null);
  const [paymentCopyStatus, setPaymentCopyStatus] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showWhatsNew, setShowWhatsNew] = useState(false);
  const [showBulkInsert, setShowBulkInsert] = useState(false);
  const [bulkInsertText, setBulkInsertText] = useState("");
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {},
  );
  const [showOCR, setShowOCR] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("darkMode") === "true";
    } catch {
      return false;
    }
  });
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [roundTo100, setRoundTo100] = useState(
    initialData?.roundTo100 || false,
  );
  const [showCalculator, setShowCalculator] = useState(true);
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [calcPrevValue, setCalcPrevValue] = useState<number | null>(null);
  const [calcOperation, setCalcOperation] = useState<string | null>(null);
  const [calcHistory, setCalcHistory] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockPos, setClockPos] = useState<Position>({ x: 24, y: 80 });
  const [calcPos, setCalcPos] = useState<Position>({
    x: typeof window !== "undefined" ? window.innerWidth - 320 : 1000,
    y: 80,
  });
  const [showPaymentTracker, setShowPaymentTracker] = useState(true);
  const [paymentTrackerPos, setPaymentTrackerPos] = useState<Position>({
    x: typeof window !== "undefined" ? window.innerWidth - 320 : 1000,
    y: 620,
  });
  const [paymentStatus, setPaymentStatus] = useState<Record<string, boolean>>(
    initialData?.paymentStatus || {},
  );
  const [isDraggingWidget, setIsDraggingWidget] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingWidget === "clock")
        setClockPos({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      else if (isDraggingWidget === "calc")
        setCalcPos({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      else if (isDraggingWidget === "payment")
        setPaymentTrackerPos({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
    };
    const handleMouseUp = () => setIsDraggingWidget(null);
    if (isDraggingWidget) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDraggingWidget, dragOffset]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    try {
      localStorage.setItem("darkMode", String(darkMode));
    } catch (error) {
      console.error("Error saving dark mode:", error);
    }
  }, [darkMode]);

  useEffect(() => {
    const dataToSave: SavedData = {
      items,
      persons,
      ongkir,
      biayaLayanan,
      tax,
      taxType,
      parking,
      diskon,
      voucher,
      bankAccounts,
      selectedAccount,
      customAccountName,
      customAccountNumber,
      customAccountVendor,
      roundTo100,
      paymentStatus,
      lastSaved: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [
    items,
    persons,
    ongkir,
    biayaLayanan,
    tax,
    taxType,
    parking,
    diskon,
    voucher,
    bankAccounts,
    selectedAccount,
    customAccountName,
    customAccountNumber,
    customAccountVendor,
    roundTo100,
    paymentStatus,
  ]);

  useEffect(() => {
    const seenVersion = localStorage.getItem(VERSION_KEY);
    if (seenVersion !== appVersion) setShowWhatsNew(true);
  }, []);

  const dismissWhatsNew = () => {
    localStorage.setItem(VERSION_KEY, appVersion);
    setShowWhatsNew(false);
  };

  const saveCustomAccount = () => {
    const newAccount: BankAccount = {
      name: customAccountName.trim(),
      number: customAccountNumber.trim(),
      vendor: customAccountVendor.trim(),
    };
    if (
      bankAccounts.some(
        (acc) => acc.number === newAccount.number && acc.number !== "CUSTOM",
      )
    ) {
      setCaptureStatus(t.accountExists);
      setTimeout(() => setCaptureStatus(""), 2000);
      return;
    }
    setBankAccounts([...bankAccounts, newAccount]);
    setSelectedAccount(newAccount.number);
    setCustomAccountName("");
    setCustomAccountNumber("");
    setCustomAccountVendor("");
    setCaptureStatus(t.accountSaved);
    setTimeout(() => setCaptureStatus(""), 2000);
  };

  const deleteBankAccount = (accountNumber: string) => {
    if (accountNumber === "CUSTOM") return;
    setBankAccounts(bankAccounts.filter((acc) => acc.number !== accountNumber));
    if (selectedAccount === accountNumber) setSelectedAccount(null);
    setCaptureStatus(t.accountDeleted);
    setTimeout(() => setCaptureStatus(""), 2000);
  };

  const resetAllData = () => {
    setItems([defaultItem]);
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
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          items: [defaultItem],
          persons: [],
          ongkir: "",
          biayaLayanan: "",
          tax: "",
          parking: "0",
          diskon: "",
          voucher: "",
          bankAccounts,
          selectedAccount: null,
          customAccountName: "",
          customAccountNumber: "",
          customAccountVendor: "",
          roundTo100: false,
          paymentStatus: {},
          lastSaved: new Date().toISOString(),
        }),
      );
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
    setShowResetModal(false);
    setCaptureStatus(t.dataReset);
    setTimeout(() => setCaptureStatus(""), 2000);
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
      const existingIdx = newItems.findIndex(
        (i) => i.name.toLowerCase() === itemName.toLowerCase(),
      );
      const resolvedPerson =
        newPersons.find((p) => p.toLowerCase() === person.toLowerCase()) ||
        person;
      if (existingIdx !== -1) {
        if (!newItems[existingIdx].persons[resolvedPerson])
          newItems[existingIdx] = {
            ...newItems[existingIdx],
            persons: { ...newItems[existingIdx].persons, [resolvedPerson]: 1 },
          };
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
    setItems([
      ...items,
      {
        id: Date.now() + Math.random() * 1000000,
        name: "",
        price: "",
        persons: {},
        priceType: "unit",
      },
    ]);
  const removeItem = (id: number) =>
    setItems(items.filter((item) => item.id !== id));
  const updateItem = (id: number, field: keyof BillItem, value: unknown) =>
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );

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

  const setPersonQuantity = (
    itemId: number,
    person: string,
    quantity: string | number,
  ) => {
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

  const handleItemDragStart = (_e: React.DragEvent, index: number) =>
    setDraggedItem(index);
  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  const handleItemDragEnd = () => {
    if (
      draggedItem !== null &&
      dragOverIndex !== null &&
      draggedItem !== dragOverIndex
    ) {
      const newItems = [...items];
      const [removed] = newItems.splice(draggedItem, 1);
      newItems.splice(dragOverIndex, 0, removed);
      setItems(newItems);
    }
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const calculateSplit = (): SplitResult => {
    const subtotal = items.reduce((sum, item) => {
      const itemPrice = Number(item.price || 0);
      const personsList = Object.keys(item.persons);
      if (personsList.length === 0 || itemPrice === 0) return sum;
      if (item.priceType === "total") return sum + itemPrice;
      const totalQuantity = Object.values(item.persons).reduce(
        (q, qty) => q + (Number(qty) || 0),
        0,
      );
      return totalQuantity === 0 ? sum : sum + itemPrice * totalQuantity;
    }, 0);
    const shippingDiscount = Number(diskon || 0);
    const voucherDiscount = Number(voucher || 0);
    const totalDiscount = shippingDiscount + voucherDiscount;
    const netShipping = Math.max(0, Number(ongkir || 0) - shippingDiscount);
    const sharedFees =
      netShipping + Number(biayaLayanan || 0) + Number(parking || 0);
    const personTotals: Record<string, number> = {};
    const personSubtotals: Record<string, number> = {};
    persons.forEach((person) => {
      personTotals[person] = 0;
      personSubtotals[person] = 0;
    });
    items.forEach((item) => {
      const itemPrice = Number(item.price || 0);
      const personsList = Object.keys(item.persons);
      if (personsList.length === 0 || itemPrice === 0) return;
      if (item.priceType === "total") {
        const totalPortions = Object.values(item.persons).reduce(
          (sum, qty) => sum + (Number(qty) || 0),
          0,
        );
        if (totalPortions === 0) return;
        const pricePerPortion = itemPrice / totalPortions;
        personsList.forEach((person) => {
          const qty = Number(item.persons[person] || 0);
          if (qty > 0) personSubtotals[person] += pricePerPortion * qty;
        });
      } else {
        personsList.forEach((person) => {
          const qty = Number(item.persons[person] || 0);
          if (qty > 0) personSubtotals[person] += itemPrice * qty;
        });
      }
    });
    const totalItemsAssigned = Object.values(personSubtotals).reduce(
      (sum, val) => sum + val,
      0,
    );
    const subtotalAfterDiscount = subtotal - voucherDiscount;
    const totalTaxAmount =
      taxType === "percentage"
        ? (subtotalAfterDiscount * Number(tax || 0)) / 100
        : Number(tax || 0);
    if (totalItemsAssigned > 0 && persons.length > 0) {
      const sharedFeePerPerson = sharedFees / persons.length;
      persons.forEach((person) => {
        const proportion = personSubtotals[person] / totalItemsAssigned;
        personTotals[person] =
          personSubtotals[person] -
          voucherDiscount * proportion +
          totalTaxAmount * proportion +
          sharedFeePerPerson;
      });
    }
    return {
      subtotal,
      taxAmount: totalTaxAmount,
      totalDiscount,
      totalBiaya: sharedFees + totalTaxAmount,
      grandTotal: subtotalAfterDiscount + sharedFees + totalTaxAmount,
      personTotals,
      personSubtotals,
      sharedFees,
      netSharedAmount: sharedFees + totalTaxAmount,
    };
  };

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

  const {
    subtotal,
    taxAmount,
    totalDiscount,
    grandTotal,
    personTotals,
    personSubtotals,
    sharedFees,
  } = calculateSplit();
  const formatMoney = (amount: number | string) => {
    const num = Number(amount);
    return isNaN(num) || !isFinite(num) ? "0" : num.toLocaleString("id-ID");
  };
  const formatMoneySplit = (amount: number | string) => {
    const num = Number(amount);
    return isNaN(num) || !isFinite(num)
      ? "0"
      : num.toLocaleString("id-ID", { maximumFractionDigits: 0 });
  };
  const roundToNearest100 = (amount: number) => Math.round(amount / 100) * 100;
  const toggleAccordion = (person: string) =>
    setOpenAccordions((prev) => ({ ...prev, [person]: !prev[person] }));
  const getPersonItems = (person: string) =>
    items.filter((item) => Number(item.persons[person] || 0) > 0);

  const parseReceiptText = (text: string): ParsedReceipt => {
    const lines = text.split("\n").filter((l) => l.trim());
    const detectedItems: BillItem[] = [];
    const itemWithQtyPattern =
      /^(\d+)x?\s+(.+?)\s+(?:Rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})+)/i;
    const pricePattern = /(?:Rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/;
    let totalPromoDiscount = 0,
      totalVoucher = 0,
      foundSubtotal = false;
    lines.forEach((line, index) => {
      const cleanLine = line.trim();
      if (cleanLine.match(/^(subtotal|total|grand total)/i)) {
        foundSubtotal = true;
        return;
      }
      if (foundSubtotal) return;
      if (
        cleanLine.match(
          /^(order summary|reorder|terima kasih|thank you|receipt|struk|cutlery|profile|contact|earned|points)/i,
        )
      )
        return;
      if (
        cleanLine
          .toLowerCase()
          .match(/discount|diskon|promo|kota|sobat|voucher/)
      ) {
        const neg = cleanLine.match(/-\s*(?:Rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})*)/);
        if (neg) {
          const amt = parseInt(neg[1].replace(/[.,]/g, ""));
          if (cleanLine.toLowerCase().match(/kota|sobat|\d+rb min \d+rb/))
            totalPromoDiscount += amt;
          else totalVoucher += amt;
          return;
        }
        const pos = cleanLine.match(/(?:Rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})*)/);
        if (pos) {
          const amt = parseInt(pos[1].replace(/[.,]/g, ""));
          if (amt >= 100) totalPromoDiscount += amt;
        }
        return;
      }
      const qtyMatch = cleanLine.match(itemWithQtyPattern);
      if (qtyMatch) {
        const itemName = qtyMatch[2].trim(),
          totalPrice = qtyMatch[3].replace(/[.,]/g, "");
        if (itemName.length > 2 && totalPrice.length >= 3)
          detectedItems.push({
            id: Date.now() + Math.random() * 1000000 + index * 100,
            name: itemName,
            price: Math.round(
              parseInt(totalPrice) / parseInt(qtyMatch[1]),
            ).toString(),
            persons: {},
            priceType: "unit",
          });
        return;
      }
      const priceMatch = cleanLine.match(pricePattern);
      if (
        priceMatch &&
        !cleanLine.match(/fee|biaya|ongkir|delivery|tax|pajak/i)
      ) {
        const priceStr = priceMatch[1].replace(/[.,]/g, "");
        const itemName = cleanLine
          .substring(0, cleanLine.indexOf(priceMatch[0]))
          .replace(/^\d+x?\s*/, "")
          .trim();
        if (itemName && priceStr && itemName.length > 2 && priceStr.length >= 3)
          detectedItems.push({
            id: Date.now() + Math.random() * 1000000 + index * 100,
            name: itemName,
            price: priceStr,
            persons: {},
            priceType: "unit",
          });
      }
    });
    const taxMatch = text.match(/(?:tax|pajak|ppn|pb1).*?(\d+)%/i);
    const serviceMatch = text.match(
      /(?:service|layanan|order fee|admin).*?(?:Rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})*)/i,
    );
    const deliveryMatch = text.match(
      /(?:delivery|ongkir|ongkos kirim|delivery fee).*?(?:Rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})*)/i,
    );
    return {
      items: detectedItems,
      tax: taxMatch ? taxMatch[1] : "",
      biayaLayanan: serviceMatch ? serviceMatch[1].replace(/[.,]/g, "") : "",
      ongkir: deliveryMatch ? deliveryMatch[1].replace(/[.,]/g, "") : "",
      diskon: totalPromoDiscount > 0 ? totalPromoDiscount.toString() : "",
      voucher: totalVoucher > 0 ? totalVoucher.toString() : "",
    };
  };

  const handleScanReceipt = async (file: File) => {
    if (!file) return;
    setIsScanning(true);
    setScanProgress(0);
    setCaptureStatus(t.scanningReceipt);
    try {
      const {
        data: { text },
      } = await recognize(file, "ind+eng", {
        logger: (m) => {
          if (m.status === "recognizing text")
            setScanProgress(Math.round(m.progress * 100));
        },
      });
      const parsed = parseReceiptText(text);
      if (parsed.items.length > 0) setItems(parsed.items);
      if (parsed.tax) setTax(parsed.tax);
      if (parsed.biayaLayanan) setBiayaLayanan(parsed.biayaLayanan);
      if (parsed.ongkir) setOngkir(parsed.ongkir);
      if (parsed.diskon) setDiskon(parsed.diskon);
      if (parsed.voucher) setVoucher(parsed.voucher);
      setCaptureStatus(`${t.scanSuccess} ${parsed.items.length} ${t.items}`);
    } catch (error) {
      console.error(error);
      setCaptureStatus(t.scanFailed);
    }
    setTimeout(() => {
      setIsScanning(false);
      setScanProgress(0);
      setCaptureStatus("");
    }, 3000);
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type.startsWith("image/")) handleScanReceipt(file);
      else {
        setCaptureStatus(t.fileMustBeImage);
        setTimeout(() => setCaptureStatus(""), 2000);
      }
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) handleScanReceipt(file);
        break;
      }
    }
  };

  useEffect(() => {
    document.addEventListener("paste", handlePaste as EventListener);
    return () =>
      document.removeEventListener("paste", handlePaste as EventListener);
  }, []);

  const handleCapture = async (actionType: "download" | "copy") => {
    if (!summaryRef.current) return;
    setIsCapturing(true);
    if (actionType === "download") setDownloadStatus(t.processing);
    else setCaptureStatus(t.processing);
    try {
      await document.fonts.ready;
      const dataUrl = await domtoimage.toPng(summaryRef.current, {
        quality: 1,
        bgcolor: darkMode ? "#1f2937" : "#ffffff",
        style: {
          transform: "scale(5)",
          transformOrigin: "top left",
          width: summaryRef.current.offsetWidth + "px",
          height: summaryRef.current.offsetHeight + "px",
        },
        width: summaryRef.current.offsetWidth * 5,
        height: summaryRef.current.offsetHeight * 5,
      });
      if (actionType === "download") {
        const link = document.createElement("a");
        link.download = `split-bill-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        setDownloadStatus(t.downloaded);
      } else {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCaptureStatus(t.copied);
        } catch {
          setCaptureStatus(t.failedToCopy);
        }
      }
    } catch {
      if (actionType === "download") setDownloadStatus(t.failedToProcess);
      else setCaptureStatus(t.failedToProcess);
    }
    setTimeout(() => {
      setCaptureStatus("");
      setDownloadStatus("");
      setIsCapturing(false);
    }, 2000);
  };

  const handlePaymentCopy = async () => {
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
  };

  const formatCalcDisplay = (value: string) => {
    if (!value || value === "0") return "0";
    if (value.endsWith("."))
      return Number(value.slice(0, -1)).toLocaleString("en-US") + ".";
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    const parts = value.split(".");
    return parts[1] !== undefined
      ? `${Number(parts[0]).toLocaleString("en-US")}.${parts[1]}`
      : Number(parts[0]).toLocaleString("en-US");
  };

  const handleCalcNumber = (num: string) =>
    setCalcDisplay((prev) => {
      if (num === ".") {
        if (prev.includes(".")) return prev;
        return prev === "0" ? "0." : prev + ".";
      }
      return prev === "0" ? num : prev + num;
    });
  const handleCalcOperation = (op: string) => {
    const current = parseFloat(calcDisplay);
    if (calcPrevValue === null) {
      setCalcHistory(formatCalcDisplay(calcDisplay) + " " + op);
      setCalcPrevValue(current);
    } else {
      let result = 0;
      switch (calcOperation) {
        case "+":
          result = calcPrevValue + current;
          break;
        case "-":
          result = calcPrevValue - current;
          break;
        case "×":
          result = calcPrevValue * current;
          break;
        case "÷":
          result = current !== 0 ? calcPrevValue / current : 0;
          break;
      }
      setCalcHistory(formatCalcDisplay(result.toString()) + " " + op);
      setCalcPrevValue(result);
      setCalcDisplay(result.toString());
    }
    setCalcOperation(op);
    setCalcDisplay("0");
  };
  const handleCalcEquals = () => {
    if (calcPrevValue === null || calcOperation === null) return;
    const current = parseFloat(calcDisplay);
    let result = 0;
    switch (calcOperation) {
      case "+":
        result = calcPrevValue + current;
        break;
      case "-":
        result = calcPrevValue - current;
        break;
      case "×":
        result = calcPrevValue * current;
        break;
      case "÷":
        result = current !== 0 ? calcPrevValue / current : 0;
        break;
    }
    setCalcHistory(calcHistory + " " + formatCalcDisplay(calcDisplay));
    setCalcDisplay(result.toString());
    setCalcPrevValue(null);
    setCalcOperation(null);
  };
  const handleCalcClear = () => {
    setCalcDisplay("0");
    setCalcPrevValue(null);
    setCalcOperation(null);
    setCalcHistory("");
  };
  const handleCalcBackspace = () =>
    setCalcDisplay((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)));

  const togglePayment = (person: string) =>
    setPaymentStatus((prev) => ({ ...prev, [person]: !prev[person] }));

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-6 px-3 sm:py-8 sm:px-4 font-sans transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-300 dark:border-gray-700 transition-colors">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  title={t.tooltipLanguage}
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase">
                    {language}
                  </span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    title={
                      darkMode ? "Switch to light mode" : "Switch to dark mode"
                    }
                  >
                    {darkMode ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => setShowCalculator(!showCalculator)}
                    className="hidden md:flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    title={t.tooltipCalculator}
                  >
                    <Calculator className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowPaymentTracker(!showPaymentTracker)}
                    className="hidden md:flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    title={t.tooltipPaymentTracker}
                  >
                    <ListChecks className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowOCR(!showOCR)}
                    className="flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    title={t.tooltipOCR}
                  >
                    {showOCR ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => setShowResetModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800"
                    title={t.tooltipReset}
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {t.title}
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
              {t.subtitle}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {appVersion} • {t.autoSaved}
            </p>
          </div>

          {showOCR && (
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] && handleScanReceipt(e.target.files[0])
                }
                className="hidden"
              />
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${isDragging ? "border-gray-900 dark:border-gray-300 bg-gray-50 dark:bg-gray-700 scale-[1.02]" : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"} ${isScanning ? "pointer-events-none opacity-50" : ""}`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`rounded-full p-4 transition-colors ${isDragging ? "bg-gray-900 dark:bg-gray-300" : "bg-gray-100 dark:bg-gray-700"}`}
                  >
                    <Camera
                      className={`w-8 h-8 ${isDragging ? "text-white dark:text-gray-900" : "text-gray-600 dark:text-gray-300"}`}
                    />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {isDragging ? t.dropToScan : t.scanReceipt}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t.scanReceiptDesc}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {t.scanReceiptFormat}
                    </p>
                  </div>
                  {!isScanning && (
                    <button
                      type="button"
                      className="mt-2 inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-700 text-white px-6 py-2.5 rounded-lg hover:bg-black dark:hover:bg-gray-600 transition shadow-sm font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerFileInput();
                      }}
                    >
                      <Upload className="w-5 h-5" />
                      {t.chooseFile}
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex gap-2 items-center">
                <span className="text-amber-600 text-lg flex-shrink-0 leading-none mt-0.5">
                  ⚠️
                </span>
                <div className="text-xs text-amber-800 dark:text-amber-200 flex-1">
                  <span className="font-semibold">{t.noteTitle}</span>{" "}
                  {t.noteDesc}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 mb-6 border-2 border-gray-300 dark:border-gray-700 shadow-md">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {t.peopleList}
                </h2>
              </div>
              <button
                onClick={() => {
                  setBulkInsertText("");
                  setShowBulkInsert(true);
                }}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {t.bulkInsert}
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mb-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newPersonName}
                  onChange={(e) => {
                    setNewPersonName(e.target.value);
                    setDuplicatePersonError(false);
                    setShowPersonSuggestions(true);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && addPerson()}
                  onFocus={() => setShowPersonSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowPersonSuggestions(false), 150)
                  }
                  placeholder={t.personNamePlaceholder}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-base sm:text-sm ${duplicatePersonError ? "border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-gray-900 dark:focus:ring-gray-500 focus:border-gray-900 dark:focus:border-gray-500"}`}
                  title={t.tooltipPersonName}
                />
                {showPersonSuggestions &&
                  newPersonName.trim() &&
                  (() => {
                    const suggestions = persons.filter((p) =>
                      p
                        .toLowerCase()
                        .includes(newPersonName.trim().toLowerCase()),
                    );
                    return suggestions.length > 0 ? (
                      <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
                        {suggestions.map((s) => (
                          <li key={s}>
                            <button
                              type="button"
                              onMouseDown={() => {
                                setNewPersonName(s);
                                setShowPersonSuggestions(false);
                                setDuplicatePersonError(false);
                              }}
                              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                              {s}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null;
                  })()}
              </div>
              <button
                onClick={addPerson}
                className="bg-gray-900 dark:bg-gray-700 text-white px-6 py-2.5 rounded-lg hover:bg-black dark:hover:bg-gray-600 transition shadow-sm font-medium"
                title={t.tooltipAddPerson}
              >
                {t.add}
              </button>
            </div>
            {duplicatePersonError && (
              <p className="text-xs text-red-500 dark:text-red-400 mb-3">
                {t.duplicatePerson}
              </p>
            )}
            {persons.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic mt-3">
                {t.noPeopleAdded}
              </p>
            ) : (
              <>
                <div className="relative mt-3 mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    value={personSearch}
                    onChange={(e) => setPersonSearch(e.target.value)}
                    placeholder={t.searchPeoplePlaceholder}
                    className="w-full pl-9 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-500 focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  />
                  {personSearch && (
                    <button
                      onClick={() => setPersonSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
                {(() => {
                  const filtered = persons.filter((p) =>
                    p.toLowerCase().includes(personSearch.toLowerCase()),
                  );
                  return filtered.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic py-3">
                      {t.noSearchResults}
                    </p>
                  ) : (
                    <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                      {filtered.map((person) => (
                        <li
                          key={person}
                          className="flex items-center justify-between py-2.5 px-4"
                        >
                          <span className="flex items-center gap-2.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="8" r="4" />
                              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                            </svg>
                            {person}
                          </span>
                          <button
                            onClick={() => removePerson(person)}
                            className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition p-1 rounded"
                            title={t.tooltipRemovePerson}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 mb-6 border-2 border-gray-300 dark:border-gray-700 shadow-md">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
              <DollarSign className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {t.itemsList}
              </h2>
            </div>
            <div className="space-y-6">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleItemDragStart(e, index)}
                  onDragOver={(e) => handleItemDragOver(e, index)}
                  onDragEnd={handleItemDragEnd}
                  className={`bg-white dark:bg-gray-700 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-md relative group transition-all ${draggedItem === index ? "opacity-50" : ""} ${dragOverIndex === index && draggedItem !== index ? "border-gray-900 dark:border-gray-300 border-2" : ""}`}
                >
                  <div className="flex gap-3 items-start mb-3">
                    <button className="hidden sm:block cursor-grab active:cursor-grabbing p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition">
                      <GripVertical className="w-5 h-5" />
                    </button>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(item.id, "name", e.target.value)
                        }
                        placeholder={`${t.itemPlaceholder}${index + 1}`}
                        className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-500 focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base sm:text-sm"
                        title={t.tooltipItemName}
                      />
                      <FormattedInput
                        value={item.price}
                        onChange={(val) => updateItem(item.id, "price", val)}
                        title={t.tooltipItemPrice}
                      />
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition shadow-sm h-[46px] w-[46px] sm:h-[42px] sm:w-[42px] flex items-center justify-center shrink-0"
                      title={t.tooltipDeleteItem}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mb-3 flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-300 font-medium">
                        {t.priceTypeLabel}:
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updateItem(item.id, "priceType", "unit")
                          }
                          className={`px-3 py-1 rounded-md text-xs font-medium transition border ${item.priceType === "unit" ? "bg-gray-900 dark:bg-gray-600 text-white border-gray-900 dark:border-gray-600" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                          title={t.tooltipPricePerUnit}
                        >
                          {t.pricePerUnit}
                        </button>
                        <button
                          onClick={() =>
                            updateItem(item.id, "priceType", "total")
                          }
                          className={`px-3 py-1 rounded-md text-xs font-medium transition border ${item.priceType === "total" ? "bg-gray-900 dark:bg-gray-600 text-white border-gray-900 dark:border-gray-600" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                          title={t.tooltipPriceTotal}
                        >
                          {t.priceTotal}
                        </button>
                      </div>
                    </div>
                    {Object.keys(item.persons).length > 0 && item.price && (
                      <span className="text-xs text-gray-400 dark:text-gray-300 break-all">
                        {(() => {
                          const totalQty = Object.values(item.persons).reduce(
                            (s, q) => s + (Number(q) || 0),
                            0,
                          );
                          const price = Number(item.price || 0);
                          if (totalQty === 0 || price === 0) return "";
                          return item.priceType === "unit"
                            ? `(${totalQty}x Rp ${formatMoney(price)} = Rp ${formatMoney(price * totalQty)})`
                            : `(Rp ${formatMoney(price)} ÷ ${totalQty} = Rp ${formatMoney(price / totalQty)})`;
                        })()}
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    {persons.length === 0 ? (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {t.addPeopleFirst}
                      </span>
                    ) : (
                      <>
                        <div className="relative mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500 pointer-events-none"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                          <input
                            type="text"
                            value={itemPersonSearch[item.id] || ""}
                            onChange={(e) =>
                              setItemPersonSearch((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                            placeholder={t.searchPeoplePlaceholder}
                            className="w-full pl-8 pr-8 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-500 focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                          />
                          {itemPersonSearch[item.id] && (
                            <button
                              onClick={() =>
                                setItemPersonSearch((prev) => ({
                                  ...prev,
                                  [item.id]: "",
                                }))
                              }
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3 h-3"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          )}
                        </div>
                        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                          {persons
                            .filter(
                              (p) =>
                                (itemPersonSearch[item.id] || "").trim() ===
                                  "" ||
                                p
                                  .toLowerCase()
                                  .includes(
                                    (
                                      itemPersonSearch[item.id] || ""
                                    ).toLowerCase(),
                                  ),
                            )
                            .map((person) => {
                              const quantity = item.persons[person] || 0;
                              const isSelected = quantity > 0;
                              return (
                                <li
                                  key={person}
                                  className="flex items-center justify-between py-2.5 gap-3"
                                >
                                  <button
                                    onClick={() =>
                                      togglePerson(item.id, person)
                                    }
                                    className="flex items-center gap-3 flex-1 text-left min-w-0"
                                    title={t.tooltipPersonSelect}
                                  >
                                    <span
                                      className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition ${isSelected ? "bg-gray-900 border-gray-900 dark:bg-gray-500 dark:border-gray-500" : "border-gray-300 dark:border-gray-600"}`}
                                    >
                                      {isSelected && (
                                        <svg
                                          className="w-2.5 h-2.5 text-white"
                                          viewBox="0 0 12 12"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <polyline points="1.5,6 4.5,9.5 10.5,2.5" />
                                        </svg>
                                      )}
                                    </span>
                                    <span
                                      className={`text-sm font-medium truncate ${isSelected ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}
                                    >
                                      {person}
                                    </span>
                                  </button>
                                  {isSelected && (
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (quantity > 1)
                                            setPersonQuantity(
                                              item.id,
                                              person,
                                              quantity - 1,
                                            );
                                        }}
                                        className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-bold text-base"
                                        title="Decrease quantity"
                                      >
                                        −
                                      </button>
                                      <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => {
                                          e.stopPropagation();
                                          const n = parseInt(e.target.value);
                                          if (!isNaN(n) && n >= 1)
                                            setPersonQuantity(
                                              item.id,
                                              person,
                                              n,
                                            );
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-10 py-0.5 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-500 rounded text-sm font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                      />
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPersonQuantity(
                                            item.id,
                                            person,
                                            quantity + 1,
                                          );
                                        }}
                                        className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-bold text-base"
                                        title="Increase quantity"
                                      >
                                        +
                                      </button>
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addItem}
              className="w-full mt-6 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 py-3 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition flex items-center justify-center gap-2"
              title={t.tooltipAddItem}
            >
              <Plus className="w-5 h-5" />
              {t.addItem}
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 mb-6 border-2 border-gray-300 dark:border-gray-700 shadow-md">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
              <CreditCard className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {t.additionalCosts}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormattedInput
                label={t.shipping}
                value={ongkir}
                onChange={setOngkir}
                title={t.tooltipShipping}
              />
              <FormattedInput
                label={t.serviceFee}
                value={biayaLayanan}
                onChange={setBiayaLayanan}
                title={t.tooltipServiceFee}
              />
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase mb-1">
                  {taxType === "percentage" ? t.taxPercentage : t.taxNominal}
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <FormattedInput
                      value={tax}
                      onChange={setTax}
                      type={taxType}
                      placeholder="0"
                      title={
                        taxType === "percentage"
                          ? t.tooltipTaxPercentage
                          : t.tooltipTaxNominal
                      }
                    />
                  </div>
                  <button
                    onClick={() =>
                      setTaxType(
                        taxType === "percentage" ? "currency" : "percentage",
                      )
                    }
                    className="px-3 py-2.5 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded-lg transition border border-gray-300 dark:border-gray-600 text-sm font-medium whitespace-nowrap flex items-center justify-center"
                  >
                    <Repeat className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <FormattedInput
                label={t.parking}
                value={parking}
                onChange={setParking}
                title={t.tooltipParking}
              />
              <FormattedInput
                label={t.promoDiscount}
                value={diskon}
                onChange={setDiskon}
                title={t.tooltipDiscount}
              />
              <FormattedInput
                label={t.voucher}
                value={voucher}
                onChange={setVoucher}
                title={t.tooltipVoucher}
              />
              <AccountSelector
                label={t.bankAccount}
                options={bankAccounts}
                selectedValue={selectedAccount}
                onChange={(v) => setSelectedAccount(v)}
                customName={customAccountName}
                customNumber={customAccountNumber}
                customVendor={customAccountVendor}
                onCustomNameChange={setCustomAccountName}
                onCustomNumberChange={setCustomAccountNumber}
                onCustomVendorChange={setCustomAccountVendor}
                onSaveCustomAccount={saveCustomAccount}
                onDeleteAccount={deleteBankAccount}
                t={t}
              />
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase mb-1">
                  {t.roundTo100}
                </label>
                <button
                  onClick={() => setRoundTo100(!roundTo100)}
                  className={`w-full px-4 py-2.5 rounded-lg border transition flex items-center justify-between ${roundTo100 ? "bg-gray-900 dark:bg-gray-600 text-white border-gray-900 dark:border-gray-600" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                  title={t.tooltipRounding}
                >
                  <span className="text-base sm:text-sm font-medium">
                    {roundTo100 ? t.rounded : t.notRounded}
                  </span>
                  <div
                    className={`w-10 h-5 rounded-full transition ${roundTo100 ? "bg-white dark:bg-gray-300" : "bg-gray-300 dark:bg-gray-600"} relative`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${roundTo100 ? "right-0.5 bg-gray-900 dark:bg-gray-600" : "left-0.5 bg-white dark:bg-gray-300"}`}
                    ></div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {subtotal > 0 && persons.length > 0 && (
            <>
              <div className="mb-6 overflow-hidden rounded-xl border-2 border-gray-300 dark:border-gray-700 shadow-md">
                <div
                  ref={summaryRef}
                  className="bg-white dark:bg-gray-800 p-5 sm:p-8"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="bg-gray-900 dark:bg-gray-700 rounded-full p-1.5">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide leading-none">
                      {t.paymentSummary}
                    </h2>
                  </div>
                  <div className="space-y-3 mb-5 text-sm border-b border-gray-300 dark:border-gray-600 pb-4">
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {t.orderSubtotal}
                      </span>
                      <span className="font-mono text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        Rp {formatMoney(subtotal)}
                      </span>
                    </div>
                    {sharedFees > 0 && (
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {t.sharedFees}
                        </span>
                        <span className="font-mono text-gray-900 dark:text-gray-100 whitespace-nowrap">
                          Rp {formatMoney(sharedFees)}
                        </span>
                      </div>
                    )}
                    {taxAmount > 0 && (
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {taxType === "percentage"
                            ? t.taxPercentage
                            : t.taxNominal}
                          {taxType === "percentage" ? ` (${tax}%)` : ""}:
                        </span>
                        <span className="font-mono text-gray-900 dark:text-gray-100 whitespace-nowrap">
                          Rp {formatMoney(taxAmount)}
                        </span>
                      </div>
                    )}
                    {totalDiscount > 0 && (
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {t.totalDiscount}
                        </span>
                        <span className="font-mono text-gray-900 dark:text-gray-100 whitespace-nowrap">
                          - Rp {formatMoney(totalDiscount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center gap-4 pt-2">
                      <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {t.total}
                      </span>
                      <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        Rp {formatMoney(grandTotal)}
                      </span>
                    </div>
                  </div>
                  {selectedAccount && selectedAccount !== "CUSTOM" && (
                    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 sm:p-5 mb-5">
                      <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                        <CreditCard className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                          {t.transferTo} {getSelectedAccountName()}
                        </span>
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight whitespace-nowrap">
                        {getSelectedAccountVendor()} -{" "}
                        {getSelectedAccountNumber()}
                      </div>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 text-xs uppercase tracking-widest">
                      {t.splitPerPerson}
                    </h3>
                    <div className="space-y-2">
                      {persons.map((person) => {
                        const personItems = getPersonItems(person);
                        const isOpen = openAccordions[person] || false;
                        return (
                          <div
                            key={person}
                            className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden"
                          >
                            <div
                              className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition"
                              title={t.tooltipViewDetails}
                              onClick={() => toggleAccordion(person)}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="font-medium text-gray-700 dark:text-gray-200 truncate">
                                  {person}
                                </span>
                                <button
                                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition flex-shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleAccordion(person);
                                  }}
                                >
                                  <ChevronDown
                                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                  />
                                </button>
                              </div>
                              <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 font-mono whitespace-nowrap flex-shrink-0 ml-4">
                                Rp{" "}
                                {formatMoneySplit(
                                  roundTo100
                                    ? roundToNearest100(
                                        personTotals[person] || 0,
                                      )
                                    : personTotals[person] || 0,
                                )}
                              </span>
                            </div>
                            {isOpen && (
                              <div className="border-t border-gray-100 dark:border-gray-600 p-3 bg-gray-50 dark:bg-gray-800">
                                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                  {t.orderDetails}
                                </div>
                                {personItems.length === 0 ? (
                                  <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                                    {t.noItems}
                                  </p>
                                ) : (
                                  <div className="space-y-3">
                                    <div className="space-y-2">
                                      {personItems.map((item) => {
                                        const itemPrice = Number(
                                          item.price || 0,
                                        );
                                        const quantity = Number(
                                          item.persons[person] || 0,
                                        );
                                        if (quantity === 0 || itemPrice === 0)
                                          return null;
                                        let displayPrice: number;
                                        if (item.priceType === "total") {
                                          const tp = Object.values(
                                            item.persons,
                                          ).reduce(
                                            (s, q) => s + (Number(q) || 0),
                                            0,
                                          );
                                          if (tp === 0) return null;
                                          displayPrice =
                                            (itemPrice / tp) * quantity;
                                        } else {
                                          displayPrice = itemPrice * quantity;
                                        }
                                        return (
                                          <div
                                            key={item.id}
                                            className="flex justify-between items-start gap-2 text-xs"
                                          >
                                            <div className="flex-1 min-w-0">
                                              <div className="font-medium text-gray-700 dark:text-gray-200 truncate">
                                                {item.name || t.itemPlaceholder}
                                                {quantity > 1 && (
                                                  <span className="text-blue-600 dark:text-blue-400 font-bold ml-1">
                                                    x{quantity}
                                                  </span>
                                                )}
                                              </div>
                                              {item.priceType === "total" && (
                                                <div className="text-gray-400 dark:text-gray-500 text-xs">
                                                  {t.priceTotal}: Rp{" "}
                                                  {formatMoney(itemPrice)} ÷{" "}
                                                  {Object.values(
                                                    item.persons,
                                                  ).reduce(
                                                    (s, q) =>
                                                      s + (Number(q) || 0),
                                                    0,
                                                  )}{" "}
                                                  portions
                                                </div>
                                              )}
                                            </div>
                                            <span className="font-mono text-gray-600 dark:text-gray-300 whitespace-nowrap flex-shrink-0">
                                              Rp {formatMoney(displayPrice)}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between items-center text-xs">
                                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                                        Order Subtotal:
                                      </span>
                                      <span className="font-mono font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                                        Rp{" "}
                                        {formatMoneySplit(
                                          personSubtotals[person] || 0,
                                        )}
                                      </span>
                                    </div>
                                    {sharedFees > 0 && persons.length > 0 && (
                                      <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                                        <span>Net Shared:</span>
                                        <span className="font-mono whitespace-nowrap">
                                          + Rp{" "}
                                          {formatMoneySplit(
                                            sharedFees / persons.length,
                                          )}
                                        </span>
                                      </div>
                                    )}
                                    {taxAmount > 0 && subtotal > 0 && (
                                      <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                                        <span>Tax:</span>
                                        <span className="font-mono whitespace-nowrap">
                                          + Rp{" "}
                                          {formatMoneySplit(
                                            taxAmount *
                                              (personSubtotals[person] /
                                                subtotal),
                                          )}
                                        </span>
                                      </div>
                                    )}
                                    {Number(voucher) > 0 && subtotal > 0 && (
                                      <div className="flex justify-between items-center text-xs text-green-600 dark:text-green-400">
                                        <span>Discount:</span>
                                        <span className="font-mono whitespace-nowrap">
                                          - Rp{" "}
                                          {formatMoneySplit(
                                            Number(voucher) *
                                              (personSubtotals[person] /
                                                subtotal),
                                          )}
                                        </span>
                                      </div>
                                    )}
                                    <div className="border-t border-gray-300 dark:border-gray-600 pt-2 flex justify-between items-center text-xs">
                                      <span className="font-bold text-gray-900 dark:text-gray-100">
                                        {t.total}:
                                      </span>
                                      <span className="font-mono font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                                        {roundTo100 &&
                                        (personTotals[person] || 0) !==
                                          roundToNearest100(
                                            personTotals[person] || 0,
                                          ) ? (
                                          <span className="inline-block">
                                            <span className="text-gray-400 dark:text-gray-500">
                                              Rp{" "}
                                              {formatMoneySplit(
                                                personTotals[person] || 0,
                                              )}
                                            </span>
                                            <span className="mx-1 text-gray-400 dark:text-gray-500">
                                              &rarr;
                                            </span>
                                            <span className="text-green-600 dark:text-green-400">
                                              Rp{" "}
                                              {formatMoneySplit(
                                                roundToNearest100(
                                                  personTotals[person] || 0,
                                                ),
                                              )}
                                            </span>
                                          </span>
                                        ) : (
                                          <span>
                                            Rp{" "}
                                            {formatMoneySplit(
                                              personTotals[person] || 0,
                                            )}
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleCapture("download")}
                  disabled={!!downloadStatus}
                  className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  title={t.tooltipDownload}
                >
                  <Download className="w-5 h-5" />
                  {downloadStatus || t.download}
                </button>
                <button
                  onClick={() => handleCapture("copy")}
                  disabled={!!captureStatus}
                  className="flex-1 bg-gray-900 dark:bg-gray-700 text-white py-3 rounded-lg hover:bg-black dark:hover:bg-gray-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-200 dark:shadow-gray-900"
                  title={t.tooltipCopy}
                >
                  <Copy className="w-5 h-5" />
                  {captureStatus || t.copyImage}
                </button>
              </div>
            </>
          )}

          {isScanning && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xs sm:max-w-sm">
              <div className="px-4 py-3 rounded-lg shadow-xl font-medium border text-sm sm:text-base bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white animate-fade-in">
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>{captureStatus}</span>
                </div>
                {scanProgress > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 dark:bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-white dark:bg-gray-900 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-center mt-1">
                      {scanProgress}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {showWhatsNew && changelog[language] && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 animate-fade-in">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-2xl animate-slide-down">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🎉</span>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {t.whatsNew}
                    </h3>
                    <span className="text-lg font-bold text-gray-400 dark:text-gray-500">
                      {appVersion}
                    </span>
                  </div>
                </div>
                <div className="space-y-4 mb-6">
                  {[
                    { key: "new" as const, label: t.whatsNewNew },
                    { key: "improved" as const, label: t.whatsNewImproved },
                    { key: "removed" as const, label: t.whatsNewRemoved },
                  ].map(({ key, label }) => {
                    const ci = changelog[language][key];
                    if (!ci || ci.length === 0) return null;
                    return (
                      <div key={key}>
                        <p className="text-xs font-bold uppercase tracking-wide mb-1.5 text-gray-400 dark:text-gray-500">
                          {label}
                        </p>
                        <ul className="space-y-1.5">
                          {ci.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                            >
                              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-gray-400 dark:bg-gray-500" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={dismissWhatsNew}
                  className="w-full px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition font-medium"
                >
                  {t.whatsNewClose}
                </button>
              </div>
            </div>
          )}

          {showBulkInsert && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-700 dark:text-gray-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {t.bulkInsertTitle}
                  </h3>
                </div>
                <textarea
                  value={bulkInsertText}
                  onChange={(e) => setBulkInsertText(e.target.value)}
                  rows={10}
                  placeholder={t.bulkInsertPlaceholder}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-500 focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm resize-none font-mono"
                />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setShowBulkInsert(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium text-sm"
                  >
                    {t.bulkInsertCancel}
                  </button>
                  <button
                    onClick={applyBulkInsert}
                    className="flex-1 px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-black dark:hover:bg-gray-300 transition font-medium text-sm"
                  >
                    {t.bulkInsertConfirm}
                  </button>
                </div>
              </div>
            </div>
          )}

          <ConfirmModal
            isOpen={showResetModal}
            onConfirm={resetAllData}
            onCancel={() => setShowResetModal(false)}
            title={t.resetTitle}
            message={t.resetMessage}
            confirmText={t.reset}
            cancelText={t.cancel}
          />
        </div>
      </div>

      {showCalculator && (
        <div
          className="hidden md:block fixed z-40 animate-fade-in"
          style={{ left: `${calcPos.x}px`, top: `${calcPos.y}px` }}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 w-64"
            onDoubleClick={(e) => {
              if (e.target === e.currentTarget)
                setCalcPos({ x: window.innerWidth - 280, y: 80 });
            }}
          >
            <div
              className="flex items-center justify-between mb-3 cursor-move"
              onMouseDown={(e) => {
                setIsDraggingWidget("calc");
                setDragOffset({
                  x: e.clientX - calcPos.x,
                  y: e.clientY - calcPos.y,
                });
              }}
              onDoubleClick={() =>
                setCalcPos({ x: window.innerWidth - 320, y: 80 })
              }
            >
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {t.widgetCalculator}
              </span>
              <button
                onClick={() => setShowCalculator(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                <span className="text-xl leading-none">×</span>
              </button>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-3">
              <div className="text-sm font-mono text-gray-500 dark:text-gray-400 text-right mb-1 h-5 truncate">
                {calcHistory || "\u00A0"}
              </div>
              <div className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100 text-right truncate">
                {formatCalcDisplay(calcDisplay)}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={handleCalcClear}
                className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
              >
                C
              </button>
              <button
                onClick={handleCalcBackspace}
                className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition text-xl"
              >
                ⌫
              </button>
              <button
                onClick={() => handleCalcOperation("÷")}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
              >
                ÷
              </button>
              <button
                onClick={() => handleCalcOperation("×")}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
              >
                ×
              </button>
              {["7", "8", "9"].map((n) => (
                <button
                  key={n}
                  onClick={() => handleCalcNumber(n)}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => handleCalcOperation("-")}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
              >
                -
              </button>
              {["4", "5", "6"].map((n) => (
                <button
                  key={n}
                  onClick={() => handleCalcNumber(n)}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => handleCalcOperation("+")}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
              >
                +
              </button>
              {["1", "2", "3"].map((n) => (
                <button
                  key={n}
                  onClick={() => handleCalcNumber(n)}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={handleCalcEquals}
                className="row-span-2 bg-gray-900 dark:bg-gray-600 hover:bg-black dark:hover:bg-gray-500 text-white rounded-lg py-3 font-semibold transition"
              >
                =
              </button>
              <button
                onClick={() => handleCalcNumber("0")}
                className="col-span-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
              >
                0
              </button>
              <button
                onClick={() => handleCalcNumber(".")}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
              >
                .
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaymentTracker && (
        <div
          className="hidden md:block fixed z-40 animate-fade-in"
          style={{
            left: `${paymentTrackerPos.x}px`,
            top: `${paymentTrackerPos.y}px`,
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-64">
            <div ref={paymentTrackerRef}>
              <div
                className="flex items-center justify-between px-4 py-3 cursor-move border-b border-gray-200 dark:border-gray-700 rounded-t-xl"
                onMouseDown={(e) => {
                  setIsDraggingWidget("payment");
                  setDragOffset({
                    x: e.clientX - paymentTrackerPos.x,
                    y: e.clientY - paymentTrackerPos.y,
                  });
                }}
                onDoubleClick={() =>
                  setPaymentTrackerPos({ x: window.innerWidth - 320, y: 620 })
                }
              >
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <ListChecks className="w-4 h-4" />
                  {t.widgetPaymentTracker}
                </span>
                <button
                  onClick={() => setShowPaymentTracker(false)}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition text-xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="p-3 max-h-80 overflow-y-auto">
                {persons.length === 0 ? (
                  <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">
                    {t.paymentNoPeople}
                  </p>
                ) : (
                  (() => {
                    const sr = calculateSplit();
                    const unpaid = persons.filter((p) => !paymentStatus[p]);
                    const paid = persons.filter((p) => paymentStatus[p]);
                    return (
                      <>
                        {unpaid.length > 0 && (
                          <div className="mb-2">
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 px-2 mb-1">
                              {t.paymentUnpaid} ({unpaid.length})
                            </div>
                            {unpaid.map((person) => (
                              <button
                                key={person}
                                onClick={() => togglePayment(person)}
                                className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-left transition hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <span
                                  className={`flex-1 min-w-0 text-sm font-medium truncate ${paymentStatus[person] ? "text-gray-400 dark:text-gray-500 line-through" : "text-gray-800 dark:text-gray-200"}`}
                                >
                                  {person}
                                </span>
                                <span className="text-xs font-mono flex-shrink-0 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                  Rp{" "}
                                  {formatMoneySplit(
                                    sr.personTotals[person] || 0,
                                  )}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                        {unpaid.length > 0 && paid.length > 0 && (
                          <div className="border-t border-gray-100 dark:border-gray-700 my-2" />
                        )}
                        {paid.length > 0 && (
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 px-2 mb-1">
                              {t.paymentPaid} ({paid.length})
                            </div>
                            {paid.map((person) => (
                              <button
                                key={person}
                                onClick={() => togglePayment(person)}
                                className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-left transition hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <span className="flex-1 min-w-0 text-sm font-medium truncate text-gray-400 dark:text-gray-500 line-through">
                                  {person}
                                </span>
                                <span className="text-xs font-mono flex-shrink-0 whitespace-nowrap text-gray-500 dark:text-gray-400">
                                  Rp{" "}
                                  {formatMoneySplit(
                                    sr.personTotals[person] || 0,
                                  )}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                        {paid.length > 0 && unpaid.length === 0 && (
                          <div className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500 font-medium py-1">
                            {t.paymentAllSettled}
                          </div>
                        )}
                      </>
                    );
                  })()
                )}
              </div>
            </div>
            <div className="px-3 pb-3">
              <button
                onClick={handlePaymentCopy}
                disabled={!!paymentCopyStatus}
                className="w-full bg-gray-900 dark:bg-gray-700 text-white py-2 rounded-lg hover:bg-black dark:hover:bg-gray-600 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                title={t.tooltipCopy}
              >
                <Copy className="w-4 h-4" />
                {paymentCopyStatus || t.copyImage}
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className="hidden md:block fixed z-40"
        style={{ left: `${clockPos.x}px`, top: `${clockPos.y}px` }}
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 cursor-move"
          onMouseDown={(e) => {
            setIsDraggingWidget("clock");
            setDragOffset({
              x: e.clientX - clockPos.x,
              y: e.clientY - clockPos.y,
            });
          }}
          onDoubleClick={() => setClockPos({ x: 24, y: 80 })}
        >
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="55"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-300 dark:text-gray-600"
            />
            {[...Array(12)].map((_, i) => {
              const angle = ((i * 30 - 90) * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={60 + 45 * Math.cos(angle)}
                  y1={60 + 45 * Math.sin(angle)}
                  x2={60 + 50 * Math.cos(angle)}
                  y2={60 + 50 * Math.sin(angle)}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-400 dark:text-gray-500"
                />
              );
            })}
            <line
              x1="60"
              y1="60"
              x2={
                60 +
                30 *
                  Math.cos(
                    (((currentTime.getHours() % 12) * 30 +
                      currentTime.getMinutes() * 0.5 -
                      90) *
                      Math.PI) /
                      180,
                  )
              }
              y2={
                60 +
                30 *
                  Math.sin(
                    (((currentTime.getHours() % 12) * 30 +
                      currentTime.getMinutes() * 0.5 -
                      90) *
                      Math.PI) /
                      180,
                  )
              }
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="text-gray-900 dark:text-gray-100"
            />
            <line
              x1="60"
              y1="60"
              x2={
                60 +
                40 *
                  Math.cos(
                    ((currentTime.getMinutes() * 6 - 90) * Math.PI) / 180,
                  )
              }
              y2={
                60 +
                40 *
                  Math.sin(
                    ((currentTime.getMinutes() * 6 - 90) * Math.PI) / 180,
                  )
              }
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-gray-700 dark:text-gray-300"
            />
            <line
              x1="60"
              y1="60"
              x2={
                60 +
                45 *
                  Math.cos(
                    ((currentTime.getSeconds() * 6 - 90) * Math.PI) / 180,
                  )
              }
              y2={
                60 +
                45 *
                  Math.sin(
                    ((currentTime.getSeconds() * 6 - 90) * Math.PI) / 180,
                  )
              }
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-gray-500 dark:text-gray-400"
            />
            <circle
              cx="60"
              cy="60"
              r="3"
              fill="currentColor"
              className="text-gray-900 dark:text-gray-100"
            />
          </svg>
          <div className="mt-3 text-center">
            <div className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SplitBill;
