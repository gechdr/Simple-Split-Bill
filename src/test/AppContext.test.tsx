import React from "react";
import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { AppProvider, useApp } from "../context/AppContext";

describe("AppContext", () => {
  it("throws when useApp is outside provider", () => {
    expect(() => renderHook(() => useApp())).toThrow("useApp must be used within AppProvider");
  });

  it("provides merged bill and ui context values", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useApp(), { wrapper });

    expect(Array.isArray(result.current.items)).toBe(true);
    expect(Array.isArray(result.current.persons)).toBe(true);
    expect(typeof result.current.addItem).toBe("function");
    expect(typeof result.current.toggleDarkMode).toBe("function");
    expect(typeof result.current.toggleLanguage).toBe("function");
    expect(result.current.t).toBeDefined();
  });
});
