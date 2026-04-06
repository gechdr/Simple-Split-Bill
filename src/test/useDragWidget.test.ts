import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDragWidget } from "../hooks/useDragWidget";

describe("useDragWidget", () => {
  it("starts drag and updates position on mouse move", () => {
    const { result } = renderHook(() => useDragWidget());

    act(() => {
      result.current.handleDragStart("clock", { clientX: 100, clientY: 120 } as React.MouseEvent);
    });

    act(() => {
      document.dispatchEvent(new MouseEvent("mousemove", { clientX: 140, clientY: 160 }));
    });

    expect(result.current.clockPos.x).toBeGreaterThan(24);
    expect(result.current.draggingWidgetId).toBe("clock");

    act(() => {
      document.dispatchEvent(new MouseEvent("mouseup"));
    });

    expect(result.current.draggingWidgetId).toBeNull();
  });

  it("resets widget positions", () => {
    const { result } = renderHook(() => useDragWidget());

    act(() => {
      result.current.resetClockPos();
      result.current.resetCalcPos();
      result.current.resetPaymentTrackerPos();
    });

    expect(result.current.clockPos).toEqual({ x: 24, y: 80 });
    expect(result.current.calcPos.y).toBe(80);
    expect(result.current.paymentTrackerPos.y).toBe(620);
  });
});
