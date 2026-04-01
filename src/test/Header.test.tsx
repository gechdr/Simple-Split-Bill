import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "../components/Header";

const useAppMock = vi.fn();
vi.mock("../context", () => ({ useApp: () => useAppMock() }));

function ctx(overrides: Record<string, unknown> = {}) {
  return {
    t: {
      tooltipLanguage: "Language",
      tooltipCalculator: "Calculator",
      tooltipPaymentTracker: "Payment tracker",
      tooltipOCR: "OCR",
      tooltipReset: "Reset",
      title: "Split Bill",
      subtitle: "Subtitle",
      autoSaved: "Auto saved",
    },
    language: "en",
    toggleLanguage: vi.fn(),
    darkMode: false,
    toggleDarkMode: vi.fn(),
    showCalculator: true,
    setShowCalculator: vi.fn(),
    showPaymentTracker: true,
    setShowPaymentTracker: vi.fn(),
    showOCR: true,
    setShowOCR: vi.fn(),
    setShowResetModal: vi.fn(),
    appVersion: "v1",
    ...overrides,
  };
}

describe("Header", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders title and version", () => {
    useAppMock.mockReturnValue(ctx());
    render(<Header />);
    expect(screen.getByText("Split Bill")).toBeInTheDocument();
    expect(screen.getByText(/v1/)).toBeInTheDocument();
  });

  it("triggers toolbar actions", () => {
    const c = ctx();
    useAppMock.mockReturnValue(c);
    const { container } = render(<Header />);

    fireEvent.click(screen.getByTitle("Language"));
    fireEvent.click(screen.getByTitle("Switch to dark mode"));
    fireEvent.click(screen.getByTitle("OCR"));
    fireEvent.click(screen.getByTitle("Reset"));

    const mdButtons = Array.from(container.querySelectorAll("button.hidden.md\\:flex"));
    fireEvent.click(mdButtons[0]);
    fireEvent.click(mdButtons[1]);

    expect(c.toggleLanguage).toHaveBeenCalledTimes(1);
    expect(c.toggleDarkMode).toHaveBeenCalledTimes(1);
    expect(c.setShowOCR).toHaveBeenCalledWith(false);
    expect(c.setShowResetModal).toHaveBeenCalledWith(true);
    expect(c.setShowCalculator).toHaveBeenCalledWith(false);
    expect(c.setShowPaymentTracker).toHaveBeenCalledWith(false);
  });
});
