import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusNotification } from "../components/StatusNotification";

const useAppMock = vi.fn();

vi.mock("../context", () => ({
  useApp: () => useAppMock(),
}));

function createContext(overrides: Record<string, unknown> = {}) {
  return {
    ocr: {
      isScanning: true,
      scanProgress: 55,
      captureStatus: "Scanning...",
    },
    ...overrides,
  };
}

describe("StatusNotification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when not scanning", () => {
    useAppMock.mockReturnValue(createContext({ ocr: { isScanning: false, scanProgress: 0, captureStatus: "" } }));

    const { container } = render(<StatusNotification />);

    expect(container.firstChild).toBeNull();
  });

  it("renders capture status and progress when scanning", () => {
    useAppMock.mockReturnValue(createContext());

    const { container } = render(<StatusNotification />);

    expect(screen.getByText("Scanning...")).toBeInTheDocument();
    expect(screen.getByText("55%")).toBeInTheDocument();

    const progressFill = container.querySelector(".transition-all") as HTMLDivElement;
    expect(progressFill.style.width).toBe("55%");
  });

  it("does not render progress section when progress is zero", () => {
    useAppMock.mockReturnValue(createContext({ ocr: { isScanning: true, scanProgress: 0, captureStatus: "Working" } }));

    render(<StatusNotification />);

    expect(screen.getByText("Working")).toBeInTheDocument();
    expect(screen.queryByText("0%")).not.toBeInTheDocument();
  });
});
