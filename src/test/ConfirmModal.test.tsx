import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmModal } from "../components/ConfirmModal";

describe("ConfirmModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <ConfirmModal
        isOpen={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        title="Reset"
        message="Are you sure?"
        confirmText="Yes"
        cancelText="No"
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("calls handlers on button clicks", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <ConfirmModal
        isOpen
        onConfirm={onConfirm}
        onCancel={onCancel}
        title="Reset"
        message="Are you sure?"
        confirmText="Yes"
        cancelText="No"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "No" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
