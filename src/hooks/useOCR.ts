import { useState, useRef, useCallback, useEffect } from "react";
import { recognize } from "tesseract.js";
import { parseReceiptText } from "../utils/receiptParser";
import type { BillItem } from "../types";
import type { Translations } from "../translations";

interface UseOCRInput {
  t: Translations;
  setItems: (items: BillItem[] | ((prev: BillItem[]) => BillItem[])) => void;
  setTax: (tax: string) => void;
  setBiayaLayanan: (biaya: string) => void;
  setOngkir: (ongkir: string) => void;
  setDiskon: (diskon: string) => void;
  setVoucher: (voucher: string) => void;
}

export function useOCR({
  t,
  setItems,
  setTax,
  setBiayaLayanan,
  setOngkir,
  setDiskon,
  setVoucher,
}: UseOCRInput) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [captureStatus, setCaptureStatus] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScanReceipt = useCallback(
    async (file: File) => {
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
    },
    [t, setItems, setTax, setBiayaLayanan, setOngkir, setDiskon, setVoucher],
  );

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
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
    },
    [handleScanReceipt, t.fileMustBeImage],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
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
    },
    [handleScanReceipt],
  );

  useEffect(() => {
    document.addEventListener("paste", handlePaste as EventListener);
    return () =>
      document.removeEventListener("paste", handlePaste as EventListener);
  }, [handlePaste]);

  return {
    isScanning,
    scanProgress,
    captureStatus,
    isDragging,
    handleScanReceipt,
    triggerFileInput,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handlePaste,
    fileInputRef,
  };
}
