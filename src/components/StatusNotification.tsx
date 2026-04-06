import React from "react";
import { useApp } from "../context";

export const StatusNotification: React.FC = () => {
  const { ocr } = useApp();
  const { isScanning, scanProgress, captureStatus } = ocr;

  if (!isScanning) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xs sm:max-w-sm">
      <div className="px-4 py-3 rounded-lg shadow-xl font-medium border text-sm sm:text-base bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white animate-fade-in">
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{captureStatus}</span>
        </div>
        {scanProgress > 0 && (
          <div className="mt-2">
            <div className="w-full bg-gray-700 dark:bg-gray-300 rounded-full h-2">
              <div className="bg-white dark:bg-gray-900 h-2 rounded-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
            </div>
            <div className="text-xs text-center mt-1">{scanProgress}%</div>
          </div>
        )}
      </div>
    </div>
  );
};
