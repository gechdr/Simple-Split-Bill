import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WhatsNewModal } from "../components/WhatsNewModal";

const useAppMock = vi.fn();
vi.mock("../context", () => ({ useApp: () => useAppMock() }));

function ctx(overrides: Record<string, unknown> = {}) {
  return {
    t: {
      whatsNew: "What's New",
      whatsNewNew: "New",
      whatsNewImproved: "Improved",
      whatsNewRemoved: "Removed",
      whatsNewClose: "Close",
    },
    language: "en",
    showWhatsNew: true,
    dismissWhatsNew: vi.fn(),
    appVersion: "v2.8.0",
    ...overrides,
  };
}

describe("WhatsNewModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when hidden", () => {
    useAppMock.mockReturnValue(ctx({ showWhatsNew: false }));
    const { container } = render(<WhatsNewModal />);
    expect(container.firstChild).toBeNull();
  });

  it("renders changelog content and closes", () => {
    const c = ctx();
    useAppMock.mockReturnValue(c);
    render(<WhatsNewModal />);

    expect(screen.getByText("What's New")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(c.dismissWhatsNew).toHaveBeenCalledTimes(1);
  });
});
