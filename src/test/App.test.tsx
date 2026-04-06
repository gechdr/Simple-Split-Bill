import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { vi } from "vitest";

vi.mock("../context", () => ({ AppProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="provider">{children}</div> }));
vi.mock("../SplitBill", () => ({ default: () => <div>SplitBillView</div> }));

describe("App", () => {
  it("wraps SplitBill with AppProvider", () => {
    render(<App />);
    expect(screen.getByTestId("provider")).toBeInTheDocument();
    expect(screen.getByText("SplitBillView")).toBeInTheDocument();
  });
});
