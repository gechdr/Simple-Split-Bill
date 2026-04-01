import { useState, useCallback } from "react";
import { formatCalcDisplay } from "../utils/formatters";

interface CalculatorState {
  calcDisplay: string;
  calcHistory: string;
  calcPrevValue: number | null;
  calcOperation: string | null;
}

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>({
    calcDisplay: "0",
    calcHistory: "",
    calcPrevValue: null,
    calcOperation: null,
  });

  const handleCalcNumber = useCallback((num: string) => {
    setState((prev) => ({
      ...prev,
      calcDisplay:
        num === "."
          ? prev.calcDisplay.includes(".")
            ? prev.calcDisplay
            : prev.calcDisplay === "0"
              ? "0."
              : prev.calcDisplay + "."
          : prev.calcDisplay === "0"
            ? num
            : prev.calcDisplay + num,
    }));
  }, []);

  const handleCalcOperation = useCallback((op: string) => {
    setState((prev) => {
      const current = parseFloat(prev.calcDisplay);
      let result = 0;
      let newHistory = prev.calcHistory;
      if (prev.calcPrevValue === null) {
        newHistory = formatCalcDisplay(prev.calcDisplay) + " " + op;
      } else {
        switch (prev.calcOperation) {
          case "+":
            result = prev.calcPrevValue + current;
            break;
          case "-":
            result = prev.calcPrevValue - current;
            break;
          case "×":
            result = prev.calcPrevValue * current;
            break;
          case "÷":
            result = current !== 0 ? prev.calcPrevValue / current : 0;
            break;
        }
        newHistory = formatCalcDisplay(result.toString()) + " " + op;
      }
      return {
        ...prev,
        calcHistory: newHistory,
        calcPrevValue: prev.calcPrevValue === null ? current : result,
        calcOperation: op,
        calcDisplay: "0",
      };
    });
  }, []);

  const handleCalcEquals = useCallback(() => {
    setState((prev) => {
      if (prev.calcPrevValue === null || prev.calcOperation === null)
        return prev;
      const current = parseFloat(prev.calcDisplay);
      let result = 0;
      switch (prev.calcOperation) {
        case "+":
          result = prev.calcPrevValue + current;
          break;
        case "-":
          result = prev.calcPrevValue - current;
          break;
        case "×":
          result = prev.calcPrevValue * current;
          break;
        case "÷":
          result = current !== 0 ? prev.calcPrevValue / current : 0;
          break;
      }
      return {
        ...prev,
        calcHistory: prev.calcHistory + " " + formatCalcDisplay(prev.calcDisplay),
        calcDisplay: result.toString(),
        calcPrevValue: null,
        calcOperation: null,
      };
    });
  }, []);

  const handleCalcClear = useCallback(() => {
    setState({
      calcDisplay: "0",
      calcHistory: "",
      calcPrevValue: null,
      calcOperation: null,
    });
  }, []);

  const handleCalcBackspace = useCallback(() => {
    setState((prev) => ({
      ...prev,
      calcDisplay: prev.calcDisplay.length <= 1 ? "0" : prev.calcDisplay.slice(0, -1),
    }));
  }, []);

  return {
    calcDisplay: state.calcDisplay,
    calcHistory: state.calcHistory,
    formatCalcDisplay,
    handleCalcNumber,
    handleCalcOperation,
    handleCalcEquals,
    handleCalcClear,
    handleCalcBackspace,
  };
}
