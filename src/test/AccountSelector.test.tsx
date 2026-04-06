import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AccountSelector } from "../components/AccountSelector";

const t = {
  selectAccount: "Select account",
  tooltipDeleteAccount: "Delete account",
  addNewAccount: "Add new account",
  addNewAccountDesc: "Create account",
  accountHolderName: "Name",
  accountHolderPlaceholder: "Name",
  accountNumber: "Number",
  accountNumberPlaceholder: "Number",
  bankEwallet: "Bank",
  bankEwalletPlaceholder: "Bank",
  tooltipAccountName: "Account name",
  tooltipAccountNumber: "Account number",
  tooltipBankName: "Bank name",
  cancel: "Cancel",
  save: "Save",
  errorNameRequired: "Name required",
  errorNameTooShort: "Name too short",
  errorNumberRequired: "Number required",
  errorNumberTooShort: "Number too short",
  errorNumberInvalid: "Number invalid",
  errorVendorRequired: "Vendor required",
  errorVendorTooShort: "Vendor too short",
} as any;

function props(overrides: Record<string, unknown> = {}) {
  return {
    options: [
      { name: "Custom", number: "CUSTOM", vendor: "Custom" },
      { name: "Alice", number: "123", vendor: "BCA" },
    ],
    selectedValue: null,
    onChange: vi.fn(),
    label: "Bank",
    onOpenCustomModal: vi.fn(),
    onDeleteAccount: vi.fn(),
    t,
    ...overrides,
  };
}

describe("AccountSelector", () => {
  beforeEach(() => vi.clearAllMocks());

  it("opens menu and selects regular account", () => {
    const p = props();
    render(<AccountSelector {...p} />);

    fireEvent.click(screen.getByRole("button", { name: "Select account" }));
    fireEvent.click(screen.getByText("Alice - BCA"));

    expect(p.onChange).toHaveBeenCalledWith("123");
  });

  it("deletes a regular account", () => {
    const p = props();
    render(<AccountSelector {...p} />);

    fireEvent.click(screen.getByRole("button", { name: "Select account" }));
    fireEvent.click(screen.getByTitle("Delete account"));

    expect(p.onDeleteAccount).toHaveBeenCalledWith("123");
  });

  it("opens custom modal when CUSTOM option is clicked", () => {
    const onOpenCustomModal = vi.fn();
    const p = props({ onOpenCustomModal });
    render(<AccountSelector {...p} />);

    fireEvent.click(screen.getByRole("button", { name: "Select account" }));
    fireEvent.click(screen.getByText(/Add new account/));

    expect(onOpenCustomModal).toHaveBeenCalledTimes(1);
  });
});
