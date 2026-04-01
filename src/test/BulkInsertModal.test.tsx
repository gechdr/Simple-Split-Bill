import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BulkInsertModal } from "../components/BulkInsertModal";

const useAppMock = vi.fn();
vi.mock("../context", () => ({ useApp: () => useAppMock() }));

function ctx(overrides: Record<string, unknown> = {}) {
  return {
    t: {
      bulkInsertTitle: "Bulk Insert",
      bulkInsertPlaceholder: "A:Item",
      bulkInsertCancel: "Cancel",
      bulkInsertConfirm: "Apply",
    },
    showBulkInsert: true,
    setShowBulkInsert: vi.fn(),
    bulkInsertText: "",
    setBulkInsertText: vi.fn(),
    applyBulkInsert: vi.fn(),
    ...overrides,
  };
}

describe("BulkInsertModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders nothing when hidden", () => {
    useAppMock.mockReturnValue(ctx({ showBulkInsert: false }));
    const { container } = render(<BulkInsertModal />);
    expect(container.firstChild).toBeNull();
  });

  it("updates text and handles actions", () => {
    const c = ctx();
    useAppMock.mockReturnValue(c);
    render(<BulkInsertModal />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Alice:Pizza" } });
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));

    expect(c.setBulkInsertText).toHaveBeenCalledWith("Alice:Pizza");
    expect(c.setShowBulkInsert).toHaveBeenCalledWith(false);
    expect(c.applyBulkInsert).toHaveBeenCalledTimes(1);
  });
});
