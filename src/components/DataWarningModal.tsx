import React from "react";
import { Copy } from "../icons";
import type { Translations } from "../translations";

interface DataWarningModalProps {
  isOpen: boolean;
  stage: 1 | 2;
  onCopyAndProceed: () => void;
  onProceedWithoutBackup: () => void;
  onFinalConfirm: () => void;
  onCancel: () => void;
  t: Translations;
}

export const DataWarningModal: React.FC<DataWarningModalProps> = ({
  isOpen,
  stage,
  onCopyAndProceed,
  onProceedWithoutBackup,
  onFinalConfirm,
  onCancel,
  t,
}) => {
  if (!isOpen) return null;

  if (stage === 1) {
    // First warning: Offer to backup current data
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4 animate-fade-in">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl animate-slide-down border-2 border-amber-500">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {t.dataWarningTitle}
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
            {t.dataWarningMessage}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={onCopyAndProceed}
              className="w-full px-4 py-3 bg-gray-900 dark:bg-gray-600 text-white rounded-lg hover:bg-black dark:hover:bg-gray-500 transition font-medium flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {t.dataWarningCopyButton}
            </button>
            <button
              onClick={onProceedWithoutBackup}
              className="w-full px-4 py-3 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border-2 border-amber-300 dark:border-amber-700 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition font-medium"
            >
              {t.dataWarningProceed}
            </button>
            <button
              onClick={onCancel}
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium text-sm"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    // Second warning: Final confirmation
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4 animate-fade-in">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full shadow-2xl animate-slide-down border-2 border-red-500">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🚨</span>
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
              {t.dataWarningFinalTitle}
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed font-medium">
            {t.dataWarningFinalMessage}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition font-medium"
            >
              {t.dataWarningFinalCancel}
            </button>
            <button
              onClick={onFinalConfirm}
              className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
            >
              {t.dataWarningFinalConfirm}
            </button>
          </div>
        </div>
      </div>
    );
  }
};
