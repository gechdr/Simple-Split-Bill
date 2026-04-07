import { useState } from "react";
import { getStorageField, setStorageField } from "../utils/storage";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const fromUnifiedStorage = getStorageField<T>(key);
      if (typeof fromUnifiedStorage !== "undefined") return fromUnifiedStorage;
      return initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      setStorageField(key, valueToStore);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}
