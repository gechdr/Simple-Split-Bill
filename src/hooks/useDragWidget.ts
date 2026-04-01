import { useState, useEffect, useCallback } from "react";
import type { Position } from "../types";
import { WIDGET_DEFAULT_OFFSET } from "../utils/constants";

interface DragState {
  draggingWidgetId: string | null;
  dragOffset: Position;
  clockPos: Position;
  calcPos: Position;
  paymentTrackerPos: Position;
}

export function useDragWidget() {
  const [state, setState] = useState<DragState>(() => ({
    draggingWidgetId: null,
    dragOffset: { x: 0, y: 0 },
    clockPos: { x: 24, y: 80 },
    calcPos: { x: typeof window !== "undefined" ? window.innerWidth - WIDGET_DEFAULT_OFFSET : WIDGET_DEFAULT_OFFSET, y: 80 },
    paymentTrackerPos: { x: typeof window !== "undefined" ? window.innerWidth - WIDGET_DEFAULT_OFFSET : WIDGET_DEFAULT_OFFSET, y: 620 },
  }));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setState((prev) => {
        if (!prev.draggingWidgetId) return prev;
        if (prev.draggingWidgetId === "clock") {
          return { ...prev, clockPos: { x: e.clientX - prev.dragOffset.x, y: e.clientY - prev.dragOffset.y } };
        } else if (prev.draggingWidgetId === "calc") {
          return { ...prev, calcPos: { x: e.clientX - prev.dragOffset.x, y: e.clientY - prev.dragOffset.y } };
        } else if (prev.draggingWidgetId === "payment") {
          return { ...prev, paymentTrackerPos: { x: e.clientX - prev.dragOffset.x, y: e.clientY - prev.dragOffset.y } };
        }
        return prev;
      });
    };
    const handleMouseUp = () => setState((prev) => ({ ...prev, draggingWidgetId: null }));
    if (state.draggingWidgetId) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [state.draggingWidgetId]);

  const handleDragStart = useCallback((widget: string, e: React.MouseEvent) => {
    setState((prev) => ({
      ...prev,
      draggingWidgetId: widget,
      dragOffset: {
        x: e.clientX - (widget === "clock" ? prev.clockPos.x : widget === "calc" ? prev.calcPos.x : prev.paymentTrackerPos.x),
        y: e.clientY - (widget === "clock" ? prev.clockPos.y : widget === "calc" ? prev.calcPos.y : prev.paymentTrackerPos.y),
      },
    }));
  }, []);

  const handleDragEnd = useCallback(() => {
    setState((prev) => ({ ...prev, draggingWidgetId: null }));
  }, []);

  const resetCalcPos = useCallback(() => {
    setState((prev) => ({
      ...prev,
      calcPos: { x: window.innerWidth - WIDGET_DEFAULT_OFFSET, y: 80 },
    }));
  }, []);

  const resetClockPos = useCallback(() => {
    setState((prev) => ({
      ...prev,
      clockPos: { x: 24, y: 80 },
    }));
  }, []);

  const resetPaymentTrackerPos = useCallback(() => {
    setState((prev) => ({
      ...prev,
      paymentTrackerPos: { x: window.innerWidth - WIDGET_DEFAULT_OFFSET, y: 620 },
    }));
  }, []);

  return {
    draggingWidgetId: state.draggingWidgetId,
    dragOffset: state.dragOffset,
    clockPos: state.clockPos,
    calcPos: state.calcPos,
    paymentTrackerPos: state.paymentTrackerPos,
    handleDragStart,
    handleDragEnd,
    resetCalcPos,
    resetClockPos,
    resetPaymentTrackerPos,
  };
}
