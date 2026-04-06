import { createRef } from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaymentSummary } from "../components/PaymentSummary";

const useAppMock = vi.fn();

vi.mock("../context", () => ({
  useApp: () => useAppMock(),
}));

vi.mock("../components/PersonAccordion", () => ({
  PersonAccordion: ({ person }: { person: string }) => <div data-testid="person-accordion">{person}</div>,
}));

function createContext(overrides: Record<string, unknown> = {}) {
  return {
    t: {
      paymentSummary: "Payment Summary",
      orderSubtotal: "Order Subtotal",
      sharedFees: "Shared Fees",
      taxPercentage: "Tax",
      taxNominal: "Tax",
      totalDiscount: "Total Discount",
      total: "Total",
      transferTo: "Transfer to",
      splitPerPerson: "Split per person",
      tooltipDownload: "Download",
      tooltipCopy: "Copy",
      download: "Download",
      copyImage: "Copy Image",
    },
    persons: ["Alice", "Bob"],
    taxType: "percentage",
    tax: "10",
    selectedAccount: "123456",
    getSelectedAccountName: vi.fn(() => "Alice"),
    getSelectedAccountVendor: vi.fn(() => "BCA"),
    getSelectedAccountNumber: vi.fn(() => "123456"),
    summaryRef: createRef<HTMLDivElement>(),
    clipboard: {
      handleCapture: vi.fn(),
      downloadStatus: "",
      captureStatus: "",
    },
    splitResult: {
      subtotal: 100000,
      taxAmount: 10000,
      totalDiscount: 5000,
      grandTotal: 125000,
      sharedFees: 20000,
      totalBiaya: 30000,
      personTotals: { Alice: 62500, Bob: 62500 },
      personSubtotals: { Alice: 50000, Bob: 50000 },
      netSharedAmount: 30000,
    },
    ...overrides,
  };
}

describe("PaymentSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when subtotal is zero", () => {
    useAppMock.mockReturnValue(createContext({ splitResult: { ...createContext().splitResult, subtotal: 0 } }));

    const { container } = render(<PaymentSummary />);

    expect(container.firstChild).toBeNull();
  });

  it("renders summary, account info, and person accordions", () => {
    useAppMock.mockReturnValue(createContext());

    render(<PaymentSummary />);

    expect(screen.getByText("Payment Summary")).toBeInTheDocument();
    expect(screen.getByText("BCA - 123456")).toBeInTheDocument();
    expect(screen.getByText("Rp 125.000")).toBeInTheDocument();
    expect(screen.getAllByTestId("person-accordion")).toHaveLength(2);
  });

  it("triggers download and copy capture actions", async () => {
    const ctx = createContext();
    useAppMock.mockReturnValue(ctx);

    render(<PaymentSummary />);

    await userEvent.click(screen.getByRole("button", { name: "Download" }));
    await userEvent.click(screen.getByRole("button", { name: "Copy Image" }));

    expect(ctx.clipboard.handleCapture).toHaveBeenCalledWith("download");
    expect(ctx.clipboard.handleCapture).toHaveBeenCalledWith("copy");
  });
});
