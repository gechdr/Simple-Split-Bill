import { useState, useEffect } from "react";

export function useDarkMode(): [boolean, () => void] {
  function getDeviceDarkmode() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  const [darkMode, setDarkMode] = useState(() => {
    try {
      if (localStorage.getItem("darkMode") === "true") {
        return true;
      }
      else if (getDeviceDarkmode()) {
        return true;
      }
      return false
    } catch {
      return false;
    }
  });
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    try {
      localStorage.setItem("darkMode", String(darkMode));
    } catch (error) {
      console.error("Error saving dark mode:", error);
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return [darkMode, toggleDarkMode];
}
