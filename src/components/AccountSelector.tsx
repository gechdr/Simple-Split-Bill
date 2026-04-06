import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, Trash2 } from "../icons";
import type { Translations } from "../translations";
import type { BankAccount } from "../types";

interface AccountSelectorProps {
  options: BankAccount[];
  selectedValue: string | null;
  onChange: (value: string) => void;
  label?: string;
  customName: string;
  customNumber: string;
  customVendor: string;
  onCustomNameChange: (value: string) => void;
  onCustomNumberChange: (value: string) => void;
  onCustomVendorChange: (value: string) => void;
  onSaveCustomAccount: () => void;
  onDeleteAccount: (accountNumber: string) => void;
  t: Translations;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  options,
  selectedValue,
  onChange,
  label,
  customName,
  customNumber,
  customVendor,
  onCustomNameChange,
  onCustomNumberChange,
  onCustomVendorChange,
  onSaveCustomAccount,
  onDeleteAccount,
  t,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.number === selectedValue) || options[0];
  const customOption = options.find((opt) => opt.number === "CUSTOM");
  const regularAccounts = options.filter((opt) => opt.number !== "CUSTOM");

  const handleSelect = (accountNumber: string) => {
    if (accountNumber === "CUSTOM") {
      setIsOpen(false);
      setShowCustomModal(true);
    } else {
      onChange(accountNumber);
      setIsOpen(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, accountNumber: string) => {
    e.stopPropagation();
    if (accountNumber !== "CUSTOM" && onDeleteAccount) {
      onDeleteAccount(accountNumber);
    }
  };

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    if (field === "name") {
      if (!value.trim()) {
        newErrors.name = t.errorNameRequired;
      } else if (value.trim().length < 2) {
        newErrors.name = t.errorNameTooShort;
      } else {
        delete newErrors.name;
      }
    }

    if (field === "number") {
      if (!value.trim()) {
        newErrors.number = t.errorNumberRequired;
      } else if (value.trim().length < 3) {
        newErrors.number = t.errorNumberTooShort;
      } else if (!/^[0-9]+$/.test(value.trim())) {
        newErrors.number = t.errorNumberInvalid;
      } else {
        delete newErrors.number;
      }
    }

    if (field === "vendor") {
      if (!value.trim()) {
        newErrors.vendor = t.errorVendorRequired;
      } else if (value.trim().length < 2) {
        newErrors.vendor = t.errorVendorTooShort;
      } else {
        delete newErrors.vendor;
      }
    }

    setErrors(newErrors);
  };

  const handleSaveCustom = () => {
    const nameError = !customName.trim()
      ? t.errorNameRequired
      : customName.trim().length < 2
        ? t.errorNameTooShort
        : null;
    const numberError = !customNumber.trim()
      ? t.errorNumberRequired
      : customNumber.trim().length < 3
        ? t.errorNumberTooShort
        : !/^[0-9]+$/.test(customNumber.trim())
          ? t.errorNumberInvalid
          : null;
    const vendorError = !customVendor.trim()
      ? t.errorVendorRequired
      : customVendor.trim().length < 2
        ? t.errorVendorTooShort
        : null;

    const newErrors: Record<string, string> = {};
    if (nameError) newErrors.name = nameError;
    if (numberError) newErrors.number = numberError;
    if (vendorError) newErrors.vendor = vendorError;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSaveCustomAccount();
      setShowCustomModal(false);
      setErrors({});
    }
  };

  const handleCancelCustom = () => {
    setShowCustomModal(false);
    setErrors({});
    onCustomNameChange("");
    onCustomNumberChange("");
    onCustomVendorChange("");
  };

  return (
    <>
      <div className="space-y-3">
        <div className="relative" ref={dropdownRef}>
          {label && (
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase mb-1">
              {label}
            </label>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 text-left flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-500 focus:border-gray-900 dark:focus:border-gray-500"
          >
            <span
              className={`block truncate text-base sm:text-sm ${
                !selectedOption || selectedOption.number === "CUSTOM"
                  ? "text-gray-400 dark:text-gray-500"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {selectedOption && selectedOption.number !== "CUSTOM"
                ? `${selectedOption.name} - ${selectedOption.vendor}`
                : t.selectAccount}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>

          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-lg py-1 text-base ring-1 ring-black dark:ring-gray-700 ring-opacity-5 overflow-auto focus:outline-none animate-fade-in sm:text-sm">
              {regularAccounts.map((option, index) => (
                <div
                  key={index}
                  className={`cursor-pointer select-none relative py-3 pl-10 pr-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                    option.number === selectedValue
                      ? "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => handleSelect(option.number)}
                >
                  {option.number === selectedValue && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 dark:text-gray-100">
                      <Check className="w-4 h-4" />
                    </span>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col flex-1 min-w-0 pr-2">
                      <span className="block truncate font-semibold">
                        {`${option.name} - ${option.vendor}`}
                      </span>
                      <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                        {option.number}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDelete(e, option.number)}
                      className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                      title={t.tooltipDeleteAccount}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {regularAccounts.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              )}

              {customOption && (
                <div
                  className="cursor-pointer select-none relative py-3 pl-10 pr-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
                  onClick={() => handleSelect(customOption.number)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col flex-1 min-w-0 pr-2">
                      <span className="block truncate font-semibold text-gray-900 dark:text-gray-100">
                        ➕ {t.addNewAccount}
                      </span>
                      <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                        {t.addNewAccountDesc}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showCustomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl animate-slide-down">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t.addNewAccount}
            </h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase mb-1">
                  {t.accountHolderName}
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => {
                    onCustomNameChange(e.target.value);
                    validateField("name", e.target.value);
                  }}
                  placeholder={t.accountHolderPlaceholder}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-base sm:text-sm ${
                    errors.name
                      ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                      : "border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-gray-500 focus:ring-gray-900 dark:focus:ring-gray-500"
                  }`}
                  title={t.tooltipAccountName}
                  autoFocus
                />
                {errors.name && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase mb-1">
                  {t.accountNumber}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={customNumber}
                  onChange={(e) => {
                    onCustomNumberChange(e.target.value);
                    validateField("number", e.target.value);
                  }}
                  placeholder={t.accountNumberPlaceholder}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-base sm:text-sm font-mono ${
                    errors.number
                      ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                      : "border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-gray-500 focus:ring-gray-900 dark:focus:ring-gray-500"
                  }`}
                  title={t.tooltipAccountNumber}
                />
                {errors.number && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.number}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase mb-1">
                  {t.bankEwallet}
                </label>
                <input
                  type="text"
                  value={customVendor}
                  onChange={(e) => {
                    onCustomVendorChange(e.target.value);
                    validateField("vendor", e.target.value);
                  }}
                  placeholder={t.bankEwalletPlaceholder}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-1 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-base sm:text-sm ${
                    errors.vendor
                      ? "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400"
                      : "border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-gray-500 focus:ring-gray-900 dark:focus:ring-gray-500"
                  }`}
                  title={t.tooltipBankName}
                />
                {errors.vendor && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.vendor}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelCustom}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSaveCustom}
                disabled={
                  !customName.trim() ||
                  !customNumber.trim() ||
                  !customVendor.trim()
                }
                className="flex-1 px-4 py-2.5 bg-gray-900 dark:bg-gray-600 text-white rounded-lg hover:bg-black dark:hover:bg-gray-500 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
