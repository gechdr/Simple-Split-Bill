import React from "react";
import { useApp } from "../context";
import { Globe, Sun, Moon, Calculator, ListChecks, Eye, EyeOff, RefreshCw } from "../icons";

export const Header: React.FC = () => {
  const {
    t,
    language,
    toggleLanguage,
    darkMode,
    toggleDarkMode,
    showCalculator,
    setShowCalculator,
    showPaymentTracker,
    setShowPaymentTracker,
    showOCR,
    setShowOCR,
    setShowResetModal,
    appVersion,
  } = useApp();

  return (
    <div className="text-center mb-6 sm:mb-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
            title={t.tooltipLanguage}
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm font-bold uppercase">{language}</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowCalculator(!showCalculator)}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              title={t.tooltipCalculator}
            >
              <Calculator className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowPaymentTracker(!showPaymentTracker)}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              title={t.tooltipPaymentTracker}
            >
              <ListChecks className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowOCR(!showOCR)}
              className="flex items-center gap-1.5 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              title={t.tooltipOCR}
            >
              {showOCR ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800"
              title={t.tooltipReset}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {t.title}
        </h1>
      </div>
      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
        {t.subtitle}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        {appVersion} • {t.autoSaved}
      </p>
    </div>
  );
};
