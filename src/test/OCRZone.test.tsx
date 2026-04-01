import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OCRZone } from "../components/OCRZone";

const useAppMock = vi.fn();

vi.mock("../context", () => ({
  useApp: () => useAppMock(),
}));

function createContext(overrides: Record<string, unknown> = {}) {
  return {
    t: {
      dropToScan: "Drop to scan",
      scanReceipt: "Scan Receipt",
      scanReceiptDesc: "Upload or drag your receipt image",
      scanReceiptFormat: "PNG, JPG",
      chooseFile: "Choose File",
      noteTitle: "Note:",
      noteDesc: "OCR may need manual correction",
    },
    showOCR: true,
    ocr: {
      isScanning: false,
      scanProgress: 0,
      isDragging: false,
      triggerFileInput: vi.fn(),
      handleDragOver: vi.fn(),
      handleDragLeave: vi.fn(),
      handleDrop: vi.fn(),
      handleScanReceipt: vi.fn(),
      fileInputRef: { current: null },
    },
    ...overrides,
  };
}

describe("OCRZone", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when showOCR is false", () => {
    useAppMock.mockReturnValue(createContext({ showOCR: false }));

    const { container } = render(<OCRZone />);

    expect(container.firstChild).toBeNull();
  });

  it("renders scan section and note", () => {
    useAppMock.mockReturnValue(createContext());

    render(<OCRZone />);

    expect(screen.getByText("Scan Receipt")).toBeInTheDocument();
    expect(screen.getByText("Choose File")).toBeInTheDocument();
    expect(screen.getByText("Note:")).toBeInTheDocument();
  });

  it("calls triggerFileInput when choose-file button is clicked", () => {
    const ctx = createContext();
    useAppMock.mockReturnValue(ctx);

    render(<OCRZone />);
    fireEvent.click(screen.getByRole("button", { name: "Choose File" }));

    expect(ctx.ocr.triggerFileInput).toHaveBeenCalledTimes(1);
  });

  it("forwards drag events to OCR handlers", () => {
    const ctx = createContext();
    useAppMock.mockReturnValue(ctx);

    const { container } = render(<OCRZone />);
    const dropZone = container.querySelector(".border-dashed");

    expect(dropZone).toBeTruthy();

    fireEvent.dragOver(dropZone as Element);
    fireEvent.dragLeave(dropZone as Element);
    fireEvent.drop(dropZone as Element);

    expect(ctx.ocr.handleDragOver).toHaveBeenCalledTimes(1);
    expect(ctx.ocr.handleDragLeave).toHaveBeenCalledTimes(1);
    expect(ctx.ocr.handleDrop).toHaveBeenCalledTimes(1);
  });

  it("passes selected image file to handleScanReceipt", () => {
    const ctx = createContext();
    useAppMock.mockReturnValue(ctx);

    const { container } = render(<OCRZone />);
    const input = container.querySelector("input[type='file']") as HTMLInputElement;
    const file = new File(["img"], "receipt.png", { type: "image/png" });

    fireEvent.change(input, { target: { files: [file] } });

    expect(ctx.ocr.handleScanReceipt).toHaveBeenCalledWith(file);
  });

  it("hides choose-file button while scanning", () => {
    useAppMock.mockReturnValue(
      createContext({
        ocr: {
          ...createContext().ocr,
          isScanning: true,
        },
      }),
    );

    render(<OCRZone />);

    expect(screen.queryByRole("button", { name: "Choose File" })).not.toBeInTheDocument();
  });
});
