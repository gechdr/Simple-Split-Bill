import { createRef } from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useClipboard } from "../hooks/useClipboard";

const toPngMock = vi.fn();

vi.mock("dom-to-image", () => ({
  default: {
    toPng: (...args: unknown[]) => toPngMock(...args),
  },
}));

const t = {
  processing: "Processing...",
  downloaded: "Downloaded",
  copied: "Copied",
  failedToCopy: "Failed to copy",
  failedToProcess: "Failed to process",
} as any;

function createDomRefs() {
  const summaryDiv = document.createElement("div");
  Object.defineProperty(summaryDiv, "offsetWidth", { value: 100, configurable: true });
  Object.defineProperty(summaryDiv, "offsetHeight", { value: 50, configurable: true });

  const trackerDiv = document.createElement("div");
  Object.defineProperty(trackerDiv, "offsetWidth", { value: 80, configurable: true });
  Object.defineProperty(trackerDiv, "offsetHeight", { value: 40, configurable: true });

  const summaryRef = createRef<HTMLDivElement>();
  const paymentTrackerRef = createRef<HTMLDivElement>();
  summaryRef.current = summaryDiv as HTMLDivElement;
  paymentTrackerRef.current = trackerDiv as HTMLDivElement;

  return { summaryRef, paymentTrackerRef };
}

describe("useClipboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    Object.defineProperty(document, "fonts", {
      value: { ready: Promise.resolve() },
      configurable: true,
    });

    vi.stubGlobal("ClipboardItem", class {
      constructor(_data: unknown) {}
    });

    vi.stubGlobal("fetch", vi.fn(async () => ({
      blob: async () => new Blob(["img"], { type: "image/png" }),
    })));

    Object.defineProperty(navigator, "clipboard", {
      value: { write: vi.fn(async () => undefined) },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("downloads image successfully", async () => {
    const { summaryRef, paymentTrackerRef } = createDomRefs();
    toPngMock.mockResolvedValue("data:image/png;base64,abc");

    const clickMock = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
      if (tagName === "a") {
        const a = originalCreateElement("a");
        a.click = clickMock;
        return a;
      }
      return originalCreateElement(tagName);
    });

    const { result } = renderHook(() =>
      useClipboard({
        summaryRef,
        paymentTrackerRef,
        darkMode: false,
        t,
      }),
    );

    await act(async () => {
      await result.current.handleCapture("download");
    });

    expect(clickMock).toHaveBeenCalledTimes(1);
    expect(result.current.downloadStatus).toBe("Downloaded");

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.downloadStatus).toBe("");
    expect(result.current.isCapturing).toBe(false);
  });

  it("copies summary image to clipboard", async () => {
    const { summaryRef, paymentTrackerRef } = createDomRefs();
    toPngMock.mockResolvedValue("data:image/png;base64,abc");

    const { result } = renderHook(() =>
      useClipboard({
        summaryRef,
        paymentTrackerRef,
        darkMode: true,
        t,
      }),
    );

    await act(async () => {
      await result.current.handleCapture("copy");
    });

    expect((navigator.clipboard.write as unknown as ReturnType<typeof vi.fn>)).toHaveBeenCalledTimes(1);
    expect(result.current.captureStatus).toBe("Copied");
  });

  it("sets failure status when summary processing fails", async () => {
    const { summaryRef, paymentTrackerRef } = createDomRefs();
    toPngMock.mockRejectedValue(new Error("render failed"));

    const { result } = renderHook(() =>
      useClipboard({
        summaryRef,
        paymentTrackerRef,
        darkMode: false,
        t,
      }),
    );

    await act(async () => {
      await result.current.handleCapture("copy");
    });

    expect(result.current.captureStatus).toBe("Failed to process");
  });

  it("copies payment tracker image", async () => {
    const { summaryRef, paymentTrackerRef } = createDomRefs();
    toPngMock.mockResolvedValue("data:image/png;base64,abc");

    const { result } = renderHook(() =>
      useClipboard({
        summaryRef,
        paymentTrackerRef,
        darkMode: false,
        t,
      }),
    );

    await act(async () => {
      await result.current.handlePaymentCopy();
    });

    expect((navigator.clipboard.write as unknown as ReturnType<typeof vi.fn>)).toHaveBeenCalledTimes(1);
    expect(result.current.paymentCopyStatus).toBe("Copied");

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.paymentCopyStatus).toBe("");
  });
});
