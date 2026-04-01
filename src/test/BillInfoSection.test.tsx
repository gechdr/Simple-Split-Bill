import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BillInfoSection } from "../components/BillInfoSection";

const useAppMock = vi.fn();
vi.mock("../context", () => ({ useApp: () => useAppMock() }));

function ctx() {
  return {
    t: {
      placeRestoName: "Place / Resto Name",
      placeRestoPlaceholder: "e.g. Sushi Tei",
      tooltipPlaceResto: "Place tooltip",
    },
    placeName: "",
    setPlaceName: vi.fn(),
  };
}

describe("BillInfoSection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders input and updates place/resto name", () => {
    const c = ctx();
    useAppMock.mockReturnValue(c);

    render(<BillInfoSection />);

    const input = screen.getByRole("textbox");
    expect(screen.getByText("Place / Resto Name")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "Sushi Tei" } });
    expect(c.setPlaceName).toHaveBeenCalledWith("Sushi Tei");
  });
});
