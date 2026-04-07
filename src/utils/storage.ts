import { STORAGE_KEY } from "./constants";

type StorageData = Record<string, unknown>;

function isRecord(value: unknown): value is StorageData {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readStorageData(storageKey = STORAGE_KEY): StorageData {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function writeStorageData(data: StorageData, storageKey = STORAGE_KEY): void {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

export function getStorageField<T>(key: string, storageKey = STORAGE_KEY): T | undefined {
  const data = readStorageData(storageKey);
  if (typeof data[key] !== "undefined") return data[key] as T;
  return undefined;
}

export function setStorageField<T>(key: string, value: T, storageKey = STORAGE_KEY): void {
  const data = readStorageData(storageKey);
  data[key] = value;
  writeStorageData(data, storageKey);
}

export function deleteStorageField(key: string, storageKey = STORAGE_KEY): void {
  const data = readStorageData(storageKey);
  const legacyKey = `${storageKey}_${key}`;
  let changed = false;

  if (key in data) {
    delete data[key];
    changed = true;
  }
  if (legacyKey in data) {
    delete data[legacyKey];
    changed = true;
  }

  if (changed) {
    writeStorageData(data, storageKey);
  }
}
