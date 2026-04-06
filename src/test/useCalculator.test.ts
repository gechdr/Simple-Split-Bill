import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCalculator } from "../hooks/useCalculator";

describe("useCalculator", () => {
  it("starts with display '0'", () => {
    const { result } = renderHook(() => useCalculator());
    expect(result.current.calcDisplay).toBe("0");
    expect(result.current.calcHistory).toBe("");
  });

  it("replaces '0' with first digit", () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.handleCalcNumber("5"));
    expect(result.current.calcDisplay).toBe("5");
  });

  it("appends digits", () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleCalcNumber("1");
      result.current.handleCalcNumber("2");
      result.current.handleCalcNumber("3");
    });
    expect(result.current.calcDisplay).toBe("123");
  });

  it("appends decimal point", () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleCalcNumber("5");
      result.current.handleCalcNumber(".");
    });
    expect(result.current.calcDisplay).toBe("5.");
  });

  it("prevents duplicate decimal point", () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleCalcNumber("5");
      result.current.handleCalcNumber(".");
      result.current.handleCalcNumber(".");
    });
    expect(result.current.calcDisplay).toBe("5.");
  });

  it("prepends '0.' when decimal pressed on '0'", () => {
    const { result } = renderHook(() => useCalculator());
    act(() => result.current.handleCalcNumber("."));
    expect(result.current.calcDisplay).toBe("0.");
  });

  it("performs addition", () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleCalcNumber("3");
      result.current.handleCalcOperation("+");
      result.current.handleCalcNumber("4");
      result.current.handleCalcEquals();
    });
    expect(result.current.calcDisplay).toBe("7");
  });

  it("performs subtraction", () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleCalcNumber("1");
      result.current.handleCalcNumber("0");
      result.current.handleCalcOperation("-");
      result.current.handleCalcNumber("3");
      result.current.handleCalcEquals();
    });
    expect(result.current.calcDisplay).toBe("7");
  });

  it("performs multiplication", () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleCalcNumber("6");
      result.current.handleCalcOperation("×");
      result.current.handleCalcNumber("7");
      result.current.handleCalcEquals();
    });
    expect(result.current.calcDisplay).toBe("42");
  });

  it("performs division", () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleCalcNumber("2");
      result.current.handleCalcNumber("0");
      result.current.handleCalcOperation("÷");
      result.current.handleCalcNumber("4");
      result.current.handleCalcEquals();
    });
    expect(result.current.calcDisplay).toBe("5");
  });

  it("handles division by zero (returns 0)", () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleCalcNumber("9");
      result.current.handleCalcOperation("÷");
      result.current.handleCalcNumber("0");
      result.current.handleCalcEquals();
    });
    expect(result.current.calcDisplay).toBe("0");
  });

  it("clears display and history on clear", () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleCalcNumber("9");
      result.current.handleCalcOperation("+");
      result.current.handleCalcNumber("1");
      result.current.handleCalcClear();
    });
    expect(result.current.calcDisplay).toBe("0");
    expect(result.current.calcHistory).toBe("");
  });

  it("backspace removes last digit", () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleCalcNumber("1");
      result.current.handleCalcNumber("2");
      result.current.handleCalcNumber("3");
      result.current.handleCalcBackspace();
    });
    expect(result.current.calcDisplay).toBe("12");
  });

  it("backspace on single digit resets to '0'", () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleCalcNumber("5");
      result.current.handleCalcBackspace();
    });
    expect(result.current.calcDisplay).toBe("0");
  });

  it("equals without prior operation returns same display", () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleCalcNumber("7");
      result.current.handleCalcEquals();
    });
    expect(result.current.calcDisplay).toBe("7");
  });

  it("chained operations use running result", () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.handleCalcNumber("5");
      result.current.handleCalcOperation("+");
      result.current.handleCalcNumber("3");
      result.current.handleCalcOperation("+"); // should commit 5+3=8
      result.current.handleCalcNumber("2");
      result.current.handleCalcEquals(); // 8+2=10
    });
    expect(result.current.calcDisplay).toBe("10");
  });
});
