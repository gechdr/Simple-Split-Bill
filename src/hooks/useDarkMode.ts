import { useState, useEffect } from "react";
import { DARK_MODE_KEY } from "../utils/constants";

export function useDarkMode(): [boolean, () => void] {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const directValue = localStorage.getItem(DARK_MODE_KEY);
      if (directValue === "true" || directValue === "false") {
        return directValue === "true";
      }

      return false;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    try {
      localStorage.setItem(DARK_MODE_KEY, String(darkMode));
    } catch (error) {
      console.error("Error saving dark mode:", error);
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return [darkMode, toggleDarkMode];
}
