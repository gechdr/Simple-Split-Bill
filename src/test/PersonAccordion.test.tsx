import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PersonAccordion } from "../components/PersonAccordion";

const useAppMock = vi.fn();
vi.mock("../context", () => ({ useApp: () => useAppMock() }));

function ctx(overrides: Record<string, unknown> = {}) {
  return {
    t: {
      tooltipViewDetails: "View details",
      orderDetails: "Order details",
      noItems: "No items",
      itemPlaceholder: "Item",
      priceTotal: "Total",
      total: "Total",
    },
    persons: ["Alice", "Bob"],
    openAccordions: { Alice: true },
    toggleAccordion: vi.fn(),
    getPersonItems: vi.fn(() => [
      { id: 1, name: "Pizza", price: "30000", persons: { Alice: 1, Bob: 2 }, priceType: "total" },
    ]),
    splitResult: {
      subtotal: 90000,
      taxAmount: 9000,
      sharedFees: 10000,
      personSubtotals: { Alice: 30000 },
      personTotals: { Alice: 38000 },
    },
    roundTo100: false,
    voucher: "1000",
    ...overrides,
  };
}

describe("PersonAccordion", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders collapsed total and toggles open", () => {
    const c = ctx({ openAccordions: { Alice: false } });
    useAppMock.mockReturnValue(c);
    render(<PersonAccordion person="Alice" />);

    fireEvent.click(screen.getByTitle("View details"));
    expect(c.toggleAccordion).toHaveBeenCalledWith("Alice");
  });

  it("renders detailed rows when open", () => {
    useAppMock.mockReturnValue(ctx());
    render(<PersonAccordion person="Alice" />);

    expect(screen.getByText("Order details")).toBeInTheDocument();
    expect(screen.getByText(/Pizza/)).toBeInTheDocument();
    expect(screen.getByText(/Discount:/)).toBeInTheDocument();
  });
});
