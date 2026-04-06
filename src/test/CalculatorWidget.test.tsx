import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CalculatorWidget } from "../components/widgets/CalculatorWidget";

const useAppMock = vi.fn();
vi.mock("../context", () => ({ useApp: () => useAppMock() }));

function ctx(overrides: Record<string, unknown> = {}) {
  return {
    t: { widgetCalculator: "Calculator" },
    calculator: {
      calcDisplay: "1234",
      calcHistory: "1+2",
      formatCalcDisplay: (v: string) => v,
      handleCalcNumber: vi.fn(),
      handleCalcOperation: vi.fn(),
      handleCalcEquals: vi.fn(),
      handleCalcClear: vi.fn(),
      handleCalcBackspace: vi.fn(),
    },
    showCalculator: true,
    setShowCalculator: vi.fn(),
    dragWidget: { calcPos: { x: 5, y: 6 }, handleDragStart: vi.fn(), resetCalcPos: vi.fn() },
    ...overrides,
  };
}

describe("CalculatorWidget", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when hidden", () => {
    useAppMock.mockReturnValue(ctx({ showCalculator: false }));
    const { container } = render(<CalculatorWidget />);
    expect(container.firstChild).toBeNull();
  });

  it("wires calculator controls", () => {
    const c = ctx();
    useAppMock.mockReturnValue(c);
    render(<CalculatorWidget />);

    fireEvent.click(screen.getByRole("button", { name: "7" }));
    fireEvent.click(screen.getByRole("button", { name: "+" }));
    fireEvent.click(screen.getByRole("button", { name: "=" }));
    fireEvent.click(screen.getByRole("button", { name: "C" }));

    const close = screen.getAllByText("×")[0].closest("button") as HTMLButtonElement;
    fireEvent.click(close);

    expect(c.calculator.handleCalcNumber).toHaveBeenCalledWith("7");
    expect(c.calculator.handleCalcOperation).toHaveBeenCalledWith("+");
    expect(c.calculator.handleCalcEquals).toHaveBeenCalledTimes(1);
    expect(c.calculator.handleCalcClear).toHaveBeenCalledTimes(1);
    expect(c.setShowCalculator).toHaveBeenCalledWith(false);
  });
});

