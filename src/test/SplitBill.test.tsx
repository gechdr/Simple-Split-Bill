import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SplitBill from "../SplitBill";

const useAppMock = vi.fn();
vi.mock("../context", () => ({ useApp: () => useAppMock() }));

vi.mock("../components/Header", () => ({ Header: () => <div>HeaderSection</div> }));
vi.mock("../components/BillInfoSection", () => ({ BillInfoSection: () => <div>BillInfoSection</div> }));
vi.mock("../components/OCRZone", () => ({ OCRZone: () => <div>OCRSection</div> }));
vi.mock("../components/PeopleSection", () => ({ PeopleSection: () => <div>PeopleSection</div> }));
vi.mock("../components/ItemsSection", () => ({ ItemsSection: () => <div>ItemsSection</div> }));
vi.mock("../components/AdditionalCosts", () => ({ AdditionalCosts: () => <div>CostsSection</div> }));
vi.mock("../components/PaymentSummary", () => ({ PaymentSummary: () => <div>SummarySection</div> }));
vi.mock("../components/StatusNotification", () => ({ StatusNotification: () => <div>StatusSection</div> }));
vi.mock("../components/WhatsNewModal", () => ({ WhatsNewModal: () => <div>WhatsNewSection</div> }));
vi.mock("../components/BulkInsertModal", () => ({ BulkInsertModal: () => <div>BulkInsertSection</div> }));
vi.mock("../components/widgets/CalculatorWidget", () => ({ CalculatorWidget: () => <div>CalcWidget</div> }));
vi.mock("../components/widgets/ClockWidget", () => ({ ClockWidget: () => <div>ClockWidget</div> }));
vi.mock("../components/widgets/PaymentTrackerWidget", () => ({ PaymentTrackerWidget: () => <div>PaymentWidget</div> }));

function ctx() {
  return {
    t: {
      resetTitle: "Reset",
      resetMessage: "Confirm reset",
      reset: "Reset now",
      cancel: "Cancel",
    },
    showResetModal: true,
    setShowResetModal: vi.fn(),
    resetAllData: vi.fn(),
  };
}

describe("SplitBill", () => {
  it("renders all sections and wires reset modal", () => {
    const c = ctx();
    useAppMock.mockReturnValue(c);

    render(<SplitBill />);

    expect(screen.getByText("HeaderSection")).toBeInTheDocument();
    expect(screen.getByText("SummarySection")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset now" }));

    expect(c.setShowResetModal).toHaveBeenCalledWith(false);
    expect(c.resetAllData).toHaveBeenCalledTimes(1);
  });
});
