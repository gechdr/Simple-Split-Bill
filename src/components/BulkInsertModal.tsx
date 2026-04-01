import React from "react";
import { useApp } from "../context";

export const BulkInsertModal: React.FC = () => {
  const { t, showBulkInsert, setShowBulkInsert, bulkInsertText, setBulkInsertText, applyBulkInsert } = useApp();

  if (!showBulkInsert) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t.bulkInsertTitle}</h3>
        </div>
        <textarea
          value={bulkInsertText}
          onChange={(e) => setBulkInsertText(e.target.value)}
          rows={10}
          placeholder={t.bulkInsertPlaceholder}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-500 focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm resize-none font-mono"
        />
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setShowBulkInsert(false)}
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium text-sm"
          >
            {t.bulkInsertCancel}
          </button>
          <button
            onClick={applyBulkInsert}
            className="flex-1 px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-black dark:hover:bg-gray-300 transition font-medium text-sm"
          >
            {t.bulkInsertConfirm}
          </button>
        </div>
      </div>
    </div>
  );
};
