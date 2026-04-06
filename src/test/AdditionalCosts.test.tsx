import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AdditionalCosts } from "../components/AdditionalCosts";

const useAppMock = vi.fn();
vi.mock("../context", () => ({ useApp: () => useAppMock() }));

vi.mock("../components/FormattedInput", () => ({
  FormattedInput: ({ label, onChange, value }: { label?: string; onChange: (v: string) => void; value: string }) => (
    <label>
      {label || "input"}
      <input aria-label={label || "input"} value={value} onChange={(e) => onChange((e.target as HTMLInputElement).value)} />
    </label>
  ),
}));

vi.mock("../components/AccountSelector", () => ({
  AccountSelector: ({ onChange, onOpenCustomModal, onDeleteAccount }: any) => (
    <div>
      <button onClick={() => onChange("123")}>select-account</button>
      <button onClick={onOpenCustomModal}>open-custom-modal</button>
      <button onClick={() => onDeleteAccount("123")}>delete-account</button>
    </div>
  ),
}));

function ctx(overrides: Record<string, unknown> = {}) {
  return {
    t: {
      additionalCosts: "Additional Costs",
      shipping: "Shipping",
      serviceFee: "Service Fee",
      taxPercentage: "Tax %",
      taxNominal: "Tax Rp",
      parking: "Parking",
      promoDiscount: "Promo",
      voucher: "Voucher",
      bankAccount: "Bank Account",
      roundTo100: "Round",
      rounded: "Rounded",
      notRounded: "Not Rounded",
      tooltipShipping: "",
      tooltipServiceFee: "",
      tooltipTaxPercentage: "",
      tooltipTaxNominal: "",
      tooltipParking: "",
      tooltipDiscount: "",
      tooltipVoucher: "",
      tooltipRounding: "",
    },
    ongkir: "", setOngkir: vi.fn(),
    biayaLayanan: "", setBiayaLayanan: vi.fn(),
    tax: "", setTax: vi.fn(),
    taxType: "percentage", setTaxType: vi.fn(),
    parking: "0", setParking: vi.fn(),
    diskon: "", setDiskon: vi.fn(),
    voucher: "", setVoucher: vi.fn(),
    bankAccounts: [],
    selectedAccount: null,
    setSelectedAccount: vi.fn(),
    customAccountName: "", setCustomAccountName: vi.fn(),
    customAccountNumber: "", setCustomAccountNumber: vi.fn(),
    customAccountVendor: "", setCustomAccountVendor: vi.fn(),
    roundTo100: false, setRoundTo100: vi.fn(),
    setShowCustomAccountModal: vi.fn(),
    deleteBankAccount: vi.fn(),
    ...overrides,
  };
}

describe("AdditionalCosts", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders section and toggles tax/rounding", () => {
    const c = ctx();
    useAppMock.mockReturnValue(c);
    const { container } = render(<AdditionalCosts />);

    expect(screen.getByText("Additional Costs")).toBeInTheDocument();

    const buttons = Array.from(container.querySelectorAll("button"));
    fireEvent.click(buttons[0]);
    fireEvent.click(screen.getByTitle(""));

    expect(c.setTaxType).toHaveBeenCalledWith("currency");
    expect(c.setRoundTo100).toHaveBeenCalledWith(true);
  });

  it("passes selection to AccountSelector bridge", () => {
    const c = ctx();
    useAppMock.mockReturnValue(c);
    render(<AdditionalCosts />);

    fireEvent.click(screen.getByRole("button", { name: "select-account" }));
    fireEvent.click(screen.getByRole("button", { name: "open-custom-modal" }));
    fireEvent.click(screen.getByRole("button", { name: "delete-account" }));

    expect(c.setSelectedAccount).toHaveBeenCalledWith("123");
    expect(c.setShowCustomAccountModal).toHaveBeenCalledWith(true);
    expect(c.deleteBankAccount).toHaveBeenCalledWith("123");
  });
});
