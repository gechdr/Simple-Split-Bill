import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ClockWidget } from "../components/widgets/ClockWidget";

const useAppMock = vi.fn();
vi.mock("../context", () => ({ useApp: () => useAppMock() }));

function ctx() {
  return {
    currentTime: new Date("2026-04-02T12:34:56"),
    dragWidget: {
      clockPos: { x: 11, y: 22 },
      handleDragStart: vi.fn(),
      resetClockPos: vi.fn(),
    },
  };
}

describe("ClockWidget", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders clock and supports drag/reset handlers", () => {
    const c = ctx();
    useAppMock.mockReturnValue(c);

    const { container } = render(<ClockWidget />);

    expect(container.querySelector("svg")).toBeTruthy();
    const draggable = container.querySelector(".cursor-move") as Element;
    fireEvent.mouseDown(draggable, { clientX: 50, clientY: 60 });
    fireEvent.doubleClick(draggable);

    expect(c.dragWidget.handleDragStart).toHaveBeenCalled();
    expect(c.dragWidget.resetClockPos).toHaveBeenCalledTimes(1);
  });
});
