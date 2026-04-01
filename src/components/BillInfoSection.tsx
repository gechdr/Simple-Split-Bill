import React from "react";
import { useApp } from "../context";

export const BillInfoSection: React.FC = () => {
  const { t, placeName, setPlaceName } = useApp();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 mb-6 border-2 border-gray-300 dark:border-gray-700 shadow-md">
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-300 uppercase mb-1">
        {t.placeRestoName}
      </label>
      <input
        type="text"
        value={placeName}
        onChange={(e) => setPlaceName(e.target.value)}
        placeholder={t.placeRestoPlaceholder}
        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-500 focus:border-gray-900 dark:focus:border-gray-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base sm:text-sm"
        title={t.tooltipPlaceResto}
      />
    </div>
  );
};
