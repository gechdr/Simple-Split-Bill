import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ItemCard } from "../components/ItemCard";
import type { BillItem } from "../types";

const useAppMock = vi.fn();

vi.mock("../context", () => ({
  useApp: () => useAppMock(),
}));

vi.mock("../components/FormattedInput", () => ({
  FormattedInput: ({ value, onChange }: { value: string; onChange: (val: string) => void }) => (
    <input
      aria-label="formatted-price"
      value={value}
      onChange={(e) => onChange((e.target as HTMLInputElement).value)}
    />
  ),
}));

function createContext(overrides: Record<string, unknown> = {}) {
  return {
    t: {
      itemPlaceholder: "Item ",
      tooltipItemName: "Item name",
      tooltipItemPrice: "Item price",
      tooltipDeleteItem: "Delete item",
      priceTypeLabel: "Price type",
      tooltipPricePerUnit: "Price per unit",
      pricePerUnit: "Per Unit",
      tooltipPriceTotal: "Price total",
      priceTotal: "Total",
      addPeopleFirst: "Add people first",
      searchPeoplePlaceholder: "Search people",
      tooltipPersonSelect: "Select person",
    },
    persons: ["Alice"],
    itemPersonSearch: {},
    setItemPersonSearch: vi.fn(),
    updateItem: vi.fn(),
    removeItem: vi.fn(),
    togglePerson: vi.fn(),
    setPersonQuantity: vi.fn(),
    handleItemDragStart: vi.fn(),
    handleItemDragOver: vi.fn(),
    handleItemDragEnd: vi.fn(),
    draggedItem: null,
    dragOverIndex: null,
    ...overrides,
  };
}

const item: BillItem = {
  id: 101,
  name: "Pizza",
  price: "50000",
  persons: { Alice: 2 },
  priceType: "unit",
};

describe("ItemCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls removeItem when delete button is clicked", async () => {
    const ctx = createContext();
    useAppMock.mockReturnValue(ctx);

    render(<ItemCard item={item} index={0} />);
    await userEvent.click(screen.getByTitle("Delete item"));

    expect(ctx.removeItem).toHaveBeenCalledWith(101);
  });

  it("updates priceType when total button is clicked", async () => {
    const ctx = createContext();
    useAppMock.mockReturnValue(ctx);

    render(<ItemCard item={item} index={0} />);
    await userEvent.click(screen.getByRole("button", { name: "Total" }));

    expect(ctx.updateItem).toHaveBeenCalledWith(101, "priceType", "total");
  });

  it("toggles person assignment when person button is clicked", async () => {
    const ctx = createContext();
    useAppMock.mockReturnValue(ctx);

    render(<ItemCard item={item} index={0} />);
    await userEvent.click(screen.getByTitle("Select person"));

    expect(ctx.togglePerson).toHaveBeenCalledWith(101, "Alice");
  });

  it("increases and decreases quantity", async () => {
    const ctx = createContext();
    useAppMock.mockReturnValue(ctx);

    render(<ItemCard item={item} index={0} />);

    await userEvent.click(screen.getByTitle("Increase quantity"));
    expect(ctx.setPersonQuantity).toHaveBeenCalledWith(101, "Alice", 3);

    await userEvent.click(screen.getByTitle("Decrease quantity"));
    expect(ctx.setPersonQuantity).toHaveBeenCalledWith(101, "Alice", 1);
  });
});
