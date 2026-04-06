import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, Trash2 } from "../icons";
import type { Translations } from "../translations";
import type { BankAccount } from "../types";

interface AccountSelectorProps {
  options: BankAccount[];
  selectedValue: string | null;
  onChange: (value: string) => void;
  label?: string;
  onOpenCustomModal: () => void;
  onDeleteAccount: (accountNumber: string) => void;
  t: Translations;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  options,
  selectedValue,
  onChange,
  label,
  onOpenCustomModal,
  onDeleteAccount,
  t,
}) => {
  const [isOpen, setIsOpen] = useState(false);
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
      onOpenCustomModal();
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

  return (
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
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 px-4 text-left flex items-center justify-between focus:outline-none"
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
  );
};
