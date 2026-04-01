import { describe, it, expect } from "vitest";
import * as contextExports from "../context";
import * as componentExports from "../components";
import * as widgetExports from "../components/widgets";
import * as hookExports from "../hooks";
import * as utilExports from "../utils";

describe("barrel exports", () => {
  it("exports context APIs", () => {
    expect(contextExports.AppProvider).toBeTypeOf("function");
    expect(contextExports.useApp).toBeTypeOf("function");
    expect(contextExports.useBillData).toBeTypeOf("function");
    expect(contextExports.useUI).toBeTypeOf("function");
  });

  it("exports component APIs", () => {
    expect(componentExports.Header).toBeTypeOf("function");
    expect(componentExports.OCRZone).toBeTypeOf("function");
    expect(componentExports.PaymentSummary).toBeTypeOf("function");
    expect(componentExports.WhatsNewModal).toBeTypeOf("function");
  });

  it("exports widget APIs", () => {
    expect(widgetExports.CalculatorWidget).toBeTypeOf("function");
    expect(widgetExports.ClockWidget).toBeTypeOf("function");
    expect(widgetExports.PaymentTrackerWidget).toBeTypeOf("function");
  });

  it("exports hook APIs", () => {
    expect(hookExports.useLocalStorage).toBeTypeOf("function");
    expect(hookExports.useBillCalculator).toBeTypeOf("function");
    expect(hookExports.useOCR).toBeTypeOf("function");
  });

  it("exports util APIs", () => {
    expect(utilExports.parseReceiptText).toBeTypeOf("function");
    expect(utilExports.formatMoney).toBeTypeOf("function");
    expect(utilExports.APP_VERSION).toBeTypeOf("string");
  });
});
