import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../hooks/useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("reads initial value when key missing", () => {
    const { result } = renderHook(() => useLocalStorage("k1", 10));
    expect(result.current[0]).toBe(10);
  });

  it("reads stored value and writes updates", () => {
    localStorage.setItem("k2", JSON.stringify(20));
    const { result } = renderHook(() => useLocalStorage("k2", 10));

    expect(result.current[0]).toBe(20);

    act(() => result.current[1](25));
    expect(localStorage.getItem("k2")).toBe("25");
  });

  it("supports updater function", () => {
    const { result } = renderHook(() => useLocalStorage("k3", 1));
    act(() => result.current[1]((prev) => prev + 1));
    expect(result.current[0]).toBe(2);
  });
});
