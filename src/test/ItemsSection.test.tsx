import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ItemsSection } from "../components/ItemsSection";

const useAppMock = vi.fn();
vi.mock("../context", () => ({ useApp: () => useAppMock() }));
vi.mock("../components/ItemCard", () => ({
  ItemCard: ({ item, index }: { item: { name: string }; index: number }) => <div data-testid="item-card">{index}:{item.name}</div>,
}));

function ctx() {
  return {
    t: { itemsList: "Items", addItem: "Add Item", tooltipAddItem: "Add item" },
    items: [{ id: 1, name: "Pizza", price: "", persons: {}, priceType: "unit" }],
    addItem: vi.fn(),
  };
}

describe("ItemsSection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders mapped item cards and add button", () => {
    const c = ctx();
    useAppMock.mockReturnValue(c);
    render(<ItemsSection />);

    expect(screen.getByText("Items")).toBeInTheDocument();
    expect(screen.getAllByTestId("item-card")).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Add Item" }));
    expect(c.addItem).toHaveBeenCalledTimes(1);
  });
});
