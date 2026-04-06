import React, { useState, useEffect } from "react";
import { useApp } from "../context";

export const CustomAccountModal: React.FC = () => {
  const {
    t,
    showCustomAccountModal,
    setShowCustomAccountModal,
    customAccountName,
    setCustomAccountName,
    customAccountNumber,
    setCustomAccountNumber,
    customAccountVendor,
    setCustomAccountVendor,
    saveCustomAccount,
  } = useApp();

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!showCustomAccountModal) {
      setErrors({});
    }
  }, [showCustomAccountModal]);

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

  const handleSave = () => {
    const nameError = !customAccountName.trim()
      ? t.errorNameRequired
      : customAccountName.trim().length < 2
        ? t.errorNameTooShort
        : null;
    const numberError = !customAccountNumber.trim()
      ? t.errorNumberRequired
      : customAccountNumber.trim().length < 3
        ? t.errorNumberTooShort
        : !/^[0-9]+$/.test(customAccountNumber.trim())
          ? t.errorNumberInvalid
          : null;
    const vendorError = !customAccountVendor.trim()
      ? t.errorVendorRequired
      : customAccountVendor.trim().length < 2
        ? t.errorVendorTooShort
        : null;

    const newErrors: Record<string, string> = {};
    if (nameError) newErrors.name = nameError;
    if (numberError) newErrors.number = numberError;
    if (vendorError) newErrors.vendor = vendorError;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      saveCustomAccount();
      setShowCustomAccountModal(false);
      setErrors({});
    }
  };

  const handleCancel = () => {
    setShowCustomAccountModal(false);
    setErrors({});
    setCustomAccountName("");
    setCustomAccountNumber("");
    setCustomAccountVendor("");
  };

  if (!showCustomAccountModal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 animate-fade-in">
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
              value={customAccountName}
              onChange={(e) => {
                setCustomAccountName(e.target.value);
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
              value={customAccountNumber}
              onChange={(e) => {
                setCustomAccountNumber(e.target.value);
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
              value={customAccountVendor}
              onChange={(e) => {
                setCustomAccountVendor(e.target.value);
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
            onClick={handleCancel}
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleSave}
            disabled={
              !customAccountName.trim() ||
              !customAccountNumber.trim() ||
              !customAccountVendor.trim()
            }
            className="flex-1 px-4 py-2.5 bg-gray-900 dark:bg-gray-600 text-white rounded-lg hover:bg-black dark:hover:bg-gray-500 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
};
