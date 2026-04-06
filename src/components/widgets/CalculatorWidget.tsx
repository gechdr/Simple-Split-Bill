import { useApp } from "../../context";
import { Calculator } from "../../icons";

export function CalculatorWidget() {
  const { t, calculator, showCalculator, setShowCalculator, dragWidget } = useApp();
  const { calcDisplay, calcHistory, formatCalcDisplay, handleCalcNumber, handleCalcOperation, handleCalcEquals, handleCalcClear, handleCalcBackspace } = calculator;
  const { calcPos, handleDragStart, resetCalcPos } = dragWidget;

  if (!showCalculator) return null;

  return (
    <div
      className="hidden md:block fixed z-40 animate-fade-in"
      style={{ left: `${calcPos.x}px`, top: `${calcPos.y}px` }}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 w-64"
        onDoubleClick={(e) => {
          if (e.target === e.currentTarget) resetCalcPos();
        }}
      >
        <div
          className="flex items-center justify-between mb-3 cursor-move"
          onMouseDown={(e) => handleDragStart("calc", e)}
          onDoubleClick={() => resetCalcPos()}
        >
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {t.widgetCalculator}
          </span>
          <button
            onClick={() => setShowCalculator(false)}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-3">
          <div className="text-sm font-mono text-gray-500 dark:text-gray-400 text-right mb-1 h-5 truncate">
            {calcHistory || "\u00A0"}
          </div>
          <div className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100 text-right truncate">
            {formatCalcDisplay(calcDisplay)}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={handleCalcClear}
            className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
          >
            C
          </button>
          <button
            onClick={handleCalcBackspace}
            className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition text-xl"
          >
            ⌫
          </button>
          <button
            onClick={() => handleCalcOperation("÷")}
            className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
          >
            ÷
          </button>
          <button
            onClick={() => handleCalcOperation("×")}
            className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
          >
            ×
          </button>
          {["7", "8", "9"].map((n) => (
            <button
              key={n}
              onClick={() => handleCalcNumber(n)}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => handleCalcOperation("-")}
            className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
          >
            -
          </button>
          {["4", "5", "6"].map((n) => (
            <button
              key={n}
              onClick={() => handleCalcNumber(n)}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => handleCalcOperation("+")}
            className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
          >
            +
          </button>
          {["1", "2", "3"].map((n) => (
            <button
              key={n}
              onClick={() => handleCalcNumber(n)}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
            >
              {n}
            </button>
          ))}
          <button
            onClick={handleCalcEquals}
            className="row-span-2 bg-gray-900 dark:bg-gray-600 hover:bg-black dark:hover:bg-gray-500 text-white rounded-lg py-3 font-semibold transition"
          >
            =
          </button>
          <button
            onClick={() => handleCalcNumber("0")}
            className="col-span-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
          >
            0
          </button>
          <button
            onClick={() => handleCalcNumber(".")}
            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg py-3 font-semibold transition"
          >
            .
          </button>
        </div>
      </div>
    </div>
  );
}
