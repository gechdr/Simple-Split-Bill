import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormattedInput } from "../components/FormattedInput";

describe("FormattedInput", () => {
  it("shows currency prefix by default and strips non-digits", () => {
    const onChange = vi.fn();
    render(<FormattedInput value="1000" onChange={onChange} />);

    expect(screen.getByText("Rp")).toBeInTheDocument();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "12.3abc" } });

    expect(onChange).toHaveBeenCalledWith("123");
  });

  it("shows percentage suffix for percentage type", () => {
    render(<FormattedInput value="10" onChange={vi.fn()} type="percentage" />);
    expect(screen.getByText("%")).toBeInTheDocument();
  });
});
