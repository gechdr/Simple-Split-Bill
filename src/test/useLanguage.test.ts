import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLanguage } from "../hooks/useLanguage";
import { LANGUAGE_KEY } from "../utils/constants";

describe("useLanguage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to en and toggles to id with persistence", () => {
    const { result } = renderHook(() => useLanguage());

    expect(result.current[0]).toBe("en");

    act(() => result.current[1]());

    expect(result.current[0]).toBe("id");
    expect(localStorage.getItem(LANGUAGE_KEY)).toBe("id");
    expect(result.current[2]).toBeDefined();
  });
});
