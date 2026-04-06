import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PaymentTrackerWidget } from "../components/widgets/PaymentTrackerWidget";

const useAppMock = vi.fn();
vi.mock("../context", () => ({ useApp: () => useAppMock() }));

function ctx(overrides: Record<string, unknown> = {}) {
  return {
    t: {
      widgetPaymentTracker: "Payment Tracker",
      paymentNoPeople: "No people",
      paymentUnpaid: "Unpaid",
      paymentPaid: "Paid",
      paymentAllSettled: "All settled",
      tooltipCopy: "Copy",
      copyImage: "Copy Image",
    },
    persons: ["Alice", "Bob"],
    paymentStatus: { Alice: false, Bob: true },
    togglePayment: vi.fn(),
    clipboard: { handlePaymentCopy: vi.fn() },
    paymentTrackerRef: { current: null },
    dragWidget: { paymentTrackerPos: { x: 10, y: 20 }, handleDragStart: vi.fn(), resetPaymentTrackerPos: vi.fn() },
    splitResult: { personTotals: { Alice: 10000, Bob: 20000 } },
    formatMoneySplit: (n: number) => n.toLocaleString("id-ID"),
    showPaymentTracker: true,
    setShowPaymentTracker: vi.fn(),
    ...overrides,
  };
}

describe("PaymentTrackerWidget", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when hidden", () => {
    useAppMock.mockReturnValue(ctx({ showPaymentTracker: false }));
    const { container } = render(<PaymentTrackerWidget />);
    expect(container.firstChild).toBeNull();
  });

  it("renders unpaid/paid groups and actions", () => {
    const c = ctx();
    useAppMock.mockReturnValue(c);
    render(<PaymentTrackerWidget />);

    expect(screen.getByText(/Unpaid/)).toBeInTheDocument();
    expect(screen.getByText(/Paid/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Copy Image" }));
    fireEvent.click(screen.getByText("Alice"));

    const closeBtn = screen.getByText("×").closest("button") as HTMLButtonElement;
    fireEvent.click(closeBtn);

    expect(c.clipboard.handlePaymentCopy).toHaveBeenCalledTimes(1);
    expect(c.togglePayment).toHaveBeenCalledWith("Alice");
    expect(c.setShowPaymentTracker).toHaveBeenCalledWith(false);
  });
});
