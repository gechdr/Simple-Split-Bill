import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDarkMode } from "../hooks/useDarkMode";
import { DARK_MODE_KEY } from "../utils/constants";

describe("useDarkMode", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("starts false by default and toggles class/storage", () => {
    const { result } = renderHook(() => useDarkMode());
    expect(result.current[0]).toBe(false);

    act(() => result.current[1]());

    expect(result.current[0]).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem(DARK_MODE_KEY)).toBe("true");
  });
});
