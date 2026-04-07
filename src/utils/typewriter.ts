/**
 * Typewriter utilities for sharing bill data via URL
 * Collects all storage keys and encodes them for sharing
 */

import { STORAGE_KEYS } from "./constants";
import { readStorageData, writeStorageData } from "./storage";

export function encodeToBase64(data: string): string {
  try {
    return btoa(encodeURIComponent(data));
  } catch (e) {
    console.error("Failed to encode data:", e);
    return "";
  }
}

export function decodeFromBase64(encoded: string): string {
  try {
    return decodeURIComponent(atob(encoded));
  } catch (e) {
    console.error("Failed to decode data:", e);
    return "";
  }
}

export function getAllStorageData(): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  try {
    const unifiedData = readStorageData();

    // Collect all bill data fields from unified storage.
    STORAGE_KEYS.forEach((key) => {
      if (key in unifiedData) {
        data[key] = unifiedData[key];
      }
    });
  } catch (e) {
    console.error("Failed to read storage data:", e);
  }
  return data;
}

export function setAllStorageData(data: Record<string, unknown>): void {
  try {
    const nextData = readStorageData();

    // Only set bill data fields that are in STORAGE_KEYS.
    STORAGE_KEYS.forEach((key) => {
      if (key in data) {
        nextData[key] = data[key];
      }
    });

    writeStorageData(nextData);
    // Trigger storage event for components to update
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Failed to write storage data:", e);
  }
}

export function getTypewriterData(): string | null {
  try {
    const data = getAllStorageData();
    // Check if there's any meaningful data
    if (Object.keys(data).length === 0) {
      return null;
    }
    const jsonString = JSON.stringify(data);
    return encodeToBase64(jsonString);
  } catch (e) {
    console.error("Failed to encode typewriter data:", e);
    return null;
  }
}

export function loadTypewriterData(): Record<string, unknown> | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get("data");
    if (!encodedData) return null;

    const jsonString = decodeFromBase64(encodedData);
    const data = JSON.parse(jsonString);
    return data;
  } catch (e) {
    console.error("Failed to decode typewriter data:", e);
    return null;
  }
}
