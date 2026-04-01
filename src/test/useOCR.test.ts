import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOCR } from "../hooks/useOCR";

const recognizeMock = vi.fn();
const parseReceiptTextMock = vi.fn();

vi.mock("tesseract.js", () => ({
  recognize: (...args: unknown[]) => recognizeMock(...args),
}));

vi.mock("../utils/receiptParser", () => ({
  parseReceiptText: (...args: unknown[]) => parseReceiptTextMock(...args),
}));

const t = {
  scanningReceipt: "Scanning...",
  scanSuccess: "Scanned",
  items: "items",
  scanFailed: "Scan failed",
  fileMustBeImage: "File must be image",
} as any;

function createDeps() {
  return {
    setItems: vi.fn(),
    setTax: vi.fn(),
    setBiayaLayanan: vi.fn(),
    setOngkir: vi.fn(),
    setDiskon: vi.fn(),
    setVoucher: vi.fn(),
  };
}

describe("useOCR", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("scans receipt successfully and applies parsed fields", async () => {
    const deps = createDeps();
    recognizeMock.mockImplementation(async (_file, _lang, opts) => {
      opts.logger({ status: "recognizing text", progress: 0.52 });
      return { data: { text: "raw text" } };
    });
    parseReceiptTextMock.mockReturnValue({
      items: [{ id: 1, name: "Nasi", price: "10000", persons: {}, priceType: "unit" }],
      tax: "10",
      biayaLayanan: "5000",
      ongkir: "12000",
      diskon: "2000",
      voucher: "1000",
    });

    const { result } = renderHook(() => useOCR({ t, ...deps }));
    const file = new File(["img"], "receipt.png", { type: "image/png" });

    await act(async () => {
      await result.current.handleScanReceipt(file);
    });

    expect(result.current.scanProgress).toBe(52);
    expect(deps.setItems).toHaveBeenCalledWith([{ id: 1, name: "Nasi", price: "10000", persons: {}, priceType: "unit" }]);
    expect(deps.setTax).toHaveBeenCalledWith("10");
    expect(deps.setBiayaLayanan).toHaveBeenCalledWith("5000");
    expect(deps.setOngkir).toHaveBeenCalledWith("12000");
    expect(deps.setDiskon).toHaveBeenCalledWith("2000");
    expect(deps.setVoucher).toHaveBeenCalledWith("1000");
    expect(result.current.captureStatus).toBe("Scanned 1 items");

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.isScanning).toBe(false);
    expect(result.current.scanProgress).toBe(0);
    expect(result.current.captureStatus).toBe("");
  });

  it("sets failure status when OCR throws", async () => {
    const deps = createDeps();
    recognizeMock.mockRejectedValue(new Error("ocr error"));

    const { result } = renderHook(() => useOCR({ t, ...deps }));
    const file = new File(["img"], "receipt.png", { type: "image/png" });

    await act(async () => {
      await result.current.handleScanReceipt(file);
    });

    expect(result.current.captureStatus).toBe("Scan failed");

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.captureStatus).toBe("");
    expect(result.current.isScanning).toBe(false);
  });

  it("handles non-image drop with temporary warning", async () => {
    const deps = createDeps();
    const { result } = renderHook(() => useOCR({ t, ...deps }));

    const event = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        files: [new File(["doc"], "receipt.txt", { type: "text/plain" })],
      },
    } as any;

    act(() => {
      result.current.handleDrop(event);
    });

    expect(result.current.captureStatus).toBe("File must be image");

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.captureStatus).toBe("");
  });
});
