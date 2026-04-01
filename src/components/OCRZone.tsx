import React from "react";
import { useApp } from "../context";
import { Camera, Upload } from "../icons";

export const OCRZone: React.FC = () => {
  const { t, showOCR, ocr } = useApp();
  const { isScanning, scanProgress, isDragging, triggerFileInput, handleDragOver, handleDragLeave, handleDrop, fileInputRef } = ocr;

  if (!showOCR) return null;

  return (
    <div className="mb-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && ocr.handleScanReceipt(e.target.files[0])}
        className="hidden"
      />
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${isDragging ? "border-gray-900 dark:border-gray-300 bg-gray-50 dark:bg-gray-700 scale-[1.02]" : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"} ${isScanning ? "pointer-events-none opacity-50" : ""}`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className={`rounded-full p-4 transition-colors ${isDragging ? "bg-gray-900 dark:bg-gray-300" : "bg-gray-100 dark:bg-gray-700"}`}>
            <Camera className={`w-8 h-8 ${isDragging ? "text-white dark:text-gray-900" : "text-gray-600 dark:text-gray-300"}`} />
          </div>
          <div>
            <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {isDragging ? t.dropToScan : t.scanReceipt}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.scanReceiptDesc}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t.scanReceiptFormat}</p>
          </div>
          {!isScanning && (
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-2 bg-gray-900 dark:bg-gray-700 text-white px-6 py-2.5 rounded-lg hover:bg-black dark:hover:bg-gray-600 transition shadow-sm font-medium"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
            >
              <Upload className="w-5 h-5" />
              {t.chooseFile}
            </button>
          )}
        </div>
      </div>
      <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex gap-2 items-center">
        <span className="text-amber-600 text-lg flex-shrink-0 leading-none mt-0.5">⚠️</span>
        <div className="text-xs text-amber-800 dark:text-amber-200 flex-1">
          <span className="font-semibold">{t.noteTitle}</span> {t.noteDesc}
        </div>
      </div>
    </div>
  );
};
