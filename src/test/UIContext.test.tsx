import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { APP_VERSION, DEFAULT_ITEM, VERSION_KEY } from "../utils/constants";

const useBillDataMock = vi.fn();
const useOCRMock = vi.fn();
const useClipboardMock = vi.fn();
const useCalculatorMock = vi.fn();
const useDragWidgetMock = vi.fn();

vi.mock("../context/BillDataContext", () => ({
  useBillData: () => useBillDataMock(),
}));

vi.mock("../hooks/useDarkMode", () => ({
  useDarkMode: () => [false, vi.fn()],
}));

vi.mock("../hooks/useLanguage", () => ({
  useLanguage: () => ["en", vi.fn(), { title: "Split Bill" }],
}));

vi.mock("../hooks/useOCR", () => ({
  useOCR: (args: unknown) => useOCRMock(args),
}));

vi.mock("../hooks/useClipboard", () => ({
  useClipboard: (args: unknown) => useClipboardMock(args),
}));

vi.mock("../hooks/useCalculator", () => ({
  useCalculator: () => useCalculatorMock(),
}));

vi.mock("../hooks/useDragWidget", () => ({
  useDragWidget: () => useDragWidgetMock(),
}));

import { UIProvider, useUI } from "../context/UIContext";

const wrapper = ({ children }: { children: React.ReactNode }) => <UIProvider>{children}</UIProvider>;

function makeBillData(overrides: Record<string, unknown> = {}) {
  return {
    items: [{ ...DEFAULT_ITEM }],
    setItems: vi.fn(),
    persons: [],
    setPersons: vi.fn(),
    setTax: vi.fn(),
    setBiayaLayanan: vi.fn(),
    setOngkir: vi.fn(),
    setDiskon: vi.fn(),
    setVoucher: vi.fn(),
    bankAccounts: [{ name: "Custom", number: "CUSTOM", vendor: "Custom" }],
    setBankAccounts: vi.fn(),
    selectedAccount: null,
    setSelectedAccount: vi.fn(),
    customAccountName: "",
    setCustomAccountName: vi.fn(),
    customAccountNumber: "",
    setCustomAccountNumber: vi.fn(),
    customAccountVendor: "",
    setCustomAccountVendor: vi.fn(),
    setRoundTo100: vi.fn(),
    setPaymentStatus: vi.fn(),
    setTaxType: vi.fn(),
    setParking: vi.fn(),
    paymentStatus: {},
    ...overrides,
  };
}

describe("UIContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useOCRMock.mockReturnValue({});
    useClipboardMock.mockReturnValue({});
    useCalculatorMock.mockReturnValue({});
    useDragWidgetMock.mockReturnValue({
      clockPos: { x: 24, y: 80 },
      calcPos: { x: 200, y: 80 },
      paymentTrackerPos: { x: 200, y: 620 },
      handleDragStart: vi.fn(),
      handleDragEnd: vi.fn(),
      resetCalcPos: vi.fn(),
      resetClockPos: vi.fn(),
      resetPaymentTrackerPos: vi.fn(),
    });
    useBillDataMock.mockReturnValue(makeBillData());
  });

  it("throws when useUI is used outside provider", () => {
    expect(() => renderHook(() => useUI())).toThrow("useUI must be used within UIProvider");
  });

  it("addPerson adds a non-duplicate person and initializes payment status", () => {
    const billData = makeBillData();
    useBillDataMock.mockReturnValue(billData);

    const { result } = renderHook(() => useUI(), { wrapper });

    act(() => {
      result.current.setNewPersonName("Alice");
    });
    act(() => {
      result.current.addPerson();
    });

    expect(billData.setPersons).toHaveBeenCalled();
    const setPersonsArg = billData.setPersons.mock.calls[0][0];
    expect(setPersonsArg([])).toEqual(["Alice"]);

    const setPaymentArg = billData.setPaymentStatus.mock.calls[0][0];
    expect(setPaymentArg({})).toEqual({ Alice: false });
    expect(result.current.newPersonName).toBe("");
  });

  it("addPerson marks duplicate error for existing person", () => {
    const billData = makeBillData({ persons: ["Alice"] });
    useBillDataMock.mockReturnValue(billData);

    const { result } = renderHook(() => useUI(), { wrapper });

    act(() => {
      result.current.setNewPersonName("alice");
    });
    act(() => {
      result.current.addPerson();
    });

    expect(result.current.duplicatePersonError).toBe(true);
    expect(billData.setPersons).not.toHaveBeenCalled();
  });

  it("saveCustomAccount adds unique account and selects it", () => {
    const billData = makeBillData({
      customAccountName: "John",
      customAccountNumber: "12345",
      customAccountVendor: "BCA",
    });
    useBillDataMock.mockReturnValue(billData);

    const { result } = renderHook(() => useUI(), { wrapper });

    act(() => {
      result.current.saveCustomAccount();
    });

    const updater = billData.setBankAccounts.mock.calls[0][0];
    expect(updater([{ name: "Custom", number: "CUSTOM", vendor: "Custom" }])[1]).toEqual({
      name: "John",
      number: "12345",
      vendor: "BCA",
    });
    expect(billData.setSelectedAccount).toHaveBeenCalledWith("12345");
    expect(billData.setCustomAccountName).toHaveBeenCalledWith("");
  });

  it("saveCustomAccount ignores duplicate account numbers", () => {
    const billData = makeBillData({
      bankAccounts: [
        { name: "Custom", number: "CUSTOM", vendor: "Custom" },
        { name: "Alice", number: "12345", vendor: "BCA" },
      ],
      customAccountName: "John",
      customAccountNumber: "12345",
      customAccountVendor: "BCA",
    });
    useBillDataMock.mockReturnValue(billData);

    const { result } = renderHook(() => useUI(), { wrapper });

    act(() => {
      result.current.saveCustomAccount();
    });

    expect(billData.setBankAccounts).not.toHaveBeenCalled();
  });

  it("applyBulkInsert merges people/items and closes modal", () => {
    const billData = makeBillData({
      persons: ["Alice"],
      items: [
        { id: 1, name: "Pizza", price: "", persons: { Alice: 1 }, priceType: "unit" },
        { id: 2, name: "", price: "", persons: {}, priceType: "unit" },
      ],
    });
    useBillDataMock.mockReturnValue(billData);

    const { result } = renderHook(() => useUI(), { wrapper });

    act(() => {
      result.current.setBulkInsertText("Bob:Pizza\nCharlie:Burger");
    });
    act(() => {
      result.current.applyBulkInsert();
    });

    expect(billData.setPersons).toHaveBeenCalledWith(["Alice", "Bob", "Charlie"]);
    const paymentUpdater = billData.setPaymentStatus.mock.calls[0][0];
    expect(paymentUpdater({})).toEqual({ Bob: false, Charlie: false });

    const setItemsArg = billData.setItems.mock.calls[0][0];
    expect(setItemsArg.find((i: any) => i.name === "Pizza").persons).toEqual({ Alice: 1, Bob: 1 });
    expect(setItemsArg.some((i: any) => i.name === "Burger" && i.persons.Charlie === 1)).toBe(true);
    expect(result.current.bulkInsertText).toBe("");
    expect(result.current.showBulkInsert).toBe(false);
  });

  it("handle item drag reorders items", () => {
    const billData = makeBillData({
      items: [
        { id: 1, name: "First", price: "", persons: {}, priceType: "unit" },
        { id: 2, name: "Second", price: "", persons: {}, priceType: "unit" },
      ],
    });
    useBillDataMock.mockReturnValue(billData);

    const { result } = renderHook(() => useUI(), { wrapper });

    act(() => {
      result.current.handleItemDragStart({} as React.DragEvent, 0);
    });
    act(() => {
      result.current.handleItemDragOver({ preventDefault: vi.fn() } as any, 1);
    });
    act(() => {
      result.current.handleItemDragEnd();
    });

    expect(billData.setItems).toHaveBeenCalledWith([
      { id: 2, name: "Second", price: "", persons: {}, priceType: "unit" },
      { id: 1, name: "First", price: "", persons: {}, priceType: "unit" },
    ]);
  });

  it("dismissWhatsNew persists current version", () => {
    localStorage.setItem(VERSION_KEY, "old");
    useBillDataMock.mockReturnValue(makeBillData());

    const { result } = renderHook(() => useUI(), { wrapper });

    expect(result.current.showWhatsNew).toBe(true);

    act(() => {
      result.current.dismissWhatsNew();
    });

    expect(localStorage.getItem(VERSION_KEY)).toBe(APP_VERSION);
    expect(result.current.showWhatsNew).toBe(false);
  });
});
