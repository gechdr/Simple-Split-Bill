import { useState, useEffect } from "react";
import { translations, type Translations } from "../translations";
import type { Language } from "../types";
import { LANGUAGE_KEY } from "../utils/constants";

export function useLanguage(): [Language, () => void, Translations] {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const directValue = localStorage.getItem(LANGUAGE_KEY);
      if (directValue === "id" || directValue === "en") return directValue;

      return "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  }, [language]);

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "id" : "en"));

  const t = translations[language];

  return [language, toggleLanguage, t];
}
