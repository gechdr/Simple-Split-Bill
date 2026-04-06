import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { BillDataProvider, useBillData } from "../context/BillDataContext";

// Wrap in BillDataProvider for each test
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <BillDataProvider>{children}</BillDataProvider>
);

// localStorage is populated between tests; clear it before each
beforeEach(() => {
  localStorage.clear();
});

describe("BillDataContext — items", () => {
  it("starts with one default empty item", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe("");
  });

  it("addItem appends a new empty item", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    act(() => result.current.addItem());
    expect(result.current.items).toHaveLength(2);
  });

  it("removeItem deletes by id", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    const id = result.current.items[0].id;
    act(() => result.current.removeItem(id));
    expect(result.current.items).toHaveLength(0);
  });

  it("updateItem changes a field", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    const id = result.current.items[0].id;
    act(() => result.current.updateItem(id, "name", "Pizza"));
    expect(result.current.items[0].name).toBe("Pizza");
  });

  it("updateItem changes price field", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    const id = result.current.items[0].id;
    act(() => result.current.updateItem(id, "price", "25000"));
    expect(result.current.items[0].price).toBe("25000");
  });

  it("updateItem changes priceType to total", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    const id = result.current.items[0].id;
    act(() => result.current.updateItem(id, "priceType", "total"));
    expect(result.current.items[0].priceType).toBe("total");
  });
});

describe("BillDataContext — persons", () => {
  it("starts with no persons", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    expect(result.current.persons).toHaveLength(0);
  });

  it("removePerson removes from persons array", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    act(() => result.current.setPersons(["Alice", "Bob"]));
    act(() => result.current.removePerson("Alice"));
    expect(result.current.persons).toEqual(["Bob"]);
  });

  it("removePerson removes person from item assignments", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    act(() => {
      result.current.setPersons(["Alice", "Bob"]);
      const id = result.current.items[0].id;
      result.current.updateItem(id, "persons", { Alice: 1, Bob: 1 });
    });
    act(() => result.current.removePerson("Alice"));
    expect(result.current.items[0].persons["Alice"]).toBeUndefined();
    expect(result.current.items[0].persons["Bob"]).toBe(1);
  });

  it("removePerson removes from paymentStatus", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    act(() => {
      result.current.setPersons(["Alice"]);
      result.current.setPaymentStatus({ Alice: false });
    });
    act(() => result.current.removePerson("Alice"));
    expect(result.current.paymentStatus["Alice"]).toBeUndefined();
  });
});

describe("BillDataContext — togglePerson", () => {
  it("adds person to item with quantity 1", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    act(() => result.current.setPersons(["Alice"]));
    const id = result.current.items[0].id;
    act(() => result.current.togglePerson(id, "Alice"));
    expect(result.current.items[0].persons["Alice"]).toBe(1);
  });

  it("removes person from item when toggled again", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    act(() => result.current.setPersons(["Alice"]));
    const id = result.current.items[0].id;
    act(() => {
      result.current.updateItem(id, "persons", { Alice: 1 });
    });
    act(() => result.current.togglePerson(id, "Alice"));
    expect(result.current.items[0].persons["Alice"]).toBeUndefined();
  });
});

describe("BillDataContext — setPersonQuantity", () => {
  it("sets quantity for a person", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    act(() => result.current.setPersons(["Alice"]));
    const id = result.current.items[0].id;
    act(() => {
      result.current.updateItem(id, "persons", { Alice: 1 });
      result.current.setPersonQuantity(id, "Alice", 3);
    });
    expect(result.current.items[0].persons["Alice"]).toBe(3);
  });

  it("removes person when quantity set to 0", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    const id = result.current.items[0].id;
    act(() => {
      result.current.updateItem(id, "persons", { Alice: 2 });
      result.current.setPersonQuantity(id, "Alice", 0);
    });
    expect(result.current.items[0].persons["Alice"]).toBeUndefined();
  });

  it("removes person when quantity is negative", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    const id = result.current.items[0].id;
    act(() => {
      result.current.updateItem(id, "persons", { Alice: 2 });
      result.current.setPersonQuantity(id, "Alice", -1);
    });
    expect(result.current.items[0].persons["Alice"]).toBeUndefined();
  });
});

describe("BillDataContext — bank accounts", () => {
  it("starts with default CUSTOM bank account", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    expect(result.current.bankAccounts[0].number).toBe("CUSTOM");
  });

  it("deleteBankAccount removes a non-CUSTOM account", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    act(() => {
      result.current.setBankAccounts([
        { name: "Custom", number: "CUSTOM", vendor: "Custom" },
        { name: "Alice", number: "1234567890", vendor: "BCA" },
      ]);
    });
    act(() => result.current.deleteBankAccount("1234567890"));
    expect(result.current.bankAccounts).toHaveLength(1);
    expect(result.current.bankAccounts[0].number).toBe("CUSTOM");
  });

  it("deleteBankAccount does not remove CUSTOM account", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    const initialLength = result.current.bankAccounts.length;
    act(() => result.current.deleteBankAccount("CUSTOM"));
    expect(result.current.bankAccounts).toHaveLength(initialLength);
  });

  it("deleteBankAccount clears selectedAccount when it matches", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    act(() => {
      result.current.setBankAccounts([
        { name: "Custom", number: "CUSTOM", vendor: "Custom" },
        { name: "Alice", number: "1234567890", vendor: "BCA" },
      ]);
      result.current.setSelectedAccount("1234567890");
    });
    act(() => result.current.deleteBankAccount("1234567890"));
    expect(result.current.selectedAccount).toBeNull();
  });
});

describe("BillDataContext — togglePayment", () => {
  it("toggles payment status from false to true", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    act(() => result.current.setPaymentStatus({ Alice: false }));
    act(() => result.current.togglePayment("Alice"));
    expect(result.current.paymentStatus["Alice"]).toBe(true);
  });

  it("toggles payment status from true to false", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    act(() => result.current.setPaymentStatus({ Alice: true }));
    act(() => result.current.togglePayment("Alice"));
    expect(result.current.paymentStatus["Alice"]).toBe(false);
  });
});

describe("BillDataContext — getPersonItems", () => {
  it("returns only items where person has quantity > 0", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    act(() => {
      result.current.setItems([
        { id: 1, name: "Pizza", price: "50000", persons: { Alice: 1 }, priceType: "unit" },
        { id: 2, name: "Soda", price: "10000", persons: { Bob: 1 }, priceType: "unit" },
        { id: 3, name: "Salad", price: "20000", persons: { Alice: 0 }, priceType: "unit" },
      ]);
    });
    const aliceItems = result.current.getPersonItems("Alice");
    expect(aliceItems).toHaveLength(1);
    expect(aliceItems[0].name).toBe("Pizza");
  });
});

describe("BillDataContext — getSelectedAccount helpers", () => {
  it("returns custom account fields when CUSTOM is selected", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    act(() => {
      result.current.setSelectedAccount("CUSTOM");
      result.current.setCustomAccountName("John");
      result.current.setCustomAccountNumber("9876543210");
      result.current.setCustomAccountVendor("Mandiri");
    });
    expect(result.current.getSelectedAccountName()).toBe("John");
    expect(result.current.getSelectedAccountNumber()).toBe("9876543210");
    expect(result.current.getSelectedAccountVendor()).toBe("Mandiri");
  });

  it("returns account data from bankAccounts when a real account is selected", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    act(() => {
      result.current.setBankAccounts([
        { name: "Custom", number: "CUSTOM", vendor: "Custom" },
        { name: "Alice", number: "111222333", vendor: "BNI" },
      ]);
      result.current.setSelectedAccount("111222333");
    });
    expect(result.current.getSelectedAccountName()).toBe("Alice");
    expect(result.current.getSelectedAccountVendor()).toBe("BNI");
    expect(result.current.getSelectedAccountNumber()).toBe("111222333");
  });
});

describe("BillDataContext — splitResult integration", () => {
  it("calculates splitResult correctly when items and persons are set", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    act(() => {
      result.current.setPersons(["Alice", "Bob"]);
      result.current.setItems([
        { id: 1, name: "Pizza", price: "60000", persons: { Alice: 1, Bob: 1 }, priceType: "unit" },
      ]);
    });
    expect(result.current.splitResult.subtotal).toBe(120000);
    expect(result.current.splitResult.personSubtotals["Alice"]).toBe(60000);
    expect(result.current.splitResult.personSubtotals["Bob"]).toBe(60000);
  });

  it("splitResult grandTotal includes tax", () => {
    const { result } = renderHook(() => useBillData(), { wrapper });
    act(() => {
      result.current.setPersons(["Alice"]);
      result.current.setItems([
        { id: 1, name: "Meal", price: "100000", persons: { Alice: 1 }, priceType: "unit" },
      ]);
      result.current.setTax("10");
      result.current.setTaxType("percentage");
    });
    expect(result.current.splitResult.taxAmount).toBe(10000);
    expect(result.current.splitResult.grandTotal).toBe(110000);
  });
});
